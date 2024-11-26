# SaaS Workshop Preparation Guide

## Required Software & Accounts
### Development Environment
1. **Node.js & npm**
   - Install Node.js v18.17 or later
   - Verify installation: `node --version` & `npm --version`

2. **Visual Studio Code**
   - Install latest stable version
   - Required Extensions:
     - ESLint
     - Prettier
     - Tailwind CSS IntelliSense
     - GitLens
     - Thunder Client (API testing)

3. **Git**
   - Install latest version
   - Basic configuration:
     ```bash
     git config --global user.name "Your Name"
     git config --global user.email "your.email@example.com"
     ```

### Required Accounts
1. **GitHub**
   - Create account if needed
   - Set up SSH keys
   - Join workshop organization (link provided)

2. **Claude.ai**
   - Sign up for account
   - Complete basic prompting tutorial
   - Test access and familiarize with interface

3. **Vercel**
   - Create account
   - Link with GitHub
   - Set up personal project

4. **Supabase**
   - Create account
   - Create new organization
   - Familiarize with dashboard

### Workshop Repository
1. **Clone Starter Repository**
   ```bash
   git clone https://github.com/workshop/saas-starter.git
   cd saas-starter
   npm install
   ```

2. **Verify Setup**
   ```bash
   npm run setup-check
   ```

## Pre-Workshop Learning
### Required Reading
1. **Next.js Foundations**
   - App Router basics
   - Server Components
   - Data fetching

2. **Supabase Concepts**
   - Authentication
   - Database access
   - Row Level Security

3. **TypeScript Basics**
   - Types and interfaces
   - Generic types
   - Type inference

### Recommended Practice
1. **Complete Coding Exercises**
   - Basic Next.js routing
   - Simple Supabase queries
   - Tailwind styling

2. **Study Example Code**
   - Review starter templates
   - Understand folder structure
   - Examine authentication flow

## Environment Configuration
### Local Development
1. **Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in:
   - Supabase credentials
   - API keys
   - Other configuration

2. **Database Setup**
   ```bash
   npm run db:setup
   ```

3. **Test Configuration**
   ```bash
   npm run test:setup
   ```

### IDE Setup
1. **VS Code Settings**
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     }
   }
   ```

2. **Extension Configuration**
   - Configure Prettier
   - Set up ESLint
   - Configure GitLens

## Technical Requirements
### Hardware
- Laptop with minimum 8GB RAM
- 50GB free disk space
- Reliable internet connection

### Software
- Modern browser (Chrome/Firefox latest)
- Terminal application
- Docker Desktop (optional)

## Pre-Workshop Checklist
### One Week Before
- [ ] Install all required software
- [ ] Create required accounts
- [ ] Clone and setup repository
- [ ] Complete required reading

### Day Before
- [ ] Verify all tools work
- [ ] Test database connection
- [ ] Ensure environment variables set
- [ ] Download workshop materials

### Morning Of
- [ ] Pull latest repository changes
- [ ] Test local development server
- [ ] Verify Claude.ai access
- [ ] Check internet connection

## Support Resources
### Documentation
- Workshop documentation
- Troubleshooting guide
- Architecture overview
- Best practices guide

### Communication Channels
- Discord support channel
- Email support
- Emergency contact numbers
- Online resource links

### Backup Plans
- Offline documentation
- Local development fallbacks
- Alternative tools list
- Contingency procedures
