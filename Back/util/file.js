const fs = require("fs");
const path = require("path");

const clearImage = (filePath) => {
    if (!filePath) return;
    const fullPath = path.join(__dirname, "..", filePath);
    fs.access(fullPath, fs.constants.F_OK, (err) => {
        if (!err) {
            fs.unlink(fullPath, (err) => {
                if (err) console.log("Error deleting file:", err);
            });
        }
    });
};

module.exports = { clearImage };
