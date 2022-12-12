const express = require('express')
const app = express()
const routes = require('./routes/route')
const port = 3000

app.use(express.json())
app.use('/', routes)


app.listen(port, () => {
    console.log(`Node Server Started on port ${port} - http://localhost:${port}`)
})
