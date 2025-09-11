# Real-Time Chat Application 💬

A modern, secure chat application built with MERN stack featuring real-time messaging, encryption, and AI integration.

## 🚀 Features
- ⚡ Real-time messaging with Socket.io
- 🔐 End-to-end encryption (bcryptjs)
- 👥 Friend management system
- 🤖 AI chatbot integration
- 📱 Responsive design
- 🔒 JWT authentication
- 📷 Media sharing capabilities

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Real-time** | Socket.io |
| **Security** | JWT, BcryptJS encryption |
| **AI** | Gemini |

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** (v14.0 or higher)
- **npm** (v6.0 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

### 1. Clone and setup
```git clone https://github.com/aishanaaz19/realtime-chat-app.git```

```cd realtime-chat-app```

### 2. Setup backend
```cd backend && npm i && npm run dev```

### 3. Setup frontend (new terminal)
```cd frontend && npm i && npm run dev```

### 4.Configure your .env file in the backend directory:

```#### Database Configuration
MONGODB_URI=mongodb://localhost:27017/chatapp
#### OR for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp

#### JWT Secret Key
JWT_SECRET=your_super_secret_jwt_key_here

#### Server Configuration
PORT=5000
NODE_ENV=development

#### Socket.io Configuration (optional)
CORS_ORIGIN=http://localhost:3000

#### Additional API Keys (if using AI features)
AI_API_KEY=your_ai_service_api_key```

## 🚀 Live Demo

https://mychatapp-4zpq.onrender.com

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Built collaboratively by an amazing team

⭐ **Star this repo if you found it helpful!** ⭐
