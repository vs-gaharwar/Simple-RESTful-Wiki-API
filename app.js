//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

/////////////////////////////////MongoDB Connection//////////////////////////////////////////

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please check data entry, no specified title!"]
    },
    content: {
      type: String,
      required: [true, "Please check data entry, no specified content!"]
    }
  }
);

const Article = mongoose.model("Article", articleSchema);

const article = new Article(
  {
    title: "RESTful API",
    content: "REpresentational State Tranfer API."
  }
);

//article.save();

/////////////////////////////Home page articles handling///////////////////////////////////////////

app.route("/articles")

.get(function(req, res){
  Article.find(function(err, results){
    if(results)    {
        res.send(results);
    }else{
      res.send("No article found in database.");
    }
  })
})

.post(function(req, res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err)  res.send("Successfully added new article.");
    else res.send(err);
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err)  res.send("Successfully deleted all articles.")
    else res.send(err);
  })
});

/////////////////////////////Specific article handling///////////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle)  res.send(foundArticle);
    else res.send("No article found with this title.");
  });
})

.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err)  res.send("Successfully update the article.");
      else res.send(err);
    });
})

.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err)  res.send("Successfully update the article.");
      else res.send(err);
    }
  );
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
    if(!err)  res.send("Successfully deleted the article.")
    else res.send(err);
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
