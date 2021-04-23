const express = require("express");
const router = new express.Router();
const session = require("express-session");
const {authorize} = require("../middleware/business-auth");

const {
  getAllBusinesses,
  locateBusiness,
  getBusinessByName,
  businessByType,
  getABusiness,
  createBusiness,
  loginBusiness,
  updateBusiness,
  deleteBusiness,
} = require("../controllers/Business");

const {
  getAComment,
  getAllComments,
  getBusinessComments,
  getPostComments,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/Comments");

const {
  getAPost,
  getBusinessPosts,
  getEveryPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/Posts");

const matchPostsAndComments = require("../controllers/Searches");

//middleware
router.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    name: "sessionName",
  })
);

router.use(express.json());

router.use((req, res, next) => {
  console.log("business router");
  next();
});

// business related routes

// register a new business
router.post("/register", createBusiness);

// business login
router.post("/login", loginBusiness);

router.get("/logout", async (req, res) => {
  req.session.user = {};
  return res.status(200).json({
    message: "Logged out"
  })
})

// get all businesses
router.get("/all", getAllBusinesses);

// business own profile
router.get("/home/profile/:business_id?", authorize, getABusiness);

// update business profile
router.patch("/home/update/:business_id?", authorize, updateBusiness);

// get one post belonging to a business (& comments on that post
router.get("/posts/post/:post_id", authorize, getAPost);

// search engine for business name, description
router.get("/find/name/?search=:query", getBusinessByName);

// search engine for posts, comments
router.get("/find/content/?content=:query", matchPostsAndComments);

// get all businesses by type
router.get("/category/:type", businessByType);

// get all businesses by location
router.post("/location-search", locateBusiness);

// get all businesses by type & location
router.get("/category/:type/distance/?rad=:distance");

// business makes a post
router.post("/create-post", authorize, createPost);

// get all posts belonging to a business
router.get("/home/posts/:business_id/all", authorize, getBusinessPosts);

// get all comments on a post
router.get("/posts/post/:post_id/comments/all", authorize, getPostComments);

// business comments on a post
router.post("/posts/post/:post_id/comment/create/:business_id", authorize, createComment);

// business updates a post
router.patch("/posts/post/:post_id/edit", authorize, updatePost);

// business updates a comment
router.patch("/posts/post/:post_id/comment/:comment_id", authorize, updateComment);

// delete a business
router.delete("/home/delete-business/:business_id", authorize, deleteBusiness);

// business deletes a post
router.delete("/posts/post/:post_id/remove", authorize, deletePost);

// business deletes a comment it made or a comment on a post it made
router.delete("/posts/post/:post_id/comment/:comment_id", authorize, deleteComment);

module.exports = router;
