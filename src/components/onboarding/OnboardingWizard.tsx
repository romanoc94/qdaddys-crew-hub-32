import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Building, Users, CheckCircle } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    id: 'store_setup',
    title: 'Store Information',
    description: 'Set up your restaurant details'
  },
  {
    id: 'employee_import',
    title: 'Import Employees',
    description: 'Add your team members'
  },
  {
    id: 'completed',
    title: 'Complete',
    description: 'Your setup is complete!'
  }
];

const testEmployees = [
  { firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', role: 'shift_leader', employeeId: 'EMP001', phone: '555-0101' },
  { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@example.com', role: 'team_member', employeeId: 'EMP002', phone: '555-0102' },
  { firstName: 'Mike', lastName: 'Davis', email: 'mike.davis@example.com', role: 'team_member', employeeId: 'EMP003', phone: '555-0103' },
  { firstName: 'Emily', lastName: 'Brown', email: 'emily.brown@example.com', role: 'team_member', employeeId: 'EMP004', phone: '555-0104' },
  { firstName: 'Chris', lastName: 'Wilson', email: 'chris.wilson@example.com', role: 'team_member', employeeId: 'EMP005', phone: '555-0105' },
  { firstName: 'Lisa', lastName: 'Garcia', email: 'lisa.garcia@example.com', role: 'team_member', employeeId: 'EMP006', phone: '555-0106' },
  { firstName: 'David', lastName: 'Martinez', email: 'david.martinez@example.com', role: 'team_member', employeeId: 'EMP007', phone: '555-0107' },
  { firstName: 'Jessica', lastName: 'Anderson', email: 'jessica.anderson@example.com', role: 'team_member', employeeId: 'EMP008', phone: '555-0108' },
  { firstName: 'Ryan', lastName: 'Taylor', email: 'ryan.taylor@example.com', role: 'team_member', employeeId: 'EMP009', phone: '555-0109' },
  { firstName: 'Amanda', lastName: 'Thomas', email: 'amanda.thomas@example.com', role: 'team_member', employeeId: 'EMP010', phone: '555-0110' },
  { firstName: 'Kevin', lastName: 'Jackson', email: 'kevin.jackson@example.com', role: 'team_member', employeeId: 'EMP011', phone: '555-0111' },
  { firstName: 'Michelle', lastName: 'White', email: 'michelle.white@example.com', role: 'team_member', employeeId: 'EMP012', phone: '555-0112' },
  { firstName: 'Brandon', lastName: 'Harris', email: 'brandon.harris@example.com', role: 'team_member', employeeId: 'EMP013', phone: '555-0113' },
  { firstName: 'Ashley', lastName: 'Clark', email: 'ashley.clark@example.com', role: 'team_member', employeeId: 'EMP014', phone: '555-0114' },
  { firstName: 'Tyler', lastName: 'Lewis', email: 'tyler.lewis@example.com', role: 'team_member', employeeId: 'EMP015', phone: '555-0115' },
  { firstName: 'Stephanie', lastName: 'Walker', email: 'stephanie.walker@example.com', role: 'team_member', employeeId: 'EMP016', phone: '555-0116' }
];

export default function OnboardingWizard() {
  const { user, store } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState('store_setup');
  const [loading, setLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  
  // Store form data
  const [storeForm, setStoreForm] = useState({
    name: '',
    location: '',
    address: '',
    phone: ''
  });

  const [selectedEmployees, setSelectedEmployees] = useState(testEmployees);

  useEffect(() => {
    loadOnboardingStatus();
  }, [store]);

  const loadOnboardingStatus = async () => {
    if (!store?.id) return;

    try {
      const { data, error } = await supabase
        .from('store_onboarding')
        .select('*')
        .eq('store_id', store.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading onboarding status:', error);
        return;
      }

      if (data) {
        setOnboardingData(data);
        setCurrentStep(data.step);
      }
    } catch (error) {
      console.error('Error loading onboarding status:', error);
    }
  };

  const updateOnboardingStep = async (step: string) => {
    if (!store?.id) return;

    try {
      const { error } = await supabase
        .from('store_onboarding')
        .upsert({
          store_id: store.id,
          step,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating onboarding step:', error);
    }
  };

  const handleStoreSetup = async () => {
    if (!store?.id) return;

    setLoading(true);
    try {
      // Update store information
      const { error: storeError } = await supabase
        .from('stores')
        .update({
          name: storeForm.name,
          location: storeForm.location,
          address: storeForm.address,
          phone: storeForm.phone
        })
        .eq('id', store.id);

      if (storeError) throw storeError;

      await updateOnboardingStep('employee_import');
      setCurrentStep('employee_import');
      
      toast({
        title: 'Store setup complete',
        description: 'Your store information has been saved.'
      });
    } catch (error) {
      console.error('Error setting up store:', error);
      toast({
        title: 'Error',
        description: 'Failed to save store information.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeImport = async () => {
    if (!store?.id) return;

    setLoading(true);
    try {
      // Create invitations for selected employees
      const invitations = selectedEmployees.map(emp => ({
        store_id: store.id,
        email: emp.email,
        first_name: emp.firstName,
        last_name: emp.lastName,
        role: emp.role,
        employee_id: emp.employeeId,
        phone: emp.phone
      }));

      const { error: inviteError } = await supabase
        .from('employee_invitations')
        .insert(invitations);

      if (inviteError) throw inviteError;

      await updateOnboardingStep('completed');
      setCurrentStep('completed');
      
      toast({
        title: 'Employees imported',
        description: `${selectedEmployees.length} employee invitations have been sent.`
      });
    } catch (error) {
      console.error('Error importing employees:', error);
      toast({
        title: 'Error',
        description: 'Failed to import employees.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    await updateOnboardingStep('completed');
    window.location.href = '/';
  };

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  const progress = ((getCurrentStepIndex() + 1) / steps.length) * 100;

  if (currentStep === 'completed') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Setup Complete!</CardTitle>
            <CardDescription>
              Your restaurant management system is ready to go.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                Invitation emails have been sent to your team members.
              </p>
              <p className="text-sm text-muted-foreground">
                They'll receive instructions to set up their accounts and access the system.
              </p>
            </div>
            <Button onClick={handleComplete} className="w-full">
              Continue to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Welcome to BBQ Management</CardTitle>
                <CardDescription>Let's get your restaurant set up</CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">
                Step {getCurrentStepIndex() + 1} of {steps.length}
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentStep === 'store_setup' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Building className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Store Information</h3>
                  <p className="text-muted-foreground">Tell us about your restaurant</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name</Label>
                  <Input
                    id="name"
                    value={storeForm.name}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your BBQ Restaurant"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location/Area</Label>
                  <Input
                    id="location"
                    value={storeForm.location}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Downtown, Mall, etc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={storeForm.phone}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea
                    id="address"
                    value={storeForm.address}
                    onChange={(e) => setStoreForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Main Street, City, State 12345"
                    rows={3}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleStoreSetup} 
                disabled={loading || !storeForm.name.trim()}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue to Employee Import
              </Button>
            </div>
          )}

          {currentStep === 'employee_import' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Import Employees</h3>
                  <p className="text-muted-foreground">Add your team members to the system</p>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-4">
                  We've found {testEmployees.length} employees from your scheduling system. 
                  They'll receive email invitations to set up their accounts.
                </p>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedEmployees.map((emp, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                      <div className="flex-1">
                        <div className="font-medium">{emp.firstName} {emp.lastName}</div>
                        <div className="text-sm text-muted-foreground">{emp.email} • {emp.employeeId}</div>
                      </div>
                      <div className="text-sm capitalize">{emp.role.replace('_', ' ')}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleEmployeeImport} 
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Invitations & Complete Setup
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}