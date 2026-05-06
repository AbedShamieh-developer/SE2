# System Architecture Study and Reuse Blueprint

## 1) Architecture Overview
This project follows a layered, domain-driven backend structure with clear boundaries between HTTP concerns, business rules, persistence, and data transformation.

Core runtime flow:
1. `index.ts` creates and configures Express app-level concerns.
2. `routes/*` define endpoint maps and attach middleware.
3. `controllers/*` validate request shape and orchestrate use cases.
4. `services/*` implement business logic and domain-level behavior.
5. `repository/*` persists and retrieves data through repository contracts.
6. `mappers/*` transform between transport/storage shapes and domain models.
7. `model/*` provides domain entities and builders with validation invariants.
8. Central error middleware converts typed exceptions to HTTP responses.

## 2) Layer-by-Layer Pattern Analysis

### A) Entry Point and App Wiring
Files:
- `src/index.ts`
- `src/routes/index.ts`

Patterns in use:
- **Single composition root**: middleware, routes, and error handling are wired in one place.
- **Cross-cutting middleware first**: `helmet`, body parsing, CORS, request logging, cookie parser.
- **Centralized exception-to-response translation**: typed `HTTPException` objects are serialized in one error handler.

Why this is reusable:
- Every new project can keep the same boot order and same centralized failure contract.

### B) Routing Layer
Files:
- `src/routes/*.ts`

Patterns in use:
- **Feature-based route modules** (`order`, `user`, `auth`, `admin`).
- **Policy at route boundary**: authentication and authorization are attached per endpoint.
- **Controller instance per module**: each route module constructs its service + controller chain.
- **Async safety wrapper**: all controller async methods pass through `asyncHandler`.

Why this is reusable:
- Easy to add new bounded contexts by cloning route module structure.

### C) Controller Layer
Files:
- `src/controllers/*.ts`

Patterns in use:
- **Thin controllers**: parse request + basic validation + call service + shape response.
- **Mapping at boundary**: JSON request payload is converted into domain objects using mapper factories.
- **HTTP exception signaling**: controllers throw `BadRequestException` etc. instead of handling errors inline.
- **Explicit response DTO shaping**: response fields are selected rather than returning raw model instances everywhere.

Why this is reusable:
- Keeps transport concerns out of services.

### D) Service Layer
Files:
- `src/services/*.ts`

Patterns in use:
- **Use-case orchestration**: services represent business actions (`createOrder`, `validateUser`, `updateUserRole`).
- **Business validation in service**: order/user invariants checked before persistence.
- **Infrastructure abstraction via repository factory/repository constructor**.
- **Category-aware behavior**: order service iterates supported item categories, allowing extension to more item types.
- **Auth token lifecycle in dedicated service**: token generation, refresh, verify, cookie persistence.

Why this is reusable:
- Service APIs can be moved almost unchanged if repository contracts remain stable.

### E) Repository Layer
Files:
- `src/repository/IRepository.ts`
- `src/repository/Repository.factory.ts`
- `src/repository/sqlite/*.ts`

Patterns in use:
- **Repository interface contract** (`create/get/getAll/update/delete`) with async semantics.
- **Factory pattern for backend mode + item category dispatch**.
- **Composition repository**: `OrderRepository` composes an item repository (`CakeRepository`) for aggregate persistence.
- **Transaction boundary in aggregate repository**: order create/update/delete starts transaction and coordinates item + order writes.
- **Connection manager singleton** for SQLite connection reuse.
- **Initialization contract** (`Initializable`) for schema bootstrapping.

Why this is reusable:
- You can swap SQLite with another backend by preserving repository contract and factory composition.

### F) Mapper Layer
Files:
- `src/mappers/*.ts`

Patterns in use:
- **Mapper interface abstraction** (`IMapper<Input, Output>`) with optional reverse map.
- **Format-specific mappers**: CSV, JSON request, SQLite row mapping.
- **Mapper factory** (`JsonMapperFactory`) to resolve mapper by item category.
- **Separation of concerns**: controllers/services do not parse raw storage formats directly.

Why this is reusable:
- Helps future multi-source inputs (API, CSV import, queue events) without polluting domain/service code.

### G) Model and Builder Layer
Files:
- `src/model/*.ts`
- `src/model/builders/*.ts`

Patterns in use:
- **Domain entities with getters** (immutable-by-convention state access).
- **Identifiable vs non-identifiable types** split (`Cake` vs `IdentifiableCake`, `Order` vs `IdentifiableOrder`).
- **Builder pattern enforcing invariants** (required fields, non-empty text, positive numerics).
- **Category polymorphism** through `ItemCategory` and `IItem` contracts.

Why this is reusable:
- Builders become domain gatekeepers, reducing invalid state propagation.

### H) Middleware and Security
Files:
- `src/middleware/*.ts`
- `src/config/roles.ts`

Patterns in use:
- **Authentication middleware** reads token cookies, supports refresh flow, attaches user payload to request.
- **Authorization middleware family**:
  - `hasPermission(...)`
  - `hasRole(...)`
  - `hasSelfOrRole(...)`
  - `bindUserIdToParam(...)`
- **RBAC mapping** through `rolePermissions` matrix.

Why this is reusable:
- Clean policy DSL at route level and easy extension to richer policies.

### I) Exception and Error Model
Files:
- `src/util/exceptions/**/*`

Patterns in use:
- **Typed HTTP exceptions** (`BadRequestException`, `NotFoundException`, auth/authorization exceptions).
- **Global Express error middleware** decides status/shape once.
- **Non-HTTP internal exceptions** for repository/service concerns.

Why this is reusable:
- Stable API error contract with one translation boundary.

### J) Observability and Config
Files:
- `src/util/logger.ts`
- `src/middleware/requestLogger.ts`
- `src/config/index.ts`

Patterns in use:
- **Central logger abstraction** (file + console transports).
- **Request lifecycle logging** with latency and dynamic log level by status code.
- **Environment-driven config object** (auth, host/port, log dir, db mode).

Why this is reusable:
- Shared operations pattern portable to any service.

## 3) End-to-End Request Lifecycle (Concrete)
Order creation (`POST /orders`) currently flows like this:
1. Route middleware checks auth and permission.
2. Controller maps JSON payload to `IdentifiableOrderItem` via `JsonMapperFactory`.
3. Service validates business rules and resolves repository by category.
4. `OrderRepository` begins transaction.
5. Composed item repository persists cake first.
6. Order row is inserted with item foreign reference.
7. Transaction commits.
8. Controller returns `201` with created order object.
9. Any thrown typed HTTP exceptions are serialized by global error middleware.

## 4) Architectural Patterns You Are Consistently Using
1. Layered architecture (transport -> application -> infrastructure).
2. Repository pattern with interface-based inversion.
3. Factory pattern for runtime implementation/category selection.
4. Builder pattern for domain object validity.
5. Mapper pattern for anti-corruption/data-shape translation.
6. Middleware pipeline pattern for cross-cutting concerns.
7. Centralized exception handling.
8. RBAC policy mapping with route-level policy composition.
9. Singleton connection manager for shared DB resource.

## 5) Reuse Blueprint for Your Next Project
Use the same folder baseline:
- `src/config`
- `src/middleware`
- `src/routes`
- `src/controllers`
- `src/services`
- `src/model`
- `src/model/builders`
- `src/mappers`
- `src/repository`
- `src/repository/<backend>`
- `src/util/exceptions`

Implementation order (recommended):
1. Define domain interfaces/entities and builders first.
2. Define `IRepository` contracts per aggregate root.
3. Implement mappers for request/storage formats.
4. Implement repositories and connection manager.
5. Implement services with business rules only.
6. Implement controllers as thin orchestration boundaries.
7. Wire routes + authz policies.
8. Add global error middleware and request logging.
9. Add tests per layer (builder, mapper, repository, service, route integration).

## 6) Strengths of the Current Architecture
1. High separation of concerns and good testability per layer.
2. Domain creation is guarded by builders and mappers.
3. Security is explicit at route-level and role/permission driven.
4. Persistence can evolve behind repository interfaces.
5. Error handling is centralized and API-friendly.

## 7) Improvements to Keep the Pattern but Make It Stronger
1. Introduce explicit dependency injection container or composition module to avoid `new Service()` inside route files.
2. Normalize exception translation at repository boundaries (avoid generic `Error` when specific domain/repo exceptions are available).
3. Fix small consistency issues in naming and typos (`AuthenitactionException`, `depricated`) for maintainability.
4. In `OrderManagementService.createOrder`, ensure generated ID is assigned to order object before persistence.
5. Add DB constraints and foreign keys for order-item integrity where applicable.
6. Prefer returning explicit response DTOs across all controllers for consistent API contracts.
7. Add service-level tests for category fallback behavior and auth refresh edge cases.
8. Move role/permission checks into policy modules if policy logic grows.

## 8) Copy-Paste Design Rules (Team Conventions)
1. Controllers never talk SQL or filesystem.
2. Services never parse raw HTTP request objects.
3. Repositories never know Express types.
4. Mappers are the only place where transport/storage format transforms happen.
5. Builders validate required fields before model instantiation.
6. Every async route handler must be wrapped with `asyncHandler`.
7. Every endpoint requiring auth must declare auth + authorization middleware in route layer.
8. Throw typed exceptions; never send ad-hoc error responses from deep layers.

## 9) Minimal Template for New Domain Module
For a new domain (example `product`):
1. `src/model/Product.model.ts` + `src/model/builders/Product.builder.ts`
2. `src/repository/<backend>/Product.repository.ts`
3. `src/mappers/Product.mapper.ts`
4. `src/services/ProductManagement.service.ts`
5. `src/controllers/product.controller.ts`
6. `src/routes/product.route.ts`
7. Register route in `src/routes/index.ts`
8. Add permissions in `src/config/roles.ts`
9. Add tests mirroring existing builder/mapper/repository/controller patterns

---
This architecture is already a strong reusable foundation. If you keep these contracts and boundaries stable, you can move fast in new projects while preserving code quality and maintainability.
