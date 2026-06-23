# This project of NEOLMS is divided into 5 phases :

## Phase 1: Foundation & Core Architecture
Goal: Set up the project structure, database models, authentication system, and core infrastructure (CI/CD).

1.1 Project Setup
Backend:

Initialize package.json. Install dependencies: express, mongoose, dotenv, cors, helmet, morgan.

Create an ES module structure ("type": "module" in package.json).

Set up environment variables (.env).

Frontend:

Initialize React app with Vite: npm create vite@latest client -- --template react.

Install dependencies: react-router-dom, axios, redux-toolkit, react-redux, tailwindcss.

CI/CD (Deployment):

Set up GitHub repository.

Connect repository to Render (Backend) and Vercel (Frontend) for automatic deployments on push.

Cost Optimization: Use free tier on Render and Vercel for initial development.

1.2 Database Design (MongoDB Models)
Design schemas based on the core entities:

User:

email: String (unique, indexed).

password: String (hashed with bcrypt).

role: String (enum: ['student', 'admin']).

name: String.

Course:

title, description, thumbnail, price.

instructor: Reference to User.

sections: Array of subdocuments (Section Schema) containing lessons (Lesson Schema).

Enrollment:

student: Reference to User.

course: Reference to Course.

progress: Map of lesson IDs to progress percentage.

paymentId: String.

Lesson:

title, description, videoUrl (for cloud storage path), duration.

Security:

Implement input validation using express-validator for all API endpoints.

1.3 Authentication System
Backend:

Endpoints: /api/auth/signup, /api/auth/login, /api/auth/logout.

JWT Strategy: Generate access token, store in httpOnly secure cookie on login.

Middleware: Create protect middleware (checks for valid JWT in cookies) and authorize middleware (checks user role).

Frontend:

Build Signup, Login, and Logout pages.

Configure axios interceptors to automatically include tokens (handled by browser cookies).

Implement protected routes using React Router.

1.4 Public Homepage
Create the homepage with a modern UI (using Tailwind).

Fetch and display course cards (from a public API endpoint).

Features: Hero section, Featured Courses, Search bar.

Security: Ensure the search endpoint is sanitized to prevent NoSQL injection.

## Phase 2: Public Course Pages & Basic Admin
Goal: Allow browsing of public course content and provide a mechanism to add content.

2.1 Public Course Page
Backend:

API: GET /api/courses/:courseId (Public).

API: GET /api/courses (Public, for listing).

Populate sections and lessons (but not video URLs if video protection is needed).

Frontend:

Build the course details page.

Show curriculum, instructor, thumbnail, description.

Embed YouTube preview lessons directly (to avoid serving own video content).

Security: No sensitive data (e.g., student emails, full video URLs) is exposed.

2.2 Admin Course Management (Core)
Admin Authorization: Apply authorize('admin') middleware.

Backend APIs:

Course CRUD: POST /api/admin/courses, PUT /api/admin/courses/:id, DELETE /api/admin/courses/:id.

Section/Lesson CRUD: POST /api/admin/courses/:courseId/sections, POST /api/admin/sections/:sectionId/lessons.

Frontend (Admin Dashboard):

Admin panel to create/update/delete courses.

WYSIWYG editor (or markdown) for course descriptions.

Video management: Admin can enter YouTube URLs in this phase.

Security: Input validation and role-checking for every request.

2.3 Video Management (Phase 2)
Strategy: For this phase, admins can add "Preview Video" URLs from YouTube for the course landing page. This keeps the system simple for the challenge requirements.

Video Lessons: Stored as an object with videoId and source (e.g., 'youtube').

Security: No direct serving of our own assets yet.

## Phase 3: Payment & Enrollment
Goal: Integrate a payment gateway to enable course purchases and enrollment.

3.1 Payment Integration (Razorpay/Stripe)
Cost Optimization: Use Test Mode keys to avoid real costs.

Backend:

Order Creation: POST /api/payment/create-order (creates a Razorpay/Stripe order).

Payment Verification: POST /api/payment/verify (verifies the signature/webhook to confirm payment).

Frontend:

Checkout flow: When a user clicks "Buy Now", create an order, open the payment modal (Razorpay/Stripe).

On successful payment, send payment details to the backend for verification.

3.2 Enrollment Logic
Backend:

After verification, create an Enrollment record.

Security: Ensure the user cannot enroll themselves without payment (payment verification is mandatory).

Link the enrollment to the user.

Frontend:

Show a "Enrolled" badge on the course page.

Redirect to the student dashboard.

3.3 Student Dashboard (MVP)
Backend:

GET /api/student/dashboard - Returns enrolled courses and progress.

Frontend:

"My Courses" section showing thumbnails of enrolled courses.

"Continue Learning" shows the last watched lesson.

Phase 4: Video Experience & Student Dashboard (Weeks 7-9)
Goal: Build the core learning experience—video player, progress tracking, and a full-featured dashboard.

4.1 Video Player & Progress
Backend:

PUT /api/student/progress/:lessonId - Update progress.

Frontend:

Video Player: Use a library like react-player or build a custom player around HTMLVideoElement.

Features:

Autoplay, fullscreen, keyboard shortcuts (space for pause/play).

Progress Saving: Use window.navigator.mediaSession for media controls. Send API calls on timeupdate at intervals (e.g., every 5 seconds) or on pause/ended events.

Resume Playback: Fetch the saved progress from the backend and set currentTime.

Security: The video URL should be protected (do not expose raw S3/R2 URLs).

4.2 Secure Video Delivery
Strategy: We need to protect our content. Using Cloudflare R2 + Workers or Cloudflare Stream is the most cost-effective and secure solution.

Implementation:

Signed URLs: Use Cloudflare R2's signed URL capability. Generate a temporary, pre-signed URL for each request to the backend.

Cloudflare Stream: Upload the video. Use the Stream API to get a playback URL with a signed token.

Cost Optimization: R2 is extremely cheap ($0.015/GB stored, $0.01/GB egress) and has no egress fees to Cloudflare Workers. This is a massive cost-saver compared to AWS S3.

4.3 Advanced Admin Features
Video Upload:

Create an admin dashboard for uploading video files.

Backend:

Accept multipart/form-data.

Upload the file to Cloudflare R2 using the AWS SDK.

(Optional) Spawn an FFmpeg process to transcode to HLS for adaptive bitrate streaming.

Cost Optimization: If FFmpeg processing is needed, consider using a serverless function (e.g., Vercel Serverless/Cloudflare Worker) to process the video, rather than running a dedicated server 24/7.

## Phase 5: Testing, Optimization, & Deployment
Goal: Polish the application, ensure security and performance, and finalize the deployment.

5.1 Testing
Backend:

Unit tests for critical functions (password hashing, JWT generation).

Integration tests for core APIs (auth, course creation, payment) using supertest and jest.

Frontend:

Component testing for key UI elements.
