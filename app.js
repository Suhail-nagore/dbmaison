//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv").config();
const session = require("express-session");


const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const sessionSecret = process.env.SESSION_SECRET;
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true
}));


function requireAuth(req, res, next) {
  if (req.session.isAuthenticated) {
    // User is authenticated, allow them to access the route
    next();
  } else {
    // User is not authenticated, redirect them to the login page
    res.redirect("/login");
  }
}



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
  spec1: String,
  spec2: String,
  spec3: String,
  spec4: String,
  spec5: String,
  spec6: String,
  Lspec: String,
  youtube: String,
  mapH: String,
  mapV: String,
  type: String,
  F1: String,
  F2: String,
  F3: String,
  F4: String,
  F5: String,
  F6: String,
  F7: String,
  F8: String,
  F9: String,
  F10: String,
  F11: String,
  F12: String,
  F13: String,
  F14: String,
  F15: String,
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



// =============================== Projects route =================================================

app.get("/projects", function (req, res) {
  Post.find({}).sort({ createdAt: -1 }).then((posts) => {
    res.render("projects", {
      posts: posts,
      images: posts.images
    });
  }).catch((err) => {
    console.log(err);
    res.status(500).send('internal server error');
  });
});






// ====================================about route===========================================




app.get("/about", function (req, res) {
  res.render("about");
});


// ===================================================Login route======================================




app.get("/login", function (req, res) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", "0");
  if (req.session.isAuthenticated) {
    res.redirect("/compose"); // Redirect authenticated users to another page.
  } else {
    res.render("login");
  }
});

// app.get("/compose", requireAuth, function (req, res) {
//   // Only authenticated users can access this route
//   res.header("Cache-Control", "no-cache, no-store, must-revalidate");
//   res.header("Pragma", "no-cache");
//   res.header("Expires", "0");
//   res.render("compose");
// });
app.get("/compose", requireAuth, function (req, res) {
  // Only authenticated users can access this route
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", "0");
  res.render("compose");
});




// app.post("/login", function (req, res) {
//   const username = req.body.username;
//   const password = req.body.password;

//   Admin.findOne({ email: username }).then((foundUser) => {
//     if (foundUser && foundUser.password === password) {
//       res.render("compose");
//     } else {
//   res.render("login", { error: "Incorrect email or password" });
//     }
//   }).catch((err) => {
//     console.log(err);
//     res.status(500).send("internal server error");
//   })
// });



app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  Admin.findOne({ email: username }).then((foundUser) => {
    if (foundUser && foundUser.password === password) {
      // Set the user as authenticated
      req.session.isAuthenticated = true;
      res.render("compose");
    } else {
      res.render("login", { error: "Incorrect email or password" });
    }
  }).catch((err) => {
    console.log(err);
    res.status(500).send("Internal server error");
  });
});



// Add this route to your server code
app.post("/logout", function (req, res) {
  // Assuming you're using express-session
  // Destroy the user's session to log them out
  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      // Redirect the user to the login page after logout
      res.redirect("/login");
    }
  });
});










// =========================================compose project route====================================================

// app.post("/compose", upload.array("image", 10), function (req, res) {
//   // Check if files were uploaded
//   if (!req.files) {
//     return res.status(400).send("Please upload three images.");
//   }

//   const post = new Post({
//     title: req.body.postTitle,
//     author: req.body.author,
//     content: req.body.postBody,
//     images: req.files.map((file) => file.filename), // Store filenames in the images array
//   });

//   post
//     .save()
//     .then(() => {
//       res.redirect("/");
//     })
//     .catch((err) => {
//       console.error(err);
//       // Handle the error appropriately, e.g., by sending an error response
//       res.status(500).send("Internal Server Error");
//     });
// });



app.post("/compose", upload.array("image", 10), function (req, res) {
  // Check if files were uploaded
  if (!req.files) {
    return res.status(400).send("Please upload at least one image.");
  }

  // Extract data from the request body
  const {
    title,
    author,
    content,
    spec1,
    spec2,
    spec3,
    spec4,
    spec5,
    spec6,
    Lspec,
    F1,
    F2,
    F3,
    F4,
    F5,
    F6,
    F7,
    F8,
    F9,
    F10,
    F11,
    F12,
    F13,
    F14,
    F15,
    youtube,
    mapV, // Latitude
    mapH, // Longitude
    type,
  } = req.body;

  // Store filenames of uploaded images
  const imageFilenames = req.files.map((file) => file.filename);

  // Create a new Post document using the data
  const post = new Post({
    title,
    author,
    content,
    spec1,
    spec2,
    spec3,
    spec4,
    spec5,
    spec6,
    Lspec,
    F1,
    F2,
    F3,
    F4,
    F5,
    F6,
    F7,
    F8,
    F9,
    F10,
    F11,
    F12,
    F13,
    F14,
    F15,
    youtube,
    mapV, // Latitude
    mapH, // Longitude
    type,
    images: imageFilenames, // Store filenames in the images array
  });

  // Save the new post document to the database
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
        spec1: post.spec1,
        spec2: post.spec2,
        spec3: post.spec3,
        spec4: post.spec4,
        spec5: post.spec5,
        spec6: post.spec6,
        Lspec: post.Lspec,
        youtube: post.youtube,
        maplati: post.mapV,
        maplongi: post.mapH,
        type: post.type,
        F1: post.F1,
        F2: post.F2,
        F3: post.F3,
        F4: post.F4,
        F5: post.F5,
        F6: post.F6,
        F7: post.F7,
        F8: post.F8,
        F9: post.F9,
        F10: post.F10,
        F11: post.F11,
        F12: post.F12,
        F13: post.F13,
        F14: post.F14,
        F15: post.F15,

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
