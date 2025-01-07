1. Visão Geral (Overview) Tab
Key Metrics Summary (Cards):
Missing endpoint. Needs an endpoint like GET /financial/summary to retrieve overall financial metrics (total income, total expenses, and net profit).
Financial Charts (Line and Pie):
Missing endpoint. Needs an endpoint like GET /financial/charts to retrieve chart data based on a specified date range.
Trends Section:
Missing endpoint. Needs an endpoint like GET /financial/trends to retrieve financial trends.
Date Range Picker:
Date range can be added as parameters to the endpoints, such as /summary, /charts, and /trends.

2. Transações (Transactions) Tab
Transactions Table:
Endpoint available: GET /financial/ (already retrieves all financial records).
Filters and Sorting:
Partially covered. You can add parameters like ?type=income&sort=desc to the existing GET /financial/ endpoint.
Search Bar:
Missing endpoint. Needs a new endpoint like GET /financial/search to search transactions by keyword.
Expandable Rows:
Partially covered. The GET /financial/:id can provide detailed information about a specific transaction. Currently, this may require additional logic for expandable row implementation.

3. Custos Fixos (Fixed Costs) Tab
Fixed Costs List:
Endpoint available: GET /fixed-costs to retrieve all fixed costs.
Management Buttons (Add/Edit, Mark as Paid):
Endpoints available:
POST /fixed-costs to add a fixed cost.
PUT /fixed-costs/:id to edit a fixed cost.
PATCH /fixed-costs/:id/mark-paid (this is currently missing for marking as paid, should be added).
Due Date Highlighting:
Covered by the existing GET /fixed-costs response. Ensure the properties like dueDate and isOverdue are appropriately returned.

4. Relatórios (Reports) Tab
Report Filters:
Missing endpoint. Needs an endpoint like GET /reports/filters to retrieve available filter options.
Generate and Preview Reports:
Partially covered:
POST /reports/generate can be added for generating reports.
GET /reports/preview/:reportId is currently missing for previewing reports.
Export Options (PDF/CSV):
Missing endpoint. Needs an endpoint like GET /reports/export to export reports.
Quick Filter Buttons:
Filters can be managed using parameters in the POST /reports/generate request.

5. Pontos de Fidelidade (Fidelity Points) Tab
Points Overview:
Missing endpoint. Needs an endpoint like GET /loyalty/summary to provide an overview of loyalty points.
Transaction History:
Missing endpoint. Needs an endpoint like GET /loyalty/transactions to get a list of earned/redeemed points.
Points Redemption:
Missing endpoints:
POST /loyalty/redeem to redeem points.
GET /loyalty/redeemable-items to get a list of available services or discounts for redemption.
Manual Adjustments:
Missing endpoint. Needs an endpoint like PATCH /loyalty/adjust for adding/subtracting loyalty points for a client.
General Observations
Authentication: All endpoints will need to enforce authentication using a token-based mechanism.
Pagination and Sorting:
The GET /financial/ route and similar endpoints should support pagination (e.g., ?limit=25&page=2) and sorting (?sort=asc).
Summary of Actions Needed
Create new endpoints for missing features:

GET /financial/summary
GET /financial/charts
GET /financial/trends
GET /financial/search
PATCH /fixed-costs/:id/mark-paid
GET /reports/filters
POST /reports/generate
GET /reports/preview/:reportId
GET /reports/export
GET /loyalty/summary
GET /loyalty/transactions
POST /loyalty/redeem
GET /loyalty/redeemable-items
PATCH /loyalty/adjust
Enhance existing endpoints to support filters, sorting, and pagination as required.

## Value 

1. Simple CRUD Endpoints (Minimal Effort, High Value)
GET /financial/summary: Retrieve overall financial metrics (total income, total expenses, and net profit).

Reason: This is a simple summary with calculations already based on stored financial data. It provides high visibility for the "Visão Geral (Overview)" tab.
GET /financial/charts: Retrieve data for financial charts.

Reason: This is similar to the summary but provides chart data points, which can be used to visualize trends and differences.
PATCH /fixed-costs/
/mark-paid: Mark a fixed cost as paid.

Reason: This is a simple patch update to an existing fixed cost, requiring minimal backend changes.
GET /financial/search: Search transactions by keyword.

Reason: This will enhance the Transactions Tab and is fairly simple if full-text search capabilities or indexing is already available.
GET /loyalty/summary: Provide an overview of loyalty points.

Reason: This endpoint is a read operation summarizing loyalty points, similar to the financial summary endpoint.
POST /fixed-costs (already available): Adds new fixed costs.

Reason: Part of CRUD operation for the "Custos Fixos (Fixed Costs)" tab.
2. Enhancements to Existing Endpoints (Medium Effort, Incremental Improvements)
Filters, Sorting, and Pagination Enhancements for GET /financial/:
Reason: Adding query parameters like ?type=income&sort=desc&limit=25&page=1 to existing endpoints. Improves usability for larger datasets.
GET /financial/
for Detailed Transaction View (Expandable Rows):
Reason: Adding details for transactions could be implemented with minor modifications and allows richer interaction in the UI.
3. Reporting and Loyalty Features (More Complex)
POST /reports/generate: Generates a financial report based on provided filter criteria.

Reason: This involves more business logic, but it is valuable to provide report generation capabilities.
GET /reports/preview/
: Preview reports before exporting.

Reason: This will require a dedicated view to preview, making it a slightly more involved process.
GET /reports/filters: Retrieve available report filter options.

Reason: A preparatory step for allowing filtering in reports.
GET /loyalty/transactions: Get a list of earned and redeemed points.

Reason: Requires implementing logic to retrieve transaction history for the loyalty system.
POST /loyalty/redeem: Redeem points for a service or discount.

Reason: Requires some business logic to handle the redemption process.
GET /loyalty/redeemable-items: Retrieve a list of services or discounts available for redemption.

Reason: This involves managing the redeemable items catalog.
4. Advanced Features (Higher Complexity)
GET /financial/trends: Retrieve financial trends.

Reason: Requires more complex analysis and summarization of financial data over time, potentially using aggregation queries.
GET /reports/export: Export reports in PDF/CSV.

Reason: Requires handling different export formats, and possibly converting reports to PDF or CSV.
PATCH /loyalty/adjust: Add/subtract loyalty points manually.

Reason: Involves updating the loyalty points balance while considering business rules.
Suggested Order of Implementation for MVP
GET /financial/summary
GET /financial/charts
PATCH /fixed-costs/
/mark-paid
GET /financial/search
GET /loyalty/summary
Filters, Sorting, and Pagination Enhancements for GET /financial/
GET /financial/
for detailed transaction view
POST /fixed-costs (already available)
POST /reports/generate
GET /reports/preview/
GET /reports/filters
GET /loyalty/transactions
POST /loyalty/redeem
GET /loyalty/redeemable-items
GET /financial/trends
GET /reports/export
PATCH /loyalty/adjust
This order focuses first on implementing the core financial metrics and CRUD capabilities, followed by enhancements to improve user experience (e.g., search, sorting, pagination). More complex reporting and loyalty features can be implemented afterward, providing the most valuable and essential functionalities first to make Qhoras market-ready.


## Endpoints and Their Relation to Financial Records
Appointment Routes (appointment.routes.js):

PUT /appointments/:appointmentId - Update an Appointment

When an appointment is updated to isPaid = true, this should trigger the creation of a Financial record.

Entities Involved: Appointment (specifically when paid).
DELETE /appointments/:appointmentId - Delete an Appointment

When an appointment is deleted, any associated Financial record should be handled (e.g., logically deleted or marked).
Entities Involved: Appointment.
Fixed Costs Routes (fixed-costs.routes.js):

POST /fixed-costs - Create a Fixed Cost
When a fixed cost is created, it may or may not create an immediate Financial record, depending on the payment status.
Entities Involved: FixedCost.
PATCH /fixed-costs/:id/mark-paid (New Endpoint to be Added)
When a fixed cost is marked as paid, a Financial record should be created to track the expense.
Entities Involved: FixedCost.
Loyalty System Routes (New Routes for Fidelity Points):

POST /loyalty/redeem - Redeem Points

When points are redeemed, a Financial record should be generated to track the redemption value.
Entities Involved: Points Redemption.
PATCH /loyalty/adjust - Adjust Loyalty Points

Adjusting loyalty points may require creating or updating a Financial record to reflect the monetary equivalent of those points.
Entities Involved: Loyalty Points Adjustment.
Service Routes (service.routes.js):

POST /services/:userId - Create a Service
This typically does not directly create a Financial record. However, services being used in appointments could be reflected in financial records.
Entities Involved: Service indirectly affects financials through appointments.
Summary of Areas Involved with Financial Records Creation:
Appointment Paid Status (PUT /appointments/:appointmentId): Should create a Financial record when an appointment is marked as paid.
Fixed Costs Management (PATCH /fixed-costs/:id/mark-paid): Should create a Financial record when a fixed cost is paid.
Loyalty Points (New routes): Redeeming or adjusting loyalty points should result in a Financial record.



