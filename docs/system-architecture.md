# ALS-LBS System Architecture & Algorithms

Welcome to the internal engineering documentation for the architectural design and proprietary algorithms powering the **Adaptive Life Stability & Load Balancing System (ALS-LBS)**.

---

## 🏗️ 1. System Architecture

ALS-LBS is built on a modern **MERN (MongoDB, Express, React, Node.js)** stack, heavily utilizing asynchronous event-driven architecture and a strict separation of concerns.

### 1.1 Frontend (React + Vite)
- **Framework**: React 19 bootstrapped with Vite for instant HMR and optimized builds.
- **Styling**: Tailwind CSS exclusively, utilizing a highly customized utility token system within `index.css`.
- **Component Design System**: Adheres to modern Glassmorphism aesthetics with dynamic Lucide-React iconography and responsive CSS flex/grid structures.
- **State Management**: Data flows through a centralized suite of React Context Providers (`authStore.tsx`, `taskStore.tsx`, `stabilityStore.tsx`, `toastStore.tsx`). These orchestrate bidirectional data flow to the REST APIs while instantly broadcasting UI updates. 
- **Performance**: High-fidelity Data Visualization (Recharts) SVGs are separated from the main JS bundle using asynchronous `React.lazy()` imports encased in `Suspense` fallback boundaries to prevent layout shifts.

### 1.2 Backend (Node.js + Express)
- **Framework**: Express.js REST API.
- **Persistence**: MongoDB cluster facilitated by `mongoose` schemas.
- **Security Posture**: Employs stateless JWT (JSON Web Token) authentication. `bcryptjs` is utilized for salted password encryption. A custom middleware (`protect`) rigorously intercepts requests to validate cryptographic signatures against the `User` footprint.

---

## 🧠 2. Stability Algorithms

The intelligence of the platform relies on three proprietary mathematical engines located in the `src/utils/` directory.

### 2.1 The Life Stability Index (LSI) Calculation
*File: `stabilityCalculator.ts`*
- The core metric aggregates five distinct life parameters: Time, Energy, Cognitive, Emotional, and Financial capacities.
- **Scoring**: $LSI = \frac{\sum Scores}{5}$.
- **Threshold Triggers**: 
  - **Optimal**: $\ge 70$
  - **Warning**: $40 - 69$ (Triggers actionable alerts)
  - **Critical Failure**: $\le 39$ (Triggers system-wide emergency protocols)

### 2.2 Re-balancing & Triage Engine
*File: `loadBalancer.ts`*
- Evaluates the user's active $LSI$ limit against the total weight of their active tasks pipeline.
- Tasks hold predefined cognitive resistance metrics: High (30), Medium (15), Low (5).
- If system resistance exceeds maximum cognitive limits (e.g., LSI drops to 45 while carrying 120 points of active tasks), the Engine forces triage. It categorizes existing tasks to either `focus`, `defer`, or `drop`, overriding priority constraints strictly based on imminent `deadline` metrics to prevent total burnout.

### 2.3 Linear Regression Forecasting
*File: `stabilityPrediction.ts`*
- Analyzes the trailing 14-day history vector via the `StabilityScore` collection.
- Calculates the Line of Best Fit ($y = mx + b$) using the Least Squares method to project the LSI trajectory 14 days into the future.
- Dynamically bounds the resulting slope within $y \in [0, 100]$.
