# ALS-LBS REST API Documentation

The backend server runs locally on Port `5000` executing JSON-based network interfaces. All endpoints (excluding Auth routes) require a valid Bearer JWT.

---

## 🔐 1. Authentication Controller (`/api/auth`)

Handles user onboarding and secure cryptographic token issuance.

| Method | Endpoint | Authorization | Description |
|---|---|---|---|
| `POST` | `/login` | Public | Validates credentials and issues a signed JWT token string. |
| `POST` | `/register` | Public | Cryptographically salts the user password and generates a remote `User` database entry. |

---

## 📋 2. Task Controller (`/api/tasks`)

Manages the core functional task pipeline that interacts with the analytical load balancers.

| Method | Endpoint | Authorization | Description |
|---|---|---|---|
| `GET` | `/` | Bearer Token | Fetches an array of all active and completed tasks mapped exclusively to the authenticated User ID. |
| `POST` | `/` | Bearer Token | Appends a new Task constraint. **Requirements**: `title` (String), `priority` ('low', 'medium', 'high'), `deadline` (ISO Date String). |
| `DELETE` | `/:id` | Bearer Token | Purges the specified task document from the MongoDB collection by Object ID. |

---

## 📊 3. Stability Controller (`/api/stability`)

Engine handling statistical performance snapshots.

| Method | Endpoint | Authorization | Description |
|---|---|---|---|
| `GET` | `/` | Bearer Token | Retrieves a chronological array of multidimensional daily stability snapshots for trend mapping. |
| `POST` | `/` | Bearer Token | Archives a new daily snapshot matrix to update the core LSI regression graph. |
