//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv").config();
const session = require("express-session");
const MongoStore = require('connect-mongo');
const fs = require("fs");
const app = express();
const Post = require("./models/posts.js");
const Form = require("./models/formdb.js");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const sessionSecret = process.env.SESSION_SECRET;
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongoUrl: process.env.MONGO_URI, }),
  })
);

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

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const Admin = new mongoose.model("Admin", adminSchema);
// ============================= project post schema =========================

// const postSchema = new mongoose.Schema({
//   title: String,
//   content: String,
//   author: String,
//   specifications: [String], // Store specifications as an array of strings
//   Lspec: String,
//   youtube: String,
//   mapH: String,
//   mapV: String,
//   type: String,
//   features: [String],
//   images: [String],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Post = mongoose.model("Post", postSchema, "post");

// ============================Admin User Schema================================================

// ================================= Api routes ==================================================================

// ============================================= home route ============================================


app.get("/", function (req, res) {
  // Fetch and render posts from MongoDB, sorted by creation date (newest first)
  Post.find({})
    .sort({ signature: -1 }) // Use the "-1" to sort in descending order
    .then((posts) => {
      res.render("index", {
        posts: posts,
        images: posts.images,
      });
    })
    .catch((err) => {
      console.error(err);
      // Handle the error appropriately, e.g., by sending an error response
      res.status(500).send("Internal Server Error");
    });
});

// =============================== Projects route =================================================

// API endpoint for all projects
app.get("/projects", function (req, res) {
  Post.find({})
    .sort({ signature: -1 }) // Sort by signature value in descending order
    .then((posts) => {
      res.render("projects", {
        posts: posts,
        images: posts.images,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
});

// API endpoint for commercial projects
app.get("/projects/commercial", function (req, res) {
  Post.find({ type: "Commercial" })
    .sort({ signature: -1 }) // Sort by signature value in descending order
    .then((posts) => {
      res.render("projects", {
        posts: posts,
        images: posts.images,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

// API endpoint for residential projects
app.get("/projects/residential", function (req, res) {
  Post.find({ type: "Residential" })
    .sort({ signature: -1 }) // Sort by signature value in descending order
    .then((posts) => {
      res.render("projects", {
        posts: posts,
        images: posts.images,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
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
    res.redirect("/dasboard"); // Redirect authenticated users to another page.
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

  Admin.findOne({ email: username })
    .then((foundUser) => {
      if (foundUser && foundUser.password === password) {
        // Set the user as authenticated
        req.session.isAuthenticated = true;
        res.render("dasboard");
      } else {
        res.render("login", { error: "Incorrect email or password" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal server error");
    });
});



// app.get("/signup", function (req, res) {
//   res.render("signup");
// });

// app.post("/signup", function (req, res) {
//   const email = req.body.email;
//   const password = req.body.password;

//   // Check if the email is already registered
//   Admin.findOne({ email: email })
//       .then((foundUser) => {
//           if (foundUser) {
//               res.render("signup", { error: "Email is already registered." });
//           } else {
//               // Create a new admin user
//               const newAdmin = new Admin({
//                   email: email,
//                   password: password,
//               });

//               newAdmin
//                   .save()
//                   .then(() => {
//                       // Sign up successful, you can redirect to a login page or another appropriate page.
//                       res.redirect("/login");
//                   })
//                   .catch((err) => {
//                       console.error(err);
//                       res.status(500).send("Internal Server Error");
//                   });
//           }
//       })
//       .catch((err) => {
//           console.error(err);
//           res.status(500).send("Internal Server Error");
//       });
// });








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
    specifications, // Use the "specifications" field as an array
    Lspec,
    features,
    youtube,
    mapV, // Latitude
    mapH, // Longitude
    type,
  } = req.body;

  // Store filenames of uploaded images
  const imageFilenames = req.files.map((file) => file.filename);

  // Find the highest value of signature in the database
  Post.findOne({}, {}, { sort: { 'signature': -1 } })
    .exec()
    .then((highestPost) => {
      let highestSignature = 0;
      if (highestPost) {
        highestSignature = highestPost.signature || 0;
      }

      // Increment the highest signature by 1
      const newSignature = highestSignature + 1;

      // Create a new Post document using the data and the new signature
      const post = new Post({
        title,
        author,
        content,
        specifications, // Store specifications as an array
        Lspec,
        features,
        youtube,
        mapV, // Latitude
        mapH, // Longitude
        type,
        signature: newSignature, // Assign the new signature
        images: imageFilenames, // Store filenames in the images array
      });

      // Save the new post document to the database
      return post.save();
    })
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
      // Fetch three random projects of the same type
      const similarProjects = await Post.aggregate([
        { $match: { type: post.type, _id: { $ne: post._id } } },
        { $sample: { size: 3 } }
      ]);

      const recentProjects = await Post.find().sort({ createdAt: -1 }).limit(3);

      res.render("post", {
        title: post.title,
        author: post.author,
        date: post.createdAt.toDateString(),
        content: post.content,
        images: post.images,
        specifications: post.specifications,
        Lspec: post.Lspec,
        youtube: post.youtube,
        maplati: post.mapV,
        maplongi: post.mapH,
        type: post.type,
        features: post.features,
        similarProjects: similarProjects, // Pass the similar projects array to the template
        recentProjects: recentProjects // Pass the recent projects array to the template
      });
    } else {
      res.status(404).render("error", { message: "Post not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
});


// 13-10-2023 new code ===================================================

// Add this route to your Express app
app.get("/edit-projects", requireAuth, function (req, res) {
  Post.find({})
    .sort({ signature: -1 })
    .then((posts) => {
      res.render("edit-projects", {
        posts: posts,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});


// Route to increment signature value of a post
app.post("/makeTop/:postId", (req, res) => {
  const postId = req.params.postId;
  // Find the post by ID and update its signature value
  Post.findByIdAndUpdate(postId, { $inc: { signature: 1 } })
      .then(() => {
          res.status(200).send("Post signature incremented successfully");
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send("Internal Server Error");
      });
});


app.get("/edit/:projectId", requireAuth, function (req, res) {
  const projectId = req.params.projectId;
  // Fetch the project by its ID
  Post.findOne({ _id: projectId })
    .then((project) => {
      if (project) {
        res.render("edit-project", { project: project });
      } else {
        res.status(404).render("error", { message: "Project not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).render("error", { message: "Internal Server Error" });
    });
});

app.post(
  "/update/:projectId",
  requireAuth,
  upload.array("image", 10),
  function (req, res) {
    const projectId = req.params.projectId;
    const updatedData = req.body;

    // Check if new images were uploaded
    if (req.files.length > 0) {
      updatedData.images = req.files.map((file) => file.filename);
    } else {
      // No new images uploaded, keep the existing ones
      const existingImages = req.body.existingImages;
      if (existingImages && Array.isArray(existingImages)) {
        updatedData.images = existingImages;
      }
    }

    // Handle the specifications array correctly
    updatedData.specifications = req.body.specifications.filter(
      (spec) => spec.trim() !== ""
    ); // Filter out empty specifications

    // Find and update the project by its ID
    Post.findOneAndUpdate({ _id: projectId }, updatedData, { new: true })
      .then((updatedProject) => {
        if (updatedProject) {
          res.redirect("/projects"); // Redirect to the projects page after updating
        } else {
          res.status(404).send("error", { message: "Project not found" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).render("error", { message: "Internal Server Error" });
      });
  }
);

app.get("/dasboard", requireAuth, function (req, res) {
  res.render("dasboard");
});

app.get("/delete-projects", requireAuth, function (req, res) {
  Post.find({})
    .sort({ signature: -1 })
    .then((posts) => {
      res.render("delete-projects", {
        posts: posts,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

// app.post("/delete/:projectId", requireAuth, function (req, res) {
//   const projectId = req.params.projectId;

//   // Find and delete the project by its ID
//   Post.findByIdAndRemove(projectId)
//     .then((deletedProject) => {
//       if (deletedProject) {
//         // Delete the project's images from the server (similar to the edit route)
//         deletedProject.images.forEach((image) => {
//           const imagePath = `public/uploads/${image}`;
//           fs.unlink(imagePath, (err) => {
//             if (err) {
//               console.error(err);
//             }
//           });
//         });

//         // Redirect to the "delete-projects" page after deleting
//         res.redirect("/delete-projects");
//       } else {
//         res.status(404).send("error", { message: "Project not found" });
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send("error", { message: "Internal Server Error" });
//     });
// });

// Handle the delete project request
app.post("/delete/:projectId", requireAuth, function (req, res) {
  const projectId = req.params.projectId;
  const { email, password } = req.body;

  // Find the admin user with the provided email in the database
  Admin.findOne({ email: email })
    .then((admin) => {
      if (admin && password === admin.password) {
        // Passwords match, proceed with deletion
        Post.findByIdAndRemove(projectId)
          .then((deletedProject) => {
            if (deletedProject) {
              // Delete the project's images from the server (similar to the edit route)
              deletedProject.images.forEach((image) => {
                const imagePath = `public/uploads/${image}`;
                fs.unlink(imagePath, (err) => {
                  if (err) {
                    console.error(err);
                  }
                });
              });
              // Redirect to the "delete-projects" page after deleting
              res.redirect("/delete-projects");
            } else {
              res.status(404).send("error", { message: "Project not found" });
            }
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send("error", { message: "Internal Server Error" });
          });
      } else {
        // Passwords do not match, show an error message
        res
          .status(400)
          .render("error", {
            message: "Incorrect email or password. Project not deleted.",
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("error", { message: "Internal Server Error" });
    });
});

// ========================= form handling route======================================================

app.post("/processform", function (req, res) {
  // Access form data from the request body
  const { name, email, contactnumber, message } = req.body;

  // Create a new FormSubmission document with the form data
  const formSubmission = new Form({
    name,
    email,
    contactnumber,
    message,
  });

  // Save the form submission to the database
  formSubmission
    .save()
    .then(() => {
      // Form data saved successfully
      res.send("Form data saved successfully.");
    })
    .catch((error) => {
      // Handle any errors, e.g., by sending an error response
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});






// dashboard route++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ...

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
