import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  ClipboardCheck, 
  Users, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  Star,
  Flame,
  ChefHat,
  Play,
  Pause,
  MoreHorizontal
} from 'lucide-react';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface ChecklistTask {
  id: string;
  title: string;
  description: string;
  assigned_to: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  performance_rating: 'below_expectations' | 'met_expectations' | 'exceeded_expectations' | null;
  estimated_minutes: number;
  actual_minutes: number | null;
  is_critical: boolean;
  order_index: number;
  started_at: string | null;
  completed_at: string | null;
  completed_by: string | null;
  profiles?: Profile;
  completed_by_profile?: Profile;
  comments: TaskComment[];
}

interface TaskComment {
  id: string;
  comment: string;
  comment_type: 'note' | 'issue' | 'feedback' | 'instruction';
  profiles: Profile;
  created_at: string;
}

interface Checklist {
  id: string;
  template_id: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  started_at: string | null;
  completed_at: string | null;
  checklist_templates: {
    name: string;
    description: string;
    checklist_type: string;
  };
  tasks: ChecklistTask[];
}

const CHECKLIST_TYPES = [
  { value: 'opening', label: 'Opening', icon: '🌅', color: 'bg-amber-500' },
  { value: 'closing', label: 'Closing', icon: '🌙', color: 'bg-indigo-500' },
  { value: 'prep', label: 'Prep', icon: '🔪', color: 'bg-green-500' },
  { value: 'catering', label: 'Catering', icon: '🍽️', color: 'bg-purple-500' },
  { value: 'maintenance', label: 'Maintenance', icon: '🔧', color: 'bg-orange-500' },
  { value: 'cleaning', label: 'Cleaning', icon: '🧽', color: 'bg-blue-500' },
];

const PERFORMANCE_RATINGS = [
  { value: 'below_expectations', label: 'Below Expectations', color: 'bg-red-500', icon: '📉' },
  { value: 'met_expectations', label: 'Met Expectations', color: 'bg-green-500', icon: '✅' },
  { value: 'exceeded_expectations', label: 'Exceeded Expectations', color: 'bg-primary', icon: '⭐' },
];

const ChecklistsPage = () => {
  const { profile, store } = useAuth();
  const { toast } = useToast();
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [availableStaff, setAvailableStaff] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedChecklist, setSelectedChecklist] = useState<string | null>(null);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ChecklistTask | null>(null);
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<'note' | 'issue' | 'feedback' | 'instruction'>('note');

  useEffect(() => {
    if (store?.id) {
      fetchChecklists();
      fetchAvailableStaff();
    } else if (store === null) {
      // Store is explicitly null, stop loading
      setLoading(false);
    }
  }, [store?.id, selectedDate]);

  const fetchChecklists = async () => {
    if (!store?.id) {
      console.log('No store ID available, skipping checklist fetch');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      console.log('Fetching checklists for store:', store.id, 'date:', selectedDate);
      
      // Fetch checklists first
      const { data: checklistsData, error: checklistsError } = await supabase
        .from('checklists')
        .select('*')
        .eq('store_id', store.id)
        .eq('date', selectedDate)
        .order('created_at');

      if (checklistsError) throw checklistsError;

      if (!checklistsData || checklistsData.length === 0) {
        setChecklists([]);
        return;
      }

      // Fetch templates separately
      const templateIds = [...new Set(checklistsData.map(c => c.template_id))];
      const { data: templatesData, error: templatesError } = await supabase
        .from('checklist_templates')
        .select('*')
        .in('id', templateIds);

      if (templatesError) throw templatesError;

      // Fetch tasks for all checklists
      const checklistIds = checklistsData.map(c => c.id);
      const { data: tasksData, error: tasksError } = await supabase
        .from('checklist_tasks')
        .select('*')
        .in('checklist_id', checklistIds)
        .order('order_index');

      if (tasksError) throw tasksError;

      // Fetch assigned profiles
      const assignedIds = [...new Set(tasksData?.map(t => t.assigned_to).filter(Boolean) || [])];
      const completedByIds = [...new Set(tasksData?.map(t => t.completed_by).filter(Boolean) || [])];
      const allProfileIds = [...new Set([...assignedIds, ...completedByIds])];
      
      let profilesData: any[] = [];
      if (allProfileIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, role')
          .in('id', allProfileIds);

        if (profilesError) {
          console.error('Error loading profiles:', profilesError);
        } else {
          profilesData = profiles || [];
        }
      }

      // Fetch comments for tasks
      const { data: commentsData, error: commentsError } = await supabase
        .from('task_comments')
        .select(`
          *,
          profiles:profile_id (id, first_name, last_name, role)
        `)
        .in('task_id', tasksData?.map(t => t.id) || []);

      if (commentsError) {
        console.error('Error loading comments:', commentsError);
      }

      const data = checklistsData;

      if (error) {
        console.error('Checklist fetch error:', error);
        throw error;
      }

      console.log('Checklists fetched:', data?.length || 0);

      const checklistsWithTasks = data?.map(checklist => {
        const template = templatesData?.find(t => t.id === checklist.template_id);
        const checklistTasks = tasksData?.filter(t => t.checklist_id === checklist.id) || [];
        
        const enrichedTasks = checklistTasks.map((task: any) => {
          const assignedProfile = profilesData.find(p => p.id === task.assigned_to);
          const completedProfile = profilesData.find(p => p.id === task.completed_by);
          const taskComments = commentsData?.filter(c => c.task_id === task.id) || [];
          
          return {
            ...task,
            profiles: assignedProfile,
            completed_by_profile: completedProfile,
            comments: taskComments
          };
        }).sort((a: any, b: any) => a.order_index - b.order_index);

        return {
          ...checklist,
          checklist_templates: template || { name: 'Unknown Template', description: '', checklist_type: 'other' },
          tasks: enrichedTasks
        };
      }) || [];

      setChecklists(checklistsWithTasks as Checklist[]);
    } catch (error) {
      console.error('Error fetching checklists:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load checklists";
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to load checklists. Please check your connection and try again.",
        variant: "destructive",
      });
      setChecklists([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableStaff = async () => {
    if (!store?.id) {
      console.log('No store ID available, skipping staff fetch');
      return;
    }

    try {
      console.log('Fetching staff for store:', store.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role')
        .eq('store_id', store.id)
        .eq('is_active', true);

      if (error) {
        console.error('Staff fetch error:', error);
        throw error;
      }

      console.log('Staff fetched:', data?.length || 0);
      setAvailableStaff(data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setAvailableStaff([]);
    }
  };

  const createDailyChecklists = async () => {
    try {
      // Get all active templates for this store
      const { data: templates, error: templatesError } = await supabase
        .from('checklist_templates')
        .select(`
          *,
          checklist_template_tasks (*)
        `)
        .eq('store_id', store?.id)
        .eq('is_active', true);

      if (templatesError) throw templatesError;

      for (const template of templates || []) {
        // Check if checklist already exists for this date
        const { data: existing } = await supabase
          .from('checklists')
          .select('id')
          .eq('template_id', template.id)
          .eq('date', selectedDate)
          .single();

        if (existing) continue;

        // Create checklist
        const { data: checklist, error: checklistError } = await supabase
          .from('checklists')
          .insert([{
            template_id: template.id,
            store_id: store.id,
            date: selectedDate,
          }])
          .select()
          .single();

        if (checklistError) throw checklistError;

        // Create tasks from template
        const tasks = (template.checklist_template_tasks || []).map((templateTask: any) => ({
          checklist_id: checklist.id,
          template_task_id: templateTask.id,
          title: templateTask.title,
          description: templateTask.description,
          estimated_minutes: templateTask.estimated_minutes,
          is_critical: templateTask.is_critical,
          order_index: templateTask.order_index,
        }));

        if (tasks.length > 0) {
          const { error: tasksError } = await supabase
            .from('checklist_tasks')
            .insert(tasks);

          if (tasksError) throw tasksError;
        }
      }

      toast({
        title: "Success",
        description: "Daily checklists created successfully",
      });

      fetchChecklists();
    } catch (error) {
      console.error('Error creating checklists:', error);
      toast({
        title: "Error",
        description: "Failed to create daily checklists",
        variant: "destructive",
      });
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Handle staff assignment to tasks
    if (destination.droppableId.startsWith('checklist-') && source.droppableId === 'available-staff') {
      const checklistId = destination.droppableId.replace('checklist-', '');
      const staffId = draggableId.replace('staff-', '');
      const checklist = checklists.find(c => c.id === checklistId);
      
      if (checklist && checklist.tasks[destination.index]) {
        await assignStaffToTask(checklist.tasks[destination.index].id, staffId);
      }
    }
  };

  const assignStaffToTask = async (taskId: string, staffId: string) => {
    try {
      const { error } = await supabase
        .from('checklist_tasks')
        .update({ assigned_to: staffId })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Staff assigned to task",
      });

      fetchChecklists();
    } catch (error) {
      console.error('Error assigning staff:', error);
      toast({
        title: "Error",
        description: "Failed to assign staff",
        variant: "destructive",
      });
    }
  };

  const updateTaskStatus = async (taskId: string, status: string, performanceRating?: string) => {
    try {
      const updates: any = { 
        status,
        completed_by: profile?.id || null,
      };

      if (status === 'in_progress') {
        updates.started_at = new Date().toISOString();
      } else if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
        if (performanceRating) {
          updates.performance_rating = performanceRating;
        }
      }

      const { error } = await supabase
        .from('checklist_tasks')
        .update(updates)
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Task ${status.replace('_', ' ')}`,
      });

      fetchChecklists();
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const addComment = async () => {
    if (!selectedTask || !newComment.trim() || !profile) return;

    try {
      const { error } = await supabase
        .from('task_comments')
        .insert([{
          task_id: selectedTask.id,
          profile_id: profile.id,
          comment: newComment.trim(),
          comment_type: commentType,
        }]);

      if (error) throw error;

      setNewComment('');
      setCommentType('note');
      
      toast({
        title: "Success",
        description: "Comment added successfully",
      });

      fetchChecklists();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const getChecklistProgress = (checklist: Checklist) => {
    const completed = checklist.tasks.filter(t => t.status === 'completed').length;
    const total = checklist.tasks.length;
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const getTypeIcon = (type: string) => {
    const typeData = CHECKLIST_TYPES.find(t => t.value === type);
    return typeData?.icon || '📋';
  };

  const getTypeColor = (type: string) => {
    const typeData = CHECKLIST_TYPES.find(t => t.value === type);
    return typeData?.color || 'bg-muted';
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading checklists...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-medium">No Store Access</h3>
          <p className="text-muted-foreground">You need to be associated with a store to view checklists.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <h3 className="text-lg font-medium text-destructive">Error Loading Checklists</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchChecklists} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bbq font-bold text-foreground flex items-center gap-2">
            <ClipboardCheck className="h-8 w-8 text-primary" />
            Checklists
          </h1>
          <p className="text-muted-foreground">Digital task management and completion tracking</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
          
          <Button onClick={fetchChecklists} variant="outline" className="mr-2">
            <Clock className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button onClick={createDailyChecklists} className="btn-bbq">
            <Plus className="h-4 w-4 mr-2" />
            Create Daily Lists
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid gap-6">
          {/* Available Staff */}
          <Card className="card-bbq">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Available Staff
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Droppable droppableId="available-staff" direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex gap-2 min-h-[60px] p-2 bg-muted/30 rounded-lg flex-wrap"
                  >
                    {availableStaff.map((staff, index) => (
                      <Draggable key={staff.id} draggableId={`staff-${staff.id}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`
                              px-3 py-2 bg-card border rounded-md shadow-sm cursor-move
                              ${snapshot.isDragging ? 'shadow-lg scale-105' : ''}
                              hover:shadow-md transition-all
                            `}
                          >
                            <div className="text-sm font-medium">
                              {staff.first_name} {staff.last_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {staff.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}. Try refreshing the page or check your connection.
              </AlertDescription>
            </Alert>
          )}

          {/* Checklists */}
          <div className="grid gap-4">
            {checklists.length === 0 && !loading ? (
              <Alert>
                <ClipboardCheck className="h-4 w-4" />
                <AlertDescription>
                  No checklists for {selectedDate}. Click "Create Daily Lists" to generate today's checklists from templates.
                </AlertDescription>
              </Alert>
            ) : (
              checklists.map((checklist) => (
                <Card key={checklist.id} className="card-bbq">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">{getTypeIcon(checklist.checklist_templates.checklist_type)}</span>
                        {checklist.checklist_templates.name}
                        <Badge className={`${getTypeColor(checklist.checklist_templates.checklist_type)} text-white`}>
                          {checklist.checklist_templates.checklist_type}
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {checklist.tasks.filter(t => t.status === 'completed').length} / {checklist.tasks.length} completed
                          </div>
                          <Progress value={getChecklistProgress(checklist)} className="w-24 h-2" />
                        </div>
                        <Badge variant={checklist.status === 'completed' ? 'default' : 'secondary'}>
                          {checklist.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    {checklist.checklist_templates.description && (
                      <p className="text-sm text-muted-foreground">
                        {checklist.checklist_templates.description}
                      </p>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    <Droppable droppableId={`checklist-${checklist.id}`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`
                            min-h-[100px] space-y-3
                            ${snapshot.isDraggingOver ? 'bg-primary/5 rounded-lg p-2' : ''}
                          `}
                        >
                          {checklist.tasks.map((task, index) => (
                            <div
                              key={task.id}
                              className="flex items-center justify-between p-4 bg-card border rounded-lg shadow-sm"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className="flex flex-col items-center gap-1">
                                  {task.status === 'completed' ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  ) : task.status === 'in_progress' ? (
                                    <Clock className="h-5 w-5 text-amber-500" />
                                  ) : (
                                    <div className="h-5 w-5 border-2 border-muted-foreground rounded-full" />
                                  )}
                                  {task.is_critical && (
                                    <AlertCircle className="h-3 w-3 text-red-500" />
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium">{task.title}</h4>
                                    {task.performance_rating && (
                                      <Badge variant="outline" className="text-xs">
                                        {PERFORMANCE_RATINGS.find(r => r.value === task.performance_rating)?.icon}
                                        {task.performance_rating.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                      </Badge>
                                    )}
                                    {task.comments.length > 0 && (
                                      <Badge variant="outline" className="text-xs">
                                        <MessageSquare className="h-3 w-3 mr-1" />
                                        {task.comments.length}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {task.description && (
                                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                                  )}
                                  
                                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {task.estimated_minutes}min
                                    </span>
                                    
                                    {task.profiles && (
                                      <span className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {task.profiles.first_name} {task.profiles.last_name}
                                      </span>
                                    )}
                                    
                                    {task.completed_by_profile && (
                                      <span className="flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Completed by {task.completed_by_profile.first_name}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {task.status === 'pending' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateTaskStatus(task.id, 'in_progress')}
                                  >
                                    <Play className="h-4 w-4 mr-1" />
                                    Start
                                  </Button>
                                )}
                                
                                {task.status === 'in_progress' && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateTaskStatus(task.id, 'pending')}
                                    >
                                      <Pause className="h-4 w-4 mr-1" />
                                      Pause
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => updateTaskStatus(task.id, 'completed', 'met_expectations')}
                                      className="btn-bbq"
                                    >
                                      <CheckCircle2 className="h-4 w-4 mr-1" />
                                      Complete
                                    </Button>
                                  </>
                                )}
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setShowTaskDialog(true);
                                  }}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          {provided.placeholder}
                          
                          {checklist.tasks.length === 0 && (
                            <div className="text-center text-muted-foreground py-8">
                              No tasks in this checklist
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DragDropContext>

      {/* Task Details Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedTask && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Select
                  value={selectedTask.status}
                  onValueChange={(value) => updateTaskStatus(selectedTask.id, value)}
                >
                  <SelectTrigger className="w-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="skipped">Skipped</SelectItem>
                  </SelectContent>
                </Select>
                
                {selectedTask.status === 'completed' && (
                  <Select
                    value={selectedTask.performance_rating || ''}
                    onValueChange={(value) => updateTaskStatus(selectedTask.id, 'completed', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Rate performance" />
                    </SelectTrigger>
                    <SelectContent>
                      {PERFORMANCE_RATINGS.map((rating) => (
                        <SelectItem key={rating.value} value={rating.value}>
                          {rating.icon} {rating.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              {selectedTask.description && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Description</h4>
                  <p className="text-sm">{selectedTask.description}</p>
                </div>
              )}
              
              <div className="space-y-3">
                <h4 className="font-medium">Comments ({selectedTask.comments.length})</h4>
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedTask.comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          {comment.profiles.first_name} {comment.profiles.last_name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {comment.comment_type}
                        </Badge>
                      </div>
                      <p className="text-sm">{comment.comment}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Select value={commentType} onValueChange={(value: any) => setCommentType(value)}>
                      <SelectTrigger className="w-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="note">Note</SelectItem>
                        <SelectItem value="issue">Issue</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="instruction">Instruction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  
                  <Button onClick={addComment} className="btn-bbq">
                    Add Comment
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChecklistsPage;