# 🏥 HEALTHAXIS - AI-Powered Community Health Ecosystem

**Offline-first healthcare platform for rural India with multilingual support**

## 🎯 Vision

HEALTHAXIS is an **offline-first, AI-powered community health ecosystem** designed for rural India. The platform empowers patients with low digital literacy and doctors in semi-connected areas through **Adaptive Connectivity** — fully functional offline, syncing intelligently when internet is available.

## 🌍 Language Support

- **English** 🇬🇧
- **हिंदी (Hindi)** 🇮🇳  
- **தமிழ் (Tamil)** 🇮🇳
- **తెలుగు (Telugu)** 🇮🇳

## 🏗️ Architecture

```
project/
├── frontend/          # React + Vite + Tailwind + Framer Motion
├── backend/           # FastAPI + SQLAlchemy + PostgreSQL
├── docs/              # Documentation and design assets
└── README.md          # This file
```

## 🔧 Core Modules

1. **Patient Registration** - Assisted onboarding via OTP & demographics
2. **Consultation & Handover** - Voice-to-prescription with QR sync
3. **Patient Daily Usage** - Medicine tracking & Health Points
4. **Secure Record Access** - Digital Safe with encrypted storage
5. **Follow-up & Data Sync** - Tele-consultations with Google Meet

## ✨ Key Features

### Patient Frontend
- 🎨 Glassmorphism UI with glowing effects
- 🗣️ Voice assistance and large button accessibility
- 💊 Medicine tracker with photo recognition
- 🔒 Digital Safe for encrypted health records
- 🎮 Gamification through Health Points
- 📱 Offline-first with smart sync

### Doctor/Clinic Features
- 🎤 AI voice-to-prescription conversion
- 📊 Patient adherence dashboard
- 📅 Appointment scheduling with Google Meet
- 📈 Health analytics and outbreak prediction

### Security & Privacy
- 🔐 End-to-end encryption for all health records
- 🔑 Single-use QR Access Keys for record unlocking
- 👥 Role-based access control
- 🛡️ HIPAA-compliant data handling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+ and pip
- Git

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 12001 --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:12000
- **Backend API**: http://localhost:12001
- **API Documentation**: http://localhost:12001/docs

## ✅ Current Status

🟢 **FULLY FUNCTIONAL** - Complete healthcare platform with:
- ✅ 6 Patient screens (Home, Medicines, Records, Appointments, Points, Settings)
- ✅ FastAPI backend with 15+ working endpoints
- ✅ Frontend-backend integration with real data
- ✅ Multilingual support (English, Hindi, Tamil, Telugu)
- ✅ Glassmorphism UI with animations
- ✅ Mobile-responsive design
- ✅ Offline-first architecture foundation

📊 **See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for detailed progress report.**

## 🎨 UI Design Principles

- **Glassmorphism** - Translucent cards with backdrop blur
- **Vibrant Gradients** - Health-themed color schemes
- **Large Touch Targets** - Accessibility for low digital literacy
- **Icon-Driven Navigation** - Universal symbols with text labels
- **Responsive Design** - Mobile-first approach

## 🔄 Offline-First Strategy

- **Local Storage** - IndexedDB for patient data
- **Smart Sync** - Conflict resolution with timestamps
- **Priority System** - Clinic > Cloud > Patient data precedence
- **Background Sync** - Automatic when connectivity restored

## 🏥 Healthcare Workflow

1. **Registration** → Patient onboarding with basic demographics
2. **Consultation** → Doctor records voice → AI generates prescription
3. **Handover** → QR code transfers encrypted prescription to patient
4. **Daily Use** → Medicine reminders, adherence tracking, points
5. **Follow-up** → Symptom logging, vitals sync, tele-consultations

## 📱 Patient App Screens

1. **Home Dashboard** - Quick access to all features
2. **My Medicines** - Morning/Afternoon/Night medicine tracker
3. **My Records** - Encrypted consultation history
4. **Appointments** - Upcoming visits with Google Meet links
5. **Health Points** - Gamification and health achievements
6. **Settings** - Language, notifications, sync preferences

## 🔧 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **react-i18next** for multilingual support
- **IndexedDB** for offline storage

### Backend
- **FastAPI** with Python
- **SQLAlchemy** ORM
- **PostgreSQL** database
- **JWT** authentication
- **Google Calendar API** for Meet integration
- **OpenAI API** for voice transcription

### DevOps
- **Docker** containerization
- **GitHub Actions** CI/CD
- **Vercel/Netlify** frontend deployment
- **Railway/Heroku** backend deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Rural healthcare workers and patients who inspired this project
- Open source community for amazing tools and libraries
- Healthcare professionals providing domain expertise

---

**HEALTHAXIS - Built with ❤️ for rural India's healthcare transformation**