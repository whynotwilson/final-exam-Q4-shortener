const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Shortener = require('./models/shortener')

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

app.get('/:id', (req, res) => {
  Shortener.findOne({ shortenURL: req.params.id })
    .exec((err, shortener) => {
      if (err) console.log(err)
      if (shortener) {
        res.redirect(shortener.originalUrl)
      } else {
        res.render('index')
      }
    })
})

app.post('/shortener', (req, res) => {
  const url = req.body.url

  const createRandomShortener = function () {
    const shortenerCode = Math.random().toString(36).slice(-5)
    Shortener.findOne({ shortenURL: shortenerCode }, (err, shortener) => {
      if (err) console.log(err)
      else if (shortener) {
        return createRandomShortener()
      } else {
        const shortener = new Shortener({
          shortenURL: shortenerCode,
          originalUrl: url
        })
        shortener.save(err => {
          let link = ''
          link += req.headers.origin + '/' + shortenerCode
          // console.log('link', link)
          if (err) console.log(err)
          return res.render('shortener', { link })
        })
      }
    })
  }
  // 防止表單是空的
  if (!url) {
    res.render('index', { messages: 'URL 欄位未填' })
  } else {
    Shortener.findOne({ originalUrl: url })
      .lean()
      .exec((err, shortener) => {
        if (err) console.log(err)
        // 資料庫有該網址
        if (shortener) {
          let link = ''
          link += req.headers.origin + '/' + shortener.shortenURL
          // console.log('link', link)
          res.render('shortener', { link })

        // 資料庫沒有該網址
        } else {
          // 防止重複短網址
          createRandomShortener()
        }
      })
  }
})

app.listen(port, () => {
  console.log('app is running......')
})
