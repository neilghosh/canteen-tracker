import { createServer } from 'node:http';

const expenses = [
  { id: 1, item: 'Masala Dosa', category: 'Food', amount: 60 },
  { id: 2, item: 'Filter Coffee', category: 'Beverage', amount: 25 }
];

const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Campus Canteen Expense Tracker</title>
  <style>
    body { font: 16px system-ui, sans-serif; max-width: 600px; margin: 3rem auto; padding: 0 1rem; }
    form { display: flex; flex-wrap: wrap; gap: .5rem; }
    input, select, button { font: inherit; padding: .5rem; }
    li { padding: .4rem 0; }
  </style>
</head>
<body>
  <h1>Campus Canteen Expense Tracker</h1>
  <p id="total-spend" aria-live="polite">Total Spend: ₹0.00</p>
  <form id="expense-form">
    <input name="item" type="text" placeholder="Item" aria-label="Item" required>
    <select name="category" aria-label="Category">
      <option>Food</option><option>Beverage</option><option>Stationery</option>
    </select>
    <input name="amount" type="number" placeholder="Amount (₹)" aria-label="Amount in rupees" min="0" step="0.01" required>
    <button type="submit">Add</button>
  </form>
  <label for="category-filter">Filter by category</label>
  <select id="category-filter">
    <option value="All">All</option>
    <option value="Food">Food</option>
    <option value="Beverage">Beverage</option>
    <option value="Stationery">Stationery</option>
  </select>
  <ul id="expenses"></ul>
  <script>
    const form = document.querySelector('#expense-form');
    const list = document.querySelector('#expenses');
    const categoryFilter = document.querySelector('#category-filter');
    const totalSpend = document.querySelector('#total-spend');
    const formatCurrency = amount => new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
    async function renderExpenses() {
      const response = await fetch('/api/expenses');
      const expenses = await response.json();
      totalSpend.textContent = 'Total Spend: ' + formatCurrency(
        expenses.reduce((total, expense) => total + expense.amount, 0)
      );
      list.replaceChildren();
      const visibleExpenses = categoryFilter.value === 'All'
        ? expenses
        : expenses.filter(expense => expense.category === categoryFilter.value);
      for (const expense of visibleExpenses) {
        const row = document.createElement('li');
        const details = document.createElement('span');
        details.textContent = expense.item + ' — ' + expense.category + ' — ' + formatCurrency(expense.amount);
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', async () => {
          const deleteResponse = await fetch('/api/expenses/' + expense.id, { method: 'DELETE' });
          if (!deleteResponse.ok) {
            alert('Could not delete expense.');
            return;
          }
          await renderExpenses();
        });
        row.append(details, ' ', deleteButton);
        list.append(row);
      }
    }
    categoryFilter.addEventListener('change', renderExpenses);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: data.get('item'), category: data.get('category'), amount: Number(data.get('amount')) })
      });
      if (!response.ok) {
        alert('Could not add expense.');
        return;
      }
      form.reset();
      await renderExpenses();
    });
    renderExpenses();
  </script>
</body>
</html>`;

export function createApp() {
  return createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(page);
    } else if (req.method === 'GET' && req.url === '/api/expenses') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(expenses));
    } else if (req.method === 'POST' && req.url === '/api/expenses') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        let input;
        try {
          input = JSON.parse(body);
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
          return;
        }
        if (!input || typeof input.item !== 'string' || typeof input.category !== 'string' || typeof input.amount !== 'number') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid expense' }));
          return;
        }
        const expense = {
          id: expenses.reduce((nextId, current) => Math.max(nextId, current.id + 1), 1),
          item: input.item,
          category: input.category,
          amount: input.amount
        };
        expenses.push(expense);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(expense));
      });
    } else if (req.method === 'DELETE' && /^\/api\/expenses\/\d+$/.test(req.url)) {
      const id = Number(req.url.slice('/api/expenses/'.length));
      const index = expenses.findIndex(expense => expense.id === id);
      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Expense not found' }));
        return;
      }
      expenses.splice(index, 1);
      res.writeHead(204);
      res.end();
    } else if (req.method === 'GET' && req.url === '/api/demo-error') {
      try {
        throw new Error('Demo error triggered');
      } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });
}

if (process.argv[1] && import.meta.url === new URL('file:///' + process.argv[1].replace(/\\/g, '/').replace(/^\/+/, '')).href) {
  const port = Number(process.env.PORT) || 3000;
  createApp().listen(port, () => console.log(`Listening on http://localhost:${port}`));
}
