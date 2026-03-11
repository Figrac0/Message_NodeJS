# Express GraphQL API with React Client

This project is a full-stack application built with Express, GraphQL, MongoDB, and React.

The backend is centered around Express as the main HTTP server and GraphQL as the primary API layer for authentication, posts, and user status management. The frontend is a React application that communicates with the backend through `fetch` requests to the `/graphql` endpoint and a separate REST endpoint for image upload.

<div align="center">
  <a href="https://message-node-front.onrender.com/" target="_blank">
    <img
      src="https://raw.githubusercontent.com/Figrac0/Message_NodeJS/MVP/git/href.svg"
      alt="Quick Access - Visit Site"
      width="100%"
    />
  </a>
</div>

---

## 📸 Project Preview

<div align="center">

| 1 | 2 |
| :---: | :---: |
| <img src="https://github.com/Figrac0/Message_NodeJS/blob/MVP/git/1.png" width="400"/><br/><sub>Feed page with post cards and pagination.</sub> | <img src="https://github.com/Figrac0/Message_NodeJS/blob/MVP/git/2.png" width="400"/><br/><sub>Landing page with the main platform features.</sub> |

| 3 | 4 |
| :---: | :---: |
| <img src="https://github.com/Figrac0/Message_NodeJS/blob/MVP/git/3.png" width="400"/><br/><sub>Modal window for creating a new post with image upload.</sub> | <img src="https://github.com/Figrac0/Message_NodeJS/blob/MVP/git/4.png" width="400"/><br/><sub>Single post page with full content and image preview.</sub> |

</div>

---

## Tech Stack

### Backend
- Node.js
- Express
- GraphQL
- express-graphql
- MongoDB + Mongoose
- JWT authentication
- bcryptjs
- multer
- dotenv
- validator
- express-validator

### Frontend
- React
- React Router
- Fetch API
- LocalStorage for auth persistence

## Main Idea of the Project

The application allows users to:

- sign up
- log in
- create posts
- edit posts
- delete posts
- upload images
- update user status
- view paginated posts

The backend combines two styles:

- GraphQL for core business operations
- Express REST endpoints for utility routes such as image upload and auth status

This makes the project a good example of how Express and GraphQL can work together in one application.

---

# Project Structure

## Backend

```txt
back/
├── controllers/
│   ├── auth.js
│   └── feed.js
├── graphql/
│   ├── resolvers.js
│   └── schema.js
├── images/
├── middleware/
├── models/
│   ├── post.js
│   └── user.js
├── util/
│   └── file.js
├── app.js
├── package.json
└── env
```

## Frontend

```text
front/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── Auth/
│   │   ├── Feed/
│   │   └── Home/
│   ├── App.js
│   └── index.js
├── package.json
└── .gitignore
```

## How the Backend Works

### 1. Express is the main server

Express is the entry point of the backend. It is responsible for:

- starting the server
- parsing JSON
- handling uploads
- serving static images
- applying authentication middleware
- exposing GraphQL endpoint
- exposing some REST endpoints

**Main file:** `back/app.js`

**Example:**

```javascript
app.use(bodyParser.json()); // parse JSON body
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"), // handle image upload
);
app.use("/images", express.static(path.join(__dirname, "images"))); // serve up
```

### 2. GraphQL is mounted as middleware

The GraphQL API is exposed through one route:

```text
POST /graphql
```

In `app.js`:

```javascript
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema, // GraphQL schema definition
    rootValue: graphqlResolver, // resolver functions
    graphiql: true, // enables GraphiQL in development
  }),
);
```

This is the key integration point:

1. Express receives the HTTP request
2. Express forwards it to GraphQL middleware
3. GraphQL validates the query against the schema
4. Resolver functions execute business logic
5. Response is returned as JSON

So GraphQL is running on top of Express.

### 3. MongoDB is used through Mongoose

The application stores data in MongoDB.

Two main models are used:

**User model**
```javascript
const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: String, default: "I am new!" },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }]
});
```

**Post model**
```javascript
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    content: { type: String, required: true },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);
```

**Relationships:**

- one user can have many posts
- each post belongs to one user

### 4. GraphQL schema defines API contract

The schema in `graphql/schema.js` describes what the client can query and mutate.

**Example:**

```graphql
type RootQuery {
  login(email: String!, password: String!): AuthData!
  posts(page: Int): PostData!
  post(id: ID!): Post!
  user: User!
}

type RootMutation {
  createUser(userInput: UserInputData): User!
  createPost(postInput: PostInputData): Post!
  updatePost(id: ID!, postInput: PostInputData): Post!
  deletePost(id: ID!): Boolean
  updateStatus(status: String!): User!
}
```

This means the frontend does not call many REST endpoints like:

- `/login`
- `/posts`
- `/users/:id`

Instead, it sends GraphQL queries and mutations to **one endpoint**.

### 5. Resolvers contain backend logic

Resolvers in `graphql/resolvers.js` act as controllers for GraphQL.

They are responsible for:

- validation
- auth checks
- reading and writing MongoDB data
- returning the correct response shape

**Example:**

```javascript
createPost: async function({ postInput }, req) {
  if (!req.isAuth) {
    const error = new Error("Not authenticated!");
    error.code = 401;
    throw error;
  }

  const post = new Post({
    title: postInput.title,
    content: postInput.content,
    imageUrl: postInput.imageUrl,
    creator: req.userId
  });

  const createdPost = await post.save();
  return {
    ...createdPost._doc,
    _id: createdPost._id.toString()
  };
}
```

**Short explanation:**

1. request is checked for authentication
2. resolver creates a MongoDB document
3. saves it
4. returns GraphQL-friendly response

### 6. JWT authentication is shared between Express and GraphQL

Authentication is done with JSON Web Tokens.

**Login flow:**

1. user sends email and password
2. backend finds the user
3. password is checked with `bcrypt.compare`
4. JWT token is generated
5. frontend stores token in `localStorage`

**Example from resolver:**

```javascript
const token = jwt.sign(
  {
    userId: user._id.toString(),
    email: user.email
  },
  "somesupersecretsecret",
  { expiresIn: "1h" }
);
```

The frontend then sends the token in the `Authorization` header:

```javascript
headers: {
  Authorization: "Bearer " + this.props.token,
  "Content-Type": "application/json",
}
```

The auth middleware reads this token and attaches user data to the request.

So both Express routes and GraphQL resolvers can use:

- `req.isAuth`
- `req.userId`

This is an important part of the architecture.

### 7. Image upload is handled by Express, not GraphQL

This project intentionally separates file upload from GraphQL.

**Why:**
- uploading binary files through plain GraphQL is inconvenient
- `multer` is simpler for multipart form uploads

**Image upload route:**

```text
PUT /post-image
```

**Example from `app.js`:**

```javascript
app.put("/post-image", (req, res, next) => {
  if (!req.isAuth) {
    throw new Error("Not authenticated!");
  }

  if (!req.file) {
    return res.status(200).json({ message: "No file provided!" });
  }

  return res.status(201).json({
    message: "File stored.",
    filePath: `images/${req.file.filename}`
  });
});
```

**Flow:**

1. frontend uploads file to `/post-image`
2. Express stores file in `/images`
3. backend returns file path
4. frontend sends GraphQL mutation with that `imageUrl`
5. post is created or updated with the saved image path

This is one of the most important integration points between Express and GraphQL in the project.

### 8. Static images are served by Express

Uploaded files are stored in `back/images` and exposed with:

```javascript
app.use("/images", express.static(path.join(__dirname, "images")));
```

This means if a file path is:

```text
images/example.jpg
```


the browser can load it from:

```text
http://localhost:8080/images/example.jpg
```

## How the Frontend Works

### 1. React is the client layer

The frontend is a React SPA that handles:

- routing
- login/signup screens
- feed page
- post creation/editing
- status updates
- post listing

**Main file:** `front/src/App.js`

The app checks auth data from `localStorage` on startup:

```javascript
componentDidMount() {
  const token = localStorage.getItem("token");
  const expiryDate = localStorage.getItem("expiryDate");
  if (!token || !expiryDate) {
    return;
  }
}
```

This keeps the user logged in after page refresh.

### 2. React talks to GraphQL with `fetch`

The frontend sends GraphQL requests manually using `fetch`.

**Example login request:**

```javascript
const graphqlQuery = {
  query: `
    query UserLogin($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        userId
      }
    }
  `,
  variables: {
    email: authData.email,
    password: authData.password,
  },
};
```

**Then:**

```javascript
fetch("http://localhost:8080/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(graphqlQuery),
});
```

This is how the frontend communicates with GraphQL without Apollo Client.

### 3. Feed page combines GraphQL and Express upload route

The most important frontend logic is in `front/src/pages/Feed/Feed.js`.

When creating or editing a post:

**Step 1 - upload image through Express**
```javascript
const formData = new FormData();
formData.append("image", postData.image);

fetch("http://localhost:8080/post-image", {
  method: "PUT",
  headers: {
    Authorization: "Bearer " + this.props.token,
  },
  body: formData,
});
```

**Step 2 - send GraphQL mutation with saved image path**
```javascript
const graphqlQuery = {
  query: `
    mutation CreateNewPost($title: String!, $content: String!, $imageUrl: String!) {
      createPost(postInput: {title: $title, content: $content, imageUrl: $imageUrl}) {
        _id
        title
        content
        imageUrl
      }
    }
  `,
  variables: {
    title: postData.title,
    content: postData.content,
    imageUrl: imageUrl,
  },
};
```

This is the clearest example of how Express and GraphQL are connected in this project.

- **Express** handles the file.
- **GraphQL** handles the data model.

### 4. Posts are loaded via GraphQL query

**Example:**

```javascript
const graphqlQuery = {
  query: `
    query FetchPosts($page: Int) {
      posts(page: $page) {
        posts {
          _id
          title
          content
          imageUrl
          creator {
            name
          }
          createdAt
        }
        totalPosts
      }
    }
  `,
  variables: {
    page: page,
  },
};
```

The frontend receives:

- list of posts
- pagination data

This matches the schema defined on the backend.

### 5. Status update is also done through GraphQL

**Example mutation:**

```graphql
mutation UpdateUserStatus($userStatus: String!) {
  updateStatus(status: $userStatus) {
    status
  }
}
```

The frontend form sends this mutation, and the backend updates `user.status`.

## How Everything Works Together

### Full flow example: creating a post

**Backend role**

1. Express receives the file upload
2. `multer` stores image in `images/`
3. GraphQL mutation creates the post document
4. Mongoose saves post to MongoDB
5. Mongoose updates the user document with the new post reference

**Frontend role**

1. React collects form input
2. sends image through `FormData`
3. receives `filePath`
4. sends GraphQL mutation with title, content, and `imageUrl`
5. updates UI state after success

**Result**

The user sees the new post immediately in the feed.

## Important Architectural Notes

### Express and GraphQL are not separate applications

GraphQL is **mounted inside Express**. Express remains the base server.

### GraphQL is used for business data

Authentication, posts, and user data are handled through GraphQL queries and mutations.

### Express is used for infrastructure tasks

File uploads, static files, CORS, JSON parsing, and middleware are handled by Express.

### React is a thin client over the API

The frontend sends GraphQL requests directly with `fetch` and manages UI state manually.

### About Socket.IO

`socket.io` exists in `package.json`, and older backend code in `controllers/feed.js` references:

```javascript
io.getIO().emit("posts", {
  action: "create",
  post: ...
});
```

However, in the current active `app.js`, **Socket.IO is not initialized** and is not part of the main running flow.

So the accurate statement is:

- Socket.IO support appears to be planned or partially implemented
- the current working backend is mainly Express + GraphQL + MongoDB
- real-time updates are not fully wired in the active server entry point now

This is important because it explains the dependency correctly without claiming a feature that is not fully active.

## REST vs GraphQL in This Project

### REST endpoints currently used
- `GET /auth/status`
- `PATCH /auth/status`
- `GET /feed/posts`
- `PUT /post-image`

### Main GraphQL operations
- `login`
- `createUser`
- `createPost`
- `updatePost`
- `deletePost`
- `posts`
- `post`
- `user`
- `updateStatus`

In practice, the frontend mainly relies on GraphQL, and the upload route remains REST-based.

## Key Files

### Backend
- `app.js` - Express server configuration
- `graphql/schema.js` - GraphQL API contract
- `graphql/resolvers.js` - GraphQL business logic
- `models/user.js` - user model
- `models/post.js` - post model
- `util/file.js` - image delete helper

### Frontend
- `src/App.js` - auth state, routing, layout
- `src/pages/Feed/Feed.js` - main feed logic, GraphQL calls, upload flow

## Environment Variables

The backend builds MongoDB connection from environment values:

- `MONGO_USER`
- `MONGO_PASSWORD`
- `MONGO_CLUSTER`
- `MONGO_DB`
- `PORT`

**Important note:**
in `app.js` the code first tries to load a file named `env`, not `.env`.

**Example logic:**

```javascript
const localEnvPath = path.join(__dirname, "env");
if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
} else {
  dotenv.config();
}
```

## Summary

This project demonstrates a practical full-stack architecture where:

- **Express** is the backend foundation
- **GraphQL** is the main API layer
- **Mongoose** connects the API to MongoDB
- **JWT** secures protected operations
- **multer** handles image uploads
- **React** consumes the API using plain `fetch`
- Express upload endpoints and GraphQL mutations work together in one post creation flow

The strongest technical point of the project is the combination of:

- **Express** for transport and infrastructure
- **GraphQL** for structured data access
- **React** as the client consuming both layers in a clear and simple way
