# AVCENA Architecture

## Current foundation


## First endpoint

`GET /health` returns a small service-health response:

```json
{"status":"ok"}
```
# AVCENA Production Architecture

## 1. Purpose and principles

This document defines the target architecture for AVCENA Gardening & Lawnmowing. The design separates the public website, protected administration, backend business rules, database, email, and media storage so each area can evolve without putting secrets or business logic in the browser.

Principles:

- Keep the public website fast, accessible, and usable without admin access.
- Keep all secrets and trusted business decisions on the server.
- Store content in focused records rather than one large website table.
- Require moderation before customer reviews become public.
- Make failures safe for customers and useful in server logs.
- Build and test each layer independently before production deployment.

## 2. System boundaries

```text
Customer
	|
	v
Public React website
	| HTTPS / REST
	v
ASP.NET Core Web API
	|              |                 |
	v              v                 v
SQL Server      Resend          Object storage
	^
	|
Protected React Admin Portal
```

### Public website

The current React/Vite site provides the public customer experience. It must retrieve editable business content from the API once the backend content endpoints are available. It must never contain SQL credentials, Resend keys, JWT signing secrets, admin passwords, or other private configuration.

### Admin portal

The admin portal is a separate React application or protected frontend area. It communicates with the API and never connects directly to SQL Server, Resend, or object storage. All management routes require authentication and authorization.

### Backend API

The ASP.NET Core API owns authentication, authorization, validation, business workflows, persistence, email dispatch, media authorization, audit events, and safe error responses.

## 3. Repository structure

```text
AVCENA-Gardening-Website/
├── frontend/                         # Future extracted public React app
├── backend/
│   ├── Avcena.Api/                   # HTTP endpoints, middleware, composition root
│   ├── Avcena.Application/           # Use cases, DTOs, ports, validation
│   ├── Avcena.Domain/                # Entities, value objects, business rules
│   ├── Avcena.Infrastructure/        # EF Core, email, media, external services
│   └── tests/Avcena.Api.Tests/       # API and integration tests
├── database/
│   ├── migrations/
│   ├── scripts/
│   └── seed/
├── docs/
├── docker/
└── .github/workflows/
```

The current public frontend remains at the repository root during migration. The backend foundation currently exists under `backend/` and exposes `GET /health`.

## 4. Public website capabilities

Customers should be able to:

- View home, About AVCENA, gardening services, lawn mowing services, other services, service details, service areas, and optional starting prices.
- View active offers and approved customer reviews.
- Request a quote and contact AVCENA.
- View phone, email, address/service area, business hours, and social links.
- Click to call and click to email.
- Submit a review for moderation.
- Read Privacy Policy and Terms & Conditions.

## 5. Admin portal routes and capabilities

Recommended routes:

```text
/admin/login
/admin/dashboard
/admin/services
/admin/services/new
/admin/offers
/admin/enquiries
/admin/reviews
/admin/customers
/admin/content
/admin/contact
/admin/business-hours
/admin/service-areas
/admin/media
/admin/seo
/admin/users
/admin/settings
/admin/audit-logs
```

The dashboard should show service count, active offers, new enquiries, pending reviews, recent enquiries, recent reviews, and quick actions for adding services/offers or reviewing activity.

Admins should be able to manage services, descriptions, categories, prices, offers, homepage content, contact details, hours, areas, media, SEO, enquiries, customers, and reviews. Review approval/rejection and audit history are mandatory workflows.

## 6. Layer responsibilities

### `Avcena.Api`

- Define REST endpoints and HTTP contracts.
- Configure dependency injection, authentication, authorization, CORS, rate limiting, headers, health checks, and exception handling.
- Translate application results to consistent HTTP responses.
- Do not place SQL queries, email provider calls, or business rules in endpoint handlers.

### `Avcena.Application`

- Define commands, queries, DTOs, interfaces, and application services.
- Coordinate workflows such as creating an enquiry, approving a review, publishing an offer, or changing contact settings.
- Validate input before persistence or external calls.

### `Avcena.Domain`

- Define entities, value objects, enums, invariants, and business rules.
- Keep the domain independent of ASP.NET, SQL Server, Resend, and storage SDKs.

### `Avcena.Infrastructure`

- Implement Entity Framework Core and SQL Server persistence.
- Implement Resend email delivery.
- Implement object/file storage and media metadata persistence.
- Provide logging, external-service adapters, and migrations.

## 7. Data model

Core tables/entities:

```text
Users, Roles, UserRoles
ServiceCategories, Services
Offers
Reviews
Enquiries
WebsiteSettings, BusinessContact, BusinessHours, ServiceAreas
Media
Pages, PageSections
SeoSettings, SocialLinks
AuditLogs, EmailLogs
```

Important relationships:

- A service belongs to a service category and can be referenced by enquiries.
- A review has a moderation status and is public only when approved.
- An offer is public only when published, active, and inside its schedule.
- Users create audit log entries for administrative actions.
- Media records reference files stored outside SQL Server.

### Service fields

Service name, description, category, price/starting price, image reference, active status, display order, SEO title, and SEO description.

### Offer fields

Title, description, discount, start date, end date, image reference, status, display order, created date, and publication metadata.

### Review fields

ID, customer name, rating, comment, status, created date, and approved date.

Allowed statuses: `Pending`, `Approved`, `Rejected`, and `Hidden`.

### Enquiry fields

Name, phone, email, address/suburb, service required, preferred date, message, status, created date, and processing metadata.

## 8. Content management flow

The owner must be able to update normal website content without changing React code:

```text
Admin Dashboard
		|
		v
Contact Settings -> ASP.NET Core API -> SQL Server -> Public API -> React website
```

This applies to phone, email, address, business hours, service areas, social links, offers, services, reviews, homepage content, and SEO settings. Public endpoints return only active/published content.

## 9. Authentication and security

Authentication is designed before the Admin Dashboard:

```text
Admin login
	-> validate user
	-> validate password
	-> check account status
	-> create secure session/token
	-> authorize admin route
```

Required controls:

- HTTPS/TLS in every deployed environment.
- ASP.NET Core Identity or an equivalent server-side identity system.
- Secure password hashing and a strong password policy.
- Authentication, authorization, admin roles, and least-privilege permissions.
- Session/token expiry, revocation where applicable, and login rate limiting.
- Input validation and parameterized EF Core data access to prevent SQL injection.
- Output encoding and XSS protections.
- CSRF protection when cookie authentication is used.
- Secure HTTP headers and restricted CORS origins.
- File type, size, filename, path, and authorization checks for uploads.
- Secrets only in environment variables or managed secret storage.
- Audit logging for authentication and administrative changes.
- Database backups with tested restoration.

Never put SQL passwords, API keys, Resend keys, admin passwords, or JWT secrets in React or any client bundle.

## 10. Email architecture

Email is sent by backend services only:

```text
Customer -> Submit enquiry -> API -> SQL Server
										|
										v
									 Resend -> AVCENA email
```

Email types:

- New enquiry: notify the admin with "New gardening service enquiry".
- Customer confirmation: send "Thank you for contacting Avcena.".
- New review: notify the admin that a review is awaiting approval.

The API records email attempts, provider results, delivery status where available, timestamps, and correlation IDs in `EmailLogs`. Provider errors are logged server-side and are never returned as raw technical details to customers.

## 11. Media and image management

Large images belong in object/file storage, not directly in SQL Server:

```text
Admin -> API upload validation -> Object storage
											 |
											 v
									SQL media metadata
```

Media metadata should include filename, content type, size, storage key/URL, owner, upload date, and active/deleted state. Storage should use backup and versioning where supported. The API must enforce upload limits and never trust client-provided filenames or content types.

## 12. SEO

SEO is part of the initial architecture. Admin-managed fields include page title, meta description, Open Graph title, Open Graph description, Open Graph image, and canonical URL.

The platform should generate or maintain:

- `robots.txt`
- `sitemap.xml`
- Structured data
- `LocalBusiness` schema for AVCENA

Values must be validated and rendered safely. Canonical URLs must match the actual production domain and deployment path.

## 13. Error handling and API contract

Customers must see safe messages such as:

```text
Something went wrong. Please try again later.
```

Do not expose SQL exceptions, stack traces, ASP.NET errors, provider responses, or database details. Technical details belong in server logs with correlation/request IDs.

The API should use consistent response categories:

```text
Success
Error
ValidationError
Unauthorized
Forbidden
NotFound
```

Use appropriate HTTP status codes and a stable response envelope so the public and admin clients can handle failures consistently.

## 14. Review moderation

```text
Customer submits review -> Pending -> Admin review
												  /       \
										 Approved     Rejected
											 |
									Public website
```

`Hidden` is used to remove an already-approved review from public results without deleting its history. Only approved reviews are returned by public APIs.

## 15. Testing strategy

### Unit tests

- Business logic
- Input and domain validation
- Application services
- Authentication flows
- Authorization boundaries and account-status checks

### API tests

- Login
- Services
- Reviews
- Enquiries
- Offers
- Settings
- Consistent success and error responses

### UI tests

Test public and admin workflows at mobile, tablet, and desktop sizes.

### Security tests

- Unauthorized admin access
- Invalid login
- Expired session
- Invalid input
- SQL injection protection
- XSS protection
- File upload validation
- API access control

## 16. CI/CD and deployment

GitHub Actions should execute for commits and pull requests:

```text
Git commit
	-> GitHub
	-> Build frontend
	-> Build backend
	-> Run tests
	-> Security/dependency checks
	-> Deploy verified artifacts
	-> Production
```

Production environments should use protected deployments, required approvals where appropriate, managed secrets, and deployment logs. The existing Pages workflow builds the public frontend; a future workflow must also build and test the backend and admin portal.

## 17. Recovery plan

```text
Server failure
	-> Provision new server
	-> Deploy application
	-> Restore database
	-> Restore media
	-> Update DNS
	-> Verify production
```

Document backup retention, restoration ownership, DNS access, hosting access, recovery time objectives, and recovery point objectives. Test restores regularly rather than assuming backups are usable.

## 18. Delivery phases

1. **Foundation:** layered solution, configuration, health checks, logging, error envelope, and CI build.
2. **Security:** ASP.NET Core Identity, admin roles, protected routes, rate limiting, headers, and secret management.
3. **Persistence:** EF Core, SQL Server, migrations, seed data, and focused entities.
4. **Core workflows:** services, content settings, enquiries, reviews, offers, email logs, and media metadata.
5. **Admin portal:** login, dashboard, CRUD screens, moderation, media, SEO, users, and audit logs.
6. **Public integration:** replace hard-coded public content with API-backed data and add review/offer flows.
7. **Production readiness:** automated tests, security checks, backups, monitoring, deployment, and restore drills.

## 19. Local commands

Frontend:

```powershell
npm install
npm run dev
npm run build
```

Backend:

```powershell
dotnet build backend/Avcena.sln
dotnet test backend/Avcena.sln
dotnet run --project backend/Avcena.Api
```

The initial API health check is available at `GET /health` and returns:

```json
{"status":"ok"}
```

## 20. Pre-admin implementation requirements

The following decisions and foundations must be completed before building the Admin Portal UI:

### Authentication decisions

- Initial release does not require MFA; keep the design extensible for later MFA support.
- Define account lockout thresholds, login rate limits, session lifetime, token revocation, and logout-all-sessions behavior.
- Define the permission matrix for `SuperAdmin`, `BusinessAdmin`, `ContentManager`, `EnquiryManager`, and `ReviewManager`.
- Support admin invitation, deactivation/reactivation, password change, and secure password reset.

### Database rules

- Define primary keys, foreign keys, indexes, unique constraints, timestamps, and soft-delete behavior.
- Define enquiry statuses such as `New`, `In Progress`, `Quoted`, `Completed`, and `Closed`.
- Define privacy, customer-data retention, audit-log retention, and email-log retention policies.
- Establish migrations, seed data, development/test databases, backup schedules, and restore procedures.

### API and operations

- Define API versioning, CORS policy, pagination, search, filtering, sorting, idempotency, and concurrency behavior.
- Add global exception handling, safe response envelopes, correlation IDs, structured logging, and readiness checks.
- Define email templates, retry behavior, duplicate-send prevention, and delivery/failure statuses.
- Define upload limits, image resizing, thumbnails, malware scanning, storage quotas, and orphan-file cleanup.
- Define monitoring, alerts, deployment environments, secret rotation, RPO, and RTO.

### Acceptance and testing gates

- Every admin feature needs acceptance criteria and role-based authorization tests.
- Add API integration tests for authentication, password reset, services, offers, enquiries, reviews, and settings.
- Add end-to-end tests for quote submission, review moderation, and password reset.
- Test public and admin interfaces on mobile, tablet, and desktop, including accessibility and browser compatibility.
- Run dependency scanning, security tests, and restore drills before production release.
