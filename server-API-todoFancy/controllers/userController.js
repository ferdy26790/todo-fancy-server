const userModel = require('../models/user')
var bcrypt = require('bcrypt');
const saltRounds = 10;
var FB = require('fb'),
    fb = new FB.Facebook({
      version : 'v2.8'
    })
const jwt = require('jsonwebtoken')
class User{
  // static loginFb(req, res) {
  //   console.log(req.headers.tokenfb);
  //   FB.setAccessToken(req.headers.tokenfb);
  //   FB.api('/me', { fields: ['id', 'name', 'email'] }, function(response){
  //     if(!response) {
  //       res.status(500).send(response.err)
  //     } else {
  //       userModel.find({email:response.email})
  //       .then((user) => {
  //         if(user.length > 0) {
  //           res.status(200).json({
  //             msg: 'login fb success',
  //             user: user[0]
  //           })
  //         } else {
  //           let newUser = new userModel({
  //             name: response.name,
  //             email: response.email,
  //             fbId: response.id,
  //             password: 'fb',
  //             role: 'user'
  //           })
  //           newUser.save()
  //           .then((userCreated) => {
  //             res.status(200).json({
  //               msg: "user from fb created",
  //               user: userCreated
  //             })
  //           }).catch((err) => {
  //             res.status(500).json(err)
  //           })
  //         }
  //       }).catch((err) => {
  //         res.status(500).json({
  //           msg: err
  //         })
  //       })
  //     }
  //   })
  // }
  static signUp(req, res) {
    console.log(req.body.password, req.body.name, req.body.email);
    if(!req.body.password) {
      res.status(422).json({
        msg: 'missing password fields'
      })
    }
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      if(!err) {
        let newUser = new userModel({
          name: req.body.name,
          email: req.body.email,
          password: hash,
          role: 'user'
        })
        console.log(newUser);
        newUser.save()
        .then((userCreated) => {
          res.status(200).json({
            msg: "user created",
            user: userCreated
          })
        }).catch((err) => {
          console.log(err)
          res.status(500).send(err)
        })
      } else {
        console.log(err)
      }
    });
  }
  static addUser(req, res) {
    if(!req.body.password) {
      res.status(422).json({
        msg: 'missing password fields'
      })
    }
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      let newUser = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        role: req.body.role
      })
      newUser.save()
      .then((userCreated) => {
        res.status(200).json({
          msg: "user created",
          user: userCreated
        })
      }).catch((err) => {
        res.status(500)
      })
    });
  }
  static signIn(req, res) {
    console.log('masuk')
    userModel.findOne({email:req.body.email})
    .then((user) => {
      if(!user) {
        res.status(200).json({
          msg: "email not registered"
        })
      } else {
        bcrypt.compare(req.body.password, user.password, function(err, response) {
          if(response) {
            let payload = jwt.sign({
              user: user
            }, process.env.SECURITY)
            res.status(200).json({
              user:{
                id: user._id,
                name: user.name
              },
              token: payload
            })
          } else {
            res.status(401).json({
              msg: "password not match"
            })
          }
        })
      }
    }).catch((err) => {
      res.status(500).send(err)
    })
  }
  static signInWithFb(req, res) {

  }
  static findUsers(req, res) {
    userModel.find()
    .then((users) => {
      if(!users){
        res.status(204).send('no content')
      }
      res.status(200).json({
        users: users
      })
    }).catch((err) => {
      res.status(500).send(err)
    })
  }
  static findUser(req, res) {
    userModel.findById(req.params.id)
    .then((user) => {
      if(!user){
        console.log('masuk', user);
        res.status(204).send('no content')
      } else {
        res.status(200).json({
          user: user
        })
      }

    }).catch((err) => {
      res.status(500).send(err)
    })
  }
  static editUser(req, res) {
    userModel.findById(req.params.id)
    .then((user) => {
      if(!user){
        res.status(204).send()
      }
      user.name = req.body.name
      user.save()
      .then((userSaved) => {
        res.status(200).json({
          msg: 'user updated',
          user: userSaved
        })
      }).catch((err) => {
        res.status(500).send(err)
      })
    }).catch((err) => {
      res.status(500).send(err)
    })
  }
  static deleteUser(req, res) {
    userModel.findByIdAndRemove(req.params.id)
    .then((userDeleted) => {
      if(!userDeleted){
        res.status(204).send()
      }
      res.status(200).json({
        msg: 'user deleted',
        user: userDeleted
      })
    }).catch((err) => {
      res.status(500).send(err)
    })
  }
}

module.exports = User;
