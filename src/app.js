const express = require('express')
const app = express()
const rota = require('./routes/route')
const port = 3000

app.use(express.json())
app.use('/', rota)


app.listen(port, () => {
    console.log(`Node Server Started on port ${port} - http://localhost:${port}`)
})
