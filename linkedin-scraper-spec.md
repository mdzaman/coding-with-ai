# LinkedIn Job Scraper SaaS - Project Specification

## Data Schema

### Job Posting Schema
```typescript
interface JobPosting {
  id: string;                    // Unique identifier
  title: string;                 // Job title
  company: {
    name: string;               // Company name
    linkedInId: string;         // Company LinkedIn ID
    size: string;              // Company size
    industry: string;          // Industry
    location: {
      country: string;
      city: string;
      remote: boolean;
    }
  };
  hiring_manager: {
    name: string;              // Hiring manager name
    title: string;             // Hiring manager title
    linkedInId: string;        // Hiring manager LinkedIn ID
    connection_degree: number; // 1st, 2nd, 3rd degree connection
  };
  skills: {
    required: string[];        // Required skills
    preferred: string[];       // Preferred skills
  };
  posting_details: {
    posted_date: Date;         // When job was posted
    application_count: number; // Number of applications
    seniority_level: string;   // Seniority level
    employment_type: string;   // Full-time, Part-time, etc.
    salary: {
      min: number;
      max: number;
      currency: string;
      period: string;         // yearly, monthly, hourly
    };
    benefits: string[];       // Listed benefits
  };
  description: {
    full_text: string;       // Full job description
    responsibilities: string[];
    qualifications: string[];
    parsed_keywords: string[];
  };
  meta: {
    last_updated: Date;      // Last time data was updated
    tracking_id: string;     // LinkedIn tracking ID
    url: string;            // Original posting URL
  }
}

// User subscription levels
enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium'
}

interface UserProfile {
  id: string;
  email: string;
  subscription: {
    tier: SubscriptionTier;
    start_date: Date;
    end_date: Date;
    jobs_tracked: number;
    searches_remaining: number;
  };
  saved_searches: {
    id: string;
    criteria: object;
    last_run: Date;
  }[];
  notifications: {
    email: boolean;
    frequency: string;
    criteria: object[];
  };
}
```

## System Architecture

### AWS Serverless Components
1. **API Gateway**
   - REST API endpoints
   - WebSocket for real-time updates
   - Request throttling

2. **Lambda Functions**
   ```typescript
   // Core function types
   type ScraperFunction = {
     scheduling: 'rate(1 hour)';
     memory: '1024MB';
     timeout: '5 minutes';
   }
   
   type ProcessorFunction = {
     trigger: 'SQS';
     batchSize: 10;
   }
   
   type APIFunction = {
     trigger: 'API Gateway';
     timeout: '30 seconds';
   }
   ```

3. **DynamoDB Tables**
   - Jobs table
   - Users table
   - Subscriptions table
   - Analytics table

4. **SQS Queues**
   - Scraping queue
   - Processing queue
   - Notification queue

5. **EventBridge**
   - Scheduling scraper runs
   - Subscription management
   - Analytics collection

## Implementation Steps

### 1. Core Scraper Development (2 hours)

#### Step 1: Setup Project
```bash
# Initialize project
mkdir linkedin-scraper
cd linkedin-scraper
npm init -y

# Install dependencies
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb puppeteer-core chrome-aws-lambda axios cheerio
```

#### Step 2: Implement Scraper
```typescript
// src/services/scraper.ts
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export class LinkedInScraper {
  async initialize() {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: true
    });
    return browser;
  }

  async scrapeJob(url: string): Promise<JobPosting> {
    const browser = await this.initialize();
    // Implementation of scraping logic
  }
}
```

### 2. Data Processing Pipeline (2 hours)

#### Step 1: Data Processor
```typescript
// src/services/processor.ts
export class JobDataProcessor {
  async processJobData(rawData: any): Promise<JobPosting> {
    // Implementation of data processing
  }

  async enrichJobData(jobData: JobPosting): Promise<JobPosting> {
    // Implementation of data enrichment
  }
}
```

#### Step 2: DynamoDB Integration
```typescript
// src/services/storage.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

export class StorageService {
  private docClient: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(client);
  }

  async saveJob(job: JobPosting): Promise<void> {
    // Implementation of storage logic
  }
}
```

### 3. API Development (1 hour)

#### Step 1: API Routes
```typescript
// src/api/routes.ts
export const routes = {
  jobs: {
    search: '/api/jobs/search',
    track: '/api/jobs/track',
    untrack: '/api/jobs/untrack'
  },
  subscriptions: {
    create: '/api/subscriptions/create',
    update: '/api/subscriptions/update',
    cancel: '/api/subscriptions/cancel'
  }
};
```

#### Step 2: Lambda Functions
```typescript
// src/functions/api/searchJobs.ts
export async function handler(event: APIGatewayProxyEvent) {
  // Implementation of search logic
}
```

### 4. Subscription Management (1 hour)

#### Step 1: Subscription Service
```typescript
// src/services/subscription.ts
export class SubscriptionService {
  async createSubscription(userId: string, tier: SubscriptionTier): Promise<void> {
    // Implementation of subscription creation
  }

  async checkUsage(userId: string): Promise<boolean> {
    // Implementation of usage checking
  }
}
```

### 5. Frontend Development (2 hours)

#### Step 1: Dashboard Components
```typescript
// src/components/JobsTable.tsx
export function JobsTable() {
  // Implementation of jobs table
}

// src/components/SearchForm.tsx
export function SearchForm() {
  // Implementation of search form
}
```

## Deployment Steps

### 1. Infrastructure Setup
```yaml
# serverless.yml
service: linkedin-job-scraper

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1

functions:
  scraper:
    handler: src/functions/scraper.handler
    events:
      - schedule: rate(1 hour)

  processor:
    handler: src/functions/processor.handler
    events:
      - sqs:
          arn: !GetAtt ScrapingQueue.Arn

  api:
    handler: src/functions/api.handler
    events:
      - http:
          path: /api/{proxy+}
          method: ANY
```

### 2. Database Setup
```typescript
// scripts/setupDynamoDB.ts
async function createTables() {
  // Implementation of table creation
}
```

### 3. Monitoring Setup
```typescript
// src/monitoring/setup.ts
export function setupMonitoring() {
  // Implementation of monitoring setup
}
```

## Unique Features

1. **AI-Powered Skill Mapping**
   ```typescript
   // src/services/skillMapping.ts
   export class SkillMappingService {
     async mapSkillsToLearningResources(skills: string[]): Promise<Resource[]> {
       // Implementation of skill mapping
     }
   }
   ```

2. **Salary Insights**
   ```typescript
   // src/services/salaryAnalytics.ts
   export class SalaryAnalyticsService {
     async generateSalaryReport(jobData: JobPosting[]): Promise<SalaryReport> {
       // Implementation of salary analysis
     }
   }
   ```

3. **Career Path Suggestions**
   ```typescript
   // src/services/careerPath.ts
   export class CareerPathService {
     async suggestCareerPath(currentSkills: string[]): Promise<CareerPath[]> {
       // Implementation of career path suggestions
     }
   }
   ```

## Pricing Implementation
```typescript
// src/services/pricing.ts
export const pricingTiers = {
  free: {
    price: 0,
    jobLimit: 5,
    features: ['Basic search', 'Job tracking', 'Email alerts']
  },
  basic: {
    price: 9.99,
    period: 'yearly',
    jobLimit: 50,
    features: ['Advanced search', 'Skill analysis', 'Salary insights']
  },
  premium: {
    price: 99.99,
    period: 'lifetime',
    jobLimit: Infinity,
    features: ['All features', 'API access', 'Custom reports']
  }
};
```

Would you like me to:
1. Expand on any specific component?
2. Add more implementation details?
3. Create detailed API documentation?
4. Add testing strategies?