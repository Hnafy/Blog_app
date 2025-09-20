const notFoundHandler = (req,res,next)=>{
  const error = new Error(`not found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err,req,res,next)=>{
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).send({msg:err.message,stack:err.stack})
}

export {errorHandler,notFoundHandler}