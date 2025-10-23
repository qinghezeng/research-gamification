import React, { useState, useMemo } from 'react';
import { Flame, Star, TrendingUp, Award, Zap, Plus, CheckCircle, XCircle, MinusCircle, ChevronUp, ChevronDown, Edit2, Save, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ResearchRankingSystem = () => {
  // 默认任务模板（初始值）
  const defaultTaskTemplates = {
    S: [
      { name: '完整数据分析', baseScore: 80, time: '2-3h', description: '完成一套完整的数据分析流程，包括数据清洗、统计分析和结果解读' },
      { name: '写完一个章节', baseScore: 100, time: '3-4h', description: '撰写论文或报告的一个完整章节，包括文献整理和逻辑梳理' },
      { name: '准备完整PPT', baseScore: 90, time: '2-3h', description: '制作一套完整的学术汇报PPT，包括内容设计和视觉优化' },
      { name: '完成一组实验', baseScore: 85, time: '2-4h', description: '完成一组完整的实验操作，包括准备、执行和数据记录' }
    ],
    A: [
      { name: '精读1篇文献', baseScore: 50, time: '1-1.5h', description: '深入阅读一篇文献，做详细笔记和批判性思考' },
      { name: '数据预处理', baseScore: 45, time: '1h', description: '对原始数据进行清洗、格式化和初步整理' },
      { name: '写方法学部分', baseScore: 55, time: '1-1.5h', description: '撰写研究方法部分，包括实验设计和技术路线' },
      { name: '制作1个图表', baseScore: 40, time: '0.5-1h', description: '制作一个高质量的数据可视化图表' },
      { name: '运行一次模型', baseScore: 45, time: '1h', description: '配置并运行一次模型训练或仿真实验' }
    ],
    B: [
      { name: '处理学术邮件', baseScore: 25, time: '30min', description: '回复导师、合作者或审稿人的邮件' },
      { name: '速读1篇文献', baseScore: 30, time: '30min', description: '快速浏览一篇文献，了解主要内容和结论' },
      { name: '优化1张图', baseScore: 20, time: '20min', description: '改进已有图表的美观度和可读性' },
      { name: '整理文献库', baseScore: 20, time: '30min', description: '整理和分类文献管理软件中的文献' },
      { name: '头脑风暴', baseScore: 25, time: '20min', description: '思考研究思路、实验设计或问题解决方案' }
    ],
    C: [
      { name: '科研日记', baseScore: 10, time: '10min', description: '记录今天的研究进展、想法或遇到的问题' },
      { name: '搜索新文献', baseScore: 12, time: '15min', description: '在数据库中搜索最新相关文献' },
      { name: '检查数据质量', baseScore: 10, time: '10min', description: '检查实验数据或分析结果的质量和完整性' },
      { name: '学术社交', baseScore: 8, time: '5min', description: '在学术社交平台互动或关注领域动态' },
      { name: '整理工作区', baseScore: 5, time: '10min', description: '整理实验台、办公桌或电脑文件夹' }
    ]
  };

  // 段位配置
  const ranks = [
    { name: '青铜学者', color: 'bg-amber-700', icon: '🥉', minScore: 0, maxScore: 300 },
    { name: '白银研究员', color: 'bg-gray-400', icon: '🥈', minScore: 300, maxScore: 800 },
    { name: '黄金学者', color: 'bg-yellow-500', icon: '🥇', minScore: 800, maxScore: 1500 },
    { name: '铂金研究员', color: 'bg-cyan-400', icon: '💠', minScore: 1500, maxScore: 2500 },
    { name: '钻石学者', color: 'bg-blue-500', icon: '💎', minScore: 2500, maxScore: 4000 },
    { name: '星耀学者', color: 'bg-purple-500', icon: '⭐', minScore: 4000, maxScore: 6000 },
    { name: '王者学者', color: 'bg-red-600', icon: '👑', minScore: 6000, maxScore: 10000 },
    { name: '荣耀学者', color: 'bg-gradient-to-r from-yellow-400 to-red-500', icon: '🌟', minScore: 10000, maxScore: Infinity }
  ];

  // 从本地存储加载数据
  const loadData = () => {
    try {
      return {
        tasks: JSON.parse(localStorage.getItem('research_tasks') || '[]'),
        totalScore: parseInt(localStorage.getItem('research_totalScore') || '0'),
        streak: parseInt(localStorage.getItem('research_streak') || '0'),
        stars: parseInt(localStorage.getItem('research_stars') || '15'),
        buffs: JSON.parse(localStorage.getItem('research_buffs') || '{"speedBoost":0,"starProtect":0,"timeExtend":0,"inspiration":0,"perfectJudge":0}'),
        customTasks: JSON.parse(localStorage.getItem('research_customTasks') || '{"S":[],"A":[],"B":[],"C":[]}'),
        achievements: JSON.parse(localStorage.getItem('research_achievements') || '[]'),
        hiddenTasks: JSON.parse(localStorage.getItem('research_hiddenTasks') || '[]'),
        taskTemplates: JSON.parse(localStorage.getItem('research_taskTemplates') || 'null'),
        taskOrder: JSON.parse(localStorage.getItem('research_taskOrder') || '{"S":[],"A":[],"B":[],"C":[]}')
      };
    } catch (e) {
      return null;
    }
  };

  const initialData = loadData();

  // State
  const [tasks, setTasks] = useState(initialData?.tasks || []);
  const [totalScore, setTotalScore] = useState(initialData?.totalScore || 0);
  const [streak, setStreak] = useState(initialData?.streak || 0);
  const [stars, setStars] = useState(initialData?.stars || 15);
  const [buffs, setBuffs] = useState(initialData?.buffs || {
    speedBoost: 0,
    starProtect: 0,
    timeExtend: 0,
    inspiration: 0,
    perfectJudge: 0
  });
  const [selectedLevel, setSelectedLevel] = useState('A');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTasks, setCustomTasks] = useState(initialData?.customTasks || {S: [], A: [], B: [], C: []});
  const [taskTemplates, setTaskTemplates] = useState(initialData?.taskTemplates || defaultTaskTemplates);
  const [newCustomTask, setNewCustomTask] = useState({
    name: '',
    baseScore: 50,
    time: '1h',
    level: 'A',
    description: ''
  });
  const [lastSaved, setLastSaved] = useState(new Date());
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState(initialData?.achievements || []);
  const [newAchievement, setNewAchievement] = useState<any>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showManageTasksModal, setShowManageTasksModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [hiddenTasks, setHiddenTasks] = useState(initialData?.hiddenTasks || []);
  const [taskOrder, setTaskOrder] = useState(initialData?.taskOrder || {S: [], A: [], B: [], C: []});
  const [editingHistoryId, setEditingHistoryId] = useState<number | null>(null);
  const [editingHistoryDescription, setEditingHistoryDescription] = useState('');

  // 计算当前段位
  const currentRank = useMemo(() => {
    const rank = ranks.find(r => totalScore >= r.minScore && totalScore < r.maxScore) || ranks[0];
    const progress = ((totalScore - rank.minScore) / (rank.maxScore - rank.minScore)) * 100;
    const subRank = Math.min(Math.floor(progress / 20) + 1, 5);

    // 低段位(青铜、白银)用3星，高段位(黄金及以上)用5星
    const isLowRank = rank.minScore < 800; // 青铜和白银
    const maxStars = isLowRank ? 3 : 5;
    const starsInSubRank = Math.floor((progress % 20) / (20 / maxStars));

    return { ...rank, subRank, starsInSubRank, maxStars, progress: Math.min(progress, 100) };
  }, [totalScore]);

  // 计算KDA
  const kda = useMemo(() => {
    const wins = tasks.filter(t => t.result === 'win').length;
    const losses = tasks.filter(t => t.result === 'loss').length;
    const assists = tasks.filter(t => ['B', 'C'].includes(t.level)).length;
    return losses === 0 ? wins + assists/2 : ((wins + assists/2) / losses).toFixed(1);
  }, [tasks]);

  // 连胜加成
  const getStreakMultiplier = (currentStreak) => {
    if (currentStreak >= 15) return 2.5;
    if (currentStreak >= 10) return 2.0;
    if (currentStreak >= 7) return 1.5;
    if (currentStreak >= 5) return 1.3;
    if (currentStreak >= 3) return 1.2;
    if (currentStreak >= 2) return 1.1;
    return 1.0;
  };

  // 添加任务
  const addTask = (level, taskName, result) => {
    let template = taskTemplates[level].find(t => t.name === taskName);
    if (!template) {
      template = customTasks[level].find(t => t.name === taskName);
    }
    if (!template) return;

    let finalScore = template.baseScore;
    
    if (result === 'win') {
      finalScore = Math.round(finalScore * getStreakMultiplier(streak));
    } else if (result === 'draw') {
      finalScore = Math.round(finalScore * 0.6);
    } else {
      finalScore = -Math.round(finalScore * 0.2);
    }

    const newTask = {
      id: Date.now(),
      level,
      name: taskName,
      description: template.description || '',
      baseScore: template.baseScore,
      finalScore,
      result,
      streak: result === 'win' ? streak + 1 : 0,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    };

    setTasks(prev => [newTask, ...prev]);
    setTotalScore(prev => Math.max(0, prev + finalScore));
    
    if (result === 'win') {
      setStreak(prev => prev + 1);
      if ((streak + 1) === 5) setStars(prev => prev + 1);
      if ((streak + 1) === 7) setStars(prev => prev + 1);
      if ((streak + 1) === 10) setStars(prev => prev + 2);
    } else if (result === 'loss') {
      setStreak(0);
    }
  };

  // 添加自定义任务
  const addCustomTask = () => {
    if (!newCustomTask.name.trim()) return;

    setCustomTasks(prev => ({
      ...prev,
      [newCustomTask.level]: [...prev[newCustomTask.level], {
        name: newCustomTask.name,
        baseScore: newCustomTask.baseScore,
        time: newCustomTask.time,
        description: newCustomTask.description
      }]
    }));

    setNewCustomTask({
      name: '',
      baseScore: 50,
      time: '1h',
      level: 'A',
      description: ''
    });
    setShowCustomModal(false);
  };

  // 删除任务（自定义任务真删除，默认任务隐藏）
  const deleteCustomTask = (level, taskName) => {
    const isDefault = isDefaultTask(level, taskName);

    if (isDefault) {
      // 默认任务使用隐藏机制（不真删除）
      const taskKey = `${level}-${taskName}`;
      if (!hiddenTasks.includes(taskKey)) {
        setHiddenTasks(prev => [...prev, taskKey]);
      }
    } else {
      // 自定义任务直接删除
      setCustomTasks(prev => ({
        ...prev,
        [level]: prev[level].filter(t => t.name !== taskName)
      }));
    }
  };

  // 编辑任务（支持默认任务和自定义任务）
  const editCustomTask = (oldLevel, oldName, newTask) => {
    const isDefault = isDefaultTask(oldLevel, oldName);

    if (isDefault) {
      // 编辑默认任务
      if (oldLevel !== newTask.level) {
        // 跨级别移动：从旧级别删除，添加到新级别
        setTaskTemplates(prev => ({
          ...prev,
          [oldLevel]: prev[oldLevel].filter(t => t.name !== oldName),
          [newTask.level]: [...prev[newTask.level], {
            name: newTask.name,
            baseScore: newTask.baseScore,
            time: newTask.time,
            description: newTask.description || ''
          }]
        }));
      } else {
        // 同级别编辑
        setTaskTemplates(prev => ({
          ...prev,
          [oldLevel]: prev[oldLevel].map(t =>
            t.name === oldName
              ? { name: newTask.name, baseScore: newTask.baseScore, time: newTask.time, description: newTask.description || '' }
              : t
          )
        }));
      }
    } else {
      // 编辑自定义任务
      if (oldLevel !== newTask.level) {
        setCustomTasks(prev => ({
          ...prev,
          [oldLevel]: prev[oldLevel].filter(t => t.name !== oldName),
          [newTask.level]: [...prev[newTask.level], {
            name: newTask.name,
            baseScore: newTask.baseScore,
            time: newTask.time,
            description: newTask.description || ''
          }]
        }));
      } else {
        setCustomTasks(prev => ({
          ...prev,
          [oldLevel]: prev[oldLevel].map(t =>
            t.name === oldName
              ? { name: newTask.name, baseScore: newTask.baseScore, time: newTask.time, description: newTask.description || '' }
              : t
          )
        }));
      }
    }
    setEditingTask(null);
  };

  // 开始编辑任务
  const startEditTask = (level, task) => {
    setEditingTask({
      oldLevel: level,
      oldName: task.name,
      name: task.name,
      baseScore: task.baseScore,
      time: task.time,
      level: level,
      description: task.description || '',
      isDefault: isDefaultTask(level, task.name)
    });
  };

  // 合并任务
  const getAllTasks = (level) => {
    const allTasks = [...taskTemplates[level], ...customTasks[level]];
    // 过滤掉被隐藏的任务
    const visibleTasks = allTasks.filter(task => !hiddenTasks.includes(`${level}-${task.name}`));

    // 应用自定义排序
    const order = taskOrder[level] || [];
    if (order.length === 0) {
      return visibleTasks; // 如果没有自定义顺序，返回默认顺序
    }

    // 按照自定义顺序排序
    const sortedTasks = [];
    const taskMap = new Map(visibleTasks.map(task => [task.name, task]));

    // 先添加有顺序的任务
    order.forEach(taskName => {
      if (taskMap.has(taskName)) {
        sortedTasks.push(taskMap.get(taskName));
        taskMap.delete(taskName);
      }
    });

    // 再添加新任务（没有在顺序列表中的）
    taskMap.forEach(task => sortedTasks.push(task));

    return sortedTasks;
  };

  // 获取所有任务（包括隐藏的，用于管理面板）
  const getAllTasksForManagement = (level) => {
    return [...taskTemplates[level], ...customTasks[level]];
  };

  // 隐藏任务
  const hideTask = (level, taskName) => {
    const taskKey = `${level}-${taskName}`;
    if (!hiddenTasks.includes(taskKey)) {
      setHiddenTasks(prev => [...prev, taskKey]);
    }
  };

  // 显示任务
  const showTask = (level, taskName) => {
    const taskKey = `${level}-${taskName}`;
    setHiddenTasks(prev => prev.filter(key => key !== taskKey));
  };

  // 检查任务是否被隐藏
  const isTaskHidden = (level, taskName) => {
    return hiddenTasks.includes(`${level}-${taskName}`);
  };

  // 移动任务顺序
  const moveTask = (level, taskName, direction) => {
    const currentTasks = getAllTasks(level);
    const currentIndex = currentTasks.findIndex(t => t.name === taskName);

    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    // 检查边界
    if (newIndex < 0 || newIndex >= currentTasks.length) return;

    // 创建新的任务名称顺序数组
    const newOrder = currentTasks.map(t => t.name);
    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];

    // 更新任务顺序
    setTaskOrder(prev => ({
      ...prev,
      [level]: newOrder
    }));
  };

  // 检查是否是默认任务
  const isDefaultTask = (level, taskName) => {
    return taskTemplates[level].some(t => t.name === taskName);
  };

  // 使用buff
  const useBuff = (buffType) => {
    const costs = {
      speedBoost: 3,
      starProtect: 5,
      timeExtend: 2,
      inspiration: 8,
      perfectJudge: 4
    };
    if (stars < costs[buffType]) return;
    setBuffs(prev => ({ ...prev, [buffType]: prev[buffType] + 1 }));
    setStars(prev => prev - costs[buffType]);
  };

  // 导出数据
  const exportData = () => {
    try {
      const data = {
        tasks,
        totalScore,
        streak,
        stars,
        buffs,
        customTasks,
        achievements: unlockedAchievements,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `科研排位数据_${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('导出失败', err);
    }
  };

  // 导入数据
  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result as string);
        setTasks(data.tasks || []);
        setTotalScore(data.totalScore || 0);
        setStreak(data.streak || 0);
        setStars(data.stars || 15);
        setBuffs(data.buffs || {speedBoost:0,starProtect:0,timeExtend:0,inspiration:0,perfectJudge:0});
        setCustomTasks(data.customTasks || {S:[],A:[],B:[],C:[]});
        setUnlockedAchievements(data.achievements || []);
        event.target.value = '';
      } catch (err) {
        console.error('导入失败', err);
      }
    };
    reader.readAsText(file);
  };

  // 清空数据
  const clearAllData = () => {
    try {
      // 清空localStorage中的所有科研数据
      localStorage.removeItem('research_tasks');
      localStorage.removeItem('research_totalScore');
      localStorage.removeItem('research_streak');
      localStorage.removeItem('research_stars');
      localStorage.removeItem('research_buffs');
      localStorage.removeItem('research_customTasks');
      localStorage.removeItem('research_achievements');
      
      // 重置所有状态到初始值
      setTasks([]);
      setTotalScore(0);
      setStreak(0);
      setStars(15);
      setBuffs({speedBoost:0,starProtect:0,timeExtend:0,inspiration:0,perfectJudge:0});
      setCustomTasks({S:[],A:[],B:[],C:[]});
      setUnlockedAchievements([]);
      
      // 关闭确认框
      setShowClearConfirm(false);
    } catch (err) {
      console.error('清空失败:', err);
    }
  };

  // 今日统计
  const todayStats = useMemo(() => {
    const today = new Date().toDateString();
    const todayTasks = tasks.filter(t => new Date(t.timestamp).toDateString() === today);
    const wins = todayTasks.filter(t => t.result === 'win').length;
    const losses = todayTasks.filter(t => t.result === 'loss').length;
    const totalPoints = todayTasks.reduce((sum, t) => sum + t.finalScore, 0);
    return { total: todayTasks.length, wins, losses, totalPoints };
  }, [tasks]);

  // 7日数据
  const weeklyData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const dayTasks = tasks.filter(t => new Date(t.timestamp).toDateString() === dateStr);
      const score = dayTasks.reduce((sum, t) => sum + t.finalScore, 0);
      data.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        score: score,
        tasks: dayTasks.length
      });
    }
    return data;
  }, [tasks]);

  // 任务分布
  const taskDistribution = useMemo(() => {
    const dist = { S: 0, A: 0, B: 0, C: 0 };
    tasks.forEach(t => dist[t.level]++);
    return Object.entries(dist).map(([level, count]) => ({ level, count }));
  }, [tasks]);

  // 成就定义（完整版）
  const achievementsList = useMemo(() => [
    // 新手成就
    { id: 'first_blood', name: '首战告捷', desc: '完成第一个任务', icon: '🎯', category: '新手', reward: '+3⭐',
      check: () => tasks.length >= 1 },
    { id: 'first_win', name: '初尝胜果', desc: '获得第一次胜利', icon: '🎉', category: '新手', reward: '+5⭐',
      check: () => tasks.filter(t => t.result === 'win').length >= 1 },
    { id: 'custom_master', name: '个性化大师', desc: '创建第一个自定义任务', icon: '✨', category: '新手', reward: '+5⭐',
      check: () => Object.values(customTasks).some((arr: any) => arr.length > 0) },
    
    // 连胜成就
    { id: 'streak_3', name: '三连胜', desc: '达成3连胜', icon: '🔥', category: '连胜', reward: '+5⭐',
      check: () => streak >= 3 },
    { id: 'streak_5', name: '超神', desc: '达成5连胜', icon: '🔥🔥', category: '连胜', reward: '+10⭐',
      check: () => streak >= 5 },
    { id: 'streak_10', name: '传说', desc: '达成10连胜', icon: '🔥🔥🔥', category: '连胜', reward: '+20⭐',
      check: () => streak >= 10 },
    { id: 'streak_15', name: '荣耀之巅', desc: '达成15连胜', icon: '👑', category: '连胜', reward: '+50⭐',
      check: () => streak >= 15 },
    
    // 勤奋成就
    { id: 'task_10', name: '初出茅庐', desc: '累计完成10个任务', icon: '📚', category: '勤奋', reward: '+10⭐',
      check: () => tasks.length >= 10 },
    { id: 'task_50', name: '小有成就', desc: '累计完成50个任务', icon: '📖', category: '勤奋', reward: '+20⭐',
      check: () => tasks.length >= 50 },
    { id: 'task_100', name: '学术专家', desc: '累计完成100个任务', icon: '🎓', category: '勤奋', reward: '+50⭐',
      check: () => tasks.length >= 100 },
    { id: 'task_500', name: '科研狂人', desc: '累计完成500个任务', icon: '🔬', category: '勤奋', reward: '+100⭐',
      check: () => tasks.length >= 500 },
    
    // 段位成就
    { id: 'silver', name: '白银研究员', desc: '达到白银段位', icon: '🥈', category: '段位', reward: '+15⭐',
      check: () => totalScore >= 300 },
    { id: 'gold', name: '黄金学者', desc: '达到黄金段位', icon: '🥇', category: '段位', reward: '+25⭐',
      check: () => totalScore >= 800 },
    { id: 'platinum', name: '铂金研究员', desc: '达到铂金段位', icon: '💠', category: '段位', reward: '+40⭐',
      check: () => totalScore >= 1500 },
    { id: 'diamond', name: '钻石学者', desc: '达到钻石段位', icon: '💎', category: '段位', reward: '+60⭐',
      check: () => totalScore >= 2500 },
    { id: 'master', name: '星耀学者', desc: '达到星耀段位', icon: '⭐', category: '段位', reward: '+80⭐',
      check: () => totalScore >= 4000 },
    { id: 'king', name: '王者学者', desc: '达到王者段位', icon: '👑', category: '段位', reward: '+150⭐',
      check: () => totalScore >= 6000 },
    
    // 胜率成就
    { id: 'winrate_70', name: '稳定发挥', desc: '胜率达到70%（至少10场）', icon: '📈', category: '胜率', reward: '+20⭐',
      check: () => tasks.length >= 10 && (tasks.filter(t => t.result === 'win').length / tasks.length) >= 0.7 },
    { id: 'winrate_80', name: '高手风范', desc: '胜率达到80%（至少20场）', icon: '🎯', category: '胜率', reward: '+30⭐',
      check: () => tasks.length >= 20 && (tasks.filter(t => t.result === 'win').length / tasks.length) >= 0.8 },
    { id: 'winrate_90', name: '近乎完美', desc: '胜率达到90%（至少30场）', icon: '💯', category: '胜率', reward: '+50⭐',
      check: () => tasks.length >= 30 && (tasks.filter(t => t.result === 'win').length / tasks.length) >= 0.9 },
    
    // KDA成就
    { id: 'kda_5', name: 'KDA大师', desc: 'KDA达到5.0', icon: '⚔️', category: 'KDA', reward: '+15⭐',
      check: () => parseFloat(kda) >= 5.0 },
    { id: 'kda_10', name: 'KDA之神', desc: 'KDA达到10.0', icon: '🗡️', category: 'KDA', reward: '+30⭐',
      check: () => parseFloat(kda) >= 10.0 },
    
    // 特殊成就
    { id: 'night_owl', name: '夜猫子', desc: '在凌晨2-5点完成任务', icon: '🦉', category: '特殊', reward: '+10⭐',
      check: () => tasks.some(t => {
        const hour = new Date(t.timestamp).getHours();
        return hour >= 2 && hour < 5;
      }) },
    { id: 'early_bird', name: '早起的鸟儿', desc: '在早上5-7点完成任务', icon: '🐦', category: '特殊', reward: '+10⭐',
      check: () => tasks.some(t => {
        const hour = new Date(t.timestamp).getHours();
        return hour >= 5 && hour < 7;
      }) },
    { id: 'productive_day', name: '高产一天', desc: '单日完成10个任务', icon: '💪', category: '特殊', reward: '+20⭐',
      check: () => {
        const tasksByDay = {};
        tasks.forEach(t => {
          const date = new Date(t.timestamp).toDateString();
          tasksByDay[date] = (tasksByDay[date] || 0) + 1;
        });
        return Object.values(tasksByDay).some((count: any) => count >= 10);
      } },
    { id: 'all_rounder', name: '全能选手', desc: '完成所有等级（S/A/B/C）的任务', icon: '🌟', category: '特殊', reward: '+15⭐',
      check: () => ['S', 'A', 'B', 'C'].every(level => tasks.some(t => t.level === level)) },
    { id: 'perfectionist', name: '完美主义者', desc: '连续20个任务全部胜利', icon: '✨', category: '特殊', reward: '+40⭐',
      check: () => {
        const recent20 = tasks.slice(0, 20);
        return recent20.length === 20 && recent20.every(t => t.result === 'win');
      } },
  ], [tasks, totalScore, streak, customTasks, kda]);

  // 确保所有级别的默认任务都存在（恢复被意外删除的默认任务）
  React.useEffect(() => {
    let needsRecovery = false;
    const recoveredTemplates = { ...taskTemplates };

    ['S', 'A', 'B', 'C'].forEach(level => {
      if (!recoveredTemplates[level] || recoveredTemplates[level].length === 0) {
        recoveredTemplates[level] = defaultTaskTemplates[level];
        needsRecovery = true;
      }
    });

    if (needsRecovery) {
      setTaskTemplates(recoveredTemplates);
    }
  }, []);

  // 自动保存
  React.useEffect(() => {
    try {
      localStorage.setItem('research_tasks', JSON.stringify(tasks));
      localStorage.setItem('research_totalScore', totalScore.toString());
      localStorage.setItem('research_streak', streak.toString());
      localStorage.setItem('research_stars', stars.toString());
      localStorage.setItem('research_buffs', JSON.stringify(buffs));
      localStorage.setItem('research_customTasks', JSON.stringify(customTasks));
      localStorage.setItem('research_taskTemplates', JSON.stringify(taskTemplates));
      localStorage.setItem('research_achievements', JSON.stringify(unlockedAchievements));
      localStorage.setItem('research_hiddenTasks', JSON.stringify(hiddenTasks));
      localStorage.setItem('research_taskOrder', JSON.stringify(taskOrder));
      setLastSaved(new Date());
    } catch (e) {
      console.error('保存失败', e);
    }
  }, [tasks, totalScore, streak, stars, buffs, customTasks, taskTemplates, unlockedAchievements, hiddenTasks, taskOrder]);

  // 成就检测
  React.useEffect(() => {
    achievementsList.forEach(achievement => {
      if (!unlockedAchievements.includes(achievement.id)) {
        try {
          if (achievement.check()) {
            setUnlockedAchievements(prev => [...prev, achievement.id]);
            setNewAchievement(achievement);
            
            // 发放奖励
            const starMatch = achievement.reward.match(/\+(\d+)⭐/);
            if (starMatch) {
              setStars(prev => prev + parseInt(starMatch[1]));
            }
            
            // 5秒后关闭提示
            setTimeout(() => setNewAchievement(null), 5000);
          }
        } catch (e) {
          // 忽略检查错误
        }
      }
    });
  }, [achievementsList, unlockedAchievements]);

  // 删除单个任务
  const deleteTask = (taskId) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!taskToDelete) return;

    // 从任务列表中移除
    setTasks(prev => prev.filter(t => t.id !== taskId));
    
    // 调整积分
    setTotalScore(prev => Math.max(0, prev - taskToDelete.finalScore));
    
    // 如果删除的是最后一个胜利任务，需要重新计算连胜
    const remainingTasks = tasks.filter(t => t.id !== taskId);
    if (remainingTasks.length > 0 && taskToDelete.result === 'win') {
      // 重新计算连胜
      let newStreak = 0;
      for (let i = 0; i < remainingTasks.length; i++) {
        if (remainingTasks[i].result === 'win') {
          newStreak++;
        } else {
          break;
        }
      }
      setStreak(newStreak);
    }
  };

  // 更新任务历史描述
  const updateTaskDescription = (taskId, newDescription) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, description: newDescription } : t
    ));
  };

  // 开始编辑任务历史描述
  const startEditHistory = (task) => {
    setEditingHistoryId(task.id);
    setEditingHistoryDescription(task.description || '');
  };

  // 保存任务历史描述
  const saveHistoryDescription = () => {
    if (editingHistoryId !== null) {
      updateTaskDescription(editingHistoryId, editingHistoryDescription);
      setEditingHistoryId(null);
      setEditingHistoryDescription('');
    }
  };

  // 取消编辑任务历史描述
  const cancelEditHistory = () => {
    setEditingHistoryId(null);
    setEditingHistoryDescription('');
  };

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
            科研排位系统
          </h1>
          <p className="text-gray-400">终极目标：Nature Nature 🎯</p>
        </div>

        {/* 段位展示 */}
        <div className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 rounded-2xl p-6 mb-6 backdrop-blur border border-purple-500/30">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{currentRank.icon}</div>
              <div>
                <h2 className="text-3xl font-bold">{currentRank.name}</h2>
                <div className="flex items-center gap-2 text-xl">
                  <span className="text-yellow-400">
                    {['I', 'II', 'III', 'IV', 'V'][currentRank.subRank - 1]}
                  </span>
                  <div className="flex">
                    {Array.from({ length: currentRank.maxStars || 3 }).map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < currentRank.starsInSubRank ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                    ))}
                  </div>
                </div>
                <div className="mt-2 w-64 bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
                    style={{ width: `${currentRank.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {totalScore} / {currentRank.maxScore === Infinity ? '∞' : currentRank.maxScore} 积分
                </p>
              </div>
            </div>

            {/* 连胜 */}
            <div className="bg-red-600/30 rounded-xl p-4 border border-red-500/50">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-6 h-6 text-orange-400" />
                <span className="text-2xl font-bold">{streak} 连胜</span>
              </div>
              <p className="text-sm text-gray-300">
                积分加成: ×{getStreakMultiplier(streak)}
              </p>
            </div>

            {/* KDA */}
            <div className="bg-blue-600/30 rounded-xl p-4 border border-blue-500/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <span className="text-2xl font-bold">KDA: {kda}</span>
              </div>
              <p className="text-sm text-gray-300">
                {tasks.filter(t => t.result === 'win').length}胜 / 
                {tasks.filter(t => t.result === 'loss').length}负
              </p>
            </div>

            {/* 星星 */}
            <div className="bg-yellow-600/30 rounded-xl p-4 border border-yellow-500/50">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <span className="text-2xl font-bold">{stars} 星星</span>
              </div>
              <p className="text-xs text-gray-300">可兑换buff卡</p>
            </div>

            {/* 成就按钮 */}
                <button
                  onClick={() => setShowAchievementModal(true)}
                  className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 border border-purple-500/50 hover:scale-105 transition-transform"
                >
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-6 h-6 text-yellow-300" />
                <span className="text-2xl font-bold">
                  {unlockedAchievements.length}/{achievementsList.length}
                </span>
              </div>
              <p className="text-xs text-gray-200">查看成就</p>
            </button>
          </div>
        </div>

        {/* 今日战绩 */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-6 backdrop-blur border border-slate-700">
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            今日战绩
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">{todayStats.total}</div>
              <div className="text-sm text-gray-400">总场次</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-400">{todayStats.wins}</div>
              <div className="text-sm text-gray-400">胜利</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-400">{todayStats.losses}</div>
              <div className="text-sm text-gray-400">失败</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-400">{todayStats.totalPoints}</div>
              <div className="text-sm text-gray-400">今日积分</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* 快速录入 */}
          <div className="lg:col-span-2 bg-slate-800/50 rounded-xl p-6 backdrop-blur border border-slate-700 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Plus className="w-5 h-5" />
                快速录入任务
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowManageTasksModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  管理任务
                </button>
                <button
                  onClick={() => setShowCustomModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  新建任务
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex gap-2 mb-4">
                {['S', 'A', 'B', 'C'].map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      selectedLevel === level
                        ? 'bg-purple-600 scale-105'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {level}级任务
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-2 flex-1 overflow-y-auto">
                {getAllTasks(selectedLevel).map((task, index) => {
                  const isDefault = isDefaultTask(selectedLevel, task.name);
                  const isCustom = !isDefault;
                  return (
                    <div key={task.name} className="bg-slate-700/50 rounded-lg p-3 flex justify-between items-center hover:bg-slate-700/70 transition-colors">
                      <div className="flex-1">
                        <div className="font-semibold flex items-center gap-2">
                          {task.name}
                          {isCustom && <span className="text-xs bg-purple-600 px-2 py-0.5 rounded">自定义</span>}
                          {isDefault && <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">默认</span>}
                        </div>
                        {task.description && (
                          <div className="text-xs text-gray-500 mt-1">
                            {task.description}
                          </div>
                        )}
                        <div className="text-sm text-gray-400 mt-1">
                          基础分: {task.baseScore} | 时长: {task.time}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveTask(selectedLevel, task.name, 'up')}
                          disabled={index === 0}
                          className={`p-2 rounded-lg transition-colors ${
                            index === 0
                              ? 'bg-gray-600 cursor-not-allowed opacity-50'
                              : 'bg-slate-600 hover:bg-slate-500'
                          }`}
                          title="上移"
                        >
                          <ChevronUp className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => moveTask(selectedLevel, task.name, 'down')}
                          disabled={index === getAllTasks(selectedLevel).length - 1}
                          className={`p-2 rounded-lg transition-colors ${
                            index === getAllTasks(selectedLevel).length - 1
                              ? 'bg-gray-600 cursor-not-allowed opacity-50'
                              : 'bg-slate-600 hover:bg-slate-500'
                          }`}
                          title="下移"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => startEditTask(selectedLevel, task)}
                          className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors"
                          title="编辑任务"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteCustomTask(selectedLevel, task.name)}
                          className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-colors"
                          title={isDefault ? "隐藏任务" : "删除任务"}
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => addTask(selectedLevel, task.name, 'win')}
                          className="bg-green-600 hover:bg-green-700 p-2 rounded-lg transition-colors"
                          title="胜利"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => addTask(selectedLevel, task.name, 'draw')}
                          className="bg-yellow-600 hover:bg-yellow-700 p-2 rounded-lg transition-colors"
                          title="平局"
                        >
                          <MinusCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => addTask(selectedLevel, task.name, 'loss')}
                          className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-colors"
                          title="失败"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Buff商城 */}
          <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur border border-slate-700 flex flex-col">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Buff商城
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {[
                { type: 'speedBoost', name: '经验加速', icon: '🚀', cost: 3, desc: '积分×1.5' },
                { type: 'starProtect', name: '保星卡', icon: '🛡️', cost: 5, desc: '失败不掉星' },
                { type: 'timeExtend', name: '时间延长', icon: '⏰', cost: 2, desc: '+30分钟' },
                { type: 'inspiration', name: '灵感爆发', icon: '💡', cost: 8, desc: '必得MVP' },
                { type: 'perfectJudge', name: '完美判定', icon: '🎯', cost: 4, desc: '质量自动A' }
              ].map(buff => (
                <div key={buff.type} className="bg-slate-700/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{buff.icon}</span>
                      <div>
                        <div className="font-semibold text-sm">{buff.name}</div>
                        <div className="text-xs text-gray-400">{buff.desc}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">{buff.cost}⭐</div>
                      <div className="text-xs text-gray-400">拥有:{buffs[buff.type]}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => useBuff(buff.type)}
                    disabled={stars < buff.cost}
                    className={`w-full py-1 rounded text-sm font-semibold transition-colors ${
                      stars >= buff.cost
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    购买
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 数据可视化 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur border border-slate-700">
            <h3 className="text-xl font-bold mb-4">7日积分趋势</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#e5e7eb' }}
                />
                <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur border border-slate-700">
            <h3 className="text-xl font-bold mb-4">任务类型分布</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={taskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ level, count }) => `${level}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 任务历史 */}
        <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur border border-slate-700 mb-6">
          <h3 className="text-xl font-bold mb-4">任务历史</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tasks.length === 0 ? (
              <p className="text-gray-400 text-center py-8">还没有任何任务记录，开始你的第一场排位吧！</p>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="bg-slate-700/50 rounded-lg p-3 flex justify-between items-center hover:bg-slate-700 transition-colors group">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl ${
                      task.level === 'S' ? 'bg-red-600' :
                      task.level === 'A' ? 'bg-orange-600' :
                      task.level === 'B' ? 'bg-blue-600' : 'bg-purple-600'
                    }`}>
                      {task.level}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{task.name}</div>
                      {editingHistoryId === task.id ? (
                        <div className="mt-1">
                          <input
                            type="text"
                            value={editingHistoryDescription}
                            onChange={(e) => setEditingHistoryDescription(e.target.value)}
                            className="w-full bg-slate-600 border border-slate-500 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                            placeholder="添加描述..."
                            autoFocus
                          />
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={saveHistoryDescription}
                              className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs transition-colors flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" />
                              保存
                            </button>
                            <button
                              onClick={cancelEditHistory}
                              className="bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded text-xs transition-colors flex items-center gap-1"
                            >
                              <X className="w-3 h-3" />
                              取消
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {task.description && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              {task.description}
                            </div>
                          )}
                        </>
                      )}
                      <div className="text-sm text-gray-400 mt-0.5">
                        {task.time} | 基础分: {task.baseScore}
                        {task.streak > 1 && ` | ${task.streak}连胜`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`text-2xl font-bold ${
                      task.result === 'win' ? 'text-green-400' :
                      task.result === 'draw' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {task.finalScore > 0 ? '+' : ''}{task.finalScore}
                    </div>
                    <div className="text-2xl">
                      {task.result === 'win' ? '🎉' : task.result === 'draw' ? '😐' : '💔'}
                    </div>
                    <button
                      onClick={() => startEditHistory(task)}
                      className="opacity-0 group-hover:opacity-100 bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-all"
                      title="编辑描述"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-all"
                      title="删除此任务"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 数据管理 */}
        <div className="bg-slate-800/50 rounded-xl p-6 backdrop-blur border border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>自动保存已开启</span>
                </div>
                <div className="text-xs">
                  最后保存: {lastSaved.toLocaleTimeString('zh-CN')}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 flex-wrap justify-center">
              <button
                onClick={exportData}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
              >
                📤 导出数据
              </button>
              
              <label className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer flex items-center gap-2">
                📥 导入数据
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={() => setShowClearConfirm(true)}
                type="button"
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
              >
                🗑️ 清空数据
              </button>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-sm">
              <div>
                <div className="text-gray-400 mb-1">累计任务</div>
                <div className="text-2xl font-bold text-purple-400">{tasks.length}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">自定义任务</div>
                <div className="text-2xl font-bold text-blue-400">
                  {Object.values(customTasks).reduce((sum: any, arr: any) => sum + (arr?.length || 0), 0) as any}
                </div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">胜率</div>
                <div className="text-2xl font-bold text-green-400">
                  {tasks.length > 0 ? Math.round((tasks.filter(t => t.result === 'win').length / tasks.length) * 100) : 0}%
                </div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">最高连胜</div>
                <div className="text-2xl font-bold text-orange-400">
                  {tasks.length > 0 ? Math.max(...tasks.map(t => t.streak)) : 0}
                </div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">已解锁成就</div>
                <div className="text-2xl font-bold text-pink-400">
                  {unlockedAchievements.length}/{achievementsList.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="mt-4 text-center text-gray-400 text-xs space-y-1">
          <p>💾 数据自动保存到浏览器本地，不会丢失</p>
          <p>📤 定期导出数据备份，以防浏览器清理缓存</p>
        </div>

        {/* 自定义任务弹窗 */}
        {showCustomModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-purple-500/30 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                创建自定义任务
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">任务名称</label>
                  <input
                    type="text"
                    value={newCustomTask.name}
                    onChange={(e) => setNewCustomTask({...newCustomTask, name: e.target.value})}
                    placeholder="例如：优化算法代码"
                    className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">任务等级</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['S', 'A', 'B', 'C'].map(level => (
                      <button
                        key={level}
                        onClick={() => setNewCustomTask({...newCustomTask, level})}
                        className={`py-3 rounded-lg font-bold transition-all ${
                          newCustomTask.level === level
                            ? level === 'S' ? 'bg-red-600' :
                              level === 'A' ? 'bg-orange-600' :
                              level === 'B' ? 'bg-blue-600' : 'bg-purple-600'
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                      >
                        {level}级
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">
                    基础积分 <span className="text-purple-400">{newCustomTask.baseScore}分</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={newCustomTask.baseScore}
                    onChange={(e) => setNewCustomTask({...newCustomTask, baseScore: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">预计时长</label>
                  <input
                    type="text"
                    value={newCustomTask.time}
                    onChange={(e) => setNewCustomTask({...newCustomTask, time: e.target.value})}
                    placeholder="例如：1-2h"
                    className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">任务描述</label>
                  <textarea
                    value={newCustomTask.description}
                    onChange={(e) => setNewCustomTask({...newCustomTask, description: e.target.value})}
                    placeholder="例如：优化数据处理算法，提升运行效率"
                    rows={3}
                    className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowCustomModal(false);
                    setNewCustomTask({name: '', baseScore: 50, time: '1h', level: 'A', description: ''});
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-semibold transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={addCustomTask}
                  disabled={!newCustomTask.name.trim()}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    newCustomTask.name.trim()
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                      : 'bg-slate-600 cursor-not-allowed'
                  }`}
                >
                  创建任务
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 编辑任务弹窗 */}
        {editingTask && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-blue-500/30 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                编辑自定义任务
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">任务名称</label>
                  <input
                    type="text"
                    value={editingTask.name}
                    onChange={(e) => setEditingTask({...editingTask, name: e.target.value})}
                    className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">任务等级</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['S', 'A', 'B', 'C'].map(level => (
                      <button
                        key={level}
                        onClick={() => setEditingTask({...editingTask, level})}
                        className={`py-3 rounded-lg font-bold transition-all ${
                          editingTask.level === level
                            ? level === 'S' ? 'bg-red-600' :
                              level === 'A' ? 'bg-orange-600' :
                              level === 'B' ? 'bg-blue-600' : 'bg-purple-600'
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                      >
                        {level}级
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">
                    基础积分 <span className="text-blue-400">{editingTask.baseScore}分</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={editingTask.baseScore}
                    onChange={(e) => setEditingTask({...editingTask, baseScore: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">预计时长</label>
                  <input
                    type="text"
                    value={editingTask.time}
                    onChange={(e) => setEditingTask({...editingTask, time: e.target.value})}
                    className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">任务描述</label>
                  <textarea
                    value={editingTask.description || ''}
                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                    placeholder="例如：优化数据处理算法，提升运行效率"
                    rows={3}
                    className="w-full bg-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingTask(null)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-semibold transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => editCustomTask(editingTask.oldLevel, editingTask.oldName, editingTask)}
                  disabled={!editingTask.name.trim()}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    editingTask.name.trim()
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                      : 'bg-slate-600 cursor-not-allowed'
                  }`}
                >
                  保存修改
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 管理任务模态框 */}
        {showManageTasksModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-4xl w-full border border-blue-500/30 shadow-2xl my-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  管理所有任务
                </h3>
                <button
                  onClick={() => setShowManageTasksModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="w-8 h-8" />
                </button>
              </div>

              <div className="mb-4 bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-gray-300">
                  💡 这里显示所有任务（包括默认任务和自定义任务）。你可以编辑任何任务。删除默认任务会将其隐藏，删除自定义任务会永久删除。
                </p>
              </div>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                {['S', 'A', 'B', 'C'].map(level => {
                  const defaultTasks = taskTemplates[level] || [];
                  const custom = customTasks[level] || [];
                  const allLevelTasks = [...defaultTasks, ...custom];

                  if (allLevelTasks.length === 0) return null;

                  return (
                    <div key={level}>
                      <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <span className={`w-8 h-8 rounded flex items-center justify-center font-bold ${
                          level === 'S' ? 'bg-red-600' :
                          level === 'A' ? 'bg-orange-600' :
                          level === 'B' ? 'bg-blue-600' : 'bg-purple-600'
                        }`}>
                          {level}
                        </span>
                        {level}级任务 ({allLevelTasks.length}个)
                      </h4>
                      <div className="space-y-2">
                        {allLevelTasks.map(task => {
                          const isDefault = isDefaultTask(level, task.name);
                          const isHidden = isTaskHidden(level, task.name);
                          return (
                            <div key={task.name} className={`rounded-lg p-4 flex justify-between items-center transition-colors ${
                              isHidden
                                ? 'bg-slate-700/30 border border-gray-600 opacity-60'
                                : 'bg-slate-700/50 hover:bg-slate-700'
                            }`}>
                              <div className="flex-1">
                                <div className="font-semibold text-white flex items-center gap-2">
                                  {task.name}
                                  {isDefault ?
                                    <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">默认</span> :
                                    <span className="text-xs bg-purple-600 px-2 py-0.5 rounded">自定义</span>
                                  }
                                  {isHidden && <span className="text-xs bg-gray-600 px-2 py-0.5 rounded">已隐藏</span>}
                                </div>
                                {task.description && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {task.description}
                                  </div>
                                )}
                                <div className="text-sm text-gray-400 mt-1">
                                  基础分: {task.baseScore} | 时长: {task.time}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {isHidden ? (
                                  <button
                                    onClick={() => showTask(level, task.name)}
                                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
                                    title="恢复此任务"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    显示
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => {
                                        startEditTask(level, task);
                                        setShowManageTasksModal(false);
                                      }}
                                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      编辑
                                    </button>
                                    <button
                                      onClick={() => deleteCustomTask(level, task.name)}
                                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
                                      title={isDefault ? "隐藏此任务" : "永久删除此任务"}
                                    >
                                      <XCircle className="w-4 h-4" />
                                      {isDefault ? '隐藏' : '删除'}
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700 flex gap-3">
                <button
                  onClick={() => setShowManageTasksModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-semibold transition-colors"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    setShowManageTasksModal(false);
                    setShowCustomModal(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  创建新任务
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 成就弹窗（完整版） */}
        {showAchievementModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-4xl w-full border border-purple-500/30 shadow-2xl my-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  成就系统
                </h3>
                <button
                  onClick={() => setShowAchievementModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="w-8 h-8" />
                </button>
              </div>

              <div className="mb-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-4 border border-purple-500/30">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {unlockedAchievements.length} / {achievementsList.length}
                    </div>
                    <div className="text-sm text-gray-300">已解锁成就</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">
                      {Math.round((unlockedAchievements.length / achievementsList.length) * 100)}%
                    </div>
                    <div className="text-sm text-gray-300">完成度</div>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
                    style={{ width: `${(unlockedAchievements.length / achievementsList.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* 按类别分组显示成就 */}
              <div className="max-h-[60vh] overflow-y-auto pr-2">
              {['新手', '连胜', '勤奋', '段位', '胜率', 'KDA', '特殊'].map(category => {
                const categoryAchievements = achievementsList.filter(a => a.category === category);
                return (
                  <div key={category} className="mb-6">
                    <h4 className="text-xl font-bold mb-3 text-purple-300">📌 {category}成就</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categoryAchievements.map(achievement => {
                        const isUnlocked = unlockedAchievements.includes(achievement.id);
                        return (
                          <div
                            key={achievement.id}
                            className={`rounded-lg p-4 border transition-all ${
                              isUnlocked
                                ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-purple-500/50 shadow-lg'
                                : 'bg-slate-700/30 border-slate-600 opacity-60'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`text-4xl ${isUnlocked ? '' : 'grayscale'}`}>
                                {achievement.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-bold text-white">{achievement.name}</h5>
                                  {isUnlocked && (
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-300">{achievement.desc}</p>
                                <div className="mt-1 text-xs text-yellow-400">
                                  奖励: {achievement.reward}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700 text-center">
                <button
                  onClick={() => setShowAchievementModal(false)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 新成就解锁提示 */}
        {newAchievement && (
          <div className="fixed top-20 right-4 z-50 animate-bounce">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 shadow-2xl border-4 border-yellow-400 max-w-sm">
              <div className="text-center">
                <div className="text-6xl mb-3">{newAchievement.icon}</div>
                <div className="text-yellow-300 text-sm font-semibold mb-1">🎉 成就解锁！</div>
                <div className="text-2xl font-bold text-white mb-2">{newAchievement.name}</div>
                <div className="text-sm text-gray-200 mb-3">{newAchievement.desc}</div>
                <div className="bg-black/30 rounded-lg py-2 px-4">
                  <div className="text-yellow-400 font-bold">奖励: {newAchievement.reward}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 清空数据确认对话框 */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border-4 border-red-500/50 shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-red-400 mb-2">
                  确定要清空所有数据吗？
                </h3>
                <p className="text-gray-300 text-sm">
                  此操作将永久删除：
                </p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4 mb-6 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span>所有任务记录（{tasks.length} 个）</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span>当前积分（{totalScore} 分）和段位</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span>连胜记录（{streak} 连胜）</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span>自定义任务（{Object.values(customTasks).reduce((sum: any, arr: any) => sum + (arr?.length || 0), 0) as any} 个）</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span>成就进度（{unlockedAchievements.length}/{achievementsList.length}）</span>
                </div>
              </div>

              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mb-6">
                <p className="text-red-300 text-sm font-semibold text-center">
                  ⚠️ 此操作不可恢复！请先导出数据备份！
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-semibold transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={clearAllData}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition-colors"
                >
                  确定清空
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchRankingSystem;