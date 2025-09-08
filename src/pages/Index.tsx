import { useState } from 'react';
import { History, Download, Settings } from 'lucide-react';
import { HistoryFilter as FilterType, ViewMode } from '@/types/history';
import { useHistoryData } from '@/hooks/useHistoryData';
import { HistoryFilter } from '@/components/HistoryFilter';
import { HistoryList } from '@/components/HistoryList';
import { HistoryTimeline } from '@/components/HistoryTimeline';
import { HistoryGrouped } from '@/components/HistoryGrouped';
import { ViewToggle } from '@/components/ViewToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filter, setFilter] = useState<FilterType>({
    timeRange: { start: null, end: null },
    quickTimeFilter: 'all',
    domains: [],
    tags: [],
    searchQuery: ''
  });

  const {
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
  } = useHistoryData();

  const filteredHistory = filterHistory(filter);
  const timelineGroups = groupByDate(filteredHistory);
  const domainGroups = groupByDomain(filteredHistory);

  const handleOpenUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddTag = (itemId: string, tag: string) => {
    addTagToItems([itemId], tag);
  };

  const handleRemoveTag = (itemId: string, tag: string) => {
    removeTagFromItems([itemId], tag);
  };

  const handleDelete = (itemId: string) => {
    deleteItems([itemId]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <History className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  浏览器历史管理器
                </h1>
                <p className="text-sm text-muted-foreground">
                  查看、搜索和管理您的浏览历史记录
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                导出
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                设置
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <HistoryFilter
          filter={filter}
          onChange={setFilter}
          availableDomains={getAllDomains}
          availableTags={getAllTags}
        />

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <ViewToggle
              currentView={viewMode}
              onViewChange={setViewMode}
            />
            <div className="text-sm text-muted-foreground">
              找到 {filteredHistory.length} 条记录
            </div>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-6">
            {viewMode === 'list' && (
              <HistoryList
                items={filteredHistory}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
                onDelete={handleDelete}
              />
            )}

            {viewMode === 'timeline' && (
              <HistoryTimeline
                groups={timelineGroups}
                onOpenUrl={handleOpenUrl}
              />
            )}

            {viewMode === 'grouped' && (
              <HistoryGrouped
                groupedItems={domainGroups}
                onOpenUrl={handleOpenUrl}
              />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;