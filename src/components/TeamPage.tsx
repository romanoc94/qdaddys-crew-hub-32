import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
      role: "Shift Leader",
      status: "active",
      qCash: 380,
      rating: 4.9,
      shiftHours: 7.0,
      certifications: ["Team Leadership", "Customer Service", "Catering Coord"]
    },
    {
      id: "3",
      name: "David Kim", 
      role: "Prep Cook",
      status: "break",
      qCash: 220,
      rating: 4.6,
      shiftHours: 4.5,
      certifications: ["Food Safety", "Sauce Prep"]
    },
    {
      id: "4",
      name: "Jessica Chen",
      role: "Cashier",
      status: "active", 
      qCash: 310,
      rating: 4.7,
      shiftHours: 5.5,
      certifications: ["POS Systems", "Customer Service", "Order Accuracy"]
    },
    {
      id: "5",
      name: "Marcus Johnson",
      role: "Catering Lead",
      status: "off-duty",
      qCash: 450,
      rating: 4.9,
      shiftHours: 0,
      certifications: ["Event Planning", "Large Orders", "Transport Safety"]
    },
    {
      id: "6",
      name: "Emma Davis",
      role: "Line Cook",
      status: "active",
      qCash: 180,
      rating: 4.4,
      shiftHours: 3.0,
      certifications: ["Food Safety", "Grill Operations"]
    }
  ];

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || member.role.toLowerCase().includes(filterRole.toLowerCase());
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'break': return 'bg-accent';
      case 'off-duty': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'On Shift';
      case 'break': return 'On Break';
      case 'off-duty': return 'Off Duty';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bbq font-bold text-foreground">Team Management</h1>
          <p className="text-muted-foreground mt-1">Manage your BBQ crew and track performance</p>
        </div>
        <Button className="mt-4 sm:mt-0 btn-bbq gap-2">
          <UserPlus className="h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-bbq">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{teamMembers.length}</p>
                <p className="text-xs text-muted-foreground">Total Staff</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-bbq">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{teamMembers.filter(m => m.status === 'active').length}</p>
                <p className="text-xs text-muted-foreground">On Shift</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-bbq">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flame className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">{teamMembers.reduce((sum, m) => sum + m.qCash, 0)}</p>
                <p className="text-xs text-muted-foreground">Total Q-Cash</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-bbq">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">{(teamMembers.reduce((sum, m) => sum + m.rating, 0) / teamMembers.length).toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-bbq">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="pitmaster">Pitmaster</SelectItem>
                <SelectItem value="leader">Shift Leader</SelectItem>
                <SelectItem value="cook">Cook</SelectItem>
                <SelectItem value="cashier">Cashier</SelectItem>
                <SelectItem value="catering">Catering</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
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
        </CardContent>
      </Card>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="card-bbq hover:shadow-bbq transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-fire text-white font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {member.role}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">{getStatusText(member.status)}</p>
                  {member.status === 'active' && (
                    <p className="text-xs text-muted-foreground">{member.shiftHours}h today</p>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Flame className="h-4 w-4 text-accent" />
                    <span className="text-lg font-bold text-accent">{member.qCash}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Q-Cash</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 text-accent" />
                    <span className="text-lg font-bold">{member.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  Certifications
                </p>
                <div className="flex flex-wrap gap-1">
                  {member.certifications.slice(0, 2).map((cert, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                  {member.certifications.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{member.certifications.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Profile
                </Button>
                <Button variant="secondary" size="sm" className="gap-1">
                  <Flame className="h-3 w-3" />
                  Award
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card className="card-bbq">
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No team members found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}