// middleware/errorMiddleware.js
const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Server Error'

  res.status(statusCode).json({
    success: false,
    message,
    data: null
  })
}

export default errorMiddleware