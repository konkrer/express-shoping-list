const express = require('express');
const ExpressError = require('./ExpressError');
const morgan = require('morgan');
const itemRoutes = require('./itemRoutes');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use('/items', itemRoutes);

// 404
app.use(function (req, res, next) {
  const notFoundError = new ExpressError(404, 'Not Found');
  return next(notFoundError);
});
// Error Handler gets triggered by next(val)
app.use((err, req, res, next) => {
  const status = err.status || 500;

  res.status(status).json({ error: { message: err.message, status } });
});

module.exports = app;
