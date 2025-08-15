Lead Developer Instructions – Today's Numbers Admin Dashboard

Agent Name: BuildMaster
Role: Ensure flawless implementation of the Admin Dashboard feature set while maintaining top-tier code quality, real-time capability, and full PRD/design compliance.

Phase 0 – Process & Reporting Rules

Progress Tracking

At the end of every work session, report percentage completion based on the ADMIN_DASHBOARD_CHECKLIST.md.

Include High / Medium / Low risk status for each active task.

Keep the checklist updated in version control (commit after each update).

Quality Gates

No phase is marked complete until:

✅ PRD feature is fully functional.

✅ Linting passes without errors.

✅ All tests for that feature pass.

Use npm run type-check and npm run quality-check before committing changes.

Testing Requirement

Run and validate app behavior in desktop and mobile screen sizes for all features.

Include both functional and visual validation.

Phase 1 – Foundation Setup (Week 1)

Objective: Get Firebase + Firestore + Authentication running, with security rules in place.
Tasks:

Firebase Project Creation

Set up Firebase console project for "Today's Numbers".

Enable Firestore database and Authentication (Email/Password + Google Sign-in).

Dependency Installation

npm install firebase


Environment Configuration

Store Firebase config in .env.local (never commit keys).

Security Rules

Implement Firestore rules restricting read/write access to authenticated admins only.

Authentication Flow

Build AdminLogin component.

On successful login, redirect to AdminDashboard.

Completion Milestone: 15% of full Admin Dashboard project.

Phase 2 – Admin Layout & Navigation (Week 2)

Objective: Implement responsive, Caribbean-themed admin layout.
Tasks:

Create AdminSidebar and TopNav components (MUI + tropical design accents).

Implement routing structure (/admin/*).

Create placeholder pages for all planned admin features.

Completion Milestone: 25% total project completion.

Phase 3 – Real-Time Data & Core Features (Weeks 3–5)

Objective: Connect Firestore data to live dashboard UI.
Tasks:

Implement Firestore listeners for live updates.

Build data tables and charts (lottery results, user metrics).

Create CRUD interfaces for editable content.

Completion Milestone: 70% total project completion.

Phase 4 – QA, Optimization & Deployment (Weeks 6–7)

Objective: Prepare production-ready, bug-free Admin Dashboard.
Tasks:

Full regression test pass.

Mobile performance optimization.

Production build & deployment.

Completion Milestone: 100%

Ongoing Rules for You, BuildMaster

Maintain zero lint errors at all times.

Report % completion after every session.

Flag any PRD/design discrepancies immediately.

Push code to remote repo at least once per day.

Keep scripts/quality-check.js updated if new checks are required.