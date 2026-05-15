# Team Task Management Application

A full-stack collaborative task and project management platform built using React.js, Node.js, Express.js, PostgreSQL, and Sequelize ORM.

The application enables teams to create projects, manage members, assign tasks, track progress, and collaborate efficiently through project-based role management and secure authentication.

---

# Live Demo

## Frontend
https://etharaai-assignment-frontend.onrender.com/

## Backend API
https://etharaai-assignment.onrender.com

## GitHub Repository
https://github.com/Vikrampoonia/etharaAi_assignment

---

# Features

## Authentication & Authorization

- User Signup & Login
- JWT-based Authentication
- Protected Routes
- Persistent Authentication using localStorage
- Secure Password Hashing with bcrypt
- Project-Based Role-Based Access Control (RBAC)

---

## Project Management

- Create Projects
- Update Projects
- Delete Projects
- View All Projects
- View Single Project Details
- Project Collaboration System

---

## Member Management

- Add Members to Projects
- Remove Members from Projects
- View Project Members
- Role-Based Member Permissions

---

## Task Management

- Create Tasks
- Assign Tasks to Members
- Update Task Status
- Delete Tasks
- Due Date Management
- Priority Levels
- Task Status Tracking

---

## Dashboard & Analytics

- Total Tasks Overview
- Todo Tasks Count
- In Progress Tasks Count
- Completed Tasks Count
- Overdue Tasks Tracking

---

# Tech Stack

## Frontend

- React.js
- React Router DOM
- Context API
- Fetch API
- CSS

## Backend

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- bcrypt

## Deployment

- Render
- PostgreSQL (Render Database)

---

# Project Architecture

# Backend Architecture

The backend follows a clean layered architecture for scalability and maintainability.

Architecture Flow:

Routes → Controllers → Services → Models → Database

## Layers Explanation

### Routes Layer

Responsible for:

- Defining API endpoints
- Mapping endpoints to controllers
- Applying middleware

Example:

/api/projects
/api/tasks
/api/auth

---

### Controllers Layer

Responsible for:

- Handling request and response
- Validating incoming data
- Calling service layer methods

Controllers do not contain business logic.

---

### Services Layer

Responsible for:

- Core business logic
- Database operations coordination
- Authorization checks
- Reusable application logic

This layer keeps controllers lightweight and clean.

---

### Models Layer

Responsible for:

- Database schema definitions
- Sequelize relationships
- ORM-level operations

Models represent database entities.

---

### Middleware Layer

Handles:

- JWT authentication
- Role-based authorization
- Error handling
- Request validation

---

## Backend Architecture Benefits

- Clean separation of concerns
- Scalable project structure
- Easier debugging
- Better maintainability
- Reusable business logic
- Cleaner API organization

---

# Frontend Architecture

Frontend follows a modular and service-based architecture using React.js.

Architecture Flow:

Components → Pages → Services → API Layer → Backend APIs

---

## Frontend Layers

### Components

Reusable UI components such as:

- Navbar
- Sidebar
- Forms
- Cards
- Task Items
- Project Items

---

### Pages

Page-level components:

- Login Page
- Signup Page
- Dashboard Page
- Project Details Page
- Task Management Page

Pages combine multiple reusable components.

---

### Context API

Used for:

- Authentication state management
- User session handling
- Global application state

---

### Services Layer

Handles all API communication.

Example service files:

auth.service.js
project.service.js
task.service.js
dashboard.service.js

Responsibilities:

- API calls
- Token handling
- Request abstraction
- Response parsing

---

### Fetch Wrapper Utility

Reusable fetch utility handles:

- JWT token attachment
- Common headers
- Error handling
- JSON parsing

This avoids duplicated API code.

---

### Protected Routes

Custom protected routes ensure:

- Unauthorized users cannot access private pages
- JWT validation before rendering pages
- Role-based route protection

---

## Frontend Architecture Benefits

- Modular structure
- Reusable services
- Cleaner components
- Better scalability
- Easier maintenance
- Centralized API handling
- Better route security

---

# Overall System Design

The application uses a client-server architecture.

## Flow

React Frontend
       ↓
Fetch API / Services
       ↓
Express Backend APIs
       ↓
Service Layer
       ↓
PostgreSQL Database

---

# Database Communication

The backend communicates with PostgreSQL using Sequelize ORM.

Benefits:

- ORM abstraction
- Easier queries
- Relationship management
- Migration support
- Better maintainability

---

# Security Implementation

- JWT Authentication
- Password hashing using bcrypt
- Protected API middleware
- Role-based access control
- Token-based authorization
- Environment variable protection