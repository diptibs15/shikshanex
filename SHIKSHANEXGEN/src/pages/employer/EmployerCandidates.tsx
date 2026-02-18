import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Filter, 
  Calendar,
  FileText,
  Mail,
  Phone,
  ExternalLink,
  Check,
  X,
  Clock,
  Loader2,
  UserCheck,
  Search
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface Application {
  id: string;
  job_id: string;
  user_id: string;
  resume_url: string | null;
  cover_letter: string | null;
  status: string;
  interview_date: string | null;
  interview_notes: string | null;
  employer_notes: string | null;
  applied_at: string;
  job: {
    title: string;
  };
  profile: {
    full_name: string;
    mobile: string | null;
  } | null;
  user_email?: string;
}

interface Job {
  id: string;
  title: string;
}

const statusColors: Record<string, string> = {
  applied: 'bg-blue-100 text-blue-800',
  shortlisted: 'bg-green-100 text-green-800',
  interviewed: 'bg-purple-100 text-purple-800',
  offered: 'bg-emerald-100 text-emerald-800',
  hired: 'bg-teal-100 text-teal-800',
  rejected: 'bg-red-100 text-red-800',
};

const EmployerCandidates = () => {
  const { employer } = useOutletContext<{ employer: { id: string } }>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [employer?.id]);

  const fetchData = async () => {
    if (!employer?.id) return;

    try {
      // Fetch employer's jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('id, title')
        .eq('employer_id', employer.id);

      if (jobsError) throw jobsError;
      setJobs(jobsData || []);

      const jobIds = jobsData?.map(j => j.id) || [];
      if (jobIds.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      // Fetch applications
      const { data: appData, error: appError } = await supabase
        .from('job_applications')
        .select(`
          *,
          job:jobs!inner(title)
        `)
        .in('job_id', jobIds)
        .order('applied_at', { ascending: false });

      if (appError) throw appError;

      // Fetch profiles for applicants
      const userIds = [...new Set(appData?.map(a => a.user_id) || [])];
      let profiles: Record<string, any> = {};
      
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, full_name, mobile')
          .in('user_id', userIds);

        profilesData?.forEach(p => {
          profiles[p.user_id] = p;
        });
      }

      const enrichedApps = (appData || []).map(app => ({
        ...app,
        profile: profiles[app.user_id] || null,
      }));

      setApplications(enrichedApps);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (appId: string, status: string) => {
    setSaving(true);
    try {
      const updateData: any = { status };
      
      if (selectedApp) {
        updateData.employer_notes = notes;
        if (interviewDate) {
          updateData.interview_date = interviewDate;
        }
      }

      const { error } = await supabase
        .from('job_applications')
        .update(updateData)
        .eq('id', appId);

      if (error) throw error;

      setApplications(prev => prev.map(app => 
        app.id === appId ? { ...app, ...updateData } : app
      ));

      toast({ title: `Application ${status}` });
      setDialogOpen(false);
      setSelectedApp(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const openApplicationDetails = (app: Application) => {
    setSelectedApp(app);
    setNotes(app.employer_notes || '');
    setInterviewDate(app.interview_date || '');
    setDialogOpen(true);
  };

  const filteredApplications = applications.filter(app => {
    if (selectedJob !== 'all' && app.job_id !== selectedJob) return false;
    if (selectedStatus !== 'all' && app.status !== selectedStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        app.profile?.full_name?.toLowerCase().includes(query) ||
        app.job?.title?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      all: applications.length,
      applied: 0,
      shortlisted: 0,
      interviewed: 0,
      offered: 0,
      hired: 0,
      rejected: 0,
    };
    applications.forEach(app => {
      if (counts[app.status] !== undefined) counts[app.status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Candidates</h1>
        <p className="text-muted-foreground">Manage job applications and hire talent</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedJob} onValueChange={setSelectedJob}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by job" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            {jobs.map(job => (
              <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Tabs */}
      <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="applied">New ({statusCounts.applied})</TabsTrigger>
          <TabsTrigger value="shortlisted">Shortlisted ({statusCounts.shortlisted})</TabsTrigger>
          <TabsTrigger value="interviewed">Interviewed ({statusCounts.interviewed})</TabsTrigger>
          <TabsTrigger value="offered">Offered ({statusCounts.offered})</TabsTrigger>
          <TabsTrigger value="hired">Hired ({statusCounts.hired})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({statusCounts.rejected})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">No applications found</h3>
            <p className="text-muted-foreground text-center max-w-md mt-1">
              {applications.length === 0 
                ? "You haven't received any applications yet. Make sure your jobs are active and approved."
                : "No applications match your current filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredApplications.map((app) => (
            <Card key={app.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openApplicationDetails(app)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{app.profile?.full_name || 'Unknown'}</CardTitle>
                    <CardDescription>{app.job?.title}</CardDescription>
                  </div>
                  <Badge className={statusColors[app.status] || 'bg-gray-100 text-gray-800'}>
                    {app.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {app.profile?.mobile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {app.profile.mobile}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Applied {format(new Date(app.applied_at), 'MMM d, yyyy')}
                </div>
                {app.interview_date && (
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Clock className="h-3 w-3" />
                    Interview: {format(new Date(app.interview_date), 'MMM d, yyyy h:mm a')}
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  {app.status === 'applied' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={(e) => { e.stopPropagation(); updateApplicationStatus(app.id, 'shortlisted'); }}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Shortlist
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); updateApplicationStatus(app.id, 'rejected'); }}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Application Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedApp?.profile?.full_name || 'Candidate Details'}</DialogTitle>
            <DialogDescription>
              Applied for: {selectedApp?.job?.title}
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                {selectedApp.profile?.mobile && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${selectedApp.profile.mobile}`} className="hover:text-primary">
                      {selectedApp.profile.mobile}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Applied {format(new Date(selectedApp.applied_at), 'MMMM d, yyyy')}
                </div>
              </div>

              {/* Cover Letter */}
              {selectedApp.cover_letter && (
                <div className="space-y-2">
                  <Label>Cover Letter</Label>
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    {selectedApp.cover_letter}
                  </div>
                </div>
              )}

              {/* Resume */}
              {selectedApp.resume_url && (
                <div>
                  <Button variant="outline" asChild>
                    <a href={selectedApp.resume_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      View Resume
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </a>
                  </Button>
                </div>
              )}

              {/* Interview Scheduling */}
              <div className="space-y-2">
                <Label htmlFor="interview_date">Schedule Interview</Label>
                <Input
                  id="interview_date"
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about this candidate..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Status Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Badge className={statusColors[selectedApp.status]}>
                  Current: {selectedApp.status}
                </Badge>
                <div className="flex-1" />
                {selectedApp.status === 'applied' && (
                  <Button size="sm" onClick={() => updateApplicationStatus(selectedApp.id, 'shortlisted')} disabled={saving}>
                    Shortlist
                  </Button>
                )}
                {selectedApp.status === 'shortlisted' && (
                  <Button size="sm" onClick={() => updateApplicationStatus(selectedApp.id, 'interviewed')} disabled={saving}>
                    Mark Interviewed
                  </Button>
                )}
                {selectedApp.status === 'interviewed' && (
                  <Button size="sm" onClick={() => updateApplicationStatus(selectedApp.id, 'offered')} disabled={saving}>
                    Send Offer
                  </Button>
                )}
                {selectedApp.status === 'offered' && (
                  <Button size="sm" onClick={() => updateApplicationStatus(selectedApp.id, 'hired')} disabled={saving}>
                    <UserCheck className="h-4 w-4 mr-1" />
                    Mark Hired
                  </Button>
                )}
                {selectedApp.status !== 'rejected' && selectedApp.status !== 'hired' && (
                  <Button size="sm" variant="destructive" onClick={() => updateApplicationStatus(selectedApp.id, 'rejected')} disabled={saving}>
                    Reject
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerCandidates;
