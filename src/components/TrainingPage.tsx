import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Award, 
  Users, 
  BookOpen, 
  Play, 
  CheckCircle2,
  Flame,
  ChefHat,
  ShieldCheck,
  Target,
  TrendingUp,
  User,
  Plus,
  Settings,
  GraduationCap,
  UserCheck,
  UtensilsCrossed,
  FileText,
  Video,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { TrainingInstanceCard, TrainingInstance } from "./training/TrainingInstanceCard";
import { TrainingChecklist } from "./training/TrainingChecklist";

interface TrainingTemplate {
  id: string;
  name: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  role_requirements: string[];
  estimated_duration_hours: number;
  quiz_questions: any[];
  certification_required: boolean;
  is_active: boolean;
}

interface TeamMemberProgress {
  id: string;
  name: string;
  role: string;
  completed_modules: number;
  total_modules: number;
  progress_percentage: number;
  certifications: string[];
  next_milestone: string;
}

const TrainingPage = () => {
  const { profile, store, user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('my-training');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [trainingInstances, setTrainingInstances] = useState<TrainingInstance[]>([]);
  const [trainingTemplates, setTrainingTemplates] = useState<TrainingTemplate[]>([]);
  const [teamProgress, setTeamProgress] = useState<TeamMemberProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChecklist, setShowChecklist] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<TrainingInstance | null>(null);
  const [checklistTasks, setChecklistTasks] = useState<any[]>([]);

  const isLeader = profile?.role && ['shift_leader', 'manager', 'operator'].includes(profile.role);

  useEffect(() => {
    if (profile?.store_id) {
      loadTrainingData();
    }
  }, [profile?.store_id]);

  const loadTrainingData = async () => {
    if (!profile?.store_id) return;
    
    try {
      setLoading(true);
      console.log('Loading training data for profile:', profile.id, 'store:', profile.store_id);

      // Load training instances for current user - simplified query
      const { data: instancesData, error: instancesError } = await supabase
        .from('training_instances')
        .select('*')
        .eq('profile_id', profile.id)
        .order('assigned_at', { ascending: false });

      if (instancesError) {
        console.error('Error loading training instances:', instancesError);
        throw instancesError;
      }

      console.log('Training instances loaded:', instancesData?.length || 0);

      // Load templates separately for instances
      let enrichedInstances: TrainingInstance[] = [];
      if (instancesData && instancesData.length > 0) {
        const templateIds = [...new Set(instancesData.map(i => i.template_id))];
        const { data: templatesData, error: templatesError } = await supabase
          .from('training_templates')
          .select('*')
          .in('id', templateIds);

        if (templatesError) {
          console.error('Error loading templates for instances:', templatesError);
          throw templatesError;
        }

        // Enrich instances with template data
        enrichedInstances = instancesData.map((instance: any) => {
          const template = templatesData?.find(t => t.id === instance.template_id);
          return {
            ...instance,
            template: template || { name: 'Unknown Template', description: '', level: 'Beginner' as const },
            status: instance.status as TrainingInstance['status']
          };
        });
      }
      
      setTrainingInstances(enrichedInstances);

      // Load available training templates
      const { data: templatesData, error: templatesError } = await supabase
        .from('training_templates')
        .select('*')
        .eq('store_id', profile.store_id)
        .eq('is_active', true)
        .order('name');

      if (templatesError) throw templatesError;
      
      // Type the templates correctly
      const typedTemplates: TrainingTemplate[] = (templatesData || []).map((item: any) => ({
        ...item,
        level: item.level as TrainingTemplate['level']
      }));

      // Add demo data if no templates exist
      if (typedTemplates.length === 0) {
        const demoTemplates: TrainingTemplate[] = [
          {
            id: 'demo-1',
            name: 'Customer Service Excellence',
            description: 'Master the art of exceptional customer service and build lasting relationships with every guest.',
            level: 'Beginner',
            category: 'Customer Service',
            role_requirements: ['team_member', 'prep_cook'],
            estimated_duration_hours: 2,
            quiz_questions: [],
            certification_required: true,
            is_active: true,
          },
          {
            id: 'demo-2',
            name: 'Food Safety Fundamentals',
            description: 'Essential food safety protocols, HACCP principles, and health department compliance.',
            level: 'Beginner',
            category: 'Safety & Compliance',
            role_requirements: ['team_member', 'prep_cook', 'pitmaster'],
            estimated_duration_hours: 3,
            quiz_questions: [],
            certification_required: true,
            is_active: true,
          },
          {
            id: 'demo-3',
            name: 'BBQ Smoking Techniques',
            description: 'Advanced smoking methods, temperature control, and meat preparation for perfect BBQ.',
            level: 'Advanced',
            category: 'Technical Skills',
            role_requirements: ['pitmaster'],
            estimated_duration_hours: 6,
            quiz_questions: [],
            certification_required: true,
            is_active: true,
          },
          {
            id: 'demo-4',
            name: 'Leadership & Team Management',
            description: 'Develop leadership skills, team building, and effective communication strategies.',
            level: 'Intermediate',
            category: 'Leadership',
            role_requirements: ['shift_leader', 'manager'],
            estimated_duration_hours: 4,
            quiz_questions: [],
            certification_required: true,
            is_active: true,
          },
          {
            id: 'demo-5',
            name: 'Point of Sale System Mastery',
            description: 'Complete training on Toast POS system features, troubleshooting, and daily operations.',
            level: 'Beginner',
            category: 'Technical Skills',
            role_requirements: ['team_member', 'shift_leader'],
            estimated_duration_hours: 1.5,
            quiz_questions: [],
            certification_required: false,
            is_active: true,
          },
          {
            id: 'demo-6',
            name: 'Opening & Closing Procedures',
            description: 'Step-by-step procedures for restaurant opening and closing, including safety checks.',
            level: 'Intermediate',
            category: 'Technical Skills',
            role_requirements: ['shift_leader', 'manager'],
            estimated_duration_hours: 2.5,
            quiz_questions: [],
            certification_required: false,
            is_active: true,
          }
        ];
        setTrainingTemplates(demoTemplates);

        // Add demo training instances for the current user
        const demoInstances: TrainingInstance[] = [
          {
            id: 'demo-instance-1',
            template_id: 'demo-1',
            profile_id: profile.id,
            status: 'assigned',
            progress_percentage: 0,
            assigned_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            started_at: undefined,
            completed_at: undefined,
            approved_at: undefined,
            approved_by: undefined,
            certification_earned: false,
            expires_at: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days from now
            template: demoTemplates[0]
          },
          {
            id: 'demo-instance-2',
            template_id: 'demo-2',
            profile_id: profile.id,
            status: 'in_progress',
            progress_percentage: 65,
            assigned_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            started_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            completed_at: undefined,
            approved_at: undefined,
            approved_by: undefined,
            certification_earned: false,
            expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days from now
            template: demoTemplates[1]
          },
          {
            id: 'demo-instance-3',
            template_id: 'demo-5',
            profile_id: profile.id,
            status: 'approved',
            progress_percentage: 100,
            assigned_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
            started_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
            completed_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
            approved_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            approved_by: 'demo-manager',
            certification_earned: false,
            expires_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
            template: demoTemplates[4]
          }
        ];
        setTrainingInstances(demoInstances);
      } else {
        setTrainingTemplates(typedTemplates);
      }

      // Load team progress if user is a leader
      if (isLeader) {
        try {
          // First get team members
          const { data: teamMembers, error: teamError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, role')
            .eq('store_id', profile.store_id)
            .neq('id', profile.id);

          if (teamError) {
            console.error('Error loading team members:', teamError);
          } else {
            // Then get their training instances separately
            const formattedTeamProgress: TeamMemberProgress[] = [];
            
            for (const member of teamMembers || []) {
              const { data: memberInstances, error: instancesError } = await supabase
                .from('training_instances')
                .select('id, status, progress_percentage, certification_earned, template_id')
                .eq('profile_id', member.id);

              if (instancesError) {
                console.error('Error loading member instances:', instancesError);
                continue;
              }

              const instances = memberInstances || [];
              const completedModules = instances.filter((i: any) => i.status === 'approved').length;
              const totalModules = instances.length;
              
              // Get template names for certifications
              const certifiedInstances = instances.filter((i: any) => i.certification_earned);
              const certifications: string[] = [];
              
              if (certifiedInstances.length > 0) {
                const templateIds = certifiedInstances.map((i: any) => i.template_id);
                const { data: certTemplates } = await supabase
                  .from('training_templates')
                  .select('name')
                  .in('id', templateIds);
                
                certifications.push(...(certTemplates?.map(t => t.name) || []));
              }

              formattedTeamProgress.push({
                id: member.id,
                name: `${member.first_name} ${member.last_name}`,
                role: member.role,
                completed_modules: completedModules,
                total_modules: totalModules,
                progress_percentage: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
                certifications,
                next_milestone: getNextMilestone(member.role, instances)
              });
            }

            // Add demo team progress data if no team members found
            if (formattedTeamProgress.length === 0 && typedTemplates.length === 0) {
              const demoTeamProgress: TeamMemberProgress[] = [
                {
                  id: 'demo-team-1',
                  name: 'Alex Johnson',
                  role: 'prep_cook',
                  completed_modules: 3,
                  total_modules: 5,
                  progress_percentage: 60,
                  certifications: ['Food Safety Fundamentals', 'Customer Service Excellence'],
                  next_milestone: 'Food Safety Certification'
                },
                {
                  id: 'demo-team-2',
                  name: 'Maria Garcia',
                  role: 'team_member',
                  completed_modules: 2,
                  total_modules: 4,
                  progress_percentage: 50,
                  certifications: ['Customer Service Excellence'],
                  next_milestone: 'Customer Service Certification'
                },
                {
                  id: 'demo-team-3',
                  name: 'Tommy Chen',
                  role: 'pitmaster',
                  completed_modules: 4,
                  total_modules: 6,
                  progress_percentage: 67,
                  certifications: ['Food Safety Fundamentals', 'BBQ Smoking Techniques'],
                  next_milestone: 'Advanced Smoking Techniques'
                },
                {
                  id: 'demo-team-4',
                  name: 'Sarah Wilson',
                  role: 'shift_leader',
                  completed_modules: 5,
                  total_modules: 7,
                  progress_percentage: 71,
                  certifications: ['Customer Service Excellence', 'Leadership & Team Management', 'Point of Sale System Mastery'],
                  next_milestone: 'Leadership Excellence'
                }
              ];
              setTeamProgress(demoTeamProgress);
            } else {
              setTeamProgress(formattedTeamProgress);
            }
          }
        } catch (error) {
          console.error('Error loading team progress:', error);
          // Set demo data on error too
          if (typedTemplates.length === 0) {
            const demoTeamProgress: TeamMemberProgress[] = [
              {
                id: 'demo-team-1',
                name: 'Alex Johnson',
                role: 'prep_cook',
                completed_modules: 3,
                total_modules: 5,
                progress_percentage: 60,
                certifications: ['Food Safety Fundamentals', 'Customer Service Excellence'],
                next_milestone: 'Food Safety Certification'
              },
              {
                id: 'demo-team-2',
                name: 'Maria Garcia',
                role: 'team_member',
                completed_modules: 2,
                total_modules: 4,
                progress_percentage: 50,
                certifications: ['Customer Service Excellence'],
                next_milestone: 'Customer Service Certification'
              }
            ];
            setTeamProgress(demoTeamProgress);
          }
        }
      }

    } catch (error) {
      console.error('Error loading training data:', error);
      toast({
        title: "Error",
        description: "Failed to load training data. Please try again.",
        variant: "destructive",
      });
      setTrainingInstances([]);
      setTrainingTemplates([]);
      setTeamProgress([]);
    } finally {
      setLoading(false);
    }
  };

  const getNextMilestone = (role: string, instances: any[]) => {
    const roleProgression = {
      team_member: 'Customer Service Certification',
      prep_cook: 'Food Safety Certification',
      pitmaster: 'Advanced Smoking Techniques',
      shift_leader: 'Leadership Excellence',
      manager: 'Operations Management'
    };
    return roleProgression[role as keyof typeof roleProgression] || 'Next Level Training';
  };

  const handleStartTraining = async (instanceId: string) => {
    const instance = trainingInstances.find(i => i.id === instanceId);
    if (!instance) return;

    try {
      // Update instance status to in_progress and set started_at
      const { error } = await supabase
        .from('training_instances')
        .update({ 
          status: 'in_progress', 
          started_at: new Date().toISOString() 
        })
        .eq('id', instanceId);

      if (error) throw error;

      // Load training checklist
      await loadTrainingChecklist(instanceId);

    } catch (error) {
      console.error('Error starting training:', error);
      toast({
        title: "Error",
        description: "Failed to start training. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadTrainingChecklist = async (instanceId: string) => {
    try {
      const instance = trainingInstances.find(i => i.id === instanceId);
      if (!instance) return;

      // Load template tasks
      const { data: templateTasks, error: templateError } = await supabase
        .from('training_template_tasks')
        .select('*')
        .eq('template_id', instance.template_id)
        .order('order_index');

      if (templateError) throw templateError;

      // Load or create instance tasks
      const { data: instanceTasks, error: instanceError } = await supabase
        .from('training_instance_tasks')
        .select('*')
        .eq('instance_id', instanceId);

      if (instanceError) throw instanceError;

      // Create instance tasks if they don't exist
      if (instanceTasks.length === 0 && templateTasks) {
        const tasksToInsert = templateTasks.map(task => ({
          instance_id: instanceId,
          template_task_id: task.id,
          status: 'pending' as const,
          time_spent_minutes: 0
        }));

        const { error: insertError } = await supabase
          .from('training_instance_tasks')
          .insert(tasksToInsert);

        if (insertError) throw insertError;

        // Reload instance tasks
        const { data: newInstanceTasks, error: reloadError } = await supabase
          .from('training_instance_tasks')
          .select('*')
          .eq('instance_id', instanceId);

        if (reloadError) throw reloadError;
        
        // Combine template and instance data
        const combinedTasks = templateTasks.map(template => {
          const instanceTask = newInstanceTasks?.find(it => it.template_task_id === template.id);
          return {
            id: template.id,
            title: template.title,
            description: template.description,
            estimated_minutes: template.estimated_minutes,
            is_required: template.is_required,
            order_index: template.order_index,
            task_type: template.task_type,
            task_data: template.task_data,
            status: instanceTask?.status || 'pending',
            completed_at: instanceTask?.completed_at,
            time_spent_minutes: instanceTask?.time_spent_minutes || 0,
            score: instanceTask?.score,
            notes: instanceTask?.notes
          };
        });

        setChecklistTasks(combinedTasks);
      } else {
        // Combine existing data
        const combinedTasks = templateTasks?.map(template => {
          const instanceTask = instanceTasks.find(it => it.template_task_id === template.id);
          return {
            id: template.id,
            title: template.title,
            description: template.description,
            estimated_minutes: template.estimated_minutes,
            is_required: template.is_required,
            order_index: template.order_index,
            task_type: template.task_type,
            task_data: template.task_data,
            status: instanceTask?.status || 'pending',
            completed_at: instanceTask?.completed_at,
            time_spent_minutes: instanceTask?.time_spent_minutes || 0,
            score: instanceTask?.score,
            notes: instanceTask?.notes
          };
        }) || [];

        setChecklistTasks(combinedTasks);
      }

      setSelectedInstance(instance);
      setShowChecklist(true);

    } catch (error) {
      console.error('Error loading training checklist:', error);
      toast({
        title: "Error",
        description: "Failed to load training checklist.",
        variant: "destructive",
      });
    }
  };

  const handleRequestApproval = async () => {
    if (!selectedInstance) return;

    try {
      const { error } = await supabase
        .from('training_instances')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', selectedInstance.id);

      if (error) throw error;

      toast({
        title: "Approval Requested",
        description: "Your training completion has been submitted for approval.",
      });

      setShowChecklist(false);
      loadTrainingData();

    } catch (error) {
      console.error('Error requesting approval:', error);
      toast({
        title: "Error",
        description: "Failed to request approval. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleApproveTraining = async () => {
    if (!selectedInstance || !profile) return;

    try {
      const { error } = await supabase
        .from('training_instances')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: profile.id,
          certification_earned: selectedInstance.template.certification_required
        })
        .eq('id', selectedInstance.id);

      if (error) throw error;

      toast({
        title: "Training Approved",
        description: "Training has been approved and certification awarded if applicable.",
      });

      setShowChecklist(false);
      loadTrainingData();

    } catch (error) {
      console.error('Error approving training:', error);
      toast({
        title: "Error",
        description: "Failed to approve training. Please try again.",
        variant: "destructive",
      });
    }
  };

  const assignTemplate = async (templateId: string, profileId: string) => {
    try {
      const { error } = await supabase
        .from('training_instances')
        .insert({
          template_id: templateId,
          profile_id: profileId,
          status: 'assigned',
          assigned_by: profile?.id,
          assigned_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Training Assigned",
        description: "Training module has been assigned successfully.",
      });

      loadTrainingData();

    } catch (error) {
      console.error('Error assigning training:', error);
      toast({
        title: "Error",
        description: "Failed to assign training. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technical skills':
        return <ChefHat className="w-4 h-4" />;
      case 'customer service':
        return <UserCheck className="w-4 h-4" />;
      case 'leadership':
        return <Users className="w-4 h-4" />;
      case 'safety & compliance':
        return <ShieldCheck className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const filteredTemplates = trainingTemplates.filter(template => {
    const matchesRole = selectedRole === 'all' || 
      template.role_requirements.includes(selectedRole) || 
      template.role_requirements.includes('team_member');
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const filteredInstances = trainingInstances.filter(instance => {
    const matchesSearch = instance.template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading training modules...</p>
      </div>
    );
  }

  if (!profile || !store) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-medium">Setup Required</h3>
          <p className="text-muted-foreground">Complete your profile setup to access training modules.</p>
        </div>
      </div>
    );
  }

  if (showChecklist && selectedInstance) {
    return (
      <div className="p-6">
        <TrainingChecklist
          instanceId={selectedInstance.id}
          templateName={selectedInstance.template.name}
          tasks={checklistTasks}
          currentUserRole={profile?.role}
          isLeader={isLeader || false}
          onBack={() => setShowChecklist(false)}
          onRequestApproval={handleRequestApproval}
          onApprove={isLeader ? handleApproveTraining : undefined}
          canApprove={isLeader}
          status={selectedInstance.status}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-red-600" />
            SkillBuilder Training
          </h1>
          <p className="text-muted-foreground">Professional development and certification pathways</p>
        </div>
        {isLeader && (
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Assign Training
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="my-training">My Training</TabsTrigger>
          <TabsTrigger value="browse">Browse Modules</TabsTrigger>
          <TabsTrigger value="team-progress">Team Progress</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        {/* My Training Tab */}
        <TabsContent value="my-training" className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search your training..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredInstances.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Training Assigned</h3>
                <p className="text-muted-foreground mb-4">
                  Contact your manager to get started with training modules.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredInstances.map((instance) => (
                <TrainingInstanceCard
                  key={instance.id}
                  instance={instance}
                  currentUserRole={profile?.role}
                  onStart={handleStartTraining}
                  onContinue={() => loadTrainingChecklist(instance.id)}
                  onReview={() => loadTrainingChecklist(instance.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Browse Modules Tab */}
        <TabsContent value="browse" className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="team_member">Team Member</SelectItem>
                <SelectItem value="prep_cook">Prep Cook</SelectItem>
                <SelectItem value="pitmaster">Pitmaster</SelectItem>
                <SelectItem value="shift_leader">Shift Leader</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="h-full transition-all duration-200 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getCategoryIcon(template.category)}
                      {template.name}
                    </CardTitle>
                    <Badge variant="outline">
                      {template.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {template.estimated_duration_hours}h
                    </div>
                    {template.certification_required && (
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        Certified
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template.role_requirements.map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {role.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>

                  {isLeader && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        // This would open a dialog to assign to team members
                        toast({
                          title: "Assign Training",
                          description: "Training assignment dialog would open here.",
                        });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Assign to Team
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Team Progress Tab */}
        <TabsContent value="team-progress" className="space-y-6">
          {isLeader ? (
            teamProgress.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Team Members</h3>
                  <p className="text-muted-foreground">
                    Team member progress will appear here once training is assigned.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {teamProgress.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="font-bold text-lg">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {member.role.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                              {member.completed_modules}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              of {member.total_modules} modules
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {member.progress_percentage}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              completion
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <Badge variant="outline">{member.next_milestone}</Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              Next milestone
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Progress value={member.progress_percentage} className="h-2" />
                      </div>
                      
                      {member.certifications.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Certifications:</p>
                          <div className="flex flex-wrap gap-2">
                            {member.certifications.map((cert, index) => (
                              <Badge key={index} variant="secondary">
                                <Award className="w-3 h-3 mr-1" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          ) : (
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                Only managers and shift leaders can view team progress.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trainingInstances
              .filter(instance => instance.certification_earned)
              .map((instance) => (
                <Card key={instance.id} className="border-green-200 bg-green-50 dark:bg-green-900/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-600" />
                      {instance.template.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Certification earned on{' '}
                      {instance.approved_at 
                        ? new Date(instance.approved_at).toLocaleDateString()
                        : 'Date not available'
                      }
                    </p>
                    {instance.approver && (
                      <p className="text-xs text-muted-foreground">
                        Approved by {instance.approver.first_name} {instance.approver.last_name}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
          
          {trainingInstances.filter(instance => instance.certification_earned).length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Certifications Yet</h3>
                <p className="text-muted-foreground">
                  Complete training modules to earn certifications.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingPage;