import { useState } from 'react';
import { Calendar, Search, Tag, Globe, Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import { HistoryFilter as FilterType } from '@/types/history';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface HistoryFilterProps {
  filter: FilterType;
  onChange: (filter: FilterType) => void;
  availableDomains: string[];
  availableTags: string[];
}

export function HistoryFilter({ filter, onChange, availableDomains, availableTags }: HistoryFilterProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const quickTimeOptions = [
    { value: 'all', label: '全部时间' },
    { value: 'today', label: '今天' },
    { value: 'yesterday', label: '昨天' },
    { value: 'week', label: '最近一周' },
    { value: 'month', label: '最近一月' }
  ];

  const updateFilter = (updates: Partial<FilterType>) => {
    onChange({ ...filter, ...updates });
  };

  const clearFilter = () => {
    onChange({
      timeRange: { start: null, end: null },
      quickTimeFilter: 'all',
      domains: [],
      tags: [],
      searchQuery: ''
    });
  };

  const hasActiveFilters = 
    filter.quickTimeFilter !== 'all' ||
    filter.timeRange.start ||
    filter.timeRange.end ||
    filter.domains.length > 0 ||
    filter.tags.length > 0 ||
    filter.searchQuery;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索标题、URL 或域名..."
            value={filter.searchQuery}
            onChange={(e) => updateFilter({ searchQuery: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Quick Time Filter */}
        <Select
          value={filter.quickTimeFilter}
          onValueChange={(value: any) => updateFilter({ quickTimeFilter: value })}
        >
          <SelectTrigger className="w-32">
            <Clock className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {quickTimeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={cn(showAdvanced && "bg-primary/10 border-primary")}
        >
          高级筛选
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilter}>
            <X className="h-4 w-4 mr-1" />
            清除
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-border space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Custom Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">自定义时间范围</label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      {filter.timeRange.start ? format(filter.timeRange.start, 'MM/dd') : '开始日期'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filter.timeRange.start || undefined}
                      onSelect={(date) => updateFilter({ 
                        timeRange: { ...filter.timeRange, start: date || null }
                      })}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      {filter.timeRange.end ? format(filter.timeRange.end, 'MM/dd') : '结束日期'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filter.timeRange.end || undefined}
                      onSelect={(date) => updateFilter({ 
                        timeRange: { ...filter.timeRange, end: date || null }
                      })}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Domain Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">按网站筛选</label>
              <Select
                onValueChange={(domain) => {
                  if (!filter.domains.includes(domain)) {
                    updateFilter({ domains: [...filter.domains, domain] });
                  }
                }}
              >
                <SelectTrigger>
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="选择网站..." />
                </SelectTrigger>
                <SelectContent>
                  {availableDomains.map(domain => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">按标签筛选</label>
            <Select
              onValueChange={(tag) => {
                if (!filter.tags.includes(tag)) {
                  updateFilter({ tags: [...filter.tags, tag] });
                }
              }}
            >
              <SelectTrigger className="w-48">
                <Tag className="h-4 w-4 mr-2" />
                <SelectValue placeholder="选择标签..." />
              </SelectTrigger>
              <SelectContent>
                {availableTags.map(tag => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {(filter.domains.length > 0 || filter.tags.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {filter.domains.map(domain => (
                <Badge key={domain} variant="secondary" className="gap-1">
                  <Globe className="h-3 w-3" />
                  {domain}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => updateFilter({ 
                      domains: filter.domains.filter(d => d !== domain) 
                    })}
                  />
                </Badge>
              ))}
              {filter.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => updateFilter({ 
                      tags: filter.tags.filter(t => t !== tag) 
                    })}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}