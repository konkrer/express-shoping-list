/** Middleware for express shopping list */

const items = require('./fakeDb');
const ExpressError = require('./ExpressError');

/**
 * Make sure body of request is valid
 * JSON for item CRUD functions.
 *
 */
function checkBody(req, _, next) {
  try {
    const data = req.body;
    if (!data) throw new ExpressError(400, 'No data');
    if (!data.name || !data.price)
      throw new ExpressError(400, 'Item needs a name and a price');
    if (!isFinite(data.price))
      throw new ExpressError(400, 'Price needs to be a number');
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Check given name parameter is valid name value of an item.
 */
function checkExists(req, _, next) {
  try {
    const name = req.params.name;
    if (!name) throw new ExpressError(400, 'Please include item name.');
    if (!items.some(el => el.name === name))
      throw new ExpressError(404, 'No matching item found');
    return next();
  } catch (error) {
    next(error);
  }
}

module.exports = { checkBody, checkExists };
