const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  
  if (!(err instanceof ApiError)) {
    console.log(err);
            
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "Internal Server Error";
  }

  res.status(statusCode).send({
    status: statusCode,
    message,
  });
};

module.exports = errorHandler;
