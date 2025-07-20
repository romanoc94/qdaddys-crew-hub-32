import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  Package,
  CloudSun,
  Wind,
  TrendingDown
} from "lucide-react";

export default function Dashboard() {
  const currentUser = "John Doe";

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

  const checklistProgress = [
    { id: '1', name: 'Opening Checklist', progress: 75, critical: true, assignedTo: 'Marcus Johnson' },
    { id: '2', name: 'Prep Checklist', progress: 30, critical: false, assignedTo: 'Sarah Chen' },
    { id: '3', name: 'Lunch Checklist', progress: 90, critical: false, assignedTo: 'Emily Davis' },
  ];

  const salesAndLaborData = {
    todaySales: 4250,
    targetSales: 5000,
    salesPercentage: 85,
    laborCost: 1200,
    laborPercentage: 28.2,
    salesTrend: "+12%"
  };

  const weatherData = {
    current: 78,
    condition: "Partly Cloudy",
    windSpeed: 8,
    humidity: 65,
    forecast: [
      { time: "12 PM", temp: 82, icon: "☀️" },
      { time: "3 PM", temp: 85, icon: "⛅" },
      { time: "6 PM", temp: 78, icon: "🌤️" }
    ]
  };

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

        {/* Checklist Progress */}
        <Card className="card-bbq">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Checklist Progress
            </CardTitle>
            <CardDescription>Current operational checklist status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {checklistProgress.map((checklist) => (
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
                <Progress value={checklist.progress} className="h-2" />
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              View All Checklists
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sales & Labor and Weather Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales & Labor Widget */}
        <Card className="card-bbq">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Sales & Labor
            </CardTitle>
            <CardDescription>Today's performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Today's Sales</p>
                  <p className="text-2xl font-bold">${salesAndLaborData.todaySales.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Target: ${salesAndLaborData.targetSales.toLocaleString()}</p>
                  <p className="text-sm font-medium text-green-600">{salesAndLaborData.salesTrend} vs yesterday</p>
                </div>
              </div>
              <Progress value={salesAndLaborData.salesPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {salesAndLaborData.salesPercentage}% of daily target
              </p>
            </div>
            
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Labor Cost</p>
                  <p className="text-xl font-bold">${salesAndLaborData.laborCost.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-orange-600">{salesAndLaborData.laborPercentage}%</p>
                  <p className="text-xs text-muted-foreground">of sales</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Widget */}
        <Card className="card-bbq">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudSun className="h-5 w-5" />
              Weather
            </CardTitle>
            <CardDescription>Current conditions and forecast</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{weatherData.current}°F</p>
                <p className="text-sm text-muted-foreground">{weatherData.condition}</p>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Wind className="h-4 w-4" />
                  <span>{weatherData.windSpeed} mph</span>
                </div>
                <p className="text-xs text-muted-foreground">Humidity: {weatherData.humidity}%</p>
              </div>
            </div>
            
            <div className="border-t border-border pt-4">
              <h4 className="font-medium text-sm mb-3">Today's Forecast</h4>
              <div className="grid grid-cols-3 gap-2">
                {weatherData.forecast.map((period, index) => (
                  <div key={index} className="text-center p-2 rounded bg-muted/50">
                    <p className="text-xs text-muted-foreground">{period.time}</p>
                    <p className="text-lg">{period.icon}</p>
                    <p className="text-sm font-medium">{period.temp}°</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Row - Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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