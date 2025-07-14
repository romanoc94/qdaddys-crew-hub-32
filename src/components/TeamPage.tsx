import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Search, 
  Star, 
  Flame,
  Clock,
  Award,
  ChefHat,
  UserPlus,
  Filter
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AccountManagement from "./team/AccountManagement";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'break' | 'off-duty';
  qCash: number;
  rating: number;
  shiftHours: number;
  certifications: string[];
  avatar?: string;
}

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Mike Rodriguez",
      role: "Pitmaster",
      status: "active",
      qCash: 420,
      rating: 4.8,
      shiftHours: 6.5,
      certifications: ["BBQ Safety", "Temperature Control", "Meat Smoking"]
    },
    {
      id: "2", 
      name: "Sarah Wilson",
      role: "Kitchen Manager",
      status: "active",
      qCash: 380,
      rating: 4.9,
      shiftHours: 7.0,
      certifications: ["Food Safety", "Kitchen Management", "Cost Control"]
    },
    {
      id: "3",
      name: "Carlos Martinez",
      role: "Prep Cook",
      status: "break",
      qCash: 180,
      rating: 4.3,
      shiftHours: 4.5,
      certifications: ["Food Safety", "Knife Skills"]
    },
    {
      id: "4",
      name: "Emma Thompson",
      role: "Server",
      status: "active", 
      qCash: 220,
      rating: 4.7,
      shiftHours: 5.5,
      certifications: ["Customer Service", "POS Systems"]
    },
    {
      id: "5",
      name: "Jake Foster",
      role: "Line Cook",
      status: "off-duty",
      qCash: 150,
      rating: 4.1,
      shiftHours: 0,
      certifications: ["Food Safety"]
    },
    {
      id: "6",
      name: "Lisa Chen",
      role: "Shift Supervisor",
      status: "active",
      qCash: 300,
      rating: 4.6,
      shiftHours: 6.0,
      certifications: ["Leadership", "Food Safety", "Inventory Management"]
    }
  ];

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || member.role === filterRole;
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'break': return 'bg-yellow-500'; 
      case 'off-duty': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active': return 'On Shift';
      case 'break': return 'On Break';
      case 'off-duty': return 'Off Duty';
      default: return status;
    }
  };

  const totalStaff = teamMembers.length;
  const onShiftStaff = teamMembers.filter(m => m.status === 'active').length;
  const totalQCash = teamMembers.reduce((sum, m) => sum + m.qCash, 0);
  const avgRating = teamMembers.reduce((sum, m) => sum + m.rating, 0) / teamMembers.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-fire bg-clip-text text-transparent">
            Team Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your BBQ crew and track performance
          </p>
        </div>
        <Button className="btn-bbq">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Team Overview</TabsTrigger>
          <TabsTrigger value="management">Account Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Staff</p>
                    <p className="text-2xl font-bold">{totalStaff}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/50 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">On Shift</p>
                    <p className="text-2xl font-bold text-green-600">{onShiftStaff}</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/50 border-orange-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Q-Cash</p>
                    <p className="text-2xl font-bold text-orange-600">${totalQCash}</p>
                  </div>
                  <Flame className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/50 border-yellow-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                    <p className="text-2xl font-bold text-yellow-600">{avgRating.toFixed(1)}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="bg-gradient-to-r from-card/50 to-card border-border/50">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="Pitmaster">Pitmaster</SelectItem>
                      <SelectItem value="Kitchen Manager">Kitchen Manager</SelectItem>
                      <SelectItem value="Prep Cook">Prep Cook</SelectItem>
                      <SelectItem value="Line Cook">Line Cook</SelectItem>
                      <SelectItem value="Server">Server</SelectItem>
                      <SelectItem value="Shift Supervisor">Shift Supervisor</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">On Shift</SelectItem>
                      <SelectItem value="break">On Break</SelectItem>
                      <SelectItem value="off-duty">Off Duty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-fire text-white font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <ChefHat className="w-4 h-4" />
                        {member.role}
                      </CardDescription>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(member.status)}`} />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                      {getStatusText(member.status)}
                    </Badge>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium">Q-Cash</span>
                      </div>
                      <p className="text-lg font-bold text-orange-600">${member.qCash}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">Rating</span>
                      </div>
                      <p className="text-lg font-bold text-yellow-600">{member.rating}</p>
                    </div>
                  </div>

                  {/* Shift Hours */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Today's Hours</span>
                      <span className="text-sm font-medium">{member.shiftHours}h</span>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Certifications</span>
                    <div className="flex flex-wrap gap-1">
                      {member.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">No team members found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="management">
          <AccountManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}