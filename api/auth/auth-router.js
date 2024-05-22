const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./auth-model.js");
const secret = require("./secret.js");

router.post('/register', async (req, res, next) => {
  let {username, password} = req.body;
  if (!username || !password) {
    next({status: 400, message: "username and password are required"})
  } else {
    const [taken] = await User.findBy({username})
    if (taken) {
      next({status: 400, message: "username taken"})
    } else {
      const hash = bcrypt.hashSync(password, 7);
      password = hash;
      User.add({username, password})
        .then(newUser => {
          res.status(201).json(newUser)
        }) .catch(err => {
          next(err)
        })
    }
  }
  
  //res.end('implement register, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', async (req, res, next) => {
  let {username, password} = req.body;
  if (!username || !password) {
    next({status: 400, message: "username and password are required"})
  } else {
    const [user] = await User.findBy({username});
    if (!user || !bcrypt.compareSync(password, user.password)) {
      next({status: 401, message: "invalid credentials"})
    } else {
      const token = tokenMaker(user)
      res.status(200).json({message: `welcome, ${user.username}`, token})
    }
  }
  //res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

function tokenMaker(user) {
  let payload = {
    subject: user.id,
  }
  let options = {
    expiresIn: "1d"
  }
  return jwt.sign(payload, secret, options)
}

module.exports = router;
