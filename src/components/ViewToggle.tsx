import { List, Clock, Layers } from 'lucide-react';
import { ViewMode } from '@/types/history';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  const views = [
    { mode: 'list' as ViewMode, icon: List, label: '列表视图' },
    { mode: 'timeline' as ViewMode, icon: Clock, label: '时间轴' },
    { mode: 'grouped' as ViewMode, icon: Layers, label: '分组视图' }
  ];

  return (
    <div className="flex rounded-lg border border-border bg-background">
      {views.map((view) => {
        const Icon = view.icon;
        return (
          <Button
            key={view.mode}
            variant="ghost"
            size="sm"
            onClick={() => onViewChange(view.mode)}
            className={cn(
              "rounded-none first:rounded-l-lg last:rounded-r-lg border-r last:border-r-0 border-border/50",
              currentView === view.mode && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            )}
          >
            <Icon className="h-4 w-4 mr-2" />
            {view.label}
          </Button>
        );
      })}
    </div>
  );
}