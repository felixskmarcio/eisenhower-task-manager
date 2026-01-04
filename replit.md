# Eisenhower Task Manager

## Overview
A modern task manager based on the Eisenhower Matrix, built with React, TypeScript, and Vite. Uses Firebase for authentication and Supabase for database storage.

## Project Structure
- `src/` - Main source code
  - `components/` - React components including UI components
  - `contexts/` - React contexts (Auth, Theme, Tag, Loading)
  - `pages/` - Page components (Dashboard, Landing, Settings, etc.)
  - `services/` - Backend services (auth, database, googleCalendar)
  - `integrations/supabase/` - Supabase client and types
  - `utils/` - Utility functions
  - `styles/` - CSS styles
- `public/` - Static assets

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + DaisyUI
- **Auth**: Firebase Authentication
- **Database**: Supabase (PostgreSQL)
- **State Management**: TanStack Query, React Context
- **Routing**: React Router DOM

## Required Environment Variables
The app requires the following environment variables to function:

### Firebase (for authentication)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

### Supabase (for database)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Google Calendar (optional)
- `VITE_GOOGLE_API_KEY`
- `VITE_GOOGLE_CLIENT_ID`

## Development
Run `npm run dev` to start the development server on port 5000.

## Deployment
Configured as a static site deployment. Build output goes to `dist/` folder.

## Recent Changes
- Migrated from Lovable to Replit environment
- Configured Vite for port 5000 with allowed hosts for Replit proxy
