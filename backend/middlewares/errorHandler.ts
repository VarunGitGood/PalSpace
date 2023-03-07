class ErrorResponse extends Error {
  statusCode: number
  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

const errorHandler = (err: ErrorResponse, req: any, res: any, next: any) => {
  const { statusCode, message } = err
  res.status(statusCode).json({
    status: 'Error',
    statusCode,
    message,
  })
  next()
}

export { ErrorResponse, errorHandler }
