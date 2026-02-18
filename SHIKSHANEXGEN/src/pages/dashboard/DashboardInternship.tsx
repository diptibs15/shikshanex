import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Briefcase, 
  Calendar,
  CheckCircle,
  Clock,
  Upload,
  FileText,
  User,
  Loader2,
  Send,
  Download,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Internship {
  id: string;
  course_id: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  mentor_name: string | null;
  tasks: any[];
  submissions: any[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  week_number: number;
  due_date: string | null;
  status: string;
}

interface Submission {
  id: string;
  task_id: string;
  submission_url: string | null;
  notes: string | null;
  mentor_feedback: string | null;
  grade: string | null;
  submitted_at: string;
}

const DashboardInternship = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch internships
      const { data: internshipData } = await supabase
        .from('internships')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      setInternships((internshipData || []).map(i => ({
        ...i,
        tasks: (i.tasks as any[]) || [],
        submissions: (i.submissions as any[]) || []
      })));

      if (internshipData && internshipData.length > 0) {
        const internshipIds = internshipData.map(i => i.id);
        
        // Fetch tasks
        const { data: taskData } = await supabase
          .from('internship_tasks')
          .select('*')
          .in('internship_id', internshipIds)
          .order('week_number', { ascending: true });

        setTasks(taskData || []);

        // Fetch submissions
        const { data: submissionData } = await supabase
          .from('internship_submissions')
          .select('*')
          .eq('user_id', user?.id);

        setSubmissions(submissionData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTask = async (taskId: string) => {
    setSubmitting(taskId);
    try {
      const { error } = await supabase
        .from('internship_submissions')
        .insert({
          task_id: taskId,
          user_id: user?.id,
          notes: submissionNotes[taskId] || '',
          submission_url: null
        });

      if (error) throw error;

      toast({
        title: 'Submission Successful',
        description: 'Your task has been submitted for review.'
      });

      fetchData();
      setSubmissionNotes(prev => ({ ...prev, [taskId]: '' }));
    } catch (error) {
      console.error('Error submitting task:', error);
      toast({
        title: 'Submission Failed',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(null);
    }
  };

  const getTaskSubmission = (taskId: string) => {
    return submissions.find(s => s.task_id === taskId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const calculateProgress = (internshipId: string) => {
    const internshipTasks = tasks.filter(t => 
      internships.find(i => i.id === internshipId)
    );
    const completedTasks = internshipTasks.filter(t => 
      submissions.some(s => s.task_id === t.id)
    ).length;
    return internshipTasks.length > 0 
      ? Math.round((completedTasks / internshipTasks.length) * 100) 
      : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (internships.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-heading font-bold">Internship</h2>
          <p className="text-muted-foreground">Complete your internship tasks</p>
        </div>

        <Card className="shadow-card">
          <CardContent className="py-16 text-center">
            <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">No Active Internship</h3>
            <p className="text-muted-foreground mb-4">
              Complete your course modules to unlock the internship program
            </p>
            <Button asChild>
              <a href="/dashboard/courses">View My Courses</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeInternship = internships[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Internship Program</h2>
        <p className="text-muted-foreground">Complete your internship tasks and earn your certificate</p>
      </div>

      {/* Internship Overview */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Current Internship
            </CardTitle>
            {getStatusBadge(activeInternship.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">
                  {activeInternship.start_date 
                    ? new Date(activeInternship.start_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
                    : 'Not started'
                  }
                  {' - '}
                  {activeInternship.end_date 
                    ? new Date(activeInternship.end_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
                    : 'Ongoing'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Mentor</p>
                <p className="font-medium">{activeInternship.mentor_name || 'Assigned Soon'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="font-medium">{calculateProgress(activeInternship.id)}% Complete</p>
              </div>
            </div>
          </div>
          <Progress value={calculateProgress(activeInternship.id)} className="h-2" />
        </CardContent>
      </Card>

      {/* Tasks */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Weekly Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="submitted">Submitted</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <div className="space-y-4">
                {tasks.filter(t => !getTaskSubmission(t.id)).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>All tasks completed! Great work!</p>
                  </div>
                ) : (
                  tasks.filter(t => !getTaskSubmission(t.id)).map(task => (
                    <Card key={task.id} className="border">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <Badge variant="outline" className="mb-2">Week {task.week_number}</Badge>
                            <h4 className="font-semibold">{task.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          </div>
                          {task.due_date && (
                            <div className="text-right text-sm">
                              <p className="text-muted-foreground">Due</p>
                              <p className="font-medium">
                                {new Date(task.due_date).toLocaleDateString('en-IN')}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Add notes about your work..."
                            value={submissionNotes[task.id] || ''}
                            onChange={(e) => setSubmissionNotes(prev => ({
                              ...prev,
                              [task.id]: e.target.value
                            }))}
                          />
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Files
                            </Button>
                            <Button 
                              onClick={() => handleSubmitTask(task.id)}
                              disabled={submitting === task.id}
                            >
                              {submitting === task.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Send className="h-4 w-4 mr-2" />
                              )}
                              Submit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="submitted">
              <div className="space-y-4">
                {submissions.filter(s => !s.mentor_feedback).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No submissions awaiting review</p>
                  </div>
                ) : (
                  submissions.filter(s => !s.mentor_feedback).map(submission => {
                    const task = tasks.find(t => t.id === submission.task_id);
                    return (
                      <Card key={submission.id} className="border">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <Badge variant="outline" className="mb-2 bg-yellow-50 text-yellow-700">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending Review
                              </Badge>
                              <h4 className="font-semibold">{task?.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                Submitted on {new Date(submission.submitted_at).toLocaleDateString('en-IN')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviewed">
              <div className="space-y-4">
                {submissions.filter(s => s.mentor_feedback).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No reviewed submissions yet</p>
                  </div>
                ) : (
                  submissions.filter(s => s.mentor_feedback).map(submission => {
                    const task = tasks.find(t => t.id === submission.task_id);
                    return (
                      <Card key={submission.id} className="border">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <Badge variant="outline" className="mb-2 bg-green-50 text-green-700">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Reviewed
                              </Badge>
                              <h4 className="font-semibold">{task?.title}</h4>
                            </div>
                            {submission.grade && (
                              <Badge className="bg-primary">{submission.grade}</Badge>
                            )}
                          </div>
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-1">Mentor Feedback</p>
                            <p className="text-sm text-muted-foreground">{submission.mentor_feedback}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Documents */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Offer Letter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Internship Offer Letter</p>
                  <p className="text-sm text-muted-foreground">Official internship confirmation</p>
                </div>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Completion Certificate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">Internship Certificate</p>
                  <p className="text-sm text-muted-foreground">
                    {activeInternship.status === 'completed' 
                      ? 'Available for download' 
                      : 'Complete internship to unlock'}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                disabled={activeInternship.status !== 'completed'}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardInternship;
