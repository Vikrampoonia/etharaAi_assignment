# Team Task Management App

A full-stack collaborative project and task management platform built with React, Node.js, Express, PostgreSQL, and Sequelize. The application supports authentication, project-based role management, task assignment, dashboard analytics, and collaborative workflows.

---

## Live Features

- JWT Authentication
- Project-based RBAC
- Project & Task Management
- Member Management
- Dashboard Analytics
- Protected Routes
- Modular Backend Architecture
- Service-Based Frontend Architecture
- PostgreSQL + Sequelize ORM
- Render Deployment Ready

A full-stack collaborative task management application with authentication, project-based RBAC, task assignment, dashboard analytics, and project collaboration features.

---

# Tech Stack

## Backend

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- bcrypt

## Frontend

- React.js (Create React App)
- React Router DOM
- Context API
- Fetch API

## Deployment

- Render
- PostgreSQL (Render)

---

# Features

## Authentication

- User Signup
- User Login
- JWT-based authentication
- Protected routes
- Persistent login using localStorage
- Logout functionality

## Project Management

- Create project
- View all projects
- View project details
- Update project
- Delete project
- Project-specific collaboration

## Member Management

- Add members to project
- Remove members from project
- View project members
- Role-based member permissions

## Task Management

- Create tasks
- Assign tasks to project members
- Update task status
- Delete tasks
- Task priorities
- Due dates
- Status tracking

## Dashboard

- Total tasks overview
- Todo tasks count
- In-progress tasks count
- Completed tasks count
- Overdue tasks tracking

## RBAC (Role-Based Access Control)

### ADMIN

Can:

- Create/update/delete projects
- Add/remove project members
- Create/update/delete tasks
- Manage project workflow

### MEMBER

Can:

- View assigned projects
- View tasks
- Update own task status

## Authentication

- User signup
- User login
- JWT-based authentication
- Protected routes
- Logout functionality

## Projects

- Create project
- View all projects
- View project details
- Update project
- Delete project

## Members Management

- Add members to project
- Remove members from project
- Role-based member management

## Tasks

- Create tasks
- Assign tasks to members
- Update task status
- Delete tasks
- Priority levels
- Due dates

## Dashboard

- Total tasks summary
- Todo tasks count
- In-progress tasks count
- Done tasks count
- Overdue tasks

## RBAC (Role-Based Access Control)

### ADMIN

Can:

- Create project
- Add/remove members
- Create/update/delete tasks
- Update/delete project

### MEMBER

Can:

- View project
- View tasks
- Update own task status

---

# Project Structure

```text
etharaAi_assignment/
│
├── backend/
├── frontend/
└── README.md
```

---

# Backend Structure

```text
backend/src/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── validations/
└── index.js
```

---

# Frontend Structure

```text
frontend/src/
│
├── components/
├── context/
├── pages/
├── routes/
├── services/
├── utils/
└── App.js
```

---

# Database Design

## Users

```text
id
name
email
password
createdAt
updatedAt
```

## Projects

```text
id
name
description
createdBy
createdAt
updatedAt
```

## ProjectMembers

```text
id
projectId
userId
role
createdAt
updatedAt
```

## Tasks

```text
id
projectId
title
description
priority
status
dueDate
assignedTo
createdBy
createdAt
updatedAt
```

---

# Important Architecture Decision

Roles are project-specific.

A user can:

- ADMIN in one project
- MEMBER in another project

Role is stored in:

```text
ProjectMember.role
```

---

# API Endpoints

# Auth APIs

## Signup

```http
POST /api/auth/signup
```

## Login

```http
POST /api/auth/login
```

---

# Project APIs

## Create Project

```http
POST /api/projects
```

## Get Projects

```http
GET /api/projects
```

## Get Single Project

```http
GET /api/projects/:projectId
```

## Update Project

```http
PUT /api/projects/:projectId
```

## Delete Project

```http
DELETE /api/projects/:projectId
```

---

# Member APIs

## Add Member

```http
POST /api/projects/:projectId/members
```

## Remove Member

```http
DELETE /api/projects/:projectId/members/:memberId
```

## Get Members

```http
GET /api/projects/:projectId/members
```

---

# Task APIs

## Create Task

```http
POST /api/projects/:projectId/tasks
```

## Get Tasks

```http
GET /api/projects/:projectId/tasks
```

## Get Single Task

```http
GET /api/tasks/:taskId
```

## Update Task

```http
PUT /api/tasks/:taskId
```

## Delete Task

```http
DELETE /api/tasks/:taskId
```

---

# Dashboard APIs

## Summary

```http
GET /api/dashboard/summary
```

## Tasks Per User

```http
GET /api/dashboard/tasks-per-user
```

## Overdue Tasks

```http
GET /api/dashboard/overdue
```

---

# Getting Started

## 1. Clone Repository

```bash
git clone <repository-url>
cd etharaAi_assignment
```

---

## 2. Backend Setup

```bash
cd backend
npm install
```

### Create `.env`

```env
PORT=5000
DATABASE_URL=
JWT_SECRET=
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Run Backend

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

## 3. Frontend Setup

```bash
cd frontend
npm install
```

### Create `.env`

```env
REACT_APP_API_URL=http://localhost:5000
```

### Run Frontend

```bash
npm start
```

Frontend will run on:

```text
http://localhost:3000
```

---

# API Overview

# 1. Clone Repository

```bash
git clone <repository-url>
```

---

# 2. Backend Setup

```bash
cd backend
npm install
```

## Create .env

```env
PORT=5000
DATABASE_URL=
JWT_SECRET=
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## Run Backend

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

# 3. Frontend Setup

```bash
cd frontend
npm install
```

## Create .env

```env
REACT_APP_API_URL=http://localhost:5000
```

## Run Frontend

```bash
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

---

# Environment Variables

# Backend

```env
DATABASE_URL=
JWT_SECRET=
NODE_ENV=
CLIENT_URL=
```

# Frontend

```env
REACT_APP_API_URL=
```

---

# Authentication Flow

1. User signs up
2. Password hashed using bcrypt
3. JWT token generated
4. Frontend stores token in localStorage
5. Protected APIs validated using middleware

---

# Sequelize Relationships

```js
ProjectMember.belongsTo(User)
User.hasMany(ProjectMember)

ProjectMember.belongsTo(Project)
Project.hasMany(ProjectMember)

Task.belongsTo(User, { as: 'assignee' })
```

---

# Frontend Architecture

## Fetch Wrapper

Common utility:

- attaches JWT automatically
- handles errors
- parses JSON responses

## Services Layer

Dedicated services:

- auth.service.js
- project.service.js
- task.service.js
- dashboard.service.js

---

# Deployment

# Backend Deployment (Render)

## Settings

### Root Directory

```text
backend
```

### Build Command

```bash
npm install
```

### Start Command

```bash
npm start
```

---

# Frontend Deployment (Render)

## Settings

### Root Directory

```text
frontend
```

### Build Command

```bash
npm install && npm run build
```

### Publish Directory

```text
build
```

---

# Screens & Modules

## Authentication

- Login
- Signup
- Protected routes

## Dashboard

- Task summary
- Overdue tasks
- Task analytics

## Projects

- Projects listing
- Project details
- Member management
- Task management

## Tasks

- Create task
- Update task status
- Assign task
- Delete task

---

# Architecture Decisions

## Project-Based RBAC

Roles are stored inside the `ProjectMember` table instead of the `User` table.

This allows:

- Same user to be ADMIN in one project
- Same user to be MEMBER in another project

This design improves scalability and flexibility.

---

## Backend Architecture

Layered architecture used:

```text
Routes → Controllers → Services → Models
```

Benefits:

- Better separation of concerns
- Easier testing
- Scalable codebase
- Cleaner business logic

---

## Frontend Architecture

Frontend uses:

- Context API for authentication
- Service-based API layer
- Fetch wrapper for reusable API handling
- Protected routes for route security

---

# Deployment

## Backend (Render)

### Configuration

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### Environment Variables

```env
DATABASE_URL=
JWT_SECRET=
NODE_ENV=production
CLIENT_URL=
```

---

## Frontend (Render)

### Configuration

```text
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: build
```

### Environment Variables

```env
REACT_APP_API_URL=
```

---

# Future Improvements

- Better responsive UI
- Toast notifications
- Drag-and-drop task board
- Real-time updates using Socket.IO
- Activity logs
- File uploads
- Email notifications
- Advanced dashboard charts

---

# Assignment Highlights

- Clean layered architecture
- Project-based RBAC
- JWT authentication
- Sequelize relationships
- Modular frontend structure
- Service-based API layer
- Responsive component structure

---

# Author

Vikram 

B.Tech CSE — IIIT Manipur

