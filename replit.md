# Super Admin Dashboard (CompusPal)

## Project Overview

A React + TypeScript + Vite lead management dashboard for the CompusPal platform. It includes features for university management, staff management, SHC committees, analytics, alert center, notifications, and user management.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 4
- **Styling**: Tailwind CSS + PostCSS
- **Routing**: React Router v6
- **State Management**: Zustand
- **Data Fetching**: Axios + TanStack React Query
- **UI Libraries**: Headless UI, Heroicons, Lucide React, Framer Motion
- **Forms**: React Hook Form + Hookform Resolvers + Formik + Yup
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **KYC**: @smileid/web-components

## Auth Store / User Model

The authenticated user is modeled as a **Lead** (from the backend Lead schema). Key properties:
- `name`, `email`, `phoneNumber` (basic info)
- `status`: LeadStatusEnum (new, contacted, qualified, converted, unqualified)
- `leadSourceType`: LeadSourceEnum (website, referral, social_media, cold_call, event, agent)
- `interestedDevice`: { deviceCategoryId, deviceCategoryName }
- `leadBoardingFlow`: onboarding dashboard state flags
- `leadTracking`: screening/qualification tracking with score and KYC status
- `offerMedia`, `objections`, `leadConfigMetaData`: additional lead data
- `assignedSalesAgentId`, `assignedScreeningAgentId`, `hubId`: assignment references

All status comparisons in components use `LeadStatusEnum` constants.

## Project Structure

```
src/
  components/     # Reusable UI components (auth, analytics, staff, etc.)
  hooks/          # Custom React hooks
  pages/          # Route-level page components (including kyc/)
  services/       # API service layer (axios-based)
  store/          # Zustand global state stores
  types/          # TypeScript type definitions
  lib/            # Utility functions
public/
  images/         # Static image assets
```

## Development

- **Dev server**: `npm run dev` -> runs on `0.0.0.0:5000`
- **Build**: `npm run build`
- **Workflow**: "Start application" -> `npm run dev`

## Deployment

- **Type**: Static site
- **Build command**: `npm run build`
- **Public directory**: `dist`

## Configuration

- `vite.config.ts`: Server configured with `host: '0.0.0.0'`, `port: 5000`, `allowedHosts: true` for Replit proxy compatibility
- `tailwind.config.js`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration with path alias `@` -> `./src`
