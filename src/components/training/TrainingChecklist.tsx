import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  Play, 
  Pause, 
  Award, 
  MessageSquare,
  ChefHat,
  Video,
  FileText,
  Users,
  ArrowLeft,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TrainingTask {
  id: string;
  title: string;
  description: string;
  estimated_minutes: number;
  is_required: boolean;
  order_index: number;
  task_type: 'checklist' | 'quiz' | 'video' | 'roleplay';
  task_data: any;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completed_at?: string;
  time_spent_minutes: number;
  score?: number;
  notes?: string;
}

interface TrainingChecklistProps {
  instanceId: string;
  templateName: string;
  tasks: TrainingTask[];
  currentUserRole?: string;
  isLeader: boolean;
  onBack: () => void;
  onRequestApproval: () => void;
  onApprove?: () => void;
  canApprove?: boolean;
  status: string;
}

const taskTypeIcons = {
  checklist: CheckCircle2,
  quiz: FileText,
  video: Video,
  roleplay: Users,
};

export function TrainingChecklist({
  instanceId,
  templateName,
  tasks: initialTasks,
  currentUserRole,
  isLeader,
  onBack,
  onRequestApproval,
  onApprove,
  canApprove,
  status
}: TrainingChecklistProps) {
  const [tasks, setTasks] = useState<TrainingTask[]>(initialTasks);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [taskNotes, setTaskNotes] = useState<{ [key: string]: string }>({});
  const [timeSpent, setTimeSpent] = useState<{ [key: string]: number }>({});
  const [startTimes, setStartTimes] = useState<{ [key: string]: Date }>({});
  const { toast } = useToast();

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const allTasksCompleted = completedTasks === totalTasks;

  useEffect(() => {
    // Initialize notes from existing task data
    const notes: { [key: string]: string } = {};
    const spent: { [key: string]: number } = {};
    tasks.forEach(task => {
      if (task.notes) notes[task.id] = task.notes;
      spent[task.id] = task.time_spent_minutes || 0;
    });
    setTaskNotes(notes);
    setTimeSpent(spent);
  }, [tasks]);

  const updateTaskStatus = async (taskId: string, newStatus: TrainingTask['status']) => {
    try {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) return;

      // Calculate time spent if task is being completed
      let finalTimeSpent = timeSpent[taskId] || 0;
      if (newStatus === 'completed' && startTimes[taskId]) {
        const additionalTime = Math.floor((Date.now() - startTimes[taskId].getTime()) / 60000);
        finalTimeSpent += additionalTime;
      }

      const { error } = await supabase
        .from('training_instance_tasks')
        .update({
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
          time_spent_minutes: finalTimeSpent,
          notes: taskNotes[taskId] || null,
          updated_at: new Date().toISOString()
        })
        .eq('instance_id', instanceId)
        .eq('template_task_id', taskId);

      if (error) throw error;

      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: newStatus, 
              completed_at: newStatus === 'completed' ? new Date().toISOString() : undefined,
              time_spent_minutes: finalTimeSpent
            }
          : task
      ));

      setTimeSpent(prev => ({ ...prev, [taskId]: finalTimeSpent }));

      if (newStatus === 'completed') {
        setActiveTaskId(null);
        setStartTimes(prev => {
          const newTimes = { ...prev };
          delete newTimes[taskId];
          return newTimes;
        });
        toast({
          title: "Task Completed!",
          description: `"${taskToUpdate.title}" has been marked as complete.`,
        });
      }

    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startTask = (taskId: string) => {
    setActiveTaskId(taskId);
    setStartTimes(prev => ({ ...prev, [taskId]: new Date() }));
    updateTaskStatus(taskId, 'in_progress');
  };

  const pauseTask = (taskId: string) => {
    if (startTimes[taskId]) {
      const additionalTime = Math.floor((Date.now() - startTimes[taskId].getTime()) / 60000);
      setTimeSpent(prev => ({ ...prev, [taskId]: (prev[taskId] || 0) + additionalTime }));
      setStartTimes(prev => {
        const newTimes = { ...prev };
        delete newTimes[taskId];
        return newTimes;
      });
    }
    setActiveTaskId(null);
  };

  const completeTask = (taskId: string) => {
    updateTaskStatus(taskId, 'completed');
  };

  const updateTaskNotes = async (taskId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('training_instance_tasks')
        .update({ 
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('instance_id', instanceId)
        .eq('template_task_id', taskId);

      if (error) throw error;

      setTaskNotes(prev => ({ ...prev, [taskId]: notes }));
      
      toast({
        title: "Notes Saved",
        description: "Your notes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating task notes:', error);
      toast({
        title: "Error",
        description: "Failed to save notes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTaskIcon = (task: TrainingTask) => {
    const IconComponent = taskTypeIcons[task.task_type] || CheckCircle2;
    return <IconComponent className="w-4 h-4" />;
  };

  const getTaskStatusColor = (status: TrainingTask['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in_progress':
        return 'text-blue-600';
      case 'skipped':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Training
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-red-600" />
              {templateName}
            </h1>
            <p className="text-muted-foreground">Training Checklist</p>
          </div>
        </div>

        {/* Approval Actions */}
        {allTasksCompleted && status === 'completed' && (
          <div className="flex gap-2">
            {canApprove && onApprove && (
              <Button onClick={onApprove} className="bg-green-600 hover:bg-green-700">
                <Award className="w-4 h-4 mr-2" />
                Approve Training
              </Button>
            )}
            {!canApprove && (
              <Button onClick={onRequestApproval} variant="outline">
                <Send className="w-4 h-4 mr-2" />
                Request Approval
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedTasks} of {totalTasks} tasks completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{progressPercentage}% Complete</span>
              {allTasksCompleted && (
                <span className="text-green-600 font-medium">Ready for Approval!</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="space-y-4">
        {tasks
          .sort((a, b) => a.order_index - b.order_index)
          .map((task, index) => (
            <Card key={task.id} className={cn(
              "transition-all duration-200",
              task.status === 'completed' && "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800",
              activeTaskId === task.id && "ring-2 ring-blue-500"
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2",
                      task.status === 'completed' ? "bg-green-600 border-green-600 text-white" : "border-gray-300"
                    )}>
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getTaskIcon(task)}
                        {task.title}
                        {task.is_required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {task.estimated_minutes}min
                    </Badge>
                    {task.status !== 'pending' && (
                      <Badge variant="outline" className={cn("text-xs", getTaskStatusColor(task.status))}>
                        {task.status === 'in_progress' && <Play className="w-3 h-3 mr-1" />}
                        {task.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {task.status.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Task Controls */}
                {task.status === 'pending' && (
                  <Button 
                    onClick={() => startTask(task.id)}
                    className="w-full"
                    variant="outline"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Task
                  </Button>
                )}

                {task.status === 'in_progress' && (
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => pauseTask(task.id)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                    <Button 
                      onClick={() => completeTask(task.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Complete
                    </Button>
                  </div>
                )}

                {/* Time Tracking */}
                {(task.status === 'in_progress' || task.time_spent_minutes > 0) && (
                  <div className="text-sm text-muted-foreground">
                    Time spent: {timeSpent[task.id] || task.time_spent_minutes || 0} minutes
                    {activeTaskId === task.id && " (running...)"}
                  </div>
                )}

                {/* Task Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Notes & Observations
                  </label>
                  <Textarea
                    placeholder="Add notes about your progress, observations, or questions..."
                    value={taskNotes[task.id] || ''}
                    onChange={(e) => setTaskNotes(prev => ({ ...prev, [task.id]: e.target.value }))}
                    onBlur={() => updateTaskNotes(task.id, taskNotes[task.id] || '')}
                    className="min-h-[80px]"
                  />
                </div>

                {/* Task-specific content */}
                {task.task_type === 'quiz' && task.task_data?.passing_score && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <Award className="w-4 h-4 inline mr-1" />
                      Minimum passing score: {task.task_data.passing_score}%
                    </p>
                  </div>
                )}

                {task.task_data?.requires_signoff && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      <Award className="w-4 h-4 inline mr-1" />
                      This task requires leadership sign-off
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}