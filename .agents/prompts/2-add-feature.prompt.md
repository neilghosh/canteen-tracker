---
description: Add Delete button, Category filter, and Total banner
---

Update `server.js`, keeping zero dependencies, to add:
1. A live "Total Spend: ₹X" banner at the top.
2. A category filter dropdown with All, Food, Beverage, and Stationery.
3. A "Delete" button on each row that calls `DELETE /api/expenses/:id` to remove the item from the in-memory array.
