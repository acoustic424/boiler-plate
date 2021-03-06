const express = require('express')
const app = express()
const port = 4000
//const bodyParser = require('body-parser') body-parser is deprecated
const { User } = require("./models/User")
const config = require('./config/key')
const cookieParser = require('cookie-parser')
const { auth } = require('./middleware/auth')

//application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}))

//application/json
app.use(express.json())

app.use(cookieParser())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, { 
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World Node.js! Welcome back!')
})

app.post('/api/user/register', (req, res) => {
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/api/users/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user){
      return req.json({
        loginSuccess: false,
        message: "Cannot find the user of email requested."
      })
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch){
        return res.json({ 
          loginSuccess: false, 
          message: "The password is not correct."
        })
      }
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err)
          res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id }, 
    { token: "" },
    (err, user) => {
      if(err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})