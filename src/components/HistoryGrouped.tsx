import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Globe, 
  ExternalLink,
  Tag,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { HistoryItem } from '@/types/history';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface HistoryGroupedProps {
  groupedItems: Map<string, HistoryItem[]>;
  onOpenUrl: (url: string) => void;
}

export function HistoryGrouped({ groupedItems, onOpenUrl }: HistoryGroupedProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (domain: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(domain)) {
      newExpanded.delete(domain);
    } else {
      newExpanded.add(domain);
    }
    setExpandedGroups(newExpanded);
  };

  const sortedGroups = Array.from(groupedItems.entries())
    .sort(([, itemsA], [, itemsB]) => {
      const latestA = Math.max(...itemsA.map(item => item.visitTime.getTime()));
      const latestB = Math.max(...itemsB.map(item => item.visitTime.getTime()));
      return latestB - latestA;
    });

  if (sortedGroups.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>没有找到匹配的历史记录</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedGroups.map(([domain, items]) => {
        const isExpanded = expandedGroups.has(domain);
        const totalVisits = items.reduce((sum, item) => sum + item.visitCount, 0);
        const latestVisit = items.reduce((latest, item) => 
          item.visitTime > latest ? item.visitTime : latest, 
          items[0].visitTime
        );
        const favicon = items.find(item => item.favicon)?.favicon;

        return (
          <Card key={domain} className="overflow-hidden">
            <Collapsible 
              open={isExpanded} 
              onOpenChange={() => toggleGroup(domain)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        
                        {/* Favicon */}
                        <div className="w-5 h-5 flex-shrink-0">
                          {favicon ? (
                            <img 
                              src={favicon} 
                              alt="" 
                              className="w-full h-full rounded"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <Globe className="w-full h-full text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{domain}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{items.length} 页面</span>
                          <span>{totalVisits} 次访问</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            最近访问: {format(latestVisit, 'MM/dd HH:mm')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Badge variant="secondary" className="ml-2">
                      {items.length}
                    </Badge>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0 px-4 pb-4">
                  <div className="space-y-2">
                    {items
                      .sort((a, b) => b.visitTime.getTime() - a.visitTime.getTime())
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground line-clamp-2 text-sm">
                              {item.title}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {item.url.replace(`https://${domain}`, '')}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(item.visitTime, 'MM/dd HH:mm')}
                              </span>
                              {item.visitCount > 1 && (
                                <span>访问 {item.visitCount} 次</span>
                              )}
                            </div>

                            {/* Tags */}
                            {item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.tags.map((tag) => (
                                  <Badge 
                                    key={tag} 
                                    variant="secondary" 
                                    className="text-xs h-4 px-1 gap-1"
                                  >
                                    <Tag className="h-2 w-2" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenUrl(item.url);
                            }}
                            className="h-7 w-7 p-0 flex-shrink-0"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
}