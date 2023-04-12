const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
   
 if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});




/*-------------------------------------------------------------------------------------*/

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send(JSON.stringify(books,4));
    //return res.status(200).send(books);
});

//********** Get the book list available in the shop ASYNC **********//
function AsyncGetBooks() {
  return new Promise((resolve, reject) => {
     if (Object.keys(books).length>0)
        return resolve(books);
     else return reject ({"message":"There are not books"});
  });
}
public_users.get('/async',function (req, res) {
  AsyncGetBooks()
  .then(resolve => {return res.status(200).send(resolve)})
  .catch(reject => {return res.status(400).send(reject)});
});

//**********END  Get the book list available in the shop ASYNC **********//


/*-------------------------------------------------------------------------------------*/
// Get book review based on ISBN
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const  key = Object.keys(books).find( k => {return k == isbn})
   if (key)
   {
       return res.status(200).json(books[key].reviews);
   } 
    return res.status(200).json({message: "Book was not found "+isbn});
  });


/*-------------------------------------------------------------------------------------*/


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const  key = Object.keys(books).find( k => {return k == isbn})
   if (key)
   {
      return res.status(200).json(books[key]);
   } 
    return res.status(200).json({message: "Book was not found "+isbn});
  });
 
// *****************Get book details based on ISBN Async*******//
public_users.get('/async/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
   getReview = new Promise((resolve,reject)=>{
    const  key = Object.keys(books).find( k => {return k == isbn})
    if (key)
    {
       return resolve(books[key]);
    } 
     return reject({message: "Book was not found "+isbn});
   })
   getReview
   .then(resolve => {return res.status(200).send(resolve)})
   .catch(reject => {return res.status(400).send(reject)});
});  
// *****************END Get book details based on ISBN Async*******//


/*-------------------------------------------------------------------------------------*/

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksfiltered = Object.entries(books).filter((value) => {
    return Object.entries( Object.entries(value)[1][1])[0][1]  == author;
  } );
  return res.status(200).json({"bookFiltered":booksfiltered});
});

// *********Get book details based on author ASYNC***************//
async function finderbyauthor(author) {
  let  booksfiltered
   return new Promise((resolve) => {
     booksfiltered = Object.entries(books).filter((value) => {
      return Object.entries( Object.entries(value)[1][1])[0][1]  == author;
    } );
    resolve(booksfiltered)
  });
}
public_users.get('/async/author/:author',function (req, res) {
  const author = req.params.author;
  finderbyauthor(author).then(bf=>{
    return res.status(200).json({"bookFiltered":bf});
  });
  
});
// *************END Get book details based on author ASYNC*********//



/*-------------------------------------------------------------------------------------*/

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksfiltered = Object.entries(books).filter((value) => {
    return Object.entries( Object.entries(value)[1][1])[1][1]  == title;
  } );
  return res.status(200).json({"bookFiltered":booksfiltered});
});


//************** Get all books based on title ASYNC*****************//
async function finderbytitle(title) {
  let  booksfiltered
   return new Promise((resolve) => {
     booksfiltered = Object.entries(books).filter((value) => {
      return Object.entries( Object.entries(value)[1][1])[1][1]  == title;
    } );
    resolve(booksfiltered)
  });
}
public_users.get('/async/title/:title',function (req, res) {
  const title = req.params.title;
  finderbytitle(title).then(bf=>{
    return res.status(200).json({"bookFiltered":bf});
  });
  
});
//**************END Get all books based on title ASYNC*****************//




module.exports.general = public_users;
