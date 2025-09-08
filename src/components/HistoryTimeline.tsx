import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Clock, ExternalLink, Tag } from 'lucide-react';
import { HistoryGroup } from '@/types/history';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface HistoryTimelineProps {
  groups: HistoryGroup[];
  onOpenUrl: (url: string) => void;
}

export function HistoryTimeline({ groups, onOpenUrl }: HistoryTimelineProps) {
  if (groups.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>没有找到匹配的历史记录</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.date} className="relative">
          {/* Date Header */}
          <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-2 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <h2 className="text-lg font-semibold text-foreground">
                {format(new Date(group.date), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
              </h2>
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-sm text-muted-foreground bg-background px-2">
                {group.items.length} 项
              </span>
            </div>
          </div>

          {/* Timeline Items */}
          <div className="ml-6 space-y-3 relative">
            {/* Timeline Line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-border"></div>

            {group.items.map((item, index) => (
              <div key={item.id} className="relative pl-6">
                {/* Timeline Dot */}
                <div className="absolute left-0 top-2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2"></div>

                {/* Item Content */}
                <div className="bg-card border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
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
                          <h3 className="font-medium text-foreground line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {item.domain}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(item.visitTime, 'HH:mm')}
                            </span>
                            {item.visitCount > 1 && (
                              <span>访问 {item.visitCount} 次</span>
                            )}
                          </div>
                        </div>

                        {/* Open Button */}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onOpenUrl(item.url)}
                          className="h-8 w-8 p-0 flex-shrink-0"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Tags */}
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
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
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}