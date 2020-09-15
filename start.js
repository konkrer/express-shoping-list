/** This is the start server script to run the server. */

const app = require('./app');

// Listen for requests.
app.listen(3000, function () {
  console.log('Server listening on port 3000');
});
