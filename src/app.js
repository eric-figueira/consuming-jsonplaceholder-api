const express = require('express')
const app = express()
const rota = require('./routes/route')
const path = require('path')
const port = 3000

app.set('view engine', 'ejs')
app.use(express.json())
app.use('/', rota)
app.use(express.static(path.join(__dirname,'../public/')))


app.listen(port, () => {
    console.log(`Node Server Started on port ${port} - http://localhost:${port}`)
})
