const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { graphqlHTTP } = require("express-graphql");

const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");
const auth = require("./middleware/auth");
const { clearImage } = require("./util/file");
const User = require("./models/user");
const Post = require("./models/post");

const localEnvPath = path.join(__dirname, "env");
if (fs.existsSync(localEnvPath)) {
    dotenv.config({ path: localEnvPath });
} else {
    dotenv.config();
}

const PORT = process.env.PORT || 8080;
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const IMAGES_DIR = path.join(__dirname, "images");

if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, IMAGES_DIR);
    },
    filename: (req, file, cb) => {
        const safeTimestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const safeOriginalName = file.originalname.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");
        cb(null, `${safeTimestamp}-${safeOriginalName}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"),
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE",
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization",
    );
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use(auth);

app.get("/auth/status", async (req, res, next) => {
    if (!req.isAuth) {
        return res.status(401).json({ message: "Not authenticated." });
    }
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json({ status: user.status });
    } catch (error) {
        return next(error);
    }
});

app.patch("/auth/status", async (req, res, next) => {
    if (!req.isAuth) {
        return res.status(401).json({ message: "Not authenticated." });
    }
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        user.status = req.body.status || user.status;
        await user.save();
        return res.status(200).json({ message: "Status updated." });
    } catch (error) {
        return next(error);
    }
});

app.get("/feed/posts", async (req, res, next) => {
    if (!req.isAuth) {
        return res.status(401).json({ message: "Not authenticated." });
    }
    const currentPage = Number(req.query.page) || 1;
    const perPage = 2;
    try {
        const totalItems = await Post.find().countDocuments();
        const posts = await Post.find()
            .populate("creator")
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        return res.status(200).json({
            message: "Fetched posts successfully.",
            posts: posts,
            totalItems: totalItems,
        });
    } catch (error) {
        return next(error);
    }
});

app.put("/post-image", (req, res, next) => {
    if (!req.isAuth) {
        throw new Error("Not authenticated!");
    }
    if (!req.file) {
        return res.status(200).json({ message: "No file provided!" });
    }
    if (req.body.oldPath) {
        clearImage(req.body.oldPath);
    }
    return res
        .status(201)
        .json({ message: "File stored.", filePath: `images/${req.file.filename}` });
});

app.use(
    "/graphql",
    graphqlHTTP({
        schema: graphqlSchema,
        rootValue: graphqlResolver,
        graphiql: true,
        customFormatErrorFn(err) {
            if (!err.originalError) {
                return err;
            }
            const data = err.originalError.data;
            const message = err.message || "An error occurred.";
            const code = err.originalError.code || 500;
            return { message: message, status: code, data: data };
        },
    }),
);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose
    .connect(MONGODB_URI)
    .then((result) => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => console.log(err));
