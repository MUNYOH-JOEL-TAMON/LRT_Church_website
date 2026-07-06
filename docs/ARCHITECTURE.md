# Architecture Overview - Latter Rain Tabernacle

## 1. Architectural Style
The application will utilize a **Modular Monolith** architecture. This approach is chosen over microservices to reduce operational complexity and infrastructure overhead during the initial phases while still enforcing clean, modular boundaries for future scalability.

## 2. Directory Structure (Backend)
The backend enforces a strict layering of concerns:

- **Routes:** Only map HTTP endpoints to Controllers.
- **Controllers:** Handle HTTP Request/Response cycle. No business logic.
- **Services:** Contain core business logic.
- **Models/Repositories:** Handle database interactions (Mongoose schemas).

```
server/
├── src/
│   ├── app.ts            # App initialization
│   ├── server.ts         # Server entry point
│   ├── config/           # Environment and DB config
│   ├── routes/           # API Endpoints
│   ├── controllers/      # HTTP layer
│   ├── services/         # Business logic layer
│   ├── models/           # Mongoose schemas
│   ├── middleware/       # Custom Express middlewares (Auth, Error handling)
│   ├── validators/       # Input validation schemas (e.g., Zod or Joi)
│   ├── utils/            # Shared utilities (logger, hashers)
│   ├── constants/        # System-wide constants
│   ├── interfaces/       # TypeScript interfaces (Shared)
│   ├── types/            # Custom type definitions
│   └── tests/            # Automated test suites
```

## 3. Directory Structure (Frontend)
The frontend utilizes a feature-based folder structure combined with standard React patterns:

```
client/
├── src/
│   ├── main.tsx          # Application entry
│   ├── App.tsx           # Root component
│   ├── assets/           # Images, icons, static files
│   ├── components/       # Reusable UI components (Buttons, Cards)
│   ├── layouts/          # Page layouts (AdminLayout, PublicLayout)
│   ├── pages/            # Page-level components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API integration layer (Axios instances)
│   ├── contexts/         # React Context API providers
│   ├── store/            # Global state management (Zustand/Redux)
│   ├── types/            # TypeScript interfaces/types
│   ├── utils/            # Helper functions
│   ├── routes/           # Route definitions
│   ├── styles/           # Global styles (Tailwind config, index.css)
│   └── constants/        # Magic strings/numbers
```

## 4. Scalability Considerations
- **Code Scalability:** By keeping functions small and isolating responsibilities (SOLID principles), a 20+ developer team can easily operate within specific modules.
- **Data Scalability:** Mongoose schemas will be designed with proper indexing to support future growth.
- **Media Storage:** An abstraction layer will be used for file uploads, allowing an easy swap from Local Multer storage to AWS S3 without modifying controller logic.
