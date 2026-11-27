import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './server.js';

test('GET /api/expenses returns seeded expenses', async (t) => {
  const server = createApp().listen(0);
  t.after(() => new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  }));
  const response = await fetch(`http://localhost:${server.address().port}/api/expenses`);
  assert.equal(response.status, 200);
  const expenses = await response.json();
  assert.ok(expenses.length >= 2);
});
