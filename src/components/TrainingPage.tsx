import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  GraduationCap, 
  BookOpen, 
  Play, 
  CheckCircle, 
  Star, 
  Clock, 
  Users, 
  Award, 
  Target,
  Flame,
  ChefHat,
  UtensilsCrossed,
  TrendingUp,
  UserCheck
} from 'lucide-react';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  role: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  completionRate: number;
  isCompleted: boolean;
  rating: number | null;
  category: 'skills' | 'safety' | 'leadership' | 'customer_service';
  prerequisites: string[];
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'practical';
  duration: number;
  isCompleted: boolean;
  score?: number;
}

interface UserProgress {
  id: string;
  name: string;
  role: string;
  level: string;
  completedModules: number;
  totalModules: number;
  overallRating: number;
  certifications: string[];
  nextMilestone: string;
}

const TrainingPage = () => {
  const { profile, store } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('my-training');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrainingData();
  }, []);

  const loadTrainingData = async () => {
    try {
      // Mock data for demo - in production this would fetch from database
      const mockModules: TrainingModule[] = [
        {
          id: '1',
          title: 'Smoking Fundamentals',
          description: 'Master the art of low and slow BBQ smoking',
          role: 'pitmaster',
          level: 'beginner',
          duration: 45,
          completionRate: 85,
          isCompleted: true,
          rating: 5,
          category: 'skills',
          prerequisites: [],
          lessons: [
            { id: '1a', title: 'Temperature Control', type: 'video', duration: 15, isCompleted: true, score: 95 },
            { id: '1b', title: 'Wood Selection', type: 'quiz', duration: 10, isCompleted: true, score: 90 },
            { id: '1c', title: 'Practical Smoking Test', type: 'practical', duration: 20, isCompleted: true, score: 92 }
          ]
        },
        {
          id: '2',
          title: 'Customer Service Excellence',
          description: 'Deliver exceptional customer experiences',
          role: 'team_member',
          level: 'beginner',
          duration: 30,
          completionRate: 60,
          isCompleted: false,
          rating: null,
          category: 'customer_service',
          prerequisites: [],
          lessons: [
            { id: '2a', title: 'Greeting Customers', type: 'video', duration: 10, isCompleted: true },
            { id: '2b', title: 'Handling Complaints', type: 'video', duration: 10, isCompleted: true },
            { id: '2c', title: 'Service Quiz', type: 'quiz', duration: 10, isCompleted: false }
          ]
        },
        {
          id: '3',
          title: 'Advanced Sauce Crafting',
          description: 'Create signature BBQ sauces and rubs',
          role: 'prep_cook',
          level: 'intermediate',
          duration: 60,
          completionRate: 0,
          isCompleted: false,
          rating: null,
          category: 'skills',
          prerequisites: ['Smoking Fundamentals'],
          lessons: [
            { id: '3a', title: 'Sauce Chemistry', type: 'video', duration: 20, isCompleted: false },
            { id: '3b', title: 'Flavor Balancing', type: 'video', duration: 20, isCompleted: false },
            { id: '3c', title: 'Recipe Development', type: 'practical', duration: 20, isCompleted: false }
          ]
        },
        {
          id: '4',
          title: 'Team Leadership Basics',
          description: 'Lead shifts and manage team performance',
          role: 'shift_leader',
          level: 'intermediate',
          duration: 90,
          completionRate: 25,
          isCompleted: false,
          rating: null,
          category: 'leadership',
          prerequisites: ['Customer Service Excellence'],
          lessons: [
            { id: '4a', title: 'Delegation Skills', type: 'video', duration: 30, isCompleted: true },
            { id: '4b', title: 'Conflict Resolution', type: 'video', duration: 30, isCompleted: false },
            { id: '4c', title: 'Performance Management', type: 'video', duration: 30, isCompleted: false }
          ]
        },
        {
          id: '5',
          title: 'Food Safety & HACCP',
          description: 'Critical food safety protocols and compliance',
          role: 'all',
          level: 'beginner',
          duration: 40,
          completionRate: 100,
          isCompleted: true,
          rating: 4,
          category: 'safety',
          prerequisites: [],
          lessons: [
            { id: '5a', title: 'Temperature Monitoring', type: 'video', duration: 15, isCompleted: true, score: 98 },
            { id: '5b', title: 'Sanitation Procedures', type: 'video', duration: 15, isCompleted: true, score: 95 },
            { id: '5c', title: 'Safety Assessment', type: 'quiz', duration: 10, isCompleted: true, score: 100 }
          ]
        }
      ];

      const mockUserProgress: UserProgress[] = [
        {
          id: '1',
          name: 'Marcus Johnson',
          role: 'Pitmaster',
          level: 'Advanced',
          completedModules: 8,
          totalModules: 10,
          overallRating: 4.7,
          certifications: ['BBQ Master', 'Food Safety'],
          nextMilestone: 'Advanced Leadership'
        },
        {
          id: '2',
          name: 'Sarah Chen',
          role: 'Prep Cook',
          level: 'Intermediate',
          completedModules: 6,
          totalModules: 8,
          overallRating: 4.3,
          certifications: ['Food Safety', 'Prep Specialist'],
          nextMilestone: 'Shift Leader Training'
        },
        {
          id: '3',
          name: 'Alex Rodriguez',
          role: 'Team Member',
          level: 'Beginner',
          completedModules: 2,
          totalModules: 6,
          overallRating: 4.0,
          certifications: ['Food Safety'],
          nextMilestone: 'Customer Service Certification'
        }
      ];

      setTrainingModules(mockModules);
      setUserProgress(mockUserProgress);
    } catch (error) {
      console.error('Error loading training data:', error);
      toast({
        title: "Error",
        description: "Failed to load training data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startModule = (moduleId: string) => {
    toast({
      title: "Module Started",
      description: "Opening training module...",
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-muted';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'skills': return <ChefHat className="h-4 w-4" />;
      case 'safety': return <Target className="h-4 w-4" />;
      case 'leadership': return <Users className="h-4 w-4" />;
      case 'customer_service': return <UserCheck className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
      />
    ));
  };

  const filteredModules = trainingModules.filter(module => 
    selectedRole === 'all' || module.role === selectedRole || module.role === 'all'
  );

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bbq font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            SkillBuilder Training
          </h1>
          <p className="text-muted-foreground">Professional development and certification pathways</p>
        </div>
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trainingModules.filter(m => m.completionRate > 0).map((module) => (
              <Card key={module.id} className="card-bbq">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getCategoryIcon(module.category)}
                      {module.title}
                    </CardTitle>
                    <Badge className={`${getLevelColor(module.level)} text-white`}>
                      {module.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{module.completionRate}%</span>
                    </div>
                    <Progress value={module.completionRate} className="h-2" />
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {module.duration}m
                      </div>
                      {module.rating && (
                        <div className="flex items-center gap-1">
                          {renderStars(module.rating)}
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      onClick={() => startModule(module.id)}
                      className="w-full btn-bbq"
                      variant={module.isCompleted ? "outline" : "default"}
                    >
                      {module.isCompleted ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Review
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Continue
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Browse Modules Tab */}
        <TabsContent value="browse" className="space-y-6">
          <div className="flex items-center gap-4">
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
            {filteredModules.map((module) => (
              <Card key={module.id} className="card-bbq">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getCategoryIcon(module.category)}
                      {module.title}
                    </CardTitle>
                    <Badge className={`${getLevelColor(module.level)} text-white`}>
                      {module.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                  
                  <div className="space-y-3">
                    {module.prerequisites.length > 0 && (
                      <Alert>
                        <AlertDescription className="text-xs">
                          <strong>Prerequisites:</strong> {module.prerequisites.join(', ')}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {module.duration}m
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {module.lessons.length} lessons
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => startModule(module.id)}
                      className="w-full btn-bbq"
                      disabled={module.prerequisites.length > 0}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Module
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Team Progress Tab */}
        <TabsContent value="team-progress" className="space-y-6">
          {profile?.role === 'manager' || profile?.role === 'shift_leader' ? (
            <div className="grid gap-4">
              {userProgress.map((user) => (
                <Card key={user.id} className="card-bbq">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-bold text-lg">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.role} • {user.level}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{user.completedModules}</div>
                          <div className="text-xs text-muted-foreground">of {user.totalModules} modules</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center gap-1">
                            {renderStars(Math.floor(user.overallRating))}
                          </div>
                          <div className="text-xs text-muted-foreground">{user.overallRating} avg rating</div>
                        </div>
                        
                        <div className="text-center">
                          <Badge variant="outline">{user.nextMilestone}</Badge>
                          <div className="text-xs text-muted-foreground mt-1">Next milestone</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">Progress</span>
                        <span className="text-sm font-medium">
                          {Math.round((user.completedModules / user.totalModules) * 100)}%
                        </span>
                      </div>
                      <Progress value={(user.completedModules / user.totalModules) * 100} className="h-2" />
                    </div>
                    
                    {user.certifications.length > 0 && (
                      <div className="mt-4">
                        <div className="text-sm text-muted-foreground mb-2">Certifications:</div>
                        <div className="flex gap-2">
                          {user.certifications.map((cert, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Award className="h-3 w-3 mr-1" />
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
          ) : (
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                Team progress is only available to managers and shift leaders.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="card-bbq">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  BBQ Master
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete mastery of all smoking techniques and meat preparation
                </p>
                <div className="space-y-2">
                  <div className="text-sm">Requirements:</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Complete Smoking Fundamentals</li>
                    <li>• Complete Advanced Sauce Crafting</li>
                    <li>• Pass practical assessment</li>
                  </ul>
                </div>
                <Badge className="mt-4 bg-green-500 text-white">Earned</Badge>
              </CardContent>
            </Card>

            <Card className="card-bbq">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-500" />
                  Food Safety Certified
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive food safety and HACCP compliance certification
                </p>
                <div className="space-y-2">
                  <div className="text-sm">Requirements:</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Complete Food Safety & HACCP</li>
                    <li>• Score 90% or higher on assessment</li>
                    <li>• Annual recertification required</li>
                  </ul>
                </div>
                <Badge className="mt-4 bg-green-500 text-white">Earned</Badge>
              </CardContent>
            </Card>

            <Card className="card-bbq">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Leadership Certificate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Proven ability to lead teams and manage operations
                </p>
                <div className="space-y-2">
                  <div className="text-sm">Requirements:</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Complete Team Leadership Basics</li>
                    <li>• Complete Advanced Leadership</li>
                    <li>• Manage shifts for 30 days</li>
                  </ul>
                </div>
                <Badge variant="outline" className="mt-4">In Progress</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingPage;