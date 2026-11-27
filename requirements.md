# Canteen Tracker Requirements

## Feature

Update `server.js`, keeping it zero-dependency, to add:

1. A live "Total Spend: ₹X" banner at the top.
2. A category filter with All, Food, Beverage, and Stationery.
3. A Delete button on each expense row that calls `DELETE /api/expenses/:id`.
4. Server-side deletion that removes the matching expense from the in-memory array.

## Test and verify

1. Add unit tests in `server.test.js` covering `POST /api/expenses` and `DELETE /api/expenses/:id`.
2. Start the server on port 3000.
3. Open `http://localhost:3000` in the browser.
4. Add "Vada Pav" for ₹30.
5. Verify that the total spend updates.
6. Delete "Vada Pav" and confirm that it is removed.
