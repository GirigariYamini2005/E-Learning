# 🎓 AI-Powered E-Learning Platform


An intelligent, full-stack e-learning platform with adaptive quizzes, AI-driven explanations, personalized study recommendations, and a comprehensive admin dashboard. Built with React, Node.js, Express, MongoDB, OpenAI GPT, and **LangGraph** for modular, visual AI pipelines.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-412991?logo=openai&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 📑 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [AI Pipeline Architecture](#ai-pipeline-architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Fine-tuning & Tracing](#fine-tuning--tracing)
- [Testing Guide](#testing-guide)
- [Seed Data](#seed-data)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

---

## Overview


This platform enables students to browse courses, study structured learning content, take adaptive quizzes, and receive AI-powered feedback on their performance. Admins can manage all platform content through a dedicated dashboard. The system leverages OpenAI's GPT model and **LangGraph** to provide intelligent, modular, and visually traceable AI explanations, quiz generation, and personalized study recommendations.


### Key Highlights

- **Modular AI Pipelines**: All AI features (quiz generation, feedback, explanations, video slides) are built as multi-node LangGraph pipelines for transparency, extensibility, and debugging.
- **Visual Tracing**: Every AI pipeline run is visualized on [smith.langchain.com](https://smith.langchain.com) (LangSmith) — see every node, input/output, and error.
- **Fine-tuned Quiz Generation**: Easily fine-tune your own OpenAI model for quiz generation with a single script and dataset.
- **5 Pre-built Courses** with structured topics and subtopics (Python, JavaScript, Data Science, MongoDB, Machine Learning)
- **14 Quizzes** with 70+ multiple-choice questions and auto-grading
- **AI-Powered Feedback** using OpenAI GPT-3.5-turbo (or your fine-tuned model)
- **Real-time Analytics** with performance charts and weak topic identification
- **Admin Panel** with full CRUD operations for courses, quizzes, and user management
- **JWT Authentication** with role-based access control (Student / Admin)
- **Responsive UI** with a light, study-focused design theme
## AI Pipeline Architecture

All AI features use **LangGraph** — a node-based, visual pipeline framework for LLMs. Each feature is a directed graph of nodes, where each node does a single job (e.g., categorize errors, generate explanations, synthesize recommendations).

**Why?**
- **Debuggability:** See exactly which step failed and why.
- **Extensibility:** Add, remove, or reorder nodes without rewriting everything.
- **Transparency:** Every input/output is visible and auditable.

**Visual Tracing:**
- Every pipeline run is sent to [smith.langchain.com](https://smith.langchain.com) (LangSmith) for visual inspection.
- See the full graph, node timings, token usage, and errors.

**Example: AI Feedback Pipeline**

```
analyseTrend → identifyPatterns → buildStudyPlan
```

**Example: Quiz Generation Pipeline**

```
enrichTopicContext → generateQuizDraft → validateQuiz
```

**How to view:**
1. Sign up at [smith.langchain.com](https://smith.langchain.com) and get an API key
2. Add it to your `.env` (see below)
3. Use any AI feature — see the run appear as a node graph in your LangSmith dashboard

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                        │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌────────────────┐  │
│  │  Auth    │  │ Courses  │  │  Quiz   │  │   Dashboard    │  │
│  │  Pages   │  │  Pages   │  │  System │  │   & Analytics  │  │
│  └────┬─────┘  └────┬─────┘  └────┬────┘  └───────┬────────┘  │
│       │              │             │               │            │
│  ┌────┴──────────────┴─────────────┴───────────────┴────────┐  │
│  │              React App (Port 3000)                        │  │
│  │  • React Router v6  • Axios HTTP Client                   │  │
│  │  • AuthContext       • Recharts                           │  │
│  │  • React Markdown   • React Icons                         │  │
│  └──────────────────────┬────────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │ HTTP/REST (JSON)
                          │ Authorization: Bearer <JWT>
┌─────────────────────────┼───────────────────────────────────────┐
│                 SERVER   │  (Port 5001)                          │
│  ┌───────────────────────┴─────────────────────────────────┐    │
│  │               Express.js Application                     │    │
│  │                                                          │    │
│  │  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐  │    │
│  │  │  Auth   │  │ Courses  │  │ Quizzes  │  │ Results │  │    │
│  │  │ Routes  │  │  Routes  │  │  Routes  │  │ Routes  │  │    │
│  │  └─────────┘  └──────────┘  └──────────┘  └─────────┘  │    │
│  │  ┌─────────┐  ┌──────────┐  ┌──────────────────────┐   │    │
│  │  │Dashboard│  │  Admin   │  │    AI Routes         │   │    │
│  │  │ Routes  │  │  Routes  │  │ (OpenAI GPT-3.5)     │   │    │
│  │  └─────────┘  └──────────┘  └──────────────────────┘   │    │
│  │                                                          │    │
│  │  ┌──────────────────┐  ┌──────────────────────────┐     │    │
│  │  │  JWT Middleware  │  │  Admin Auth Middleware    │     │    │
│  │  └──────────────────┘  └──────────────────────────┘     │    │
│  └──────────────────────────────────────────────────────────┘    │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │ Mongoose ODM
┌──────────────────────────┼───────────────────────────────────────┐
│              MongoDB Atlas Cluster                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  users   │  │ courses  │  │  quizzes │  │ results  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└──────────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│              OpenAI API (External)                                │
│  • GPT-3.5-turbo for AI explanations & study recommendations     │
└──────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Authentication**: Client sends credentials → Server validates → Returns JWT token → Stored in `localStorage`
2. **Course Enrollment**: Authenticated user enrolls → User's `enrolledCourses` array updated in MongoDB
3. **Quiz Submission**: Student submits answers → Server auto-grades against correct answers → Result saved with score
4. **AI Explanation**: Student requests explanation for incorrect answers → Server sends context to OpenAI → Returns AI-generated explanation
5. **Dashboard Analytics**: Server aggregates results across quizzes → Calculates scores, weak topics → Returns analytics data

---

## Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| **Node.js** (v18+) | JavaScript runtime environment |
| **Express.js** (v4) | Web application framework |
| **MongoDB** | NoSQL document database |
| **Mongoose** (v8) | MongoDB object data modeling (ODM) |
| **JSON Web Token** | Stateless authentication |
| **bcrypt.js** | Password hashing (12 salt rounds) |
| **OpenAI SDK** (v4) | GPT-3.5-turbo integration for AI features |
| **dotenv** | Environment variable management |
| **CORS** | Cross-origin resource sharing |

### Frontend

| Technology | Purpose |
|---|---|
| **React** (v18) | Component-based UI library |
| **React Router** (v6) | Client-side routing with protected routes |
| **Axios** | HTTP client with JWT interceptors |
| **Recharts** | Data visualization (bar charts, pie charts) |
| **React Markdown** | Markdown content rendering for course material |
| **React Icons** | Icon library (Feather Icons) |
| **CSS3** | Custom design system — no UI framework dependency |

### Infrastructure

| Technology | Purpose |
|---|---|
| **MongoDB Atlas** | Cloud-hosted database cluster |
| **OpenAI API** | AI-powered explanations and feedback |
| **Git & GitHub** | Version control and repository hosting |

---

## Project Structure

```
AI-Powered-E-Learning/
│
├── backend/                        # Node.js + Express API server
│   ├── middleware/
│   │   └── auth.js                 # JWT verification & admin role-check middleware
│   ├── models/
│   │   ├── User.js                 # User schema (name, email, password, role, enrolledCourses)
│   │   ├── Course.js               # Course schema (title, topics → subtopics → content)
│   │   ├── Quiz.js                 # Quiz schema (questions, options, correctAnswer)
│   │   └── Result.js               # Result schema (answers, score, percentage)
│   ├── routes/
│   │   ├── auth.js                 # POST /register, POST /login, GET /me
│   │   ├── courses.js              # CRUD courses, enroll, get enrolled
│   │   ├── quizzes.js              # Get quizzes by course, create quiz
│   │   ├── results.js              # Submit quiz result, get results
│   │   ├── dashboard.js            # Analytics: stats, weak topics, performance
│   │   ├── ai.js                   # AI explain (incorrect answers), AI feedback
│   │   └── admin.js                # Admin: manage users, courses, quizzes, results
│   ├── seed.js                     # Database seeder (5 courses, 14 quizzes, admin user)
│   ├── server.js                   # Express app entry point
│   ├── package.json
│   └── .env                        # Environment variables (not in repo)
│
├── frontend/                       # React single-page application
│   ├── public/
│   │   └── index.html              # HTML entry point
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── AdminPanel.js   # Admin dashboard with tabs (CRUD for all entities)
│   │   │   ├── auth/
│   │   │   │   ├── Login.js        # Login form with JWT storage
│   │   │   │   └── Register.js     # Registration form with validation
│   │   │   ├── courses/
│   │   │   │   ├── CourseList.js    # Course catalog with search & filter
│   │   │   │   ├── CourseDetail.js  # Course detail with topic sidebar
│   │   │   │   ├── ContentViewer.js# Markdown content renderer with navigation
│   │   │   │   └── EnrolledCourses.js # Enrolled courses grid
│   │   │   ├── dashboard/
│   │   │   │   └── Dashboard.js    # Analytics with charts & AI recommendations
│   │   │   ├── layout/
│   │   │   │   └── Navbar.js       # Navigation bar with role-based links
│   │   │   └── quiz/
│   │   │       ├── QuizPage.js     # Quiz-taking interface with progress
│   │   │       └── QuizResult.js   # Results with AI explanation integration
│   │   ├── context/
│   │   │   └── AuthContext.js      # React context for auth state management
│   │   ├── services/
│   │   │   └── api.js              # Axios instance with JWT interceptor
│   │   ├── App.js                  # Root component with React Router
│   │   ├── App.css                 # Complete design system (1300+ lines)
│   │   └── index.js                # React DOM entry point
│   └── package.json
│
└── .gitignore
```

---

## Features

### 👨‍🎓 Student Features

| Feature | Description |
|---|---|
| **Registration & Login** | Secure sign-up with email/password, JWT-based session management |
| **Course Browsing** | Search courses by title, filter by difficulty (Beginner/Intermediate/Advanced) |
| **Course Enrollment** | One-click enrollment, tracked in user profile |
| **Enrolled Courses** | Dedicated page showing all enrolled courses with "Continue Learning" action |
| **Structured Content** | Markdown-rendered learning material organized by topics → subtopics |
| **Content Navigation** | Previous/Next buttons, breadcrumb trail, jump to quiz from content |
| **Adaptive Quizzes** | Multiple-choice quizzes (4 options), one question at a time, progress bar |
| **Auto-Grading** | Instant scoring upon quiz submission with percentage calculation |
| **Result Review** | Review all answers with correct/incorrect highlighting |
| **AI Explanations** | Click "Get AI Explanation" on any wrong answer for GPT-powered analysis |
| **AI Study Plan** | Personalized study recommendations based on overall performance |
| **Dashboard** | Stats overview, bar/pie charts, weak topic identification, recent results |

### 🔧 Admin Features

| Feature | Description |
|---|---|
| **Platform Overview** | Total users, courses, quizzes, attempts, platform average score |
| **User Management** | View all users, roles, enrollment count; delete student accounts |
| **Course Management** | View courses with stats; create new courses with topics/subtopics; delete courses |
| **Quiz Management** | View quizzes with attempt stats; create quizzes with questions/options; delete quizzes |
| **Results Monitoring** | View all student quiz results across the platform |

---

## Database Schema

### User
```javascript
{
  name:             String (required),
  email:            String (required, unique, lowercase),
  password:         String (required, min 6 chars, bcrypt hashed),
  role:             String (enum: 'student' | 'admin', default: 'student'),
  enrolledCourses:  [ObjectId → Course],
  createdAt:        Date
}
```

### Course
```javascript
{
  title:       String (required),
  description: String (required),
  category:    String (required),
  thumbnail:   String (emoji),
  difficulty:  String (enum: 'Beginner' | 'Intermediate' | 'Advanced'),
  topics: [{
    title:       String,
    description: String,
    subtopics: [{
      title:   String,
      content: String (Markdown),
      order:   Number
    }],
    order: Number
  }],
  createdBy: ObjectId → User,
  createdAt: Date
}
```

### Quiz
```javascript
{
  course:        ObjectId → Course (required),
  topicIndex:    Number,
  subtopicIndex: Number,
  title:         String (required),
  questions: [{
    question:      String,
    options:       [String] (4 options),
    correctAnswer: Number (index of correct option),
    explanation:   String
  }],
  createdAt: Date
}
```

### Result
```javascript
{
  user:           ObjectId → User,
  quiz:           ObjectId → Quiz,
  course:         ObjectId → Course,
  answers: [{
    questionIndex:  Number,
    selectedAnswer: Number,
    isCorrect:      Boolean
  }],
  score:          Number,
  totalQuestions:  Number,
  percentage:     Number,
  completedAt:    Date
}
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Login and receive JWT token |
| `GET` | `/api/auth/me` | JWT | Get current user profile |

### Courses
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/courses` | No | List all courses (content excluded) |
| `GET` | `/api/courses/:id` | No | Get full course with content |
| `POST` | `/api/courses` | Admin | Create a new course |
| `PUT` | `/api/courses/:id` | Admin | Update a course |
| `POST` | `/api/courses/:id/enroll` | JWT | Enroll in a course |
| `GET` | `/api/courses/user/enrolled` | JWT | Get user's enrolled courses |

### Quizzes
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/quizzes/course/:courseId` | JWT | Get quizzes for a course |
| `GET` | `/api/quizzes/:id` | JWT | Get quiz (answers hidden) |
| `GET` | `/api/quizzes/:id/full` | JWT | Get quiz with answers (for review) |
| `POST` | `/api/quizzes` | Admin | Create a new quiz |

### Results
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/results` | JWT | Submit quiz answers (auto-graded) |
| `GET` | `/api/results/my` | JWT | Get current user's results |
| `GET` | `/api/results/:id` | JWT | Get specific result detail |

### Dashboard
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/dashboard` | JWT | Get user analytics & performance stats |


### AI (LangGraph + OpenAI)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/ai/explain` | JWT | Get AI explanation for incorrect answers (LangGraph pipeline) |
| `POST` | `/api/ai/feedback` | JWT | Get personalized study recommendations (LangGraph pipeline) |
| `POST` | `/api/ai/generate-video` | JWT | Generate video slides for a topic (LangGraph pipeline + DALL-E) |
| `POST` | `/api/ai/generate-quiz` | JWT | Generate a quiz for a topic (LangGraph pipeline, uses fine-tuned model if available) |
## Fine-tuning & Tracing

### Fine-tune your own quiz generator (optional)

1. Edit your OpenAI API key in `backend/.env`.
2. Run:
  ```bash
  cd backend
  npm run finetune
  ```
  This uploads a 50-question dataset and starts a fine-tuning job. Wait for it to finish (15–60 min).
3. Copy the printed model ID to your `.env` as:
  ```env
  FINETUNED_MODEL_ID=ft:gpt-3.5-turbo-...
  ```
4. Restart the backend. The `/api/ai/generate-quiz` endpoint will now use your fine-tuned model.

### Enable LangSmith visual tracing

1. Sign up at [smith.langchain.com](https://smith.langchain.com) and create an API key.
2. Add these to your `backend/.env`:
  ```env
  LANGCHAIN_TRACING_V2=true
  LANGCHAIN_API_KEY=lsv2-pt-xxxxxxxxxxxxxxxx
  LANGCHAIN_PROJECT=ai-elearning
  ```
3. Restart the backend. Every AI pipeline run will now appear as a visual node graph in your LangSmith dashboard.

---

### Admin
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Admin | Platform-wide statistics |
| `GET` | `/api/admin/users` | Admin | List all users |
| `DELETE` | `/api/admin/users/:id` | Admin | Delete a user |
| `GET` | `/api/admin/courses` | Admin | List courses with enrollment stats |
| `DELETE` | `/api/admin/courses/:id` | Admin | Delete course + related data |
| `GET` | `/api/admin/quizzes` | Admin | List quizzes with attempt stats |
| `DELETE` | `/api/admin/quizzes/:id` | Admin | Delete quiz + related results |
| `GET` | `/api/admin/results` | Admin | List all quiz results |

---

## Prerequisites

Ensure the following are installed on your system:

| Software | Version | Download |
|---|---|---|
| **Node.js** | v18 or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | v9 or higher | Comes with Node.js |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |
| **MongoDB Atlas Account** | Free tier | [mongodb.com/atlas](https://www.mongodb.com/atlas) |
| **OpenAI API Key** | GPT-3.5 access | [platform.openai.com](https://platform.openai.com/) |

> **Note:** MongoDB Atlas (cloud) is used by default. No local MongoDB installation required.

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/srivardhan-kondu/AI-Powered-E--Learning.git
cd AI-Powered-E--Learning
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/elearning?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=sk-your-openai-api-key-here
```

| Variable | Description |
|---|---|
| `PORT` | Backend server port (default: `5001`, avoid `5000` on macOS) |
| `MONGODB_URI` | MongoDB Atlas connection string with database name |
| `JWT_SECRET` | Secret key for signing JWT tokens (use a strong random string) |
| `OPENAI_API_KEY` | Your OpenAI API key for AI features |

> ⚠️ **macOS Users:** Port 5000 is used by AirPlay Receiver. Use `5001` or another port.

### 4. Seed the Database

```bash
cd backend
node seed.js
```

Expected output:
```
Connected to MongoDB
Cleared existing courses and quizzes
Admin user created (admin@elearning.com / admin123)
Inserted 5 courses
Inserted 14 quizzes
✅ Database seeded successfully!
```

### 5. Frontend Setup

```bash
cd ../frontend
npm install
```

---

## Running the Application

### Start Backend Server

```bash
cd backend
node server.js
```

Output: `Server running on port 5001` and `Connected to MongoDB`

### Start Frontend Development Server

Open a **new terminal**:

```bash
cd frontend
npm start
```

The React app will open at **http://localhost:3000**

### Quick Start (Both Servers)

Terminal 1:
```bash
cd backend && node server.js
```

Terminal 2:
```bash
cd frontend && npm start
```

---

## Testing Guide

### 1. Test User Registration

1. Open **http://localhost:3000**
2. Click **Register**
3. Fill in: Name, Email, Password (min 6 characters), Confirm Password
4. Submit → Redirected to login page
5. Login with the registered credentials

### 2. Test Course Browsing & Enrollment

1. Click **Courses** in the navbar
2. Verify 5 courses are displayed (Python, JavaScript, Data Science, MongoDB, ML)
3. Use the **search bar** — type "Python" → only Python course shown
4. Use **difficulty filters** — click "Advanced" → filtered results
5. Click a course card → **Course Detail** page
6. Click **Enroll** → success message
7. Click **Enrolled** in navbar → your enrolled course appears

### 3. Test Learning Content

1. From Course Detail, expand a topic → click a subtopic
2. Content renders in Markdown (headings, code blocks, tables)
3. Use **Previous / Next** buttons to navigate between subtopics
4. Click **Take Quiz** button at the end of content

### 4. Test Quiz System

1. Navigate to a quiz from Course Detail or Content Viewer
2. Select an answer for each question (4 options shown)
3. Use the progress bar and question dots to track progress
4. Click **Submit Quiz**
5. View score as percentage with grade classification:
   - ≥ 80%: Excellent 🌟
   - ≥ 60%: Good 👍
   - ≥ 40%: Average ⚡
   - < 40%: Needs Improvement 📚
6. Click **Review Answers** to see correct/incorrect breakdown

### 5. Test AI Features

> Requires a valid OpenAI API key in `.env`

1. After completing a quiz, go to **Results**
2. For any **incorrect answer**, click **"Get AI Explanation"**
3. Wait for GPT response → displays detailed explanation
4. Go to **Dashboard** → click **"Get AI Study Recommendations"**
5. Receive personalized feedback based on your quiz history

### 6. Test Dashboard & Analytics

1. Click **Dashboard** in the navbar
2. View stats: Total Quizzes Taken, Average Score, Enrolled Courses
3. Check **Weak Topics** section (topics where score < 60%)
4. Review **Recent Results** list
5. Examine **Bar Chart** (course performance) and **Pie Chart** (score distribution)

### 7. Test Admin Panel

1. Login as admin: **admin@elearning.com** / **admin123**
2. Click **Admin** (orange link in navbar, only visible to admins)
3. **Overview Tab**: Platform stats (users, courses, quizzes, attempts, avg score)
4. **Users Tab**: List of all registered users, delete student accounts
5. **Courses Tab**:
   - Click **"+ Add New Course"**
   - Fill in title, category, description, difficulty
   - Add topics with subtopics (supports Markdown content)
   - Click **Create Course**
   - Verify new course appears in the table and in the Courses page
6. **Quizzes Tab**:
   - Click **"+ Add New Quiz"**
   - Select a course, add questions with 4 options each
   - Mark correct answer using radio buttons
   - Click **Create Quiz**
7. **Results Tab**: View all student quiz attempts across the platform

### 8. Test API Endpoints (Optional - via cURL)

```bash
# Login and get token
TOKEN=$(curl -s http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@elearning.com","password":"admin123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# Get all courses
curl -s http://localhost:5001/api/courses | python3 -m json.tool

# Get admin stats
curl -s http://localhost:5001/api/admin/stats \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

# Get enrolled courses
curl -s http://localhost:5001/api/courses/user/enrolled \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

---

## Seed Data

The seed script (`backend/seed.js`) populates the database with:

### Courses (5)

| # | Course | Difficulty | Topics | Category |
|---|---|---|---|---|
| 1 | Introduction to Python Programming | Beginner | 3 | Programming |
| 2 | Web Development with JavaScript | Intermediate | 3 | Web Development |
| 3 | Data Science Fundamentals | Intermediate | 3 | Data Science |
| 4 | MongoDB for Developers | Beginner | 3 | Database |
| 5 | Machine Learning Basics | Advanced | 2 | AI/ML |

### Quizzes (14)

- Each course has 2–3 quizzes
- Each quiz contains **5 questions** with 4 options
- Total: **70 questions** across all quizzes
- Includes explanations for each correct answer

### Admin User

| Field | Value |
|---|---|
| Name | Admin |
| Email | admin@elearning.com |
| Password | admin123 |
| Role | admin |

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | 5000 | Backend server port |
| `MONGODB_URI` | **Yes** | — | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | Secret for JWT token signing |
| `OPENAI_API_KEY` | **Yes** | — | OpenAI API key for AI features |

---

## Design System

The platform uses a custom CSS design system with a **light, study-focused theme**:

| Token | Value | Usage |
|---|---|---|
| `--primary` | `#2ABFBF` (Teal/Mint) | Buttons, links, active states |
| `--secondary` | `#7C6FE0` (Lavender) | Secondary actions, gradients |
| `--accent` | `#FF8474` (Soft Coral) | Admin elements, warnings |
| `--bg-primary` | `#FAFCFE` | Page backgrounds |
| `--bg-card` | `#FFFFFF` | Card backgrounds |

**Typography:** Inter (body) + Poppins (headings)

---

## Screenshots

> After running the application, you can access these pages:

| Page | URL |
|---|---|
| Login | http://localhost:3000/login |
| Register | http://localhost:3000/register |
| Courses | http://localhost:3000/courses |
| Enrolled Courses | http://localhost:3000/enrolled |
| Course Detail | http://localhost:3000/courses/:id |
| Content Viewer | http://localhost:3000/courses/:courseId/learn/:topicIndex/:subtopicIndex |
| Quiz | http://localhost:3000/quiz/:quizId |
| Quiz Results | http://localhost:3000/results/:resultId |
| Dashboard | http://localhost:3000/dashboard |
| Admin Panel | http://localhost:3000/admin |

---

## Troubleshooting

| Issue | Solution |
|---|---|
| `Port 5000 is in use` (macOS) | Change `PORT=5001` in `.env`. macOS uses port 5000 for AirPlay. |
| `MongoDB connection error` | Verify your `MONGODB_URI` in `.env`. Ensure your IP is whitelisted in Atlas. |
| `Cannot find module` | Run `npm install` in both `backend/` and `frontend/` directories. |
| `AI features not working` | Verify `OPENAI_API_KEY` is valid and has credits. GPT-3.5-turbo access required. |
| `Admin link not visible` | Login with admin credentials. Only `role: admin` users see the Admin link. |
| Frontend won't start | Ensure no other process is using port 3000. Try `npx kill-port 3000`. |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is built for educational purposes.

---

<p align="center">
  <strong>Group Project - AI-Powered E-Learning</strong><br>
  <b>My Role: Backend Developer</b>
  <br><br>
  Contributed by:<br>
  Poojitha Rachamadugu (Database) | Girigari Yamini (API & Backend) | 
  Srivardhan Kondu (Frontend)
</p>
