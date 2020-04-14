const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// 設定 bodyParser, handlebars
app.use(bodyParser.urlencoded({ extended: true }))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 資料庫連線
mongoose.connect('mongodb://localhost/shortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

// 取得資料庫連線物件
const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongoDB error')
})

// 連線成功
db.once('open', () => {
  console.log('mongoDB connected!')
})

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/shortener', (req, res) => {
  res.render('shortener')
})

app.listen(port, () => {
  console.log('app is running......')
})
