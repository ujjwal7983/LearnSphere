# LearnSphere – AI-Powered Learning Management System

LearnSphere is a full-stack Learning Management System (LMS) built using the MERN stack. It provides separate experiences for students and educators, secure authentication, course purchasing, lecture management, reviews, media storage, and AI-assisted course discovery.

## 🚀 Features

### 👨‍🎓 Student

- User registration and login
- Google authentication
- Browse and search courses
- AI-assisted course discovery
- View course details
- Purchase courses using Razorpay
- Secure payment verification
- Automatic course enrollment after successful payment
- Watch enrolled lectures
- Rate and review courses
- Manage profile
- Password recovery using OTP

### 👨‍🏫 Educator

- Educator authentication
- Create courses
- Edit courses
- Delete courses
- Add lectures
- Update lectures
- Delete lectures
- Manage course content
- View course-related information

---

## 🧠 AI-Powered Course Search

LearnSphere uses the Gemini API to improve course discovery when a direct database search does not return results.

### Search Flow

```text
             User enters search query
                       │
                       ▼
              Frontend Search Request
                       │
                       ▼
                Backend API
                       │
                       ▼
            MongoDB Direct Search
                       │
              ┌────────┴────────┐
              │                 │
          Results Found      No Results
              │                 │
              ▼                 ▼
        Return Courses      Gemini API
                                │
                                ▼
                     Extract category/
                     relevant keyword
                                │
                                ▼
                         MongoDB Search
                                │
                                ▼
                         Return Results
````

The database is searched first because it is faster and avoids unnecessary Gemini API calls. Gemini is used as a fallback when the initial search does not produce relevant results.

---

## 🔐 Authentication & Authorization

LearnSphere implements authentication using JWT, bcrypt, HTTP-only cookies, Firebase Google Authentication, and role-based access control.

### Login Flow

```text
User
 │
 ▼
Login Request
 │
 ▼
Backend
 │
 ├── Find User
 │
 ├── bcrypt.compare()
 │
 ▼
Generate JWT
 │
 ▼
HTTP-only Cookie
 │
 ▼
Authenticated User
```

### Authentication vs Authorization

**Authentication** answers:

> Who are you?

**Authorization** answers:

> What are you allowed to do?

For example, a logged-in student is authenticated, but they should not be authorized to access educator-only APIs such as creating a lecture.

---

## 🛡️ JWT & Protected APIs

Protected backend routes use authentication middleware to verify the JWT and identify the user.

```text
Client Request
      │
      ▼
HTTP-only Cookie
      │
      ▼
Authentication Middleware
      │
      ▼
Verify JWT
      │
      ▼
Attach User Identity
      │
      ▼
Controller
      │
      ▼
Database Operation
```

The backend performs the actual authorization checks. Frontend route protection is mainly for improving the user experience and should not be treated as a security boundary.

### HTTP-only Cookies

The JWT is stored in an HTTP-only cookie so that client-side JavaScript cannot directly read the token.

This reduces the risk of token theft through malicious JavaScript.

Other cookie security attributes such as `Secure` and `SameSite` can further improve security depending on the deployment setup.

---

## 🔑 Password Security

Passwords are hashed using **bcrypt** before being stored in MongoDB.

```text
Plain Password
      │
      ▼
   bcrypt
      │
      ▼
Password Hash
      │
      ▼
   MongoDB
```

During login:

```text
Entered Password
      │
      ▼
bcrypt.compare()
      │
      ▼
Stored Hash
```

Passwords are never stored as plain text.

> bcrypt is a password hashing algorithm, not encryption.

---

## 🔵 Google Authentication

Google authentication is implemented using Firebase Authentication.

```text
User
 │
 ▼
Google Login
 │
 ▼
Firebase Authentication
 │
 ▼
User Information
 │
 ▼
Backend
 │
 ├── Find Existing User
 │
 └── Create User if Required
```

---

## 🔢 OTP Password Recovery

LearnSphere provides password recovery using OTP-based email verification.

The OTP is sent through **Nodemailer** and is used during the password reset process.

---

# 💳 Razorpay Payment Integration

LearnSphere integrates Razorpay for course purchases.

### Payment Flow

```text
Student
   │
   │ Clicks Buy
   ▼
Frontend
   │
   │ Create Order Request
   ▼
Backend
   │
   │ Create Razorpay Order
   ▼
Razorpay
   │
   │ Order ID
   ▼
Backend
   │
   ▼
Frontend
   │
   │ Opens Razorpay Checkout
   ▼
Student Completes Payment
   │
   ▼
Razorpay
   │
   │ payment_id
   │ order_id
   │ signature
   ▼
Frontend
   │
   │ Sends payment details
   ▼
Backend
   │
   │ Verify Signature
   ▼
Payment Verified
   │
   ▼
Enroll Student
```

### Payment Verification

The frontend cannot be trusted for payment confirmation.

The backend verifies the Razorpay signature using **HMAC-SHA256**.

Conceptually:

```text
Razorpay Secret
      +
Order ID + Payment ID
      │
      ▼
HMAC-SHA256
      │
      ▼
Expected Signature
      │
      ▼
Compare with Razorpay Signature
      │
      ├── Match ───────► Payment Verified
      │                       │
      │                       ▼
      │                    Enrollment
      │
      └── Mismatch ────► Reject Request
```

The Razorpay secret remains on the backend and is never exposed to the frontend.

> HMAC-SHA256 is a cryptographic authentication/signature mechanism, not encryption.

---

# 🗄️ Database Design

LearnSphere uses **MongoDB Atlas** with **Mongoose**.

### Main Collections

```text
User
Course
Lecture
Review
```

### Relationships

```text
User
 │
 ├──────── enrolledCourses ───────► Course
 │
 └──────── reviews ───────────────► Review


Course
 │
 ├──────── creator ───────────────► User
 │
 ├──────── lectures ──────────────► Lecture
 │
 ├──────── reviews ───────────────► Review
 │
 └──────── enrolledStudents ──────► User


Lecture
 │
 └──────── course ────────────────► Course


Review
 ├──────── user ──────────────────► User
 └──────── course ────────────────► Course
```

---

## 🔄 Bidirectional Enrollment

Enrollment information is maintained on both sides:

```text
User
 └── enrolledCourses
          │
          ▼
        Course
          │
          └── enrolledStudents
```

This makes it convenient to access:

- Courses enrolled by a user
- Students enrolled in a course

However, this introduces duplicated relationship data, so consistency must be maintained when enrollment changes.

For a larger production system, a separate `Enrollment` or `Order/Payment` collection could provide a cleaner structure and support transaction history, payment status, refunds, and other information.

---

## 🔗 Mongoose Populate

Mongoose `populate()` is used to resolve referenced documents.

For example:

```text
Course
 └── creator: ObjectId(User)
```

Instead of receiving only the user ID, `populate()` can retrieve the referenced user's details when querying the course.

`populate()` does not permanently copy the referenced document into the course document.

---

# ⚡ Performance Considerations

## Pagination

Course and review listings can use pagination with parameters such as:

```text
page
limit
skip
```

Instead of loading every record at once.

Conceptually:

```text
Database
   │
   ├── Page 1
   ├── Page 2
   ├── Page 3
   └── ...
```

For very large datasets, cursor-based pagination can be considered because large `skip` values can become inefficient.

---

## 📊 MongoDB Aggregation

The ratings functionality uses MongoDB aggregation to calculate information such as:

- Average rating
- Total number of reviews
- Star-wise review counts

This avoids loading all reviews into Node.js just to calculate statistics.

Example:

```text
Reviews
   │
   ▼
MongoDB Aggregation
   │
   ├── Average Rating
   ├── Total Reviews
   ├── 5 Star Count
   ├── 4 Star Count
   ├── 3 Star Count
   ├── 2 Star Count
   └── 1 Star Count
```

---

## 🚫 Avoiding Unnecessary API Calls

The AI search first checks MongoDB directly.

Gemini is only called when the direct search does not return results.

This helps reduce:

- API usage
- Latency
- Unnecessary external requests

---

# 🏗️ Backend Architecture

The backend follows a modular Express structure.

```text
backend/
│
├── config/
│
├── controller/
│   ├── authController
│   ├── courseController
│   ├── orderController
│   ├── reviewController
│   ├── searchController
│   └── userController
│
├── middleware/
│
├── model/
│
├── routes/
│
├── index.js
│
└── Dockerfile
```

### Request Flow

```text
HTTP Request
     │
     ▼
Express Route
     │
     ▼
Middleware
     │
     ▼
Controller
     │
     ▼
Mongoose Model
     │
     ▼
MongoDB Atlas
```

### Middleware

Middleware is used for cross-cutting functionality such as:

- Authentication
- Request processing
- Access control

### Controllers

Controllers contain request handling and application logic such as:

- Creating courses
- Fetching courses
- Processing payments
- Managing users
- Creating reviews

---

# 🌐 REST API

The backend exposes RESTful APIs using Node.js and Express.js.

Common HTTP methods:

| MethodPurpose |                |
| ------------- | -------------- |
| GET           | Retrieve data  |
| POST          | Create data    |
| PUT           | Update data    |
| PATCH         | Partial update |
| DELETE        | Delete data    |

### Common Status Codes

| Status CodeMeaning |                                  |
| ------------------ | -------------------------------- |
| 200                | Successful request               |
| 201                | Resource created                 |
| 400                | Bad request                      |
| 401                | Authentication required/invalid  |
| 403                | Authenticated but not authorized |
| 404                | Resource not found               |
| 500                | Server error                     |

---

# ⚛️ Frontend Architecture

The frontend is built with React and uses Redux Toolkit for centralized state management.

```text
React Components
       │
       ▼
Redux Toolkit
       │
       ▼
Axios
       │
       ▼
Express REST APIs
```

### React

React is used to build reusable UI components.

### Redux Toolkit

Redux Toolkit is used for centralized application state such as:

- User state
- Course state
- Lecture state
- Review state

### Axios

Axios is used for communication between the React frontend and backend REST APIs.

### React Router

React Router is used for client-side navigation and route handling.

---

# ☁️ Media Storage

Cloudinary is used for storing course-related media such as:

- Course thumbnails
- Lecture videos

The application stores media URLs/references rather than keeping large media files directly on the application server.

---

# 🐳 Docker

The backend is Dockerized to provide a consistent runtime environment.

### Docker Concepts

```text
Dockerfile
    │
    ▼
Docker Image
    │
    ▼
Docker Container
```

- **Dockerfile** → Instructions for building the image
- **Image** → Blueprint/package for the application environment
- **Container** → Running instance of an image

Docker Compose is used to simplify configuration and running related services.

MongoDB is hosted using **MongoDB Atlas** rather than running MongoDB inside the Docker container.

---

# 🚀 Deployment

The frontend and backend are deployed separately.

```text
                 Internet
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
     Frontend App        Backend API
                              │
                              ▼
                       MongoDB Atlas
```

External services include:

```text
Frontend
   │
   └── Backend API
          │
          ├── MongoDB Atlas
          ├── Cloudinary
          ├── Razorpay
          ├── Gemini API
          ├── Firebase
          └── Nodemailer
```

Environment variables are used for sensitive credentials and deployment-specific configuration.

---

# 🔒 Security Considerations

LearnSphere follows several security practices:

- Password hashing using bcrypt
- JWT-based authentication
- HTTP-only cookies
- Backend route protection
- Role-based authorization
- Backend payment verification
- Razorpay secret kept on the server
- Environment variables for sensitive configuration
- CORS configuration for frontend-backend communication

The frontend is treated as an untrusted client, especially for security-sensitive operations such as payment verification and authorization.

---

# 🧩 Tech Stack

## Frontend

- React.js
- Redux Toolkit
- Axios
- React Router
- Bootstrap
- Vite

## Backend

- Node.js
- Express.js
- REST APIs
- JWT
- bcrypt

## Database

- MongoDB
- MongoDB Atlas
- Mongoose

## Authentication

- JWT
- Firebase Authentication
- Google OAuth
- bcrypt
- HTTP-only Cookies

## External Services

- Razorpay
- Cloudinary
- Gemini API
- Nodemailer
- Firebase

## DevOps / Deployment

- Docker
- Docker Compose
- Render
- Git
- GitHub

---

# 📁 High-Level Project Structure

```text
LearnSphere/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── ...
│   │
│   └── ...
│
├── backend/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   ├── index.js
│   ├── Dockerfile
│   └── ...
│
└── README.md
```

---

# 🔄 Complete Application Flow

```text
                         LearnSphere
                              │
              ┌───────────────┴───────────────┐
              │                               │
           Student                         Educator
              │                               │
              ▼                               ▼
       Browse Courses                 Create Courses
              │                               │
              ▼                               ▼
          Search                         Add Lectures
              │                               │
              ▼                               ▼
      AI Search Fallback               Manage Content
              │
              ▼
       Course Details
              │
              ▼
        Buy Course
              │
              ▼
          Razorpay
              │
              ▼
      Backend Verification
              │
              ▼
         Enrollment
              │
              ▼
       Watch Lectures
              │
              ▼
        Review Course
```

---

# 🧠 Key Engineering Decisions

### Why MongoDB?

MongoDB was chosen because the application's data is naturally document-oriented and the current application does not require many complex relational queries.

A relational database such as MySQL could also be a valid choice, especially if the system later requires stronger relational constraints and transaction-heavy workflows.

### Why Redux?

Redux Toolkit provides centralized state management for application-wide data such as users, courses, lectures, and reviews.

### Why Gemini as a Fallback?

Direct MongoDB search is faster and cheaper for normal queries. Gemini is used only when the direct search does not find relevant results.

### Why HTTP-only Cookies?

They prevent client-side JavaScript from directly accessing the JWT, reducing the risk of token theft through certain XSS scenarios.

### Why Verify Payments on Backend?

The frontend is controlled by the client and cannot be trusted for security-sensitive decisions. The backend therefore verifies the Razorpay signature before granting course access.

---

# ⚠️ Current Limitations

The current version is a functional full-stack LMS, but several improvements would be useful for a larger production environment.

### Payment Reliability

A dedicated `Order` or `Payment` collection could track:

- Order status
- Payment status
- Payment ID
- Refunds
- Transaction history

Webhooks, retries, reconciliation, and idempotent processing could also improve reliability.

### Search

The current AI search uses Gemini as a fallback for query understanding.

A future version could use:

- Embeddings
- Vector search
- Semantic search
- Search caching

### Scalability

Potential improvements include:

- Redis caching
- Cursor-based pagination
- Database indexing
- Background jobs
- Better logging and monitoring

### Testing

Automated:

- Unit tests
- Integration tests
- API tests
- End-to-end tests

could be added for stronger reliability.

### Authentication Security

The OTP/password-reset flow could be strengthened further with:

- OTP expiration
- Attempt limits
- Rate limiting
- Secure reset-token handling
- Better abuse prevention

---

# 🔮 Future Improvements

-  Dedicated Order/Payment model
-  Razorpay webhooks
-  Idempotent payment processing
-  Redis caching
-  Cursor-based pagination
-  Database indexing improvements
-  Semantic/vector search
-  Automated testing
-  API rate limiting
-  Centralized logging and monitoring
-  Better payment reconciliation
-  More detailed educator analytics

---

# 📚 What I Learned

While building LearnSphere, I worked with:

- Full-stack MERN architecture
- REST API development
- React component architecture
- Redux state management
- JWT authentication
- HTTP-only cookies
- Role-based authorization
- Google OAuth
- Password hashing
- OTP-based password recovery
- MongoDB data modeling
- Mongoose references and populate
- MongoDB aggregation
- Razorpay payment integration
- HMAC-SHA256 payment verification
- Cloudinary media management
- Gemini API integration
- Docker
- Docker Compose
- Environment-based configuration
- Full-stack deployment

---

# 👨‍💻 Author

**Ujjwal Soni**

Electronics & Communication Engineering
Indian Institute of Information Technology, Bhopal

### Profiles

- GitHub: https://github.com/ujjwal7983
- LinkedIn: [https://www.linkedin.com/in/ujjwal-soni-0525992b6/](https://www.linkedin.com/in/ujjwal-soni-0525992b6/)

```
```
