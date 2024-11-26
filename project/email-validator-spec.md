# Contact List Validation SaaS - Project Specification

## Data Schema

### Email Validation Schema
```typescript
interface EmailValidation {
  id: string;                    // Unique identifier
  email: string;                 // Original email address
  validation_results: {
    is_valid: boolean;           // Overall validity
    checks: {
      syntax: boolean;           // Basic syntax check
      mx_record: boolean;        // MX record exists
      smtp_check: boolean;       // SMTP verification
      disposable: boolean;       // Disposable email check
      role_account: boolean;     // Role account check (info@, support@)
      free_provider: boolean;    // Free email provider check
    };
    suggestions: {
      domain_corrections: string[];  // Example: gmial.com -> gmail.com
      spelling_corrections: string[];// Example: jhon@domain.com -> john@domain.com
      common_corrections: string[];  // Other common corrections
    };
    metadata: {
      provider: string;          // Email provider name
      domain_created: Date;      // Domain creation date
      first_seen: Date;          // First time email was checked
      last_seen: Date;          // Last time email was checked
      confidence_score: number;  // 0-100 confidence score
    };
  };
  processing: {
    timestamp: Date;            // When validation was performed
    duration_ms: number;        // How long validation took
    source: string;            // API, bulk upload, etc.
  };
}

interface ContactList {
  id: string;
  name: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  stats: {
    total_contacts: number;
    valid_emails: number;
    invalid_emails: number;
    fixed_emails: number;
    pending_validation: number;
  };
  contacts: Array<{
    email: string;
    validation_id: string;
    status: 'valid' | 'invalid' | 'pending' | 'fixed';
    original_email?: string;    // If email was fixed
  }>;
}

interface UserProfile {
  id: string;
  email: string;
  subscription: {
    tier: 'free' | 'basic' | 'premium';
    monthly_limit: number;
    used_this_month: number;
    reset_date: Date;
    features: string[];
  };
  api_keys: Array<{
    key: string;
    created_at: Date;
    last_used: Date;
    calls_count: number;
  }>;
  settings: {
    validation_strictness: 'strict' | 'moderate' | 'lenient';
    auto_fix: boolean;
    notification_email: string;
    webhook_url?: string;
  };
}
```

## System Architecture

### AWS Serverless Components

```typescript
// Core service types
interface EmailValidatorService {
  validateEmail(email: string): Promise<EmailValidation>;
  suggestCorrections(email: string): Promise<string[]>;
  bulkValidate(emails: string[]): Promise<EmailValidation[]>;
}

interface StorageService {
  saveValidation(validation: EmailValidation): Promise<void>;
  updateContactList(list: ContactList): Promise<void>;
  getUserUsage(userId: string): Promise<number>;
}

interface NotificationService {
  sendValidationComplete(userId: string, results: ValidationResult): Promise<void>;
  sendLimitWarning(userId: string, usage: number): Promise<void>;
}
```

### Infrastructure Components
1. **API Gateway & Lambda Functions**
```yaml
# serverless.yml
service: email-validator

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1

functions:
  validateEmail:
    handler: src/functions/validateEmail.handler
    events:
      - http:
          path: /validate/email
          method: post
          cors: true

  bulkValidate:
    handler: src/functions/bulkValidate.handler
    events:
      - http:
          path: /validate/bulk
          method: post
          cors: true
          
  processQueue:
    handler: src/functions/processQueue.handler
    events:
      - sqs:
          arn: !GetAtt ValidationQueue.Arn
          batchSize: 10

resources:
  Resources:
    ValidationQueue:
      Type: AWS::SQS::Queue
      Properties:
        QueueName: ${self:service}-validation-queue
        
    ValidationTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:service}-validations
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
          - AttributeName: email
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        GlobalSecondaryIndexes:
          - IndexName: email-index
            KeySchema:
              - AttributeName: email
                KeyType: HASH
            Projection:
              ProjectionType: ALL
```

## Implementation Steps

### 1. Core Validation Service (2 hours)

#### Step 1: Email Validation Implementation
```typescript
// src/services/emailValidator.ts
export class EmailValidator {
  private async checkSyntax(email: string): Promise<boolean> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async checkMXRecord(domain: string): Promise<boolean> {
    // Implementation of MX record check
  }

  private async checkSMTP(email: string): Promise<boolean> {
    // Implementation of SMTP verification
  }

  private async checkDisposable(domain: string): Promise<boolean> {
    // Implementation of disposable email check
  }

  async validateEmail(email: string): Promise<EmailValidation> {
    // Implementation of full validation logic
  }

  async suggestCorrections(email: string): Promise<string[]> {
    // Implementation of correction suggestions
  }
}
```

#### Step 2: Spell Checking Service
```typescript
// src/services/spellChecker.ts
export class EmailSpellChecker {
  private readonly commonDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com'
  ];

  async findSimilarDomain(domain: string): Promise<string[]> {
    // Implementation of domain similarity check
  }

  async checkLocalPart(localPart: string): Promise<string[]> {
    // Implementation of local part spell checking
  }

  async getSuggestions(email: string): Promise<string[]> {
    // Implementation of full suggestion logic
  }
}
```

### 2. Frontend Development (2 hours)

#### Step 1: Pricing Calculator Component
```typescript
// src/components/PricingCalculator.tsx
export function PricingCalculator() {
  const [emailVolume, setEmailVolume] = useState(1000);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'basic' | 'premium'>('free');

  const calculateRecommendedPlan = (volume: number) => {
    if (volume <= 1000) return 'free';
    if (volume <= 10000) return 'basic';
    return 'premium';
  };

  return (
    <div className="pricing-calculator">
      <input
        type="range"
        min="100"
        max="100000"
        value={emailVolume}
        onChange={(e) => setEmailVolume(parseInt(e.target.value))}
      />
      <div className="plan-recommendation">
        {/* Implementation of plan recommendation UI */}
      </div>
    </div>
  );
}
```

#### Step 2: Admin Dashboard
```typescript
// src/components/AdminDashboard.tsx
export function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <ValidationStats />
      <UserManagement />
      <SystemHealth />
      <RevenueReports />
    </div>
  );
}

// src/components/ValidationStats.tsx
export function ValidationStats() {
  const [stats, setStats] = useState<ValidationStats>();

  useEffect(() => {
    // Implementation of stats fetching
  }, []);

  return (
    <div className="stats-grid">
      {/* Implementation of stats display */}
    </div>
  );
}
```

### 3. API Implementation (1 hour)

```typescript
// src/functions/validateEmail.ts
export async function handler(event: APIGatewayProxyEvent) {
  const { email } = JSON.parse(event.body || '{}');
  
  try {
    const validator = new EmailValidator();
    const result = await validator.validateEmail(email);
    
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Validation failed' })
    };
  }
}

// src/functions/bulkValidate.ts
export async function handler(event: APIGatewayProxyEvent) {
  const { emails } = JSON.parse(event.body || '{}');
  
  // Implementation of bulk validation handler
}
```

### 4. Pricing Implementation (1 hour)

```typescript
// src/services/pricing.ts
export const pricingTiers = {
  free: {
    price: 0,
    monthlyLimit: 1000,
    features: [
      'Basic email validation',
      'Syntax checking',
      'Domain verification',
      'Basic suggestions'
    ]
  },
  basic: {
    price: 9.99,
    period: 'yearly',
    monthlyLimit: 10000,
    features: [
      'Advanced validation',
      'SMTP verification',
      'Disposable email detection',
      'API access'
    ]
  },
  premium: {
    price: 99.99,
    period: 'yearly',
    monthlyLimit: 100000,
    features: [
      'Enterprise validation',
      'Bulk processing',
      'Custom integration',
      'Priority support'
    ]
  }
};

export function calculateUsage(validations: number): PricingTier {
  // Implementation of usage calculation
}
```

### 5. Monitoring and Analytics (1 hour)

```typescript
// src/services/analytics.ts
export class AnalyticsService {
  async trackValidation(validation: EmailValidation): Promise<void> {
    // Implementation of validation tracking
  }

  async generateUserReport(userId: string): Promise<UserReport> {
    // Implementation of user report generation
  }

  async generateSystemReport(): Promise<SystemReport> {
    // Implementation of system report generation
  }
}
```

## Unique Features

1. **AI-Powered Name Correction**
```typescript
// src/services/nameSuggestion.ts
export class NameSuggestionService {
  async suggestNameCorrections(name: string): Promise<string[]> {
    // Implementation of AI-based name correction
  }
}
```

2. **Domain Intelligence**
```typescript
// src/services/domainIntelligence.ts
export class DomainIntelligenceService {
  async getDomainReputation(domain: string): Promise<DomainReport> {
    // Implementation of domain reputation checking
  }
}
```

3. **Smart Batch Processing**
```typescript
// src/services/batchProcessor.ts
export class BatchProcessor {
  async processBatch(emails: string[]): Promise<BatchReport> {
    // Implementation of smart batch processing
  }
}
```

Would you like me to:
1. Add more implementation details for any component?
2. Create detailed API documentation?
3. Add testing strategies?
4. Expand on the admin dashboard features?