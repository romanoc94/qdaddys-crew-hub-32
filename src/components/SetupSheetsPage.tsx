import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  FileSpreadsheet, 
  Users, 
  UtensilsCrossed,
  Cloud,
  Flame,
  AlertTriangle,
  Calendar,
  Clock,
  Thermometer,
  Beef,
  ChefHat,
  Star,
  GripVertical
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface SetupSheet {
  id: string;
  date: string;
  weather: {
    temperature: number;
    condition: string;
    humidity: number;
  };
  dailySpecials: string;
  expectedFootTraffic: string;
  inventoryAlerts: string[];
  teamNotes: string;
  shiftAssignments: ShiftAssignment[];
  cateringOrders: CateringOrder[];
  checklistProgress: ChecklistProgress[];
}

interface ShiftAssignment {
  id: string;
  shiftType: string;
  startTime: string;
  endTime: string;
  staffAssigned: StaffMember[];
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  section: string;
}

interface CateringOrder {
  id: string;
  customerName: string;
  orderSummary: string;
  deliveryTime: string;
  prepRequirements: string;
  status: 'pending' | 'in_prep' | 'ready' | 'delivered';
}

interface ChecklistProgress {
  id: string;
  name: string;
  type: string;
  progress: number;
  critical: boolean;
  assignedTo: string;
}

const SetupSheetsPage = () => {
  const { store, profile } = useAuth();
  const { toast } = useToast();
  const [setupSheet, setSetupSheet] = useState<SetupSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingNotes, setEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');

  useEffect(() => {
    if (store?.id) {
      loadSetupSheet();
    }
  }, [store?.id, selectedDate]);

  const loadSetupSheet = async () => {
    try {
      // Mock data for demo - in production this would fetch from database
      const mockSheet: SetupSheet = {
        id: '1',
        date: selectedDate,
        weather: {
          temperature: 78,
          condition: 'Partly Cloudy',
          humidity: 65
        },
        dailySpecials: 'Smoked Brisket Burnt Ends, Carolina Pulled Pork, Jalapeño Mac & Cheese',
        expectedFootTraffic: 'High - Local festival in town',
        inventoryAlerts: [
          'Brisket: 85 lbs remaining (order more)',
          'BBQ Sauce: 12 bottles left',
          'Hickory Wood: Running low'
        ],
        teamNotes: 'Sarah\'s birthday today! Marcus will be 30 min late. New trainee Alex starts on prep.',
        shiftAssignments: [
          {
            id: '1',
            shiftType: 'Opening',
            startTime: '06:00',
            endTime: '11:00',
            staffAssigned: [
              { id: '1', name: 'Marcus Johnson', role: 'Pitmaster', section: 'Smokers' },
              { id: '2', name: 'Sarah Chen', role: 'Prep Cook', section: 'Kitchen' },
              { id: '3', name: 'Mike Torres', role: 'Team Member', section: 'Front' }
            ]
          },
          {
            id: '2',
            shiftType: 'Lunch',
            startTime: '10:00',
            endTime: '15:00',
            staffAssigned: [
              { id: '4', name: 'Emily Davis', role: 'Shift Leader', section: 'Front' },
              { id: '5', name: 'Jordan Lee', role: 'Cashier', section: 'Front' },
              { id: '6', name: 'Alex Rodriguez', role: 'Prep Cook', section: 'Kitchen' }
            ]
          }
        ],
        cateringOrders: [
          {
            id: '1',
            customerName: 'Downtown Office Complex',
            orderSummary: '20 Brisket Platters, 15 Pulled Pork, Sides for 35',
            deliveryTime: '12:30 PM',
            prepRequirements: 'Start brisket slicing at 11:30 AM',
            status: 'pending'
          },
          {
            id: '2',
            customerName: 'Johnson Wedding',
            orderSummary: 'Full BBQ spread for 80 people',
            deliveryTime: '6:00 PM',
            prepRequirements: 'All items ready by 5:30 PM for transport',
            status: 'in_prep'
          }
        ],
        checklistProgress: [
          {
            id: '1',
            name: 'Opening Checklist',
            type: 'opening',
            progress: 75,
            critical: true,
            assignedTo: 'Marcus Johnson'
          },
          {
            id: '2',
            name: 'Prep Checklist',
            type: 'prep',
            progress: 30,
            critical: false,
            assignedTo: 'Sarah Chen'
          }
        ]
      };

      setSetupSheet(mockSheet);
      setTempNotes(mockSheet.teamNotes);
    } catch (error) {
      console.error('Error loading setup sheet:', error);
      toast({
        title: "Error",
        description: "Failed to load setup sheet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !setupSheet) return;

    // Handle staff reassignment between sections
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      toast({
        title: "Staff Reassigned",
        description: "Staff member moved to new section",
      });
    }
  };

  const updateTeamNotes = () => {
    if (!setupSheet) return;
    
    setSetupSheet({
      ...setupSheet,
      teamNotes: tempNotes
    });
    setEditingNotes(false);
    
    toast({
      title: "Notes Updated",
      description: "Team notes have been saved",
    });
  };

  const getWeatherIcon = (condition: string) => {
    if (condition.includes('Cloud')) return '☁️';
    if (condition.includes('Sun')) return '☀️';
    if (condition.includes('Rain')) return '🌧️';
    return '🌤️';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!setupSheet) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No setup sheet found for {selectedDate}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bbq font-bold text-foreground flex items-center gap-2">
            <FileSpreadsheet className="h-8 w-8 text-primary" />
            Setup Sheets
          </h1>
          <p className="text-muted-foreground">Daily briefing and operational overview</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
          <Button className="btn-bbq">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Print Sheet
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Weather & Environment */}
            <Card className="card-bbq">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-primary" />
                  Weather & Environment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl">{getWeatherIcon(setupSheet.weather.condition)}</span>
                  <div>
                    <div className="text-2xl font-bold">{setupSheet.weather.temperature}°F</div>
                    <div className="text-sm text-muted-foreground">{setupSheet.weather.condition}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Humidity:</span>
                    <div className="font-medium">{setupSheet.weather.humidity}%</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Traffic:</span>
                    <div className="font-medium text-orange-600">{setupSheet.expectedFootTraffic}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Specials */}
            <Card className="card-bbq">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Daily Specials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{setupSheet.dailySpecials}</p>
              </CardContent>
            </Card>

            {/* Inventory Alerts */}
            <Card className="card-bbq">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Inventory Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {setupSheet.inventoryAlerts.map((alert, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      {alert}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Notes */}
            <Card className="card-bbq">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Team Notes
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingNotes(!editingNotes)}
                  >
                    {editingNotes ? 'Cancel' : 'Edit'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editingNotes ? (
                  <div className="space-y-2">
                    <Textarea
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <Button onClick={updateTeamNotes} size="sm">
                      Save Notes
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm">{setupSheet.teamNotes}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            {/* Shift Assignments */}
            <Card className="card-bbq">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Shift Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {setupSheet.shiftAssignments.map((shift) => (
                    <div key={shift.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{shift.shiftType}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {shift.startTime} - {shift.endTime}
                        </span>
                      </div>
                      <Droppable droppableId={`shift-${shift.id}`}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="space-y-2"
                          >
                            {shift.staffAssigned.map((staff, index) => (
                              <Draggable key={staff.id} draggableId={staff.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`
                                      flex items-center justify-between p-2 bg-muted/30 rounded
                                      ${snapshot.isDragging ? 'shadow-lg scale-105' : ''}
                                    `}
                                  >
                                    <div>
                                      <div className="font-medium text-sm">{staff.name}</div>
                                      <div className="text-xs text-muted-foreground">{staff.role}</div>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {staff.section}
                                    </Badge>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Checklist Progress */}
            <Card className="card-bbq">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-primary" />
                  Checklist Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {setupSheet.checklistProgress.map((checklist) => (
                    <div key={checklist.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm flex items-center gap-2">
                            {checklist.name}
                            {checklist.critical && (
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Assigned to: {checklist.assignedTo}
                          </div>
                        </div>
                        <span className="text-sm font-medium">{checklist.progress}%</span>
                      </div>
                      <Progress 
                        value={checklist.progress} 
                        className={`h-2 ${getProgressColor(checklist.progress)}`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Catering Orders */}
            <Card className="card-bbq">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5 text-primary" />
                  Catering Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {setupSheet.cateringOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{order.customerName}</h4>
                        <Badge 
                          variant={order.status === 'pending' ? 'secondary' : 
                                 order.status === 'in_prep' ? 'default' : 'outline'}
                        >
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{order.orderSummary}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>Delivery: {order.deliveryTime}</span>
                      </div>
                      <p className="text-xs bg-muted/50 p-2 rounded">
                        {order.prepRequirements}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default SetupSheetsPage;