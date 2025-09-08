import { useState, useMemo } from 'react';
import { HistoryItem, HistoryFilter, HistoryGroup } from '@/types/history';

// Mock data generator
const generateMockHistory = (): HistoryItem[] => {
  const domains = [
    'github.com', 'stackoverflow.com', 'youtube.com', 'google.com',
    'wikipedia.org', 'medium.com', 'dev.to', 'twitter.com', 'reddit.com',
    'docs.microsoft.com', 'mdn.mozilla.org', 'vercel.com'
  ];
  
  const titles = [
    '用户界面设计最佳实践', 'React 性能优化技巧', 'TypeScript 深度解析',
    'CSS Grid 布局指南', '前端开发工具推荐', '代码审查流程',
    '项目管理方法论', '开源项目贡献指南', 'API 设计原则',
    '数据库优化策略', '微服务架构实践', '测试驱动开发'
  ];

  const tags = ['开发', '设计', '工具', '学习', '文档', '项目'];

  const history: HistoryItem[] = [];
  
  for (let i = 0; i < 200; i++) {
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    
    const visitTime = new Date();
    visitTime.setDate(visitTime.getDate() - daysAgo);
    visitTime.setHours(visitTime.getHours() - hoursAgo);

    history.push({
      id: `hist-${i}`,
      url: `https://${domain}/${Math.random().toString(36).substr(2, 9)}`,
      title,
      visitTime,
      domain,
      favicon: `https://favicon.im/${domain}?larger=true`,
      tags: Math.random() > 0.7 ? [tags[Math.floor(Math.random() * tags.length)]] : [],
      visitCount: Math.floor(Math.random() * 10) + 1
    });
  }

  return history.sort((a, b) => b.visitTime.getTime() - a.visitTime.getTime());
};

export const useHistoryData = () => {
  const [history] = useState<HistoryItem[]>(generateMockHistory);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  const filterHistory = (filter: HistoryFilter): HistoryItem[] => {
    return history.filter(item => {
      // Time filter
      if (filter.quickTimeFilter !== 'all') {
        const now = new Date();
        const itemDate = new Date(item.visitTime);
        
        switch (filter.quickTimeFilter) {
          case 'today':
            if (itemDate.toDateString() !== now.toDateString()) return false;
            break;
          case 'yesterday':
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            if (itemDate.toDateString() !== yesterday.toDateString()) return false;
            break;
          case 'week':
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            if (itemDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            if (itemDate < monthAgo) return false;
            break;
        }
      }

      // Custom time range
      if (filter.timeRange.start && item.visitTime < filter.timeRange.start) return false;
      if (filter.timeRange.end && item.visitTime > filter.timeRange.end) return false;

      // Domain filter
      if (filter.domains.length > 0 && !filter.domains.includes(item.domain)) return false;

      // Tags filter
      if (filter.tags.length > 0 && !filter.tags.some(tag => item.tags.includes(tag))) return false;

      // Search query
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(query) ||
               item.url.toLowerCase().includes(query) ||
               item.domain.toLowerCase().includes(query);
      }

      return true;
    });
  };

  const groupByDate = (items: HistoryItem[]): HistoryGroup[] => {
    const groups = new Map<string, HistoryItem[]>();
    
    items.forEach(item => {
      const dateKey = item.visitTime.toDateString();
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(item);
    });

    return Array.from(groups.entries())
      .map(([date, items]) => ({ date, items }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const groupByDomain = (items: HistoryItem[]): Map<string, HistoryItem[]> => {
    const groups = new Map<string, HistoryItem[]>();
    
    items.forEach(item => {
      if (!groups.has(item.domain)) {
        groups.set(item.domain, []);
      }
      groups.get(item.domain)!.push(item);
    });

    return groups;
  };

  const getAllDomains = useMemo(() => {
    const domains = new Set(history.map(item => item.domain));
    return Array.from(domains).sort();
  }, [history]);

  const getAllTags = useMemo(() => {
    const tags = new Set(history.flatMap(item => item.tags));
    return Array.from(tags).sort();
  }, [history]);

  const addTagToItems = (itemIds: string[], tag: string) => {
    // In a real app, this would update the backend
    console.log('Adding tag', tag, 'to items', itemIds);
  };

  const removeTagFromItems = (itemIds: string[], tag: string) => {
    // In a real app, this would update the backend
    console.log('Removing tag', tag, 'from items', itemIds);
  };

  const deleteItems = (itemIds: string[]) => {
    // In a real app, this would update the backend
    console.log('Deleting items', itemIds);
  };

  return {
    history,
    selectedItems,
    setSelectedItems,
    filterHistory,
    groupByDate,
    groupByDomain,
    getAllDomains,
    getAllTags,
    addTagToItems,
    removeTagFromItems,
    deleteItems
  };
};