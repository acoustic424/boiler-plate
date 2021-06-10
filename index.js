const express = require('express')
const app = express()
const port = 4000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://dy_node:12345@boilerplate.mt3b1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { 
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World Node.js!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})