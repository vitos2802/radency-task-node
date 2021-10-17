const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const notesRouter = require('./routes/api/notes')
const { HttpCode } = require('./helpers/constants')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/notes', notesRouter)

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({
    status: status === HttpCode.INTERNAL_SERVER_ERORR ? 'fail' : 'error',
    code: status,
    message: err.message,
  })
})

module.exports = app
