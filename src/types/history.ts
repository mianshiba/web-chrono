export interface HistoryItem {
  id: string;
  url: string;
  title: string;
  visitTime: Date;
  domain: string;
  favicon?: string;
  tags: string[];
  visitCount: number;
}

export interface HistoryFilter {
  timeRange: {
    start: Date | null;
    end: Date | null;
  };
  quickTimeFilter: 'today' | 'yesterday' | 'week' | 'month' | 'all';
  domains: string[];
  tags: string[];
  searchQuery: string;
}

export type ViewMode = 'list' | 'timeline' | 'grouped';

export interface HistoryGroup {
  date: string;
  items: HistoryItem[];
}