// JavaScript Integration Example
const CHATBOT_API_KEY = 'your_api_key';
const CHATBOT_URL = 'https://api.chatbot.com/v1';

// Basic Chat Integration
class ChatbotClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = CHATBOT_URL;
  }

  async sendMessage(message, sessionId = null) {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId,
      }),
    });

    return response.json();
  }

  // Initialize WebSocket connection for real-time chat
  initializeWebSocket(sessionId) {
    const ws = new WebSocket(`${this.baseUrl}/ws/${sessionId}`);
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };

    return ws;
  }
}

// React Component Integration
const ChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatbot = new ChatbotClient(CHATBOT_API_KEY);

  const sendMessage = async (text) => {
    setMessages(prev => [...prev, { type: 'user', text }]);
    setIsTyping(true);

    try {
      const response = await chatbot.sendMessage(text);
      setMessages(prev => [...prev, { type: 'bot', text: response.message }]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-widget">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">Bot is typing...</div>}
      </div>
      <MessageInput onSend={sendMessage} />
    </div>
  );
};

// HTML Integration
const htmlIntegration = `
<!DOCTYPE html>
<html>
<head>
  <title>Chatbot Integration</title>
  <script src="https://cdn.chatbot.com/widget.js"></script>
</head>
<body>
  <script>
    ChatbotWidget.init({
      apiKey: 'your_api_key',
      position: 'bottom-right',
      theme: 'light',
      welcomeMessage: 'How can I help you today?',
      height: 500,
      width: 350
    });
  </script>
</body>
</html>
`;

// Mobile (React Native) Integration
const MobileChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const chatbot = new ChatbotClient(CHATBOT_API_KEY);

  const sendMessage = async (text) => {
    // Add message to state
    const newMessage = {
      _id: Math.round(Math.random() * 1000000),
      text,
      createdAt: new Date(),
      user: {
        _id: 1,
      },
    };

    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, [newMessage])
    );

    try {
      const response = await chatbot.sendMessage(text);
      
      const botMessage = {
        _id: Math.round(Math.random() * 1000000),
        text: response.message,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Chatbot',
          avatar: 'https://placeimg.com/140/140/tech',
        },
      };

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [botMessage])
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => sendMessage(messages[0].text)}
      user={{
        _id: 1,
      }}
    />
  );
};

// Node.js Backend Integration
const express = require('express');
const app = express();

const chatbot = new ChatbotClient(process.env.CHATBOT_API_KEY);

app.post('/webhook', express.json(), async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const response = await chatbot.sendMessage(message, sessionId);
    res.json(response);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Python Backend Integration
import requests
import asyncio
import websockets

class ChatbotClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.chatbot.com/v1"

    async def send_message(self, message, session_id=None):
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "message": message,
            "sessionId": session_id
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/chat",
                headers=headers,
                json=data
            ) as response:
                return await response.json()

    async def websocket_handler(self, websocket, path):
        async for message in websocket:
            response = await self.send_message(message)
            await websocket.send(json.dumps(response))

# Example usage in FastAPI
from fastapi import FastAPI, WebSocket

app = FastAPI()
chatbot = ChatbotClient("your_api_key")

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            response = await chatbot.send_message(data, client_id)
            await websocket.send_json(response)
    except Exception as e:
        print(f"Error: {e}")
