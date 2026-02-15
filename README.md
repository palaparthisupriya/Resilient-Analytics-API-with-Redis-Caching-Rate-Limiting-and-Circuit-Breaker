# Resilient Analytics API 

A high-performance Node.js microservice built with a focus on system resilience, fault tolerance, and scalability. This project demonstrates how to protect an API from cascading failures and high traffic using industry-standard patterns.

---

##  Project Architecture
This service follows a modular architecture, separating business logic from infrastructure concerns:

* **API Layer**: Clean RESTful endpoints using Express.js.
* **Resilience Services**: Dedicated modules for Rate Limiting, Caching, and Circuit Breaking.
* **Infrastructure**: Redis-backed state management.
* **Testing**: Comprehensive suite using Jest and Supertest.

---

##  Core Features

### Circuit Breaker (Fault Tolerance)
Protects the system from failing external dependencies using a 3-state machine:
- **Closed**: Requests flow normally.
- **Open**: Service is failing; requests are blocked immediately (fail-fast).
- **Half-Open**: Carefully tests the service to see if it has recovered.



### 🚦 Redis Rate Limiting
Prevents API abuse by implementing an IP-based sliding window. Limits are configurable via environment variables to ensure service availability for all users.

### ⚡ Read-Through Caching
Significant performance boost for analytical queries. The system checks Redis first and only computes averages from the database if the cache has expired.

---

##  Getting Started

### Prerequisites
- Docker & Docker Compose
- Git

### Installation & Setup
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
   cd your-repo-name
Configure Environment:Bashcp .env.example .env
Launch the Stack:Bashdocker-compose up --build
The API will be live at http://localhost:8000.🧪 TestingThe project includes both unit tests for core logic and integration tests for API endpoints.Run tests inside the container:Bashdocker-compose exec app npm test
## Repository
├── src/
│   ├── api/            # Route definitions
│   ├── config/         # App configuration & settings
│   ├── services/       # Circuit Breaker, Caching, Rate Limiter
│   └── app.js          # Entry point
├── tests/              # Unit & Integration test suite
├── .env.example        # Environment template
├── docker-compose.yml  # Orchestration
└── Dockerfile          # Container build spec
## API Endpoints 
GET/healthService 
Redis health check POST/api/metrics
Ingest new telemetry data (Rate Limited)GET/api/metrics/summaryGet 
analytical averages (Cached)GET/api/externalSimulated unstable external call (Circuit Breaker)
