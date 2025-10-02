// const express = require('express')
import express from "express"

const app = express()
const port = 122

app.set('view engine', 'hbs');
app.set('views', './src/views')

app.use("/assets", express.static('src/assets'));
// req => dari claent ke server
// res => dari server ke client
app.get("/home", (req , res) => {
  res.render("index")
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
