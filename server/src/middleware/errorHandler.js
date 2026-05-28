// const errorHandler = (err, req, res, next) => {
//   const status = err.status || 500;
//   const message = err.message || 'Something went wrong on our end.';

//   if (process.env.NODE_ENV === 'development') {
//     console.error(`[ERROR] ${status} - ${message}`);
//   }

//   res.status(status).json({ error: message });
// };


const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;

  
  const message = status === 500 && process.env.NODE_ENV === 'production'
    ? 'Something went wrong on our end.'
    : err.message || 'Something went wrong on our end.';

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${status} - ${err.message}`);
    console.error(err.stack);
  }

  res.status(status).json({ error: message });
};

module.exports = errorHandler;
