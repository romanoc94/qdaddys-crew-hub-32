import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UserCheck, UserX, Mail, Phone, Calendar, Shield } from 'lucide-react';

interface TeamMember {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  employee_id: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  permissions: string[];
}

interface AuditLog {
  id: string;
  action: string;
  old_values: any;
  new_values: any;
  changed_by: string;
  changed_at: string;
  reason: string | null;
}

export default function AccountManagement() {
  const { profile, store } = useAuth();
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (store?.id) {
      loadTeamMembers();
      loadAuditLogs();
    }
  }, [store]);

  const loadTeamMembers = async () => {
    if (!store?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('store_id', store.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error loading team members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load team members.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAuditLogs = async () => {
    if (!store?.id) return;

    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('table_name', 'profiles')
        .order('changed_at', { ascending: false })
        .limit(50);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    }
  };

  const toggleAccountStatus = async (memberId: string, currentStatus: boolean, reason: string = '') => {
    try {
      const oldValues = { is_active: currentStatus };
      const newValues = { is_active: !currentStatus };

      // Update the profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', memberId);

      if (updateError) throw updateError;

      // Create audit log
      const { error: auditError } = await supabase
        .from('audit_logs')
        .insert({
          table_name: 'profiles',
          record_id: memberId,
          action: 'UPDATE',
          old_values: oldValues,
          new_values: newValues,
          changed_by: profile?.id,
          reason: reason || `Account ${!currentStatus ? 'activated' : 'deactivated'}`
        });

      if (auditError) throw auditError;

      // Refresh data
      await loadTeamMembers();
      await loadAuditLogs();

      toast({
        title: 'Success',
        description: `Account ${!currentStatus ? 'activated' : 'deactivated'} successfully.`
      });
    } catch (error) {
      console.error('Error updating account status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update account status.',
        variant: 'destructive'
      });
    }
  };

  const updateRole = async (memberId: string, newRole: string, currentRole: string) => {
    try {
      const oldValues = { role: currentRole };
      const newValues = { role: newRole };

      // Update the profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', memberId);

      if (updateError) throw updateError;

      // Create audit log
      const { error: auditError } = await supabase
        .from('audit_logs')
        .insert({
          table_name: 'profiles',
          record_id: memberId,
          action: 'UPDATE',
          old_values: oldValues,
          new_values: newValues,
          changed_by: profile?.id,
          reason: `Role changed from ${currentRole} to ${newRole}`
        });

      if (auditError) throw auditError;

      // Refresh data
      await loadTeamMembers();
      await loadAuditLogs();

      toast({
        title: 'Success',
        description: 'Role updated successfully.'
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update role.',
        variant: 'destructive'
      });
    }
  };

  const canManageAccounts = profile?.role === 'operator' || profile?.role === 'manager';

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Account Management</h2>
          <p className="text-muted-foreground">Manage team member accounts and permissions</p>
        </div>
      </div>

      {/* Team Members */}
      <div className="grid gap-4">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-secondary rounded-full">
                    <span className="text-lg font-medium text-secondary-foreground">
                      {member.first_name?.[0]}{member.last_name?.[0]}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">
                        {member.first_name} {member.last_name}
                      </h3>
                      <Badge variant={member.is_active ? 'default' : 'secondary'}>
                        {member.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4" />
                        <span className="capitalize">{member.role.replace('_', ' ')}</span>
                      </div>
                      {member.employee_id && (
                        <span>ID: {member.employee_id}</span>
                      )}
                      {member.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date(member.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {canManageAccounts && member.id !== profile?.id && (
                  <div className="flex items-center space-x-4">
                    {/* Role Management */}
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`role-${member.id}`} className="text-sm">Role:</Label>
                      <select
                        id={`role-${member.id}`}
                        value={member.role}
                        onChange={(e) => updateRole(member.id, e.target.value, member.role)}
                        className="px-2 py-1 text-sm border rounded"
                      >
                        <option value="team_member">Team Member</option>
                        <option value="shift_leader">Shift Leader</option>
                        <option value="manager">Manager</option>
                        {profile?.role === 'operator' && (
                          <option value="operator">Operator</option>
                        )}
                      </select>
                    </div>

                    {/* Account Status Toggle */}
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`status-${member.id}`} className="text-sm">Active:</Label>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Switch
                            id={`status-${member.id}`}
                            checked={member.is_active}
                          />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {member.is_active ? 'Deactivate' : 'Activate'} Account
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to {member.is_active ? 'deactivate' : 'activate'} {member.first_name} {member.last_name}'s account?
                              {member.is_active && ' They will no longer be able to access the system.'}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => toggleAccountStatus(member.id, member.is_active)}
                            >
                              {member.is_active ? 'Deactivate' : 'Activate'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Audit Trail */}
      {auditLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Changes</CardTitle>
            <CardDescription>Account modification history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{log.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.changed_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline">{log.action}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}