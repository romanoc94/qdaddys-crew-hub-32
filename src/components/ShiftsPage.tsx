import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus,
  MapPin,
  ChefHat,
  Flame,
  Calendar as CalendarIcon
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ShiftAssignment {
  id: string;
  employee: string;
  role: string;
  startTime: string;
  endTime: string;
  avatar?: string;
  status: 'scheduled' | 'active' | 'completed';
}

interface Shift {
  id: string;
  date: string;
  location: string;
  assignments: ShiftAssignment[];
  notes?: string;
  specialEvents?: string[];
}

export default function ShiftsPage() {
  const [selectedDate, setSelectedDate] = useState("2024-01-15");
  
  const shifts: Shift[] = [
    {
      id: "1",
      date: "2024-01-15",
      location: "Mansfield Location",
      notes: "Catering pickup at 2 PM - Corporate event (50 people)",
      specialEvents: ["Large Catering Order"],
      assignments: [
        {
          id: "1",
          employee: "Mike Rodriguez",
          role: "Pitmaster",
          startTime: "06:00",
          endTime: "14:00",
          status: "active"
        },
        {
          id: "2", 
          employee: "Sarah Wilson",
          role: "Shift Leader",
          startTime: "07:00",
          endTime: "15:00",
          status: "active"
        },
        {
          id: "3",
          employee: "David Kim",
          role: "Prep Cook", 
          startTime: "09:00",
          endTime: "17:00",
          status: "scheduled"
        },
        {
          id: "4",
          employee: "Jessica Chen",
          role: "Cashier",
          startTime: "11:00",
          endTime: "19:00", 
          status: "scheduled"
        },
        {
          id: "5",
          employee: "Marcus Johnson",
          role: "Catering Lead",
          startTime: "10:00",
          endTime: "18:00",
          status: "active"
        }
      ]
    }
  ];

  const currentShift = shifts.find(s => s.date === selectedDate);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'scheduled': return 'bg-primary';
      case 'completed': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  const getRoleIcon = (role: string) => {
    if (role.toLowerCase().includes('pitmaster')) return ChefHat;
    if (role.toLowerCase().includes('leader')) return Users;
    return Clock;
  };

  const currentTime = "12:30";
  const activeAssignments = currentShift?.assignments.filter(a => a.status === 'active') || [];
  const upcomingAssignments = currentShift?.assignments.filter(a => a.status === 'scheduled') || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bbq font-bold text-foreground">Shift Management</h1>
          <p className="text-muted-foreground mt-1">Manage daily operations and staff assignments</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Schedule
          </Button>
          <Button className="btn-bbq gap-2">
            <Plus className="h-4 w-4" />
            New Shift
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-bbq">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{activeAssignments.length}</p>
                <p className="text-xs text-muted-foreground">Currently Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-bbq">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">{upcomingAssignments.length}</p>
                <p className="text-xs text-muted-foreground">Coming Up</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-bbq">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-lg font-bold">Mansfield</p>
                <p className="text-xs text-muted-foreground">Active Location</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-bbq">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flame className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-muted-foreground">Special Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Shift Display */}
      {currentShift && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shift Overview */}
          <div className="lg:col-span-2">
            <Card className="card-bbq">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Today's Shift - {currentShift.location}
                    </CardTitle>
                    <CardDescription>Monday, January 15, 2024 • Current time: {currentTime}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {currentShift.assignments.length} Staff Assigned
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Special Events */}
                {currentShift.specialEvents && currentShift.specialEvents.length > 0 && (
                  <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1 text-accent">Special Events Today</h4>
                    <div className="flex flex-wrap gap-1">
                      {currentShift.specialEvents.map((event, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {currentShift.notes && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Shift Notes</h4>
                    <p className="text-sm text-muted-foreground">{currentShift.notes}</p>
                  </div>
                )}

                {/* Staff Assignments */}
                <div>
                  <h4 className="font-semibold text-sm mb-3">Staff Assignments</h4>
                  <div className="space-y-3">
                    {currentShift.assignments.map((assignment) => {
                      const RoleIcon = getRoleIcon(assignment.role);
                      const isCurrentlyWorking = assignment.status === 'active';
                      
                      return (
                        <div 
                          key={assignment.id}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                            isCurrentlyWorking 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-muted/30 border-border'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gradient-fire text-white font-semibold text-sm">
                                  {assignment.employee.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(assignment.status)}`} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{assignment.employee}</p>
                              <div className="flex items-center gap-1">
                                <RoleIcon className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{assignment.role}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-medium text-sm">{assignment.startTime} - {assignment.endTime}</p>
                            <Badge 
                              variant={assignment.status === 'active' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {assignment.status === 'active' ? 'Working Now' : 
                               assignment.status === 'scheduled' ? 'Scheduled' : 'Completed'}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-3 w-3" />
                    Add Staff
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Flame className="h-3 w-3" />
                    Award Q-Cash
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Clock className="h-3 w-3" />
                    Log Break
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - BBQ Buddies & Quick Actions */}
          <div className="space-y-4">
            {/* BBQ Buddies */}
            <Card className="card-bbq">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <ChefHat className="h-4 w-4" />
                  BBQ Buddies
                </CardTitle>
                <CardDescription className="text-xs">Staff rotation pairs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                  <div className="flex -space-x-2">
                    <Avatar className="h-6 w-6 border-2 border-background">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">MR</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-6 w-6 border-2 border-background">
                      <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">DK</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="text-xs font-medium">Mike & David</p>
                    <p className="text-xs text-muted-foreground">Pit ↔ Prep</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                  <div className="flex -space-x-2">
                    <Avatar className="h-6 w-6 border-2 border-background">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">SW</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-6 w-6 border-2 border-background">
                      <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">JC</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="text-xs font-medium">Sarah & Jessica</p>
                    <p className="text-xs text-muted-foreground">Leader ↔ Front</p>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full text-xs">
                  Manage Pairs
                </Button>
              </CardContent>
            </Card>

            {/* Temperature Monitor */}
            <Card className="card-bbq">
              <CardHeader>
                <CardTitle className="text-sm">Pit Temperatures</CardTitle>
                <CardDescription className="text-xs">Live monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-green-50 border border-green-200 rounded">
                  <span className="text-sm font-medium">Pit #1</span>
                  <span className="font-bold text-green-600">225°F ✓</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-red-50 border border-red-200 rounded">
                  <span className="text-sm font-medium">Pit #2</span>
                  <span className="font-bold text-red-600">195°F ⚠</span>
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  View Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!currentShift && (
        <Card className="card-bbq">
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No shifts scheduled</h3>
            <p className="text-muted-foreground mb-4">Create a new shift to get started</p>
            <Button className="btn-bbq gap-2">
              <Plus className="h-4 w-4" />
              Create New Shift
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}