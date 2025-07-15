import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  FileSpreadsheet, 
  Users, 
  UtensilsCrossed,
  Cloud,
  AlertTriangle,
  Clock,
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
  expectedFootTraffic: string;
  teamNotes: string;
  shiftAssignments: ShiftAssignment[];
  cateringOrders: CateringOrder[];
}

interface ShiftAssignment {
  id: string;
  shiftType: string;
  startTime: string;
  endTime: string;
  positions: Position[];
  availableStaff: StaffMember[];
}

interface Position {
  id: string;
  name: string;
  station: string;
  requiredRole?: string;
  assignedStaff?: StaffMember;
  notes?: string;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  availability: string[];
}

interface CateringOrder {
  id: string;
  customerName: string;
  orderSummary: string;
  deliveryTime: string;
  prepRequirements: string;
  status: 'pending' | 'in_prep' | 'ready' | 'delivered';
}

const SetupSheetsPage = () => {
  const { store, profile } = useAuth();
  const { toast } = useToast();
  const [setupSheet, setSetupSheet] = useState<SetupSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedShift, setSelectedShift] = useState('opening');
  const [editingNotes, setEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');

  const shiftTimes = [
    { id: 'opening', label: '5:00 AM - Opening', startTime: '05:00', endTime: '11:00' },
    { id: 'lunch', label: '11:00 AM - Lunch', startTime: '11:00', endTime: '14:00' },
    { id: 'afternoon', label: '2:00 PM - Afternoon', startTime: '14:00', endTime: '16:00' },
    { id: 'dinner', label: '4:00 PM - Dinner', startTime: '16:00', endTime: '19:00' },
    { id: 'latenight', label: '7:00 PM - Late Night', startTime: '19:00', endTime: '21:00' },
    { id: 'closing', label: '9:00 PM - Closing', startTime: '21:00', endTime: '23:00' }
  ];

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
        expectedFootTraffic: 'High - Local festival in town',
        teamNotes: 'Sarah\'s birthday today! Marcus will be 30 min late. New trainee Alex starts on prep.',
        shiftAssignments: [
          {
            id: 'opening',
            shiftType: 'Opening',
            startTime: '05:00',
            endTime: '11:00',
            positions: [
              { id: 'pitmaster', name: 'Pitmaster', station: 'Main Smoker', requiredRole: 'Pitmaster', assignedStaff: { id: '1', name: 'Marcus Johnson', role: 'Pitmaster', availability: ['opening', 'lunch'] } },
              { id: 'prep-lead', name: 'Prep Lead', station: 'Kitchen', requiredRole: 'Prep Cook', assignedStaff: { id: '2', name: 'Sarah Chen', role: 'Prep Cook', availability: ['opening', 'lunch'] } },
              { id: 'opener-front', name: 'Front Opener', station: 'Front Counter', requiredRole: 'Team Member', assignedStaff: { id: '3', name: 'Mike Torres', role: 'Team Member', availability: ['opening', 'lunch'] } },
              { id: 'maintenance', name: 'Maintenance', station: 'General', requiredRole: 'Team Member' },
              { id: 'backup-prep', name: 'Backup Prep', station: 'Kitchen', requiredRole: 'Prep Cook' },
              { id: 'smoker-2', name: 'Smoker #2', station: 'Side Smoker', requiredRole: 'Pitmaster' },
              { id: 'inventory', name: 'Inventory Lead', station: 'Storage', requiredRole: 'Team Member' },
              { id: 'cleaning', name: 'Deep Clean', station: 'General', requiredRole: 'Team Member' },
            ],
            availableStaff: [
              { id: '7', name: 'Alex Rodriguez', role: 'Prep Cook', availability: ['opening', 'lunch', 'dinner'] },
              { id: '8', name: 'Jordan Smith', role: 'Team Member', availability: ['opening', 'lunch'] },
              { id: '9', name: 'Casey Williams', role: 'Pitmaster', availability: ['opening', 'afternoon', 'dinner'] },
            ]
          },
          {
            id: 'lunch',
            shiftType: 'Lunch',
            startTime: '11:00',
            endTime: '14:00',
            positions: [
              { id: 'shift-leader', name: 'Shift Leader', station: 'Front Counter', requiredRole: 'Shift Leader', assignedStaff: { id: '4', name: 'Emily Davis', role: 'Shift Leader', availability: ['lunch', 'dinner'] } },
              { id: 'cashier-1', name: 'Cashier #1', station: 'Register 1', requiredRole: 'Cashier', assignedStaff: { id: '5', name: 'Jordan Lee', role: 'Cashier', availability: ['lunch', 'dinner'] } },
              { id: 'cashier-2', name: 'Cashier #2', station: 'Register 2', requiredRole: 'Cashier' },
              { id: 'line-cook', name: 'Line Cook', station: 'Kitchen Line', requiredRole: 'Prep Cook', assignedStaff: { id: '6', name: 'Alex Rodriguez', role: 'Prep Cook', availability: ['lunch', 'dinner'] } },
              { id: 'expediter', name: 'Expediter', station: 'Pass Window', requiredRole: 'Team Member' },
              { id: 'runner', name: 'Food Runner', station: 'Dining Room', requiredRole: 'Team Member' },
              { id: 'sanitizer', name: 'Sanitizer', station: 'Dish Pit', requiredRole: 'Team Member' },
              { id: 'catering-prep', name: 'Catering Prep', station: 'Catering Kitchen', requiredRole: 'Prep Cook' },
              { id: 'sides-station', name: 'Sides Station', station: 'Kitchen', requiredRole: 'Prep Cook' },
              { id: 'drink-station', name: 'Drink Station', station: 'Front Counter', requiredRole: 'Team Member' },
            ],
            availableStaff: [
              { id: '10', name: 'Taylor Brown', role: 'Cashier', availability: ['lunch', 'dinner'] },
              { id: '11', name: 'Morgan Davis', role: 'Team Member', availability: ['lunch', 'afternoon', 'dinner'] },
              { id: '12', name: 'Riley Johnson', role: 'Prep Cook', availability: ['lunch', 'dinner'] },
            ]
          },
          {
            id: 'afternoon',
            shiftType: 'Afternoon',
            startTime: '14:00',
            endTime: '16:00',
            positions: [
              { id: 'afternoon-lead', name: 'Afternoon Lead', station: 'Front Counter', requiredRole: 'Shift Leader' },
              { id: 'afternoon-cashier', name: 'Cashier', station: 'Register 1', requiredRole: 'Cashier' },
              { id: 'afternoon-kitchen', name: 'Kitchen Support', station: 'Kitchen', requiredRole: 'Prep Cook' },
              { id: 'afternoon-maintenance', name: 'Maintenance', station: 'General', requiredRole: 'Team Member' },
            ],
            availableStaff: [
              { id: '13', name: 'Sam Wilson', role: 'Shift Leader', availability: ['afternoon', 'dinner'] },
              { id: '14', name: 'Pat Garcia', role: 'Cashier', availability: ['afternoon', 'dinner', 'latenight'] },
            ]
          },
          {
            id: 'dinner',
            shiftType: 'Dinner',
            startTime: '16:00',
            endTime: '19:00',
            positions: [
              { id: 'dinner-manager', name: 'Dinner Manager', station: 'Floor', requiredRole: 'Manager' },
              { id: 'dinner-cashier-1', name: 'Cashier #1', station: 'Register 1', requiredRole: 'Cashier' },
              { id: 'dinner-cashier-2', name: 'Cashier #2', station: 'Register 2', requiredRole: 'Cashier' },
              { id: 'dinner-line', name: 'Line Cook', station: 'Kitchen Line', requiredRole: 'Prep Cook' },
              { id: 'dinner-expediter', name: 'Expediter', station: 'Pass Window', requiredRole: 'Team Member' },
              { id: 'dinner-runner-1', name: 'Food Runner #1', station: 'Dining Room', requiredRole: 'Team Member' },
              { id: 'dinner-runner-2', name: 'Food Runner #2', station: 'Dining Room', requiredRole: 'Team Member' },
              { id: 'dinner-sanitizer', name: 'Sanitizer', station: 'Dish Pit', requiredRole: 'Team Member' },
              { id: 'dinner-sides', name: 'Sides Station', station: 'Kitchen', requiredRole: 'Prep Cook' },
              { id: 'dinner-drinks', name: 'Drink Station', station: 'Front Counter', requiredRole: 'Team Member' },
              { id: 'dinner-smoker', name: 'Smoker Tender', station: 'Main Smoker', requiredRole: 'Pitmaster' },
            ],
            availableStaff: [
              { id: '15', name: 'Chris Martinez', role: 'Manager', availability: ['dinner', 'latenight'] },
              { id: '16', name: 'Avery Thompson', role: 'Cashier', availability: ['dinner', 'latenight', 'closing'] },
            ]
          },
          {
            id: 'latenight',
            shiftType: 'Late Night',
            startTime: '19:00',
            endTime: '21:00',
            positions: [
              { id: 'late-lead', name: 'Late Lead', station: 'Front Counter', requiredRole: 'Shift Leader' },
              { id: 'late-cashier', name: 'Cashier', station: 'Register 1', requiredRole: 'Cashier' },
              { id: 'late-kitchen', name: 'Kitchen Support', station: 'Kitchen', requiredRole: 'Prep Cook' },
              { id: 'late-cleaning', name: 'Cleaning Crew', station: 'General', requiredRole: 'Team Member' },
            ],
            availableStaff: [
              { id: '17', name: 'Dakota Lee', role: 'Shift Leader', availability: ['latenight', 'closing'] },
              { id: '18', name: 'Quinn Adams', role: 'Team Member', availability: ['latenight', 'closing'] },
            ]
          },
          {
            id: 'closing',
            shiftType: 'Closing',
            startTime: '21:00',
            endTime: '23:00',
            positions: [
              { id: 'closing-manager', name: 'Closing Manager', station: 'Floor', requiredRole: 'Manager' },
              { id: 'closing-cashier', name: 'Cashier', station: 'Register 1', requiredRole: 'Cashier' },
              { id: 'closing-kitchen', name: 'Kitchen Closer', station: 'Kitchen', requiredRole: 'Prep Cook' },
              { id: 'closing-sanitizer', name: 'Sanitizer', station: 'Dish Pit', requiredRole: 'Team Member' },
              { id: 'closing-maintenance', name: 'Maintenance Closer', station: 'General', requiredRole: 'Team Member' },
              { id: 'closing-smoker', name: 'Smoker Closer', station: 'Main Smoker', requiredRole: 'Pitmaster' },
            ],
            availableStaff: [
              { id: '19', name: 'River Clark', role: 'Manager', availability: ['closing'] },
              { id: '20', name: 'Sage Mitchell', role: 'Team Member', availability: ['closing'] },
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

    const { source, destination, draggableId } = result;
    
    // Find the current shift
    const currentShift = setupSheet.shiftAssignments.find(s => s.id === selectedShift);
    if (!currentShift) return;

    if (source.droppableId === 'available-staff' && destination.droppableId.startsWith('position-')) {
      // Moving staff from available to position
      const positionId = destination.droppableId.replace('position-', '');
      const staffMember = currentShift.availableStaff.find(s => s.id === draggableId);
      
      if (staffMember) {
        const updatedShifts = setupSheet.shiftAssignments.map(shift => {
          if (shift.id === selectedShift) {
            return {
              ...shift,
              positions: shift.positions.map(pos => 
                pos.id === positionId ? { ...pos, assignedStaff: staffMember } : pos
              ),
              availableStaff: shift.availableStaff.filter(s => s.id !== draggableId)
            };
          }
          return shift;
        });

        setSetupSheet({ ...setupSheet, shiftAssignments: updatedShifts });
        toast({
          title: "Staff Assigned",
          description: `${staffMember.name} assigned to ${currentShift.positions.find(p => p.id === positionId)?.name}`,
        });
      }
    } else if (source.droppableId.startsWith('position-') && destination.droppableId === 'available-staff') {
      // Moving staff from position back to available
      const positionId = source.droppableId.replace('position-', '');
      const position = currentShift.positions.find(p => p.id === positionId);
      
      if (position?.assignedStaff) {
        const updatedShifts = setupSheet.shiftAssignments.map(shift => {
          if (shift.id === selectedShift) {
            return {
              ...shift,
              positions: shift.positions.map(pos => 
                pos.id === positionId ? { ...pos, assignedStaff: undefined } : pos
              ),
              availableStaff: [...shift.availableStaff, position.assignedStaff]
            };
          }
          return shift;
        });

        setSetupSheet({ ...setupSheet, shiftAssignments: updatedShifts });
        toast({
          title: "Staff Unassigned",
          description: `${position.assignedStaff.name} moved back to available staff`,
        });
      }
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

  const getCurrentShift = () => {
    return setupSheet?.shiftAssignments.find(s => s.id === selectedShift);
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

  const currentShift = getCurrentShift();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Left Column - Compact Widgets */}
          <div className="space-y-4">
            {/* Weather & Environment */}
            <Card className="card-bbq">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Cloud className="h-4 w-4 text-primary" />
                  Weather & Environment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getWeatherIcon(setupSheet.weather.condition)}</span>
                  <div>
                    <div className="text-xl font-bold">{setupSheet.weather.temperature}°F</div>
                    <div className="text-xs text-muted-foreground">{setupSheet.weather.condition}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Humidity:</span>
                    <div className="font-medium">{setupSheet.weather.humidity}%</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Traffic:</span>
                    <div className="font-medium text-orange-600">High</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Notes */}
            <Card className="card-bbq">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4 text-primary" />
                  Team Notes
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingNotes(!editingNotes)}
                    className="ml-auto h-6 px-2 text-xs"
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
                      className="min-h-[60px] text-xs"
                    />
                    <Button onClick={updateTeamNotes} size="sm" className="text-xs">
                      Save Notes
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs">{setupSheet.teamNotes}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Shift Assignments - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            {/* Shift Time Selector */}
            <Card className="card-bbq">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Shift Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedShift} onValueChange={setSelectedShift}>
                  <SelectTrigger className="w-full mb-4">
                    <SelectValue placeholder="Select shift time" />
                  </SelectTrigger>
                  <SelectContent>
                    {shiftTimes.map((shift) => (
                      <SelectItem key={shift.id} value={shift.id}>
                        {shift.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Current Shift Details */}
            {currentShift && (
              <Card className="card-bbq">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-sm">
                      {currentShift.shiftType}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {currentShift.startTime} - {currentShift.endTime}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Positions */}
                    <div>
                      <h4 className="font-medium text-sm mb-3">Positions</h4>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {currentShift.positions.map((position) => (
                          <Droppable key={position.id} droppableId={`position-${position.id}`}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`
                                  border-2 border-dashed rounded-lg p-3 min-h-[60px]
                                  ${snapshot.isDraggingOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'}
                                  ${position.assignedStaff ? 'bg-muted/30' : 'bg-background'}
                                `}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-xs">{position.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {position.station}
                                  </Badge>
                                </div>
                                {position.requiredRole && (
                                  <div className="text-xs text-muted-foreground mb-2">
                                    Requires: {position.requiredRole}
                                  </div>
                                )}
                                
                                {position.assignedStaff ? (
                                  <Draggable 
                                    draggableId={position.assignedStaff.id} 
                                    index={0}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`
                                          flex items-center gap-2 p-2 bg-primary/10 rounded text-xs
                                          ${snapshot.isDragging ? 'shadow-lg rotate-2' : ''}
                                        `}
                                      >
                                        <GripVertical className="h-3 w-3 text-muted-foreground" />
                                        <div>
                                          <div className="font-medium">
                                            {position.assignedStaff.name}
                                          </div>
                                          <div className="text-muted-foreground">
                                            {position.assignedStaff.role}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ) : (
                                  <div className="text-xs text-muted-foreground italic">
                                    Drag staff here to assign
                                  </div>
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        ))}
                      </div>
                    </div>

                    {/* Available Staff */}
                    <div>
                      <h4 className="font-medium text-sm mb-3">Available Staff</h4>
                      <Droppable droppableId="available-staff">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`
                              border-2 border-dashed rounded-lg p-3 min-h-[200px] max-h-96 overflow-y-auto
                              ${snapshot.isDraggingOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'}
                            `}
                          >
                            <div className="space-y-2">
                              {currentShift.availableStaff.map((staff, index) => (
                                <Draggable key={staff.id} draggableId={staff.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`
                                        flex items-center gap-2 p-2 bg-muted/50 rounded text-xs cursor-move
                                        ${snapshot.isDragging ? 'shadow-lg rotate-2 scale-105' : ''}
                                      `}
                                    >
                                      <GripVertical className="h-3 w-3 text-muted-foreground" />
                                      <div>
                                        <div className="font-medium">{staff.name}</div>
                                        <div className="text-muted-foreground">{staff.role}</div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {currentShift.availableStaff.length === 0 && (
                                <div className="text-xs text-muted-foreground italic text-center py-4">
                                  All staff assigned
                                </div>
                              )}
                            </div>
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Catering Orders */}
          <div className="space-y-4">
            <Card className="card-bbq">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <UtensilsCrossed className="h-4 w-4 text-primary" />
                  Catering Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {setupSheet.cateringOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-xs">{order.customerName}</h4>
                        <Badge 
                          variant={order.status === 'pending' ? 'secondary' : 
                                 order.status === 'in_prep' ? 'default' : 'outline'}
                          className="text-xs"
                        >
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{order.orderSummary}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="h-3 w-3" />
                        Delivery: {order.deliveryTime}
                      </div>
                      <p className="text-xs font-medium text-orange-600">{order.prepRequirements}</p>
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