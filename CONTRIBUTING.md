# Contributing to Research Ranking System

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🌟 Ways to Contribute

- Report bugs
- Suggest new features or enhancements
- Improve documentation
- Submit bug fixes
- Add new achievements or task templates
- Improve UI/UX
- Write tests

## 🚀 Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/qinghezeng/research-gamification.git
   cd research-gamification
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   - Follow the existing code style
   - Use TypeScript types properly
   - Add comments for complex logic
   - Test your changes locally

5. **Test your changes**
   ```bash
   npm run dev    # Start dev server
   npm run build  # Test production build
   npm run lint   # Check for linting errors
   ```

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add awesome feature"
   ```

   Use conventional commit messages:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting, etc.)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template
   - Wait for review

## 📝 Code Style Guidelines

### TypeScript
- Use TypeScript for all new files
- Define proper types for props and state
- Avoid `any` type when possible
- Use interfaces for complex object types

### React
- Use functional components with hooks
- Keep components focused and single-purpose
- Use `useMemo` and `useCallback` for optimization
- Follow React best practices

### CSS/Tailwind
- Use Tailwind utility classes
- Follow existing color scheme (slate/purple/blue)
- Ensure responsive design (mobile-first)
- Maintain consistent spacing

### Code Organization
```typescript
// 1. Imports
import React, { useState } from 'react';

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Component
const Component = () => {
  // 4. State
  const [state, setState] = useState();

  // 5. Memoized values
  const value = useMemo(() => {}, []);

  // 6. Functions
  const handleClick = () => {};

  // 7. Effects
  useEffect(() => {}, []);

  // 8. JSX
  return <div />;
};

// 9. Export
export default Component;
```

## 🐛 Reporting Bugs

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/OS information
- Console errors (if any)

## 💡 Suggesting Features

When suggesting features:
- Explain the use case
- Describe the expected behavior
- Consider how it fits with existing features
- Include mockups if possible

## 🎨 Adding New Content

### Adding Task Templates
Edit `defaultTaskTemplates` in `research_ranking_system.tsx`:
```typescript
const defaultTaskTemplates = {
  S: [
    {
      name: 'New Task',
      baseScore: 85,
      time: '2h',
      description: 'Detailed description'
    }
  ]
};
```

### Adding Achievements
Add to `achievementsList`:
```typescript
{
  id: 'unique_id',
  name: 'Achievement Name',
  desc: 'Clear description',
  icon: '🏆',
  category: 'Category',
  reward: '+10⭐',
  check: () => {
    // Logic to check if unlocked
    return condition;
  }
}
```

### Adding Ranks
Update the `ranks` array:
```typescript
{
  name: 'Rank Name',
  color: 'bg-color-class',
  icon: '🎯',
  minScore: 0,
  maxScore: 500
}
```

## ✅ Pull Request Checklist

Before submitting:
- [ ] Code follows the style guidelines
- [ ] All tests pass
- [ ] No console errors
- [ ] Works on mobile and desktop
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

## 🤔 Questions?

Feel free to:
- Open an issue for discussion
- Ask questions in pull requests
- Reach out to maintainers

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help create a welcoming environment

## 🙏 Thank You!

Every contribution helps make this project better. Whether it's a bug report, feature suggestion, or code contribution - thank you for your time and effort!

---

Happy coding! 🚀
