# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TimeRegistry is a full-stack time tracking application with a Laravel 12 backend API and Next.js 16 frontend. Users can manage projects, log time entries with duration/kilometers/notes, and export data as CSV.

## Architecture

- **Backend** (`/backend/`): Laravel 12 (PHP 8.2+), SQLite database, Laravel Sanctum session-based auth with CSRF tokens
- **Frontend** (`/frontend-web/`): Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Radix UI components
- **E2E Tests** (`/e2e/`): Playwright tests against both running services

The frontend communicates with the backend REST API. Auth uses Sanctum's cookie-based sessions — the frontend fetches a CSRF cookie first, then authenticates. The API client (`frontend-web/lib/axios.ts`) handles CSRF refresh on 419 responses automatically.

### Backend Key Paths
- `routes/api.php` — API v1 routes (all under `/api/v1/`, require `auth:sanctum`)
- `routes/web.php` — Auth routes (login, register, password reset, email verification)
- `app/Http/Controllers/` — Controllers for auth, projects, time registrations
- `app/Models/` — User, Project, TimeRegistration (User owns Projects and TimeRegistrations)
- `config/cors.php` — CORS allows `localhost:3000` and `localhost:8000`

### Frontend Key Paths
- `app/` — Next.js App Router pages (dashboard/, login/, register/, etc.)
- `lib/authContext.tsx` — Auth context provider with useAuth hook
- `lib/axios.ts` — Axios instance configured for Sanctum CSRF flow
- `lib/types.ts` — Shared TypeScript types
- `components/ui/` — Radix UI-based primitives
- `components/organisms/` — Complex components (menubar, etc.)
- `components/forms/` — Form components using React Hook Form + Zod

## Development Commands

### Backend
```bash
cd backend
composer install
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve --host=localhost --port=8000

# Run all tests
php artisan test

# Run a single test file
php artisan test tests/Feature/ProjectControllerTest.php

# Run combined dev mode (serve + queue + logs)
composer run dev

# Format code
./vendor/bin/pint
```

### Frontend
```bash
cd frontend-web
npm ci
npm run dev          # Dev server on http://localhost:3000 (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
```

### E2E Tests (Playwright)
```bash
# From repo root
npx playwright install   # First time only
npx playwright test      # Requires both backend and frontend running
```

## Testing

- **Backend tests** use PHPUnit with in-memory SQLite (`phpunit.xml` sets `DB_CONNECTION=sqlite`, `DB_DATABASE=:memory:`)
- **Frontend** has no unit test suite — validated via ESLint + build + E2E
- **E2E tests** run against Chromium, Firefox, and Mobile Chrome (Pixel 5). Test helpers in `e2e/helpers/` provide `registerUser`/`loginUser` utilities and test data generators
- **CI** runs three GitHub Actions workflows: `laravel.yml` (backend tests), `next_frontend.yml` (lint + build), `playwright.yml` (full integration)

## Code Style

- **PHP**: Laravel Pint (PSR-12 based)
- **TypeScript/JS**: ESLint with double quotes, TypeScript strict mode
- **CSS**: Tailwind CSS utility classes

## Environment

Backend `.env` requires `SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:8000`. Frontend needs `NEXT_PUBLIC_API_URL=http://localhost:8000`. See `.env.example` files in both directories.