const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{  
  let userswithsamename = users.filter((user)=>{
  return user.username === username
});
if(userswithsamename.length > 0){
  return true;
} else {
  return false;
}
}

const authenticatedUser = (username,password)=>{ 
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const  key = Object.keys(books).find( k => {return k == isbn})
  username = req.session.authorization['username'];
  if (!key) return res.status(200).json({message: "Book was not found "+isbn});
  if (!books[key].reviews[username])
  {  
     let objreview={};
     objreview[username]=review;
     Object.assign(books[key].reviews, objreview);     
  } 
  else
  {
      books[key].reviews[username]=review;
  }
  return res.status(200).json(books[key].reviews);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const  key = Object.keys(books).find( k => {return k == isbn})
  username = req.session.authorization['username'];
  if (!key) return res.status(200).json({message: "Book was not found "+isbn});
  if (books[key].reviews[username])
  {  
      delete books[key].reviews[username];
  } 
  return res.status(200).json(books[key].reviews);
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
