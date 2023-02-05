require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { sequelize } = require("./util/database");
const { PORT } = process.env;
const { User } = require("./models/user");
const { Post } = require("./models/post");
const {
  getAllPosts,
  getCurrentUserPosts,
  addPost,
  editPost,
  deletePost,
} = require("./controllers/posts");
const { register, login } = require("./controllers/auth");
const { isAuthenticated } = require("./middleware/isAuthenticated");

const app = express();

app.use(express.json());
app.use(cors());

User.hasMany(Post);
Post.belongsTo(User);

//AUTH
app.post("/api/register", register);
app.post("/api/login", login);

// GET POSTS - no auth
app.get("/api/posts", getAllPosts);

// CRUD POSTS - auth required
app.get("/api/userposts/:userId", getCurrentUserPosts);
app.post("/api/posts", isAuthenticated, addPost);
app.put("/api/posts/:id", isAuthenticated, editPost);
app.delete("/api/posts/:id", isAuthenticated, deletePost);

// the force: true is for development -- it DROPS tables!!!
// sequelize.sync({ force: true })
  sequelize.sync()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`db sync successful & server running on port ${PORT}`)
    );
  })
  .catch((err) => console.log(err));
