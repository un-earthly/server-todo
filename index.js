const express = require('express')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 80

const app = express()

app.use(cors())
app.use(express.json())

app.

app.listen(port)