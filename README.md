# 🎯 Research Ranking System

一个游戏化的科研任务管理系统，将学术工作转化为类似游戏排位赛的激励机制。通过完成任务、获得积分、解锁成就，让科研工作更有趣！

A gamified research task management system that transforms academic work into a ranked gameplay experience. Complete tasks, earn points, unlock achievements, and make research work more engaging!

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎮 Gamification System
- **Ranking System** (段位系统): Progress from Bronze Scholar to Glory Scholar through 8 ranks
- **Scoring Mechanism** (积分机制): Earn points based on task difficulty (S/A/B/C levels)
- **Winning Streaks** (连胜系统): Gain multipliers for consecutive wins (up to 2.5x)
- **Star Currency** (星星货币): Collect stars through achievements and streaks to buy power-ups

### 📊 Task Management
- **4-Tier Task System**: S (80-100pts), A (40-55pts), B (20-30pts), C (5-12pts)
- **Customizable Tasks**: Create, edit, and organize your own research tasks
- **Task Ordering**: Drag tasks up/down to prioritize your workflow
- **Task History**: Track all completed tasks with editable descriptions
- **Default & Custom Tasks**: Built-in research task templates + create your own

### 🏆 Achievement System
- **40+ Achievements** across 7 categories:
  - Beginner (新手)
  - Winning Streaks (连胜)
  - Productivity (勤奋)
  - Rank Progress (段位)
  - Win Rate (胜率)
  - KDA Performance (KDA)
  - Special Achievements (特殊)

### 💎 Buff Shop
Purchase power-ups with stars:
- **Speed Boost** (经验加速): 1.5x points multiplier
- **Star Protection** (保星卡): Prevent rank loss on failure
- **Time Extension** (时间延长): +30 minutes bonus
- **Inspiration** (灵感爆发): Guaranteed MVP
- **Perfect Judge** (完美判定): Auto-grade quality to A

### 📈 Data Visualization
- **7-Day Score Trends**: Line chart showing your progress
- **Task Distribution**: Pie chart of task levels completed
- **Real-time KDA**: Calculate your research performance ratio
- **Progress Tracking**: Visual indicators for rank advancement

### 💾 Data Management
- **Auto-save**: All progress automatically saved to localStorage
- **Export/Import**: Backup and restore your data as JSON
- **Clear All**: Reset system with confirmation dialog

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/qinghezeng/research-gamification.git

# Navigate to project directory
cd research-gamification

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to start using the app!

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 🎯 How to Use

### 1. Quick Task Entry (快速录入)
- Select task level (S/A/B/C)
- Choose a task from the list
- Click result: ✅ Win (胜利), ➖ Draw (平局), or ❌ Loss (失败)
- Your score and rank update automatically!

### 2. Task Management (管理任务)
- **Create Custom Tasks**: Click "新建任务" to add your own research tasks
- **Edit Tasks**: Modify task details (name, score, time, description)
- **Hide/Show Tasks**: Manage which tasks appear in the quick entry
- **Reorder Tasks**: Use ⬆️⬇️ arrows to organize your task list

### 3. Edit Task History (编辑历史)
- Hover over any completed task in history
- Click the ✏️ edit button
- Add or modify the task description
- Click "保存" to save or "取消" to cancel

### 4. Achievements (成就)
- View all achievements in the achievement modal
- Automatically unlock achievements as you progress
- Earn star rewards for each achievement
- Track completion percentage

### 5. Buff Shop (Buff商城)
- Spend stars on power-ups
- Activate buffs before tasks for bonuses
- Strategic use of buffs can accelerate progress

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Hooks (useState, useMemo)
- **Data Persistence**: Browser localStorage

## 📁 Project Structure

```
research-app/
├── src/
│   ├── research_ranking_system.tsx  # Main application component
│   ├── App.tsx                       # App entry point
│   ├── index.css                     # Global styles + Tailwind
│   └── main.tsx                      # React root
├── public/                           # Static assets
├── package.json                      # Dependencies
├── vite.config.ts                    # Vite configuration
├── tailwind.config.js                # Tailwind configuration
└── tsconfig.json                     # TypeScript configuration
```

## 🎨 Customization

### Adding New Task Templates
Edit the `defaultTaskTemplates` object in `research_ranking_system.tsx`:

```typescript
const defaultTaskTemplates = {
  S: [
    { name: 'Your Task', baseScore: 85, time: '2h', description: 'Task description' }
  ],
  // ...
};
```

### Modifying Rank Thresholds
Update the `ranks` array:

```typescript
const ranks = [
  { name: 'Custom Rank', color: 'bg-custom', icon: '🎯', minScore: 0, maxScore: 500 }
];
```

### Creating New Achievements
Add to the `achievementsList` array:

```typescript
{
  id: 'custom_achievement',
  name: 'Achievement Name',
  desc: 'Description',
  icon: '🏅',
  category: 'Category',
  reward: '+10⭐',
  check: () => /* condition */
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by competitive gaming ranking systems
- Built with modern React and TypeScript best practices
- UI design inspired by gaming dashboards

## 📧 Contact

Project Link: [https://github.com/qinghezeng/research-gamification](https://github.com/qinghezeng/research-gamification)

---

**Made with ❤️ for researchers who love gaming mechanics**

*Turn your research grind into a ranked adventure!* 🚀
