import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Clock, 
  Flame, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  DollarSign,
  ChefHat,
  Thermometer,
  Package
} from "lucide-react";

export default function Dashboard() {
  const currentUser = "John Doe";
  const todayMetrics = {
    activeStaff: 8,
    completedTasks: 23,
    qCashAwarded: 150,
    upcomingShifts: 3,
    lowInventory: 2,
    tempAlerts: 1
  };

  const quickActions = [
    { label: "Start Shift", icon: Clock, variant: "default" as const },
    { label: "View Tasks", icon: CheckCircle, variant: "outline" as const },
    { label: "Award Q-Cash", icon: Flame, variant: "secondary" as const },
    { label: "Check Inventory", icon: Package, variant: "outline" as const },
  ];

  const activeAlerts = [
    { type: "warning", message: "Brisket inventory running low", time: "2 min ago" },
    { type: "info", message: "Catering order prep starts in 1 hour", time: "5 min ago" },
  ];

  const todaysTasks = [
    { task: "Clean smoker grates", assigned: "Mike Rodriguez", status: "completed" },
    { task: "Prep sauce bottles", assigned: "Sarah Wilson", status: "in-progress" },
    { task: "Stock napkin dispensers", assigned: "David Kim", status: "pending" },
    { task: "Temperature check - Pit #2", assigned: "Auto-assigned", status: "overdue" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bbq font-bold text-foreground">Welcome back, {currentUser}!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening at Qdaddy's BBQ today</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          {quickActions.map((action, index) => (
            <Button key={index} variant={action.variant} size="sm" className="gap-2">
              <action.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="card-bbq">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayMetrics.activeStaff}</div>
            <p className="text-xs text-muted-foreground">Currently on shift</p>
          </CardContent>
        </Card>

        <Card className="card-bbq">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayMetrics.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="card-bbq">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Q-Cash Awarded</CardTitle>
            <Flame className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{todayMetrics.qCashAwarded}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card className="card-bbq">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Shifts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayMetrics.upcomingShifts}</div>
            <p className="text-xs text-muted-foreground">Next 4 hours</p>
          </CardContent>
        </Card>

        <Card className="card-bbq">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Inventory</CardTitle>
            <Package className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{todayMetrics.lowInventory}</div>
            <p className="text-xs text-muted-foreground">Items need restocking</p>
          </CardContent>
        </Card>

        <Card className="card-bbq">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature Alerts</CardTitle>
            <Thermometer className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{todayMetrics.tempAlerts}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <Card className="card-bbq">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Today's Tasks
            </CardTitle>
            <CardDescription>Current checklist items and assignments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaysTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <p className="font-medium text-sm">{task.task}</p>
                  <p className="text-xs text-muted-foreground">Assigned to: {task.assigned}</p>
                </div>
                <Badge 
                  variant={
                    task.status === 'completed' ? 'default' :
                    task.status === 'in-progress' ? 'secondary' :
                    task.status === 'overdue' ? 'destructive' : 'outline'
                  }
                  className="ml-2"
                >
                  {task.status.replace('-', ' ')}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              View All Tasks
            </Button>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card className="card-bbq">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Active Alerts
            </CardTitle>
            <CardDescription>Important notifications requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeAlerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.type === 'warning' ? 'bg-destructive' : 'bg-primary'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
            
            {/* BBQ Temperature Status */}
            <div className="border-t border-border pt-4 mt-4">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <ChefHat className="h-4 w-4" />
                Pit Status
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-green-50 border border-green-200">
                  <p className="text-xs font-medium text-green-800">Pit #1</p>
                  <p className="text-lg font-bold text-green-600">225°F</p>
                </div>
                <div className="p-2 rounded bg-red-50 border border-red-200">
                  <p className="text-xs font-medium text-red-800">Pit #2</p>
                  <p className="text-lg font-bold text-red-600">195°F</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}