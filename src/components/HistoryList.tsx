import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { 
  ExternalLink, 
  Clock, 
  Tag, 
  MoreVertical,
  Eye,
  Trash2,
  Plus,
  Check
} from 'lucide-react';
import { HistoryItem } from '@/types/history';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface HistoryListProps {
  items: HistoryItem[];
  selectedItems: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
  onAddTag: (itemId: string, tag: string) => void;
  onRemoveTag: (itemId: string, tag: string) => void;
  onDelete: (itemId: string) => void;
}

export function HistoryList({ 
  items, 
  selectedItems, 
  onSelectionChange,
  onAddTag,
  onRemoveTag,
  onDelete 
}: HistoryListProps) {
  const [newTagValue, setNewTagValue] = useState('');
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);

  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    onSelectionChange(newSelected);
  };

  const selectAll = () => {
    onSelectionChange(new Set(items.map(item => item.id)));
  };

  const clearSelection = () => {
    onSelectionChange(new Set());
  };

  const handleAddTag = () => {
    if (currentItem && newTagValue.trim()) {
      onAddTag(currentItem.id, newTagValue.trim());
      setNewTagValue('');
      setTagDialogOpen(false);
      setCurrentItem(null);
    }
  };

  const handleOpenUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>没有找到匹配的历史记录</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-accent-foreground">
            已选择 {selectedItems.size} 项
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearSelection}>
              取消选择
            </Button>
            <Button variant="outline" size="sm">
              批量添加标签
            </Button>
            <Button variant="destructive" size="sm">
              批量删除
            </Button>
          </div>
        </div>
      )}

      {/* Selection Controls */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={selectedItems.size === items.length ? clearSelection : selectAll}
          >
            {selectedItems.size === items.length ? '取消全选' : '全选'}
          </Button>
          <span>共 {items.length} 条记录</span>
        </div>
      </div>

      {/* History Items */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "bg-card border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors",
              selectedItems.has(item.id) && "border-primary bg-primary/5"
            )}
          >
            <div className="flex items-start gap-3">
              {/* Selection Checkbox */}
              <Checkbox
                checked={selectedItems.has(item.id)}
                onCheckedChange={() => toggleItemSelection(item.id)}
                className="mt-1"
              />

              {/* Favicon */}
              <div className="w-4 h-4 mt-1 flex-shrink-0">
                {item.favicon ? (
                  <img 
                    src={item.favicon} 
                    alt="" 
                    className="w-full h-full rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-muted rounded" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {item.url}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(item.visitTime, { 
                          addSuffix: true, 
                          locale: zhCN 
                        })}
                      </span>
                      <span>{item.domain}</span>
                      {item.visitCount > 1 && (
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.visitCount}次访问
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenUrl(item.url)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        打开链接
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setCurrentItem(item);
                          setTagDialogOpen(true);
                        }}
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        添加标签
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(item.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Tags */}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="text-xs h-5 px-2 gap-1"
                      >
                        <Tag className="h-2 w-2" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Tag Dialog */}
      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>添加标签</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">标签名称</label>
              <Input
                value={newTagValue}
                onChange={(e) => setNewTagValue(e.target.value)}
                placeholder="输入标签名称..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag();
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setTagDialogOpen(false)}
              >
                取消
              </Button>
              <Button onClick={handleAddTag} disabled={!newTagValue.trim()}>
                <Plus className="h-4 w-4 mr-1" />
                添加
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}