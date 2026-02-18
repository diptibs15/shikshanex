import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Bell, CreditCard, Shield, Mail } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Platform Settings</h2>
        <p className="text-muted-foreground">Configure your platform preferences</p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <CardTitle>General Settings</CardTitle>
            </div>
            <CardDescription>Basic platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform_name">Platform Name</Label>
              <Input id="platform_name" defaultValue="ShikshaNex" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support_email">Support Email</Label>
              <Input id="support_email" type="email" defaultValue="support@shikshanex.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input id="contact_phone" defaultValue="+91 9876543210" />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle>Payment Settings</CardTitle>
            </div>
            <CardDescription>Configure Razorpay integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Razorpay integration is currently in simulation mode. 
                Add your Razorpay API keys to enable live payments.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="razorpay_key">Razorpay Key ID</Label>
              <Input id="razorpay_key" placeholder="rzp_test_xxxxxxxxxxxx" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="razorpay_secret">Razorpay Key Secret</Label>
              <Input id="razorpay_secret" type="password" placeholder="••••••••••••••••" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Test Mode</p>
                <p className="text-sm text-muted-foreground">Use Razorpay test environment</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Interview Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Interview Settings</CardTitle>
            </div>
            <CardDescription>Configure AI interview parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interview_fee">Interview Fee (₹)</Label>
                <Input id="interview_fee" type="number" defaultValue="499" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mcq_pass_percent">MCQ Pass Percentage</Label>
                <Input id="mcq_pass_percent" type="number" defaultValue="60" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mcq_time">MCQ Time Limit (minutes)</Label>
                <Input id="mcq_time" type="number" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coding_time">Coding Time Limit (minutes)</Label>
                <Input id="coding_time" type="number" defaultValue="45" />
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Proctoring Enabled</p>
                <p className="text-sm text-muted-foreground">Enable webcam monitoring during tests</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Disqualification</p>
                <p className="text-sm text-muted-foreground">Automatically disqualify on violations</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notification Settings</CardTitle>
            </div>
            <CardDescription>Configure email and push notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Registration Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified when new students register</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Payment Notifications</p>
                <p className="text-sm text-muted-foreground">Get notified for successful payments</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Interview Completion</p>
                <p className="text-sm text-muted-foreground">Get notified when students complete interviews</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>Email Templates</CardTitle>
            </div>
            <CardDescription>Configure automated email templates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Email templates are managed through the backend email service. 
                Contact support to customize email templates.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Welcome Email</p>
                <p className="text-sm text-muted-foreground">Send welcome email on registration</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Invoice Email</p>
                <p className="text-sm text-muted-foreground">Send invoice on payment completion</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Certificate Email</p>
                <p className="text-sm text-muted-foreground">Send certificate on course completion</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button size="lg">Save All Settings</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
