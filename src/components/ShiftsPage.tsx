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
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  Users, 
  Plus, 
  ChefHat, 
  CreditCard, 
  Utensils, 
  UserPlus,
  CalendarDays,
  Flame,
  NotebookPen
} from 'lucide-react';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  user_id: string;
}

interface Shift {
  id: string;
  date: string;
  shift_type: string;
  start_time: string;
  end_time: string;
  notes: string;
  daily_specials: string;
  catering_notes: string;
  assignments: ShiftAssignment[];
}

interface ShiftAssignment {
  id: string;
  profile_id: string;
  primary_role: string;
  secondary_roles: string[] | null;
  bbq_buddy_id: string | null;
  is_scheduled: boolean;
  profiles: Profile;
  bbq_buddy?: {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
  } | null;
}

const ROLES = [
  { value: 'pitmaster', label: 'Pitmaster', icon: ChefHat, color: 'bg-primary' },
  { value: 'cashier', label: 'Cashier', icon: CreditCard, color: 'bg-accent' },
  { value: 'prep_cook', label: 'Prep Cook', icon: Utensils, color: 'bg-secondary' },
  { value: 'catering_lead', label: 'Catering Lead', icon: Users, color: 'bg-primary-glow' },
  { value: 'front_of_house', label: 'Front of House', icon: UserPlus, color: 'bg-muted' },
  { value: 'manager', label: 'Manager', icon: Users, color: 'bg-destructive' },
];

const SHIFT_TYPES = [
  { value: 'opening', label: 'Opening', time: '06:00-11:00' },
  { value: 'lunch', label: 'Lunch', time: '10:00-15:00' },
  { value: 'dinner', label: 'Dinner', time: '15:00-22:00' },
  { value: 'closing', label: 'Closing', time: '20:00-24:00' },
  { value: 'all_day', label: 'All Day', time: '06:00-22:00' },
];

const ShiftsPage = () => {
  const { profile, store } = useAuth();
  const { toast } = useToast();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [availableStaff, setAvailableStaff] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCreateShift, setShowCreateShift] = useState(false);
  const [newShift, setNewShift] = useState({
    shift_type: '',
    start_time: '',
    end_time: '',
    notes: '',
    daily_specials: '',
    catering_notes: '',
  });

  useEffect(() => {
    if (store?.id) {
      fetchShifts();
      fetchAvailableStaff();
    }
  }, [store?.id, selectedDate]);

  const fetchShifts = async () => {
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select(`
          *,
          shift_assignments!inner (
            *,
            profiles!shift_assignments_profile_id_fkey (
              id, first_name, last_name, role, user_id
            ),
            bbq_buddy:profiles!shift_assignments_bbq_buddy_id_fkey (
              id, first_name, last_name, role
            )
          )
        `)
        .eq('store_id', store?.id)
        .eq('date', selectedDate)
        .order('start_time');

      if (error) throw error;

      const shiftsWithAssignments = data?.map(shift => ({
        ...shift,
        assignments: (shift.shift_assignments || []).map((assignment: any) => ({
          ...assignment,
          secondary_roles: assignment.secondary_roles || []
        }))
      })) || [];

      setShifts(shiftsWithAssignments as Shift[]);
    } catch (error) {
      console.error('Error fetching shifts:', error);
      toast({
        title: "Error",
        description: "Failed to load shifts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableStaff = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role, user_id')
        .eq('store_id', store?.id)
        .eq('is_active', true);

      if (error) throw error;
      setAvailableStaff(data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const createShift = async () => {
    if (!store?.id || !newShift.shift_type) return;

    try {
      const { data, error } = await supabase
        .from('shifts')
        .insert([
          {
            store_id: store.id,
            date: selectedDate,
            ...newShift,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shift created successfully",
      });

      setShowCreateShift(false);
      setNewShift({
        shift_type: '',
        start_time: '',
        end_time: '',
        notes: '',
        daily_specials: '',
        catering_notes: '',
      });
      fetchShifts();
    } catch (error) {
      console.error('Error creating shift:', error);
      toast({
        title: "Error",
        description: "Failed to create shift",
        variant: "destructive",
      });
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // If dropped in the same place, do nothing
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Handle staff assignment
    if (destination.droppableId.startsWith('shift-')) {
      const shiftId = destination.droppableId.replace('shift-', '');
      const staffId = draggableId.replace('staff-', '');
      
      await assignStaffToShift(shiftId, staffId);
    }
  };

  const assignStaffToShift = async (shiftId: string, staffId: string) => {
    try {
      const { error } = await supabase
        .from('shift_assignments')
        .insert([
          {
            shift_id: shiftId,
            profile_id: staffId,
            primary_role: 'front_of_house', // Default role
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Staff assigned to shift",
      });

      fetchShifts();
    } catch (error) {
      console.error('Error assigning staff:', error);
      toast({
        title: "Error",
        description: "Failed to assign staff",
        variant: "destructive",
      });
    }
  };

  const updateAssignmentRole = async (assignmentId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('shift_assignments')
        .update({ primary_role: newRole })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Role updated successfully",
      });

      fetchShifts();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const removeAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('shift_assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Staff removed from shift",
      });

      fetchShifts();
    } catch (error) {
      console.error('Error removing assignment:', error);
      toast({
        title: "Error",
        description: "Failed to remove staff",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: string) => {
    const roleData = ROLES.find(r => r.value === role);
    return roleData ? roleData.icon : Users;
  };

  const getRoleColor = (role: string) => {
    const roleData = ROLES.find(r => r.value === role);
    return roleData ? roleData.color : 'bg-muted';
  };

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
            <CalendarDays className="h-8 w-8 text-primary" />
            Shifts Management
          </h1>
          <p className="text-muted-foreground">Manage daily shifts and assign your BBQ crew</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
          
          {profile?.role && ['shift_leader', 'manager', 'operator'].includes(profile.role) && (
            <Dialog open={showCreateShift} onOpenChange={setShowCreateShift}>
              <DialogTrigger asChild>
                <Button className="btn-bbq">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Shift
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Shift</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="shift_type">Shift Type</Label>
                    <Select value={newShift.shift_type} onValueChange={(value) => setNewShift({ ...newShift, shift_type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shift type" />
                      </SelectTrigger>
                      <SelectContent>
                        {SHIFT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label} ({type.time})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_time">Start Time</Label>
                      <Input
                        id="start_time"
                        type="time"
                        value={newShift.start_time}
                        onChange={(e) => setNewShift({ ...newShift, start_time: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_time">End Time</Label>
                      <Input
                        id="end_time"
                        type="time"
                        value={newShift.end_time}
                        onChange={(e) => setNewShift({ ...newShift, end_time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Shift Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="General shift notes..."
                      value={newShift.notes}
                      onChange={(e) => setNewShift({ ...newShift, notes: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="daily_specials">Daily Specials</Label>
                    <Textarea
                      id="daily_specials"
                      placeholder="Today's BBQ specials..."
                      value={newShift.daily_specials}
                      onChange={(e) => setNewShift({ ...newShift, daily_specials: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="catering_notes">Catering Notes</Label>
                    <Textarea
                      id="catering_notes"
                      placeholder="Catering orders and special instructions..."
                      value={newShift.catering_notes}
                      onChange={(e) => setNewShift({ ...newShift, catering_notes: e.target.value })}
                    />
                  </div>

                  <Button onClick={createShift} className="w-full btn-bbq">
                    Create Shift
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
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

          {/* Shifts */}
          <div className="grid gap-4">
            {shifts.length === 0 ? (
              <Alert>
                <Flame className="h-4 w-4" />
                <AlertDescription>
                  No shifts scheduled for {selectedDate}. Create a shift to get started!
                </AlertDescription>
              </Alert>
            ) : (
              shifts.map((shift) => (
                <Card key={shift.id} className="card-bbq">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        {SHIFT_TYPES.find(t => t.value === shift.shift_type)?.label || shift.shift_type}
                        <Badge variant="outline">
                          {shift.start_time} - {shift.end_time}
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {shift.assignments.length} staff assigned
                        </Badge>
                      </div>
                    </div>
                    
                    {(shift.notes || shift.daily_specials || shift.catering_notes) && (
                      <div className="grid gap-2 text-sm">
                        {shift.notes && (
                          <div className="flex items-start gap-2">
                            <NotebookPen className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <span>{shift.notes}</span>
                          </div>
                        )}
                        {shift.daily_specials && (
                          <div className="flex items-start gap-2">
                            <Flame className="h-4 w-4 text-accent mt-0.5" />
                            <span className="text-accent font-medium">Specials: {shift.daily_specials}</span>
                          </div>
                        )}
                        {shift.catering_notes && (
                          <div className="flex items-start gap-2">
                            <Users className="h-4 w-4 text-primary mt-0.5" />
                            <span className="text-primary">Catering: {shift.catering_notes}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    <Droppable droppableId={`shift-${shift.id}`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`
                            min-h-[100px] p-4 rounded-lg border-2 border-dashed transition-colors
                            ${snapshot.isDraggingOver ? 'border-primary bg-primary/5' : 'border-border bg-muted/20'}
                          `}
                        >
                          <div className="grid gap-3">
                            {shift.assignments.map((assignment, index) => {
                              const RoleIcon = getRoleIcon(assignment.primary_role);
                              return (
                                <div
                                  key={assignment.id}
                                  className="flex items-center justify-between p-3 bg-card border rounded-lg shadow-sm"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${getRoleColor(assignment.primary_role)} text-white`}>
                                      <RoleIcon className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <div className="font-medium">
                                        {assignment.profiles.first_name} {assignment.profiles.last_name}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {assignment.primary_role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                      </div>
                                    </div>
                                    {assignment.bbq_buddy && (
                                      <Badge variant="outline" className="text-xs">
                                        BBQ Buddy: {assignment.bbq_buddy.first_name}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Select
                                      value={assignment.primary_role}
                                      onValueChange={(value) => updateAssignmentRole(assignment.id, value)}
                                    >
                                      <SelectTrigger className="w-auto">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {ROLES.map((role) => (
                                          <SelectItem key={role.value} value={role.value}>
                                            {role.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeAssignment(assignment.id)}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {provided.placeholder}
                          
                          {shift.assignments.length === 0 && (
                            <div className="text-center text-muted-foreground py-8">
                              Drag staff here to assign them to this shift
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
    </div>
  );
};

export default ShiftsPage;