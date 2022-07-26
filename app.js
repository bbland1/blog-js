//jshint esversion:6

// set up server and app variables
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash")
const port = 3000;

const app = express();


// inital posts
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// Middleware
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// setting up mongoose
mongoose.connect("mongodb://localhost:27017/blogDB");

const postsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "You need a title for your new post."]
  },
  content: {
    type: String,
    required: [true, "You didn't write anything."]
  }
});

const Post = mongoose.model("Post", postsSchema);

// getting the blog home page

app.get("/", (req, res) => {

  Post.find({}, (err, posts) => {
    if (err) {
      console.log(err);
      res.redirect("/")
    } else {
      res.render("home", {
        homePage: homeStartingContent,
        posts: posts
      });
    }
  });
});

// about page of blog
app.get("/about", (req, res) => {
  res.render("about", { aboutPage: aboutContent });
})

// the contact page
app.get("/contact", (req, res) => {
  res.render("contact", { contactPage: contactContent });
})

// hidden compose page
app.get("/compose", (req, res) => {
  res.render("compose");
})

app.post("/compose", (req, res) => {
  const post = {
    title: req.body.blogTitle,
    content: req.body.blogBody
  }

  Post.create({
    title: post.title,
    content: post.content
  }, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", (req, res) => {
  const requestedId = req.params.postId;

  Post.findOne({_id: requestedId}, (err, foundPost) => {
    if (err) {
      res.send("Issue finding the post clicked.").status(404);
    }
      res.render("post", {
        title: foundPost.title,
        content: foundPost.content
      });
  });
});

app.listen(port, function () {
  console.log("Server started on port 3000");
});
