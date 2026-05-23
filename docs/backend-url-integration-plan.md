# Backend URL Integration Plan

Updated: 2026-05-23

Source notes:
- Backend planning source: `backend/.vscode/frontend-TODO.md`
- Backend route check: `backend/routes/guest.php`, `backend/routes/staff.php`
- Frontend stack: React, JavaScript, Vite, npm

## Goal

Add the new and changed backend API surface to the frontend in small, testable slices.

The frontend already selects the API realm in `ConfigContext`:
- public/guest pages use `/api/guest/`
- admin/staff pages use `/api/staff/`

Most components call relative endpoints through `ApiContext`, such as `get("me")` or `post("/orders", ...)`. The integration should keep that pattern, but centralize new endpoint names enough that changed backend URLs are easier to track.

## Current Frontend Shape

Relevant existing files:
- `src/contexts/ApiContext.jsx`: axios wrapper, token injection, refresh handling
- `src/contexts/ConfigContext.jsx`: realm and base URL selection
- `src/contexts/UserContext.jsx`: login/logout state by realm
- `src/contexts/CartContext.jsx`: menu loading and guest order creation
- `src/components/common/Profile.jsx`: current guest/staff profile view
- `src/components/public/ShoppingCart.jsx`: order submission entry point
- `src/components/public/Orders.jsx`: current guest order list
- `src/routes/publicRoutes.js`: guest routes
- `src/routes/adminRoutes.js`: staff/admin routes

## Proposed Integration Order

### Phase 0: API Inventory And Endpoint Constants

Create a small API endpoint inventory before feature UI work.

Suggested file:
- `src/api/endpoints.js`

Keep it simple JavaScript:

```js
export const guestEndpoints = {
  me: "me",
  profilePicture: "me/picture",
  anonymizeCheck: "me/anonymize/check",
  anonymize: "me/anonymize",
  dataExport: "me/export",
  orders: "orders",
  activeOrders: "orders/active",
  availableTables: "tables/available",
  currentTable: "tables/current",
  currentTableStats: "tables/current/stats",
  tableSpendingLimit: "tables/current/spending-limit",
  closeCurrentTable: "tables/current/close",
  joinTable: "tables/join",
  tableMembers: "tables/current/members",
  ownPayment: "payments",
  tablePayment: "tables/current/payments",
  closingPayment: "tables/current/closing-payment",
  receipt: (receipt) => `receipts/${receipt}`,
};
```

Add staff endpoints in the same file when the staff slice starts.

Why:
- reduces scattered string changes
- keeps the existing `ApiContext` and realm behavior
- does not introduce a generated client or new dependency

Verification:
- add a lightweight endpoint unit test only if helper functions become non-trivial
- otherwise verify through feature tests

### Phase 1: Profile, Compliance, GDPR

Scope:
- update guest profile data display
- add profile picture upload/delete
- add GDPR anonymization check and anonymization flow
- add personal data export
- add 18+ registration requirement

Backend endpoints:
- `GET me`
- `POST me`
- `POST me/picture`
- `DELETE me/picture`
- `GET me/anonymize/check`
- `POST me/anonymize`
- `GET me/export`

Affected frontend areas:
- `src/components/common/Profile.jsx`
- `src/components/public/Register.jsx`
- `src/contexts/UserContext.jsx`
- optionally `src/contexts/ProfileContext.jsx`, or remove/replace it if unused after checking references
- `src/lang/hu.js` for new UI labels

Implementation notes:
- Keep profile page usable for both guest and staff until intentionally split.
- Guest-only GDPR UI should not appear in staff profile mode.
- Use multipart form data only for `me/picture`; keep normal JSON for profile fields.
- After successful anonymization, clear guest auth/user state and redirect to a safe public route.
- For data export, create a JSON blob download in the browser.

Edge cases:
- `can_anonymize = false`: show blocking reasons and do not show final destructive action as enabled.
- anonymized users may have blanked PII fields.
- export may contain accounting-retention data that should be displayed/downloaded carefully.

Useful tests:
- profile renders new compliance fields
- anonymization check disables/enables destructive action
- successful anonymization calls logout/cleanup
- export creates a downloadable JSON blob
- registration requires `is_over_18`

### Phase 2: Order Submission Payment Mode

Scope:
- add order submission mode to cart
- handle per-guest spending-limit conflict
- prepare for pay-now flow without inventing backend behavior not yet confirmed

Backend endpoints:
- `POST orders`

Expected behavior:
- default flow keeps current order behavior unless backend contract requires a new default
- add UI mode options once backend confirms request field name, expected values, and failure behavior
- if `409` has `code=per_guest_spending_limit_exceeded` and `recommended_action=pay_now`, show a clear recovery path

Affected frontend areas:
- `src/contexts/CartContext.jsx`
- `src/components/public/ShoppingCart.jsx`
- possibly a new small payment mode component under `src/components/public/orders/`

Open backend contract questions:
- exact request field: `payment_mode` or other
- allowed values: `add_to_table`, `pay_now`
- whether a failed pay-now creates an order, a payment attempt, both, or neither
- response shape for payment attempts

Useful tests:
- cart posts existing payload by default
- cart includes payment mode when selected
- 409 recommended pay-now response is surfaced to the user without clearing the cart

### Phase 3: Guest Table Experience

Scope:
- free table list
- claim/join by GUID or QR value
- current table view
- owner member management
- owner spending limit
- table close flow

Backend endpoints:
- `GET tables/available`
- `POST tables/claim`
- `POST tables/join`
- `GET tables/current`
- `GET tables/current/stats`
- `GET tables/current/members`
- `POST tables/current/spending-limit`
- `POST tables/current/close`
- `POST tables/members/{member}/approve`
- `POST tables/members/{member}/reject`
- `POST tables/members/{member}/toggle-ordering`
- `DELETE tables/members/{member}`

Suggested routes:
- `/tables`
- `/tables/current`
- `/tables/join/:guid?`

Affected frontend areas:
- `src/routes/publicRoutes.js`
- new components under `src/components/public/tables/`
- possibly a small `TableContext` only if multiple table screens need shared state

Implementation notes:
- Keep owner actions hidden or disabled unless current user is table owner.
- Display effective limit separately from owner limit and staff override.
- Use clear states for no table, pending membership, active member, owner, and closed table.

Edge cases:
- claiming an occupied table may return conflict
- closing a table may return 409 when unpaid details remain
- member toggling should preserve visible state after success

Useful tests:
- no-current-table state
- current-table owner state
- 409 close conflict shows unpaid-items message
- owner spending-limit form sends `null` and nonnegative integers correctly

### Phase 4: Guest Payments And Receipts

Scope:
- select own pending order details
- select table pending details
- closing payment for all remaining details
- payer/accounting data form
- receipt detail view

Backend endpoints:
- `POST payments`
- `POST tables/current/payments`
- `POST tables/current/closing-payment`
- `GET receipts/{receipt}`

Suggested routes:
- `/payments/new`
- `/tables/current/payment`
- `/tables/current/closing-payment`
- `/receipts/:receipt`

Affected frontend areas:
- `src/components/public/Orders.jsx`
- new components under `src/components/public/payments/`
- new components under `src/components/public/receipts/`
- `src/routes/publicRoutes.js`

Implementation notes:
- Do not mark items paid in UI before backend confirms success.
- Failed/abandoned payment should leave details pending.
- Receipt accounting snapshot may remain after GDPR anonymization; label it as receipt/customer data, not editable profile data.
- Do not add receipt PDF/email UI until backend endpoints exist.

Useful tests:
- own payment payload contains selected order detail IDs
- closing payment selects all remaining eligible details
- payer form preserves optional fields
- receipt route renders accounting snapshot fields

### Phase 5: Staff/Admin Tables, Orders, Mark Paid

Scope:
- table CRUD in admin
- regenerate GUID
- staff spending-limit override
- staff order creation for guest/table session
- staff mark-paid workflow
- review existing order status screens against backend contract

Backend endpoints:
- `GET/POST/PUT/PATCH/DELETE tables`
- `POST tables/{table}/regenerate-guid`
- `POST table-sessions/{tableSession}/spending-limit`
- `POST orders`
- `POST order-details/mark-paid`
- existing staff order endpoints: `orders/active`, `orders/waiting`, `orders/my-tasks`, assign/done endpoints

Affected frontend areas:
- `src/components/admin/masters/*`
- `src/components/admin/WaitingOrders.jsx`
- `src/components/admin/MyTasks.jsx`
- `src/routes/adminRoutes.js`
- new admin table/session screens if the generic master table is not enough

Implementation notes:
- Treat mark-paid as high-risk money/accounting UI.
- Confirm selected order details belong to one guest before submitting, if the UI can know that.
- Show backend 409/403 messages without hiding audit-sensitive failures.
- Do not let a generic CRUD screen become the only interface for business workflows such as mark-paid.

Useful tests:
- regenerate GUID disabled or conflict-handled for occupied table
- staff limit override displays owner, staff, effective values
- mark-paid sends selected detail IDs and payer/payment metadata if required

### Phase 6: Reports

Scope:
- report list
- filters
- queued status display
- CSV download

Backend status:
- later backend development cycle

Implementation notes:
- Do not build UI until endpoint names and response shapes are confirmed.
- Add route placeholders only if product navigation needs them.

## Cross-Cutting API Handling

Add or preserve these behaviors while implementing each slice:

- Use `AbortController` in screens that load data in `useEffect`.
- Preserve existing `ApiContext` error handling and message display patterns.
- Keep `401` refresh behavior realm-aware.
- Handle `409` conflicts explicitly for table/payment/GDPR flows.
- Do not clear cart or local state after failed order/payment calls.
- Avoid logging PII, tokens, payment data, payer data, or full export payloads.

## Suggested Documentation Split

This plan can remain the overview. Add focused docs as work starts:

- `frontend/docs/profile-gdpr-plan.md`
- `frontend/docs/table-flow-plan.md`
- `frontend/docs/payment-receipt-plan.md`
- `frontend/docs/staff-admin-workflow-plan.md`

Each focused doc should include:
- backend endpoints used
- request/response assumptions
- affected frontend files
- routes to add/change
- UX states
- verification checklist

## Recommended First Slice

Start with Phase 0 and Phase 1:

1. Add `src/api/endpoints.js` for guest profile/GDPR endpoints.
2. Update `Profile.jsx` to display backend compliance fields.
3. Add profile picture upload/delete.
4. Add anonymization check and confirmed anonymization.
5. Add data export.
6. Add focused tests for the profile/GDPR behaviors.

This slice is valuable on its own, does not require payment UI decisions, and exercises the changed guest URLs with limited blast radius.

## Verification Commands

From repo root, prefer Docker:

```bash
docker compose exec -T node npm run test -- src/path/file.test.jsx
docker compose exec -T node npm run test
docker compose exec -T node npm run build
```

Run the production build before merging larger route, API, or context changes.
