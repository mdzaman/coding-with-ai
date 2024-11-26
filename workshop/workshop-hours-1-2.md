# Detailed Workshop Content - Hours 1-2

## Hour 1: Foundation & Quick Wins (9:00-10:00)

### Introduction (15 mins)
#### Workshop Overview
1. **Welcome & Introduction**
   - Workshop objectives
   - Final application showcase
   - Schedule overview

2. **AI Development Approach**
   - Claude.ai capabilities
   - Prompting strategies
   - Development workflow

3. **Technical Stack Overview**
   ```
   - Next.js 14 (App Router)
   - TypeScript
   - Tailwind CSS
   - Supabase (Auth & Database)
   - Vercel (Deployment)
   ```

#### Setup Verification (5 mins)
```bash
# Run verification script
npm run workshop:verify

# Check environment
npm run workshop:env-check
```

### Rapid Application Scaffolding (40 mins)

#### Step 1: Project Structure (15 mins)
1. **Generate Structure with Claude**
   ```prompt
   Create a Next.js 14 project structure for a B2B SaaS application with:
   - Authentication (Supabase)
   - Dashboard layout
   - User management
   - Multi-tenant support
   - TypeScript & Tailwind CSS
   
   Include:
   - Folder structure
   - Key components
   - Route organization
   - Type definitions
   - Configuration files
   ```

2. **Implement Core Structure**
   ```bash
   # Generate base structure
   npx create-next-app@latest . --typescript --tailwind --app --src-dir
   
   # Add additional dependencies
   npm install @supabase/auth-helpers-nextjs @supabase/supabase-js
   ```

#### Step 2: Authentication Setup (15 mins)
1. **Generate Auth Components**
   ```prompt
   Create authentication components for:
   - Sign in
   - Sign up
   - Password reset
   - Email verification
   Using Supabase auth and following best practices.
   Include error handling and loading states.
   ```

2. **Implement Authentication**
   ```typescript
   // Add auth middleware
   // app/middleware.ts
   import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
   import { NextResponse } from 'next/server'
   import type { NextRequest } from 'next/server'

   export async function middleware(req: NextRequest) {
     const res = NextResponse.next()
     const supabase = createMiddlewareClient({ req, res })
     await supabase.auth.getSession()
     return res
   }
   ```

#### Step 3: Base Layout (10 mins)
1. **Generate Layout Components**
   ```prompt
   Create a modern dashboard layout with:
   - Responsive sidebar
   - Top navigation
   - User profile dropdown
   - Quick actions
   Using Tailwind CSS and considering mobile responsiveness.
   ```

2. **Implement Layout**
   ```typescript
   // app/layout.tsx
   // Implementation of generated layout code
   ```

## Hour 2: Core Features Development (10:00-11:00)

### Database and API Design (30 mins)

#### Step 1: Database Schema (15 mins)
1. **Generate Schema**
   ```prompt
   Create Supabase database schema for:
   - Users and profiles
   - Organizations (multi-tenant)
   - Projects
   - Team members
   - Audit logs
   
   Include:
   - Foreign key relationships
   - Indexes
   - RLS policies
   - Type definitions
   ```

2. **Implement Schema**
   ```sql
   -- Generated SQL implementation
   -- schemas/01_init.sql
   ```

#### Step 2: API Routes (15 mins)
1. **Generate API Structure**
   ```prompt
   Create Next.js API routes for:
   - User management
   - Organization management
   - Project handling
   - Team collaboration
   
   Include:
   - Input validation
   - Error handling
   - TypeScript types
   - Middleware
   ```

2. **Implement API Routes**
   ```typescript
   // app/api/users/route.ts
   // Implementation of generated API routes
   ```

### Feature Implementation (30 mins)

#### Step 1: Core Services (15 mins)
1. **Generate Service Layer**
   ```prompt
   Create service layer for:
   - User management
   - Organization handling
   - Project operations
   - Team collaboration
   
   Include:
   - Error handling
   - Type safety
   - Database queries
   - Business logic
   ```

2. **Implement Services**
   ```typescript
   // services/user.service.ts
   // Implementation of generated services
   ```

#### Step 2: Data Hooks (15 mins)
1. **Generate Custom Hooks**
   ```prompt
   Create React hooks for:
   - User data management
   - Organization state
   - Project operations
   - Team collaboration
   
   Include:
   - Loading states
   - Error handling
   - Type safety
   - Caching strategy
   ```

2. **Implement Hooks**
   ```typescript
   // hooks/useUser.ts
   // Implementation of generated hooks
   ```

### Hour 2 Checkpoint
- Working authentication
- Database schema deployed
- API routes functioning
- Core services implemented
- Data hooks ready
