/** Tests for items routes */

process.env.NODE_ENV = 'test';

const client = require('supertest');
const app = require('./app');
const ExpressError = require('./ExpressError');
const items = require('./fakeDb');

describe('Test items endpoints function', function () {
  beforeEach(function () {
    book = { name: 'book', price: 25.0 };
    items.push(book);
  });

  afterEach(function () {
    items.length = 0;
  });

  test('Test GET /items returns items', async () => {
    const resp = await client(app).get('/items');
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual([book]);
  });

  test('Test GET /item returns item', async () => {
    const resp = await client(app).get('/items/book');
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual(book);
  });

  test('Test POST /item adds item', async () => {
    const chair = { name: 'chair', price: 200 };
    const resp = await client(app).post('/items').send(chair);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({ added: chair });
  });

  test('Test POST /item can be seen /items endpoint', async () => {
    const chair = { name: 'chair', price: 200 };
    await client(app).post('/items').send(chair);
    const resp = await client(app).get('/items');
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual([
      { name: 'book', price: 25 },
      { name: 'chair', price: 200 },
    ]);
  });

  test('Test PATCH /item updates item', async () => {
    const chair = { name: 'chair', price: 200 };
    const resp = await client(app).patch('/items/book').send(chair);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ updated: chair });
  });

  test('Test PATCH /item can be seen /items endpoint', async () => {
    const chair = { name: 'chair', price: 200 };
    await client(app).patch('/items/book').send(chair);
    const resp = await client(app).get('/items');
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual([{ name: 'chair', price: 200 }]);
  });

  test('Test DELETE /item deletes item', async () => {
    const resp = await client(app).delete('/items/book');
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ message: 'Deleted' });
  });

  test('Test DELETE /item can not be seen at /items endpoint', async () => {
    await client(app).delete('/items/book');
    const resp = await client(app).get('/items');
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual([]);
  });
});

describe('Test items API errors are handled', () => {
  beforeEach(function () {
    book = { name: 'book', price: 25.0 };
    items.push(book);
  });

  afterEach(function () {
    items.length = 0;
  });

  test('Test GET /item bad name returns 404', async () => {
    const resp = await client(app).get('/items/bookd');
    expect(resp.statusCode).toEqual(404);
  });

  test('Test POST /item without data returns 400', async () => {
    const resp = await client(app).post('/items');
    expect(resp.statusCode).toEqual(400);
  });

  test('Test POST /item wrong item format return 400', async () => {
    let chair = { title: 'chair', price: 200 };
    let resp = await client(app).post('/items').send(chair);
    expect(resp.statusCode).toEqual(400);

    chair = { name: 'chair', price: 'a lot' };
    resp = await client(app).post('/items').send(chair);
    expect(resp.statusCode).toEqual(400);

    chair = { price: 200 };
    resp = await client(app).post('/items').send(chair);
    expect(resp.statusCode).toEqual(400);
  });

  test('Test PATCH /item without data returns 400', async () => {
    const resp = await client(app).patch('/items/book');
    expect(resp.statusCode).toEqual(400);
  });

  test('Test PATCH /item wrong item format return 400', async () => {
    let chair = { title: 'chair', price: 200 };
    let resp = await client(app).patch('/items/book').send(chair);
    expect(resp.statusCode).toEqual(400);

    chair = { name: 'chair', price: 'a lot' };
    resp = await client(app).patch('/items/book').send(chair);
    expect(resp.statusCode).toEqual(400);

    chair = { price: 200 };
    resp = await client(app).patch('/items/book').send(chair);
    expect(resp.statusCode).toEqual(400);
  });

  test('Test DELETE /item bad name returns 404', async () => {
    const resp = await client(app).delete('/items/books');
    expect(resp.statusCode).toEqual(404);
  });
});
