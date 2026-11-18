// const errorhandel = (error, req, res, next) => {
//   return res
//     .status(error.status || 500)
//     .json({ message: error.message || "server is down" });
// };

const errorhandel = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  return res.status(error.status || 500).json({
    message: error.message || "Internal server error",
  });
};

export default errorhandel;
