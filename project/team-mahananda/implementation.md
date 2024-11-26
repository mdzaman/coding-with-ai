# Team Mahananda: AI-Powered Recruitment Platform
**Project Duration:** 7 hours (10:30 AM - 5:30 PM)

## Project Overview
Building a comprehensive recruitment platform that:
- Screens resumes using AI
- Matches candidates to job requirements
- Automates interview scheduling
- Provides skill assessments
- Manages recruitment pipeline
- Generates AI-powered interview questions
- Tracks hiring metrics and analytics
- Ensures compliance and bias prevention

## Schedule Breakdown

### Phase 1: Environment Setup (10:30 AM - 11:30 AM)

#### Windows Setup
```bash
# 1. Install Core Tools
- Download Python 3.11 from python.org
- Install Node.js LTS from nodejs.org
- Install Git from git-scm.com
- Install VS Code from code.visualstudio.com

# 2. Install AI Libraries
pip install -r requirements.txt
# requirements.txt contains:
# - transformers
# - torch
# - spacy
# - scikit-learn
# - pandas
# - numpy

# 3. Install Database Tools
- Install PostgreSQL from postgresql.org
- Install Redis from redis.io
```

#### Mac Setup
```bash
# 1. Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install Required Tools
brew install python@3.11 node git postgresql redis

# 3. Install Project Dependencies
pip3 install -r requirements.txt
npm install
```

### Phase 2: Core Components Development (11:30 AM - 4:30 PM)

#### 1. Resume Parser and Matcher (11:30 AM - 1:00 PM)
```python
# resume/parser.py
from transformers import DistilBertTokenizer, DistilBertModel
import spacy
import torch

class ResumeParser:
    def __init__(self):
        self.tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
        self.model = DistilBertModel.from_pretrained('distilbert-base-uncased')
        self.nlp = spacy.load('en_core_web_sm')
        
    def parse_resume(self, resume_text: str) -> dict:
        doc = self.nlp(resume_text)
        
        # Extract key information
        return {
            'skills': self.extract_skills(doc),
            'experience': self.extract_experience(doc),
            'education': self.extract_education(doc),
            'contact': self.extract_contact_info(doc)
        }
    
    def match_job(self, resume_data: dict, job_requirements: dict) -> float:
        # Calculate matching score
        required_skills = set(job_requirements['required_skills'])
        candidate_skills = set(resume_data['skills'])
        
        score = len(required_skills.intersection(candidate_skills)) / len(required_skills)
        
        return {
            'match_score': score,
            'missing_skills': list(required_skills - candidate_skills),
            'additional_skills': list(candidate_skills - required_skills)
        }
```

#### 2. Interview Scheduler (1:00 PM - 2:30 PM)
```typescript
// scheduler/InterviewManager.ts
interface Interview {
  candidateId: string;
  interviewerId: string;
  jobId: string;
  scheduledTime: Date;
  duration: number;
  type: 'video' | 'phone' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled';
}

class InterviewScheduler {
  private calendar: Calendar;
  
  async scheduleInterview(
    candidateId: string,
    jobId: string
  ): Promise<Interview> {
    // Get available interviewers
    const interviewers = await this.findAvailableInterviewers(jobId);
    
    // Find optimal time slots
    const timeSlots = await this.findAvailableTimeSlots(
      interviewers,
      candidateId
    );
    
    // Schedule interview
    const interview = await this.createInterview({
      candidateId,
      interviewerId: interviewers[0].id,
      jobId,
      scheduledTime: timeSlots[0],
      duration: 60,
      type: 'video',
      status: 'scheduled'
    });
    
    // Send notifications
    await this.sendNotifications(interview);
    
    return interview;
  }
  
  private async findAvailableTimeSlots(
    interviewers: any[],
    candidateId: string
  ): Promise<Date[]> {
    // Implement time slot finding logic
    return [];
  }
}
```

#### 3. Assessment Engine (2:30 PM - 3:30 PM)
```typescript
// assessment/SkillAssessment.ts
interface Assessment {
  skillId: string;
  questions: Question[];
  duration: number;
  passingScore: number;
}

class AssessmentEngine {
  async generateAssessment(jobId: string): Promise<Assessment> {
    // Get job requirements
    const requirements = await this.getJobRequirements(jobId);
    
    // Generate questions based on requirements
    const questions = await this.generateQuestions(requirements);
    
    return {
      skillId: requirements.primarySkill,
      questions,
      duration: this.calculateDuration(questions),
      passingScore: 0.7
    };
  }
  
  async evaluateSubmission(
    candidateId: string,
    assessment: Assessment,
    answers: any[]
  ): Promise<number> {
    let score = 0;
    
    // Evaluate each answer
    for (let i = 0; i < answers.length; i++) {
      score += await this.evaluateAnswer(
        assessment.questions[i],
        answers[i]
      );
    }
    
    return score / answers.length;
  }
}
```

#### 4. Analytics Dashboard (3:30 PM - 4:30 PM)
```typescript
// analytics/RecruitmentAnalytics.tsx
import React from 'react';
import { LineChart, XAxis, YAxis, Tooltip, Line } from 'recharts';

const RecruitmentDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    timeToHire: [],
    sourceEffectiveness: {},
    stageConversion: [],
    diversity: {}
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h2>Time to Hire</h2>
        <LineChart
          width={500}
          height={300}
          data={metrics.timeToHire}
        >
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="days" />
        </LineChart>
      </div>
      
      <div>
        <h2>Pipeline Conversion</h2>
        <FunnelChart data={metrics.stageConversion} />
      </div>
    </div>
  );
};
```

### Phase 3: Integration and Testing (4:30 PM - 5:30 PM)

#### Database Schema
```sql
-- Candidates
CREATE TABLE candidates (
    id UUID PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    resume_url TEXT,
    parsed_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs
CREATE TABLE jobs (
    id UUID PRIMARY KEY,
    title TEXT,
    department TEXT,
    requirements JSONB,
    status TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications
CREATE TABLE applications (
    id UUID PRIMARY KEY,
    candidate_id UUID REFERENCES candidates(id),
    job_id UUID REFERENCES jobs(id),
    status TEXT,
    stage TEXT,
    match_score FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### API Definitions
```yaml
openapi: 3.0.0
info:
  title: Recruitment Platform API
  version: 1.0.0
paths:
  /candidates:
    post:
      summary: Create new candidate
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                resume:
                  type: string
                  format: binary
  /jobs/{jobId}/applications:
    post:
      summary: Submit job application
      parameters:
        - name: jobId
          in: path
          required: true
          schema:
            type: string
```

## Security Measures
```typescript
// security/DataProtection.ts
class DataProtection {
  async anonymizeData(candidateData: any): Promise<any> {
    // Remove PII
    const anonymized = {...candidateData};
    delete anonymized.email;
    delete anonymized.phone;
    delete anonymized.address;
    
    return anonymized;
  }
  
  async encryptSensitiveData(data: any): Promise<any> {
    // Implement encryption
    return encryptedData;
  }
}
```

## Testing Strategy
```typescript
// tests/resume-parser.test.ts
describe('Resume Parser', () => {
  it('extracts skills accurately', async () => {
    const parser = new ResumeParser();
    const result = await parser.parse_resume(sampleResume);
    
    expect(result.skills).toContain('javascript');
    expect(result.experience).toHaveLength(2);
  });
});
```

Remember:
- GDPR compliance
- Regular bias testing
- Data privacy checks
- Performance monitoring
- Accessibility standards
