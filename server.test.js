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

test('POST /api/expenses creates and returns an expense', async (t) => {
  const server = createApp().listen(0);
  t.after(() => new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  }));
  const baseUrl = `http://localhost:${server.address().port}`;
  const response = await fetch(`${baseUrl}/api/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item: 'Test Samosa', category: 'Food', amount: 15 })
  });

  assert.equal(response.status, 201);
  const created = await response.json();
  assert.deepEqual(
    { item: created.item, category: created.category, amount: created.amount },
    { item: 'Test Samosa', category: 'Food', amount: 15 }
  );
  const listResponse = await fetch(`${baseUrl}/api/expenses`);
  assert.ok((await listResponse.json()).some(expense => expense.id === created.id));
});

test('DELETE /api/expenses/:id removes an expense', async (t) => {
  const server = createApp().listen(0);
  t.after(() => new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  }));
  const baseUrl = `http://localhost:${server.address().port}`;
  const createResponse = await fetch(`${baseUrl}/api/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item: 'Test Idli', category: 'Food', amount: 20 })
  });
  const created = await createResponse.json();

  const deleteResponse = await fetch(`${baseUrl}/api/expenses/${created.id}`, { method: 'DELETE' });
  assert.equal(deleteResponse.status, 204);
  const listResponse = await fetch(`${baseUrl}/api/expenses`);
  assert.ok(!(await listResponse.json()).some(expense => expense.id === created.id));

  const missingResponse = await fetch(`${baseUrl}/api/expenses/${created.id}`, { method: 'DELETE' });
  assert.equal(missingResponse.status, 404);
});
