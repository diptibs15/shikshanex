import { cn } from '@/lib/utils';
import { Lock, CheckCircle2, PlayCircle, FileText, ClipboardCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface Module {
  id: string;
  title: string;
  order_index: number;
  duration_minutes: number | null;
  video_url: string | null;
  notes_url: string | null;
}

interface ModuleProgress {
  module_id: string;
  video_completed: boolean;
  notes_viewed: boolean;
  exam_passed: boolean;
}

interface ModuleSidebarProps {
  modules: Module[];
  currentModuleIndex: number;
  moduleProgress: Record<string, ModuleProgress>;
  onModuleSelect: (index: number) => void;
  courseName: string;
  overallProgress: number;
}

const ModuleSidebar = ({
  modules,
  currentModuleIndex,
  moduleProgress,
  onModuleSelect,
  courseName,
  overallProgress,
}: ModuleSidebarProps) => {
  const isModuleUnlocked = (index: number): boolean => {
    if (index === 0) return true;
    const previousModule = modules[index - 1];
    const prevProgress = moduleProgress[previousModule?.id];
    return prevProgress?.exam_passed === true;
  };

  const isModuleCompleted = (moduleId: string): boolean => {
    const progress = moduleProgress[moduleId];
    return progress?.video_completed && progress?.notes_viewed && progress?.exam_passed;
  };

  const getModuleStatus = (module: Module, index: number) => {
    if (!isModuleUnlocked(index)) return 'locked';
    if (isModuleCompleted(module.id)) return 'completed';
    if (index === currentModuleIndex) return 'current';
    return 'available';
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full">
      {/* Course Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-heading font-bold text-lg text-foreground truncate">{courseName}</h2>
        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium text-foreground">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </div>

      {/* Module List */}
      <div className="flex-1 overflow-y-auto p-2">
        {modules.map((module, index) => {
          const status = getModuleStatus(module, index);
          const progress = moduleProgress[module.id];

          return (
            <button
              key={module.id}
              onClick={() => status !== 'locked' && onModuleSelect(index)}
              disabled={status === 'locked'}
              className={cn(
                'w-full text-left p-3 rounded-lg mb-2 transition-all',
                status === 'locked' && 'opacity-50 cursor-not-allowed bg-muted/30',
                status === 'completed' && 'bg-primary/10 border border-primary/20',
                status === 'current' && 'bg-primary text-primary-foreground',
                status === 'available' && 'hover:bg-muted bg-muted/50'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {status === 'locked' && <Lock className="h-5 w-5 text-muted-foreground" />}
                  {status === 'completed' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  {(status === 'current' || status === 'available') && (
                    <PlayCircle className={cn('h-5 w-5', status === 'current' ? 'text-primary-foreground' : 'text-primary')} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-xs font-medium',
                      status === 'current' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    )}>
                      Module {index + 1}
                    </span>
                    {status === 'completed' && (
                      <Badge variant="secondary" className="text-xs py-0">Done</Badge>
                    )}
                  </div>
                  <p className={cn(
                    'font-medium text-sm truncate',
                    status === 'current' ? 'text-primary-foreground' : 'text-foreground'
                  )}>
                    {module.title}
                  </p>
                  {module.duration_minutes && (
                    <p className={cn(
                      'text-xs mt-1',
                      status === 'current' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      {module.duration_minutes} min
                    </p>
                  )}

                  {/* Progress indicators */}
                  {status !== 'locked' && progress && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className={cn(
                        'flex items-center gap-1 text-xs',
                        progress.video_completed ? 'text-primary' : 'text-muted-foreground'
                      )}>
                        <PlayCircle className="h-3 w-3" />
                      </div>
                      <div className={cn(
                        'flex items-center gap-1 text-xs',
                        progress.notes_viewed ? 'text-primary' : 'text-muted-foreground'
                      )}>
                        <FileText className="h-3 w-3" />
                      </div>
                      <div className={cn(
                        'flex items-center gap-1 text-xs',
                        progress.exam_passed ? 'text-primary' : 'text-muted-foreground'
                      )}>
                        <ClipboardCheck className="h-3 w-3" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModuleSidebar;
