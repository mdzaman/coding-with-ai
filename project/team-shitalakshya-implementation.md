# Team Shitalakshya: Virtual Event Platform
**Project Duration:** 7 hours (10:30 AM - 5:30 PM)

## Project Overview
Building a comprehensive virtual event platform that provides:
- Live video streaming and webinars
- Interactive networking rooms
- AI-powered attendee matching
- Virtual exhibition halls
- Real-time engagement tools
- Analytics and reporting
- Multiple event formats support
- Networking breakout rooms

## Schedule Breakdown

### Phase 1: Environment Setup (10:30 AM - 11:30 AM)

#### Windows Setup
```bash
# 1. Install Core Tools
- Download Node.js LTS from nodejs.org
- Install Git from git-scm.com
- Install VS Code from code.visualstudio.com
- Install Redis from redis.io

# 2. Install WebRTC Tools
npm install mediasoup mediasoup-client socket.io

# 3. Install AI Libraries
npm install @tensorflow/tfjs openai
```

#### Mac Setup
```bash
# 1. Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install Required Tools
brew install node git redis

# 3. Install Dependencies
npm install mediasoup mediasoup-client socket.io
npm install @tensorflow/tfjs openai
```

### Phase 2: Core Components Development (11:30 AM - 4:30 PM)

#### 1. Video Streaming System (11:30 AM - 1:00 PM)
```typescript
// streaming/VideoRoom.ts
import * as mediasoup from 'mediasoup';
import { Socket } from 'socket.io';

interface Room {
  id: string;
  router: mediasoup.Router;
  peers: Map<string, Peer>;
}

class VideoRoom {
  private workers: mediasoup.Worker[] = [];
  private rooms: Map<string, Room> = new Map();
  
  async createRoom(roomId: string): Promise<Room> {
    const worker = await this.getWorker();
    
    const router = await worker.createRouter({
      mediaCodecs: [
        {
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
          parameters: {
            'x-google-start-bitrate': 1000
          }
        },
        {
          kind: 'audio',
          mimeType: 'audio/opus',
          clockRate: 48000,
          channels: 2
        }
      ]
    });
    
    const room: Room = {
      id: roomId,
      router,
      peers: new Map()
    };
    
    this.rooms.set(roomId, room);
    return room;
  }
  
  async handleConnection(socket: Socket, roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error('Room not found');
    
    // Create transport for sending media
    const transport = await room.router.createWebRtcTransport({
      listenIps: [{ ip: '0.0.0.0', announcedIp: null }],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true
    });
    
    socket.on('disconnect', () => {
      this.handleDisconnection(socket.id, roomId);
    });
    
    return transport;
  }
}
```

#### 2. Networking Module (1:00 PM - 2:30 PM)
```typescript
// networking/MatchingEngine.ts
interface Attendee {
  id: string;
  interests: string[];
  role: string;
  connections: string[];
}

class NetworkingEngine {
  private attendees: Map<string, Attendee> = new Map();
  
  async findMatches(attendeeId: string): Promise<Attendee[]> {
    const attendee = this.attendees.get(attendeeId);
    if (!attendee) return [];
    
    const matches = [...this.attendees.values()]
      .filter(other => other.id !== attendeeId)
      .map(other => ({
        attendee: other,
        score: this.calculateMatchScore(attendee, other)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    return matches.map(m => m.attendee);
  }
  
  private calculateMatchScore(a: Attendee, b: Attendee): number {
    const interestOverlap = a.interests.filter(i => 
      b.interests.includes(i)
    ).length;
    
    const roleMatch = a.role === b.role ? 0 : 1;
    const connectionScore = this.getConnectionScore(a, b);
    
    return (interestOverlap * 0.6) + (roleMatch * 0.2) + (connectionScore * 0.2);
  }
}
```

#### 3. Virtual Exhibition Hall (2:30 PM - 3:30 PM)
```typescript
// exhibition/ExhibitionHall.ts
interface Booth {
  id: string;
  company: string;
  content: {
    videos: string[];
    documents: string[];
    presentations: string[];
  };
  representatives: string[];
  visitors: Set<string>;
}

class ExhibitionHall {
  private booths: Map<string, Booth> = new Map();
  
  async createBooth(boothData: Omit<Booth, 'visitors'>): Promise<Booth> {
    const booth = {
      ...boothData,
      visitors: new Set()
    };
    
    this.booths.set(booth.id, booth);
    return booth;
  }
  
  async handleVisitor(visitorId: string, boothId: string) {
    const booth = this.booths.get(boothId);
    if (!booth) throw new Error('Booth not found');
    
    booth.visitors.add(visitorId);
    
    // Track analytics
    await this.trackVisit(visitorId, boothId);
    
    // Check for representative availability
    await this.checkRepresentativeAvailability(booth, visitorId);
  }
}
```

#### 4. Engagement Tools (3:30 PM - 4:30 PM)
```typescript
// engagement/InteractionTools.ts
interface Poll {
  id: string;
  question: string;
  options: string[];
  responses: Map<string, string>;
}

class EngagementManager {
  private polls: Map<string, Poll> = new Map();
  private qaMessages: Message[] = [];
  
  async createPoll(pollData: Omit<Poll, 'responses'>): Promise<Poll> {
    const poll = {
      ...pollData,
      responses: new Map()
    };
    
    this.polls.set(poll.id, poll);
    return poll;
  }
  
  async submitQuestion(question: string, userId: string): Promise<Message> {
    const message: Message = {
      id: generateId(),
      userId,
      content: question,
      timestamp: new Date(),
      status: 'pending'
    };
    
    this.qaMessages.push(message);
    
    // Notify moderators
    await this.notifyModerators(message);
    
    return message;
  }
  
  async handleReaction(
    userId: string,
    contentId: string,
    reactionType: string
  ) {
    // Track reaction
    await this.trackReaction(userId, contentId, reactionType);
    
    // Update engagement metrics
    await this.updateEngagementScore(contentId);
  }
}
```

### Phase 3: Integration and Testing (4:30 PM - 5:30 PM)

#### Database Schema
```sql
-- Events
CREATE TABLE events (
    id UUID PRIMARY KEY,
    name TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    type TEXT,
    settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendees
CREATE TABLE attendees (
    id UUID PRIMARY KEY,
    event_id UUID REFERENCES events(id),
    user_id UUID,
    role TEXT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interactions
CREATE TABLE interactions (
    id UUID PRIMARY KEY,
    event_id UUID REFERENCES events(id),
    user_id UUID,
    type TEXT,
    content JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### API Definitions
```yaml
openapi: 3.0.0
info:
  title: Virtual Event Platform API
  version: 1.0.0
paths:
  /events/{eventId}/join:
    post:
      summary: Join virtual event
      parameters:
        - name: eventId
          in: path
          required: true
          schema:
            type: string
  /networking/matches:
    get:
      summary: Get networking matches
      parameters:
        - name: userId
          in: query
          required: true
          schema:
            type: string
```

## Testing Strategy
```typescript
// tests/video-room.test.ts
describe('Video Room', () => {
  it('handles peer connections correctly', async () => {
    const room = new VideoRoom();
    const roomId = await room.createRoom('test-room');
    
    // Simulate peer connection
    const peer = await room.handleConnection(mockSocket, roomId);
    
    expect(peer).toBeDefined();
    expect(peer.transport).toBeDefined();
  });
});
```

## Security Measures
```typescript
// security/RoomSecurity.ts
class RoomSecurity {
  async validateAccess(userId: string, roomId: string): Promise<boolean> {
    // Implement access validation
    return true;
  }
  
  async enforceRoomPolicies(roomId: string) {
    // Implement room policies
  }
}
```

Remember:
- WebRTC connection monitoring
- Network quality checks
- Engagement tracking
- Access control
- Performance optimization
