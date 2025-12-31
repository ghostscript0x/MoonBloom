# 🌙 Moon Bloom Tracker

> **AI-Powered Menstrual Cycle Companion** - Track your cycles with intelligent insights, wellness features, and beautiful design.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)](https://web.dev/progressive-web-apps/)

<div align="center">
  <img src="public/og-image.png" alt="Moon Bloom Tracker" width="600"/>
</div>

## ✨ Features

### 🔮 AI-Powered Cycle Tracking
- **Smart Predictions**: Machine learning algorithms predict your cycle phases
- **Personalized Insights**: AI analyzes your patterns for health recommendations
- **Cycle Phase Detection**: Automatic follicular, ovulation, and luteal phase identification

### 📊 Comprehensive Health Tracking
- **Period Logging**: Track flow intensity, symptoms, and duration
- **Mood Tracking**: Monitor emotional patterns throughout your cycle
- **Symptom Journal**: Log cramps, headaches, energy levels, and more
- **Wellness Integration**: Exercise, sleep, nutrition, and goal tracking

### 🔒 Privacy & Security
- **End-to-End Encryption**: All data encrypted before storage
- **Local-First**: Data stored on your device by default
- **Optional Cloud Sync**: Secure backup with your permission
- **App Lock**: Biometric or PIN protection

### 🔔 Smart Notifications
- **Cycle Reminders**: Get notified about upcoming periods and fertile windows
- **Wellness Prompts**: Gentle reminders for logging and self-care
- **Native Notifications**: Real device notifications (not just in-app)

### 📱 Progressive Web App
- **Installable**: Add to home screen like a native app
- **Offline Support**: Works without internet connection
- **Cross-Platform**: Compatible with all modern browsers
- **Responsive Design**: Optimized for mobile and desktop

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/moon-bloom-tracker.git
   cd moon-bloom-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

5. **Install as PWA**
   - Open in your browser
   - Click "Add to Home Screen" or "Install App"

## 📖 Usage Guide

### Getting Started
1. **Create Account**: Sign up with email or continue anonymously
2. **Initial Setup**: Set your average cycle length and last period date
3. **Start Logging**: Add your first period entry

### Daily Tracking
- **Quick Log**: Use the floating action button for fast entries
- **Detailed Log**: Access full logging screen for comprehensive tracking
- **Calendar View**: Visualize your cycle patterns over time

### Settings & Customization
- **Cycle Length**: Adjust your average cycle length (21-45 days)
- **Notifications**: Enable/disable cycle reminders
- **App Lock**: Secure with biometric or PIN
- **Data Export**: Download your health data as JSON

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: React Query + Context API
- **Storage**: IndexedDB (local) + optional cloud sync
- **PWA**: Service Workers + Web App Manifest
- **Charts**: Recharts for data visualization

### Project Structure
```
moon-bloom-tracker/
├── public/                 # Static assets and PWA files
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Route components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and configurations
│   └── styles/            # Global styles
├── dist/                  # Production build output
└── docs/                  # Documentation
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Automated code formatting
- **Husky**: Pre-commit hooks for quality checks

### Contributing
We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📊 Data & Privacy

### What We Collect
- **Cycle Data**: Period dates, flow intensity, symptoms
- **Wellness Data**: Mood, exercise, sleep, nutrition logs
- **App Usage**: Settings preferences and feature usage

### Data Security
- **Encryption**: AES-256 encryption for stored data
- **Local Storage**: Data stays on your device by default
- **No Third-Party Sharing**: We never sell or share your data
- **Export Rights**: Download and delete your data anytime

### Privacy Compliance
- **GDPR Ready**: European privacy regulation compliant
- **CCPA Compliant**: California privacy law compliant
- **Transparent**: Full privacy policy available in-app

## 🌟 Features in Detail

### AI Insights Engine
Our AI analyzes your cycle patterns to provide:
- **Cycle Predictions**: Accurate next period and ovulation dates
- **Health Correlations**: Links between symptoms and cycle phases
- **Wellness Recommendations**: Personalized self-care suggestions

### Advanced Analytics
- **Trend Analysis**: Long-term pattern recognition
- **Symptom Correlation**: Understand symptom relationships
- **Health Metrics**: Energy, hydration, and wellness tracking
- **Export Capabilities**: JSON export for external analysis

### PWA Features
- **Offline Functionality**: Core features work offline
- **Push Notifications**: Native device notifications
- **Home Screen Installation**: App-like experience
- **Background Sync**: Automatic data synchronization

## 🐛 Troubleshooting

### Common Issues
- **Notifications not working**: Check browser permissions
- **App not syncing**: Verify internet connection
- **Data not saving**: Clear browser cache and reload

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Performance Tips
- Keep app updated to latest version
- Clear cache periodically
- Enable notifications for full experience

## 📞 Support

### Contact Options
- **Email**: ghostscript.dev@gmail.com
- **WhatsApp**: [+234 703 565 6882](https://wa.me/2347035656882)
- **Issues**: [GitHub Issues](https://github.com/yourusername/moon-bloom-tracker/issues)

### Community
- **Discussions**: Join conversations on GitHub
- **Contributing**: See our contribution guidelines
- **Documentation**: Full API docs available

## 📄 Legal

### Terms of Service
Please read our complete [Terms of Service](TERMS_OF_SERVICE.md) before using the app.

### Privacy Policy
Your privacy matters. Review our detailed [Privacy Policy](PRIVACY_POLICY.md).

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Icons**: Lucide React icon library
- **UI Components**: Shadcn/ui component library
- **Charts**: Recharts visualization library
- **PWA**: Vite PWA plugin

## 🎯 Roadmap

### Upcoming Features
- [ ] Advanced fertility tracking
- [ ] Health data integration (Apple Health, Google Fit)
- [ ] Multi-device sync
- [ ] Advanced AI insights
- [ ] Community features

### Version History
- **v1.0.0**: Initial release with core cycle tracking
- **v1.1.0**: AI insights and wellness features
- **v1.2.0**: PWA and notification enhancements

---

<div align="center">
  <p><strong>Built with 💕 by <a href="https://wa.me/2347035656882">GhostScript</a></strong></p>
  <p>Empowering women's health through technology</p>
</div>
