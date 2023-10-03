//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv").config();


const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads"); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Set the filename to be unique (e.g., timestamp + original name)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });






mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const adminSchema = new mongoose.Schema( {
  email: String,
  password: String
});


const Admin = new mongoose.model("Admin", adminSchema);

// ============================= project post schema =========================


const postSchema = new mongoose.Schema( {
  title: String,
  content: String,
  author: String,
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now, // Sets the default value to the current date and time
  },
});

const Post = mongoose.model("Post", postSchema , "post");

// ============================Admin User Schema================================================






// ================================= Api routes ==================================================================



// =============================================home route============================================
app.get("/", function (req, res) {
  // Fetch and render posts from MongoDB, sorted by creation date (newest first)
  Post.find({}).sort({ createdAt: -1 }) // Use the "-1" to sort in descending order
    .then((posts) => {
      res.render("index", {
        posts: posts,
        images: posts.images
      });
    })
    .catch((err) => {
      console.error(err);
      // Handle the error appropriately, e.g., by sending an error response
      res.status(500).send("Internal Server Error");
    });
});


// ====================================about route===========================================




app.get("/about", function (req, res) {
  res.render("about");
});


// ===================================================Login route======================================




app.get("/login", function (req, res) {
  res.render("login");
});


app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  Admin.findOne({ email: username }).then((foundUser) => {
    if (foundUser && foundUser.password === password) {
      res.render("compose");
    } else {
  res.render("login", { error: "Incorrect email or password" });
    }
  }).catch((err) => {
    console.log(err);
    res.status(500).send("internal server error");
  })
});











// =========================================compose project route====================================================

app.post("/compose", upload.array("image", 10), function (req, res) {
  // Check if files were uploaded
  if (!req.files) {
    return res.status(400).send("Please upload three images.");
  }

  const post = new Post({
    title: req.body.postTitle,
    author: req.body.author,
    content: req.body.postBody,
    images: req.files.map((file) => file.filename), // Store filenames in the images array
  });

  post
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.error(err);
      // Handle the error appropriately, e.g., by sending an error response
      res.status(500).send("Internal Server Error");
    });
});


// ...projects page route=====================================================================================

app.get("/posts/:postId", async function (req, res) {
  try {
    const requestedPostId = req.params.postId;
    const post = await Post.findOne({ _id: requestedPostId });
    if (post) {
      res.render("post", {
        title: post.title,
        author: post.author,
        date: post.createdAt.toDateString(),
        content: post.content,
        images: post.images, // Pass the images array to the template
      });
    } else {
      // Handle the case where the post was not found, e.g., by rendering an error page
      res.status(404).render("error", { message: "Post not found" });
    }
  } catch (err) {
    console.error(err);
    // Handle any other errors appropriately, e.g., by rendering an error page
    res.status(500).render("error", { message: "Internal Server Error" });
  }
});


// ...

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
