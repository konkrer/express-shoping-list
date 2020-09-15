/** Endpoints for items CRUD */

const express = require('express');
const items = require('./fakeDb');
const { checkBody, checkExists } = require('./middleware');

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    // Default status 200
    return res.json(items);
  } catch (error) {
    next(error);
  }
});

router.post('/', checkBody, (req, res, next) => {
  try {
    const newItem = req.body;
    items.push(newItem);
    return res.status(201).json({ added: newItem });
  } catch (error) {
    next(error);
  }
});

router.get('/:name', checkExists, (req, res, next) => {
  try {
    const item = items.find(el => el.name === req.params.name);
    // Default status 200
    return res.json(item);
  } catch (error) {
    next(error);
  }
});

router.patch('/:name', checkExists, checkBody, (req, res, next) => {
  try {
    const item = items.find(el => el.name === req.params.name);
    item.name = req.body.name;
    item.price = req.body.price;
    // Default status 200
    return res.json({ updated: item });
  } catch (error) {
    next(error);
  }
});

router.delete('/:name', checkExists, (req, res, next) => {
  try {
    const itemIdx = items.findIndex(el => el.name === req.params.name);
    items.splice(itemIdx, 1);
    // Default status 200
    return res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
