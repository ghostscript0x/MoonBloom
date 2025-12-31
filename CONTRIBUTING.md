# Contributing to Moon Bloom Tracker

We love your input! We want to make contributing to Moon Bloom Tracker as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git

### Setup Steps

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/moon-bloom-tracker.git
   cd moon-bloom-tracker
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Run Tests**
   ```bash
   npm run test
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable
2. Update the version numbers in any examples files and the README.md to the new version that this Pull Request would represent
3. The PR will be merged once you have the sign-off of at least one maintainer

## Code Style

### TypeScript/React Guidelines
- Use TypeScript for all new code
- Follow React best practices and hooks guidelines
- Use functional components with hooks
- Maintain consistent naming conventions
- Add proper TypeScript types for all props and state

### Styling Guidelines
- Use Tailwind CSS classes
- Follow the existing design system
- Maintain accessibility standards (WCAG 2.1 AA)
- Test on multiple screen sizes

### Commit Messages
- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove)
- Keep the first line under 50 characters
- Add body if needed for complex changes

Example:
```
Add biometric authentication support

- Implement WebAuthn API integration
- Add fallback PIN authentication
- Update lock screen UI components
```

## Testing

### Unit Tests
- Write tests for all new components
- Maintain test coverage above 80%
- Use React Testing Library for component tests

### E2E Tests
- Add Cypress tests for critical user flows
- Test PWA installation and offline functionality

### Manual Testing Checklist
- [ ] Works on Chrome, Firefox, Safari, Edge
- [ ] Responsive on mobile and desktop
- [ ] PWA installs correctly
- [ ] Offline functionality works
- [ ] All form validations work
- [ ] Accessibility features work

## Issue Reporting

### Bug Reports
When filing an issue, make sure to answer these questions:

1. What version of the app are you using?
2. What operating system and browser?
3. What did you do?
4. What did you expect to see?
5. What did you see instead?

### Feature Requests
Feature requests are welcome! Please provide:

1. Use case description
2. Proposed solution
3. Alternatives considered
4. Additional context

## Code of Conduct

### Our Pledge
We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone.

### Our Standards
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement
Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at ghostscript.dev@gmail.com.

## Recognition

Contributors will be recognized in:
- GitHub repository contributors list
- App credits section
- Release notes for significant contributions

Thank you for contributing to Moon Bloom Tracker! 🌙✨