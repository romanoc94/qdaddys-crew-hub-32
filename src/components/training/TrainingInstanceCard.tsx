import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Flame, Award, User, CheckCircle2, AlertCircle, Play, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrainingInstance {
  id: string;
  template_id: string;
  profile_id: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'approved' | 'expired';
  progress_percentage: number;
  assigned_at: string;
  started_at?: string;
  completed_at?: string;
  approved_at?: string;
  approved_by?: string;
  notes?: string;
  score?: number;
  certification_earned: boolean;
  expires_at: string;
  template: {
    id: string;
    name: string;
    description: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    category: string;
    estimated_duration_hours: number;
    certification_required: boolean;
  };
  approver?: {
    first_name: string;
    last_name: string;
  };
}

interface TrainingInstanceCardProps {
  instance: TrainingInstance;
  onStart: (instanceId: string) => void;
  onContinue: (instanceId: string) => void;
  onReview: (instanceId: string) => void;
  currentUserRole?: string;
}

const statusConfig = {
  assigned: {
    label: "Not Started",
    color: "bg-muted text-muted-foreground",
    icon: FileText,
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Play,
  },
  completed: {
    label: "Pending Approval",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: AlertCircle,
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle2,
  },
  expired: {
    label: "Expired",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    icon: AlertCircle,
  },
};

const levelColors = {
  Beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Intermediate: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  Advanced: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function TrainingInstanceCard({ 
  instance, 
  onStart, 
  onContinue, 
  onReview,
  currentUserRole 
}: TrainingInstanceCardProps) {
  const statusInfo = statusConfig[instance.status];
  const StatusIcon = statusInfo.icon;
  
  const isExpired = new Date(instance.expires_at) < new Date();
  const daysLeft = Math.ceil((new Date(instance.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const getActionButton = () => {
    switch (instance.status) {
      case 'assigned':
        return (
          <Button 
            onClick={() => onStart(instance.id)}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Training
          </Button>
        );
      case 'in_progress':
        return (
          <Button 
            onClick={() => onContinue(instance.id)}
            variant="outline"
            className="w-full"
          >
            <Play className="w-4 h-4 mr-2" />
            Continue Training
          </Button>
        );
      case 'completed':
      case 'approved':
        return (
          <Button 
            onClick={() => onReview(instance.id)}
            variant="outline"
            className="w-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            Review Training
          </Button>
        );
      case 'expired':
        return (
          <Button 
            onClick={() => onStart(instance.id)}
            variant="outline"
            className="w-full"
            disabled
          >
            Expired
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg border border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-600" />
              {instance.template.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {instance.template.description}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={cn("text-xs", levelColors[instance.template.level])}>
              {instance.template.level}
            </Badge>
            <Badge className={cn("text-xs", statusInfo.color)}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusInfo.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{instance.progress_percentage}%</span>
          </div>
          <Progress value={instance.progress_percentage} className="h-2" />
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{instance.template.estimated_duration_hours}h</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Award className="w-4 h-4" />
            <span>{instance.template.certification_required ? 'Certified' : 'Training'}</span>
          </div>
        </div>

        {/* Expiry Warning */}
        {!isExpired && daysLeft <= 7 && instance.status !== 'approved' && (
          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
            <AlertCircle className="w-3 h-3" />
            <span>Expires in {daysLeft} days</span>
          </div>
        )}

        {/* Approval Info */}
        {instance.status === 'approved' && instance.approver && (
          <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded">
            <User className="w-3 h-3" />
            <span>Approved by {instance.approver.first_name} {instance.approver.last_name}</span>
          </div>
        )}

        {/* Action Button */}
        {getActionButton()}
      </CardContent>
    </Card>
  );
}