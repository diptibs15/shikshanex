import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  MapPin, 
  DollarSign,
  Search,
  Loader2,
  Building2,
  Clock,
  CheckCircle,
  Send,
  Bell,
  Calendar,
  Star,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: string;
  title: string;
  description: string | null;
  requirements: string | null;
  skills: string[];
  experience_min: number;
  experience_max: number | null;
  salary_min: number | null;
  salary_max: number | null;
  location: string | null;
  job_type: string;
  posted_at: string;
  employer: {
    id: string;
    company_name: string;
    company_logo: string | null;
    industry: string | null;
  };
}

interface Application {
  id: string;
  job_id: string;
  status: string;
  applied_at: string;
  interview_date: string | null;
}

interface SkillMatch {
  id: string;
  job_id: string;
  match_score: number;
  matched_skills: string[];
  is_notified: boolean;
}

const DashboardPlacement = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [skillMatches, setSkillMatches] = useState<SkillMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [applying, setApplying] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch approved active jobs with employer info
      const { data: jobsData } = await supabase
        .from('jobs')
        .select(`
          *,
          employer:employers(id, company_name, company_logo, industry)
        `)
        .eq('is_active', true)
        .eq('is_approved', true)
        .order('posted_at', { ascending: false });

      setJobs((jobsData || []).map(j => ({
        ...j,
        skills: (j.skills as string[]) || [],
        employer: j.employer as Job['employer']
      })));

      // Fetch user applications
      const { data: applicationsData } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user?.id);

      setApplications(applicationsData || []);

      // Fetch skill matches
      const { data: matchesData } = await supabase
        .from('skill_matches')
        .select('*')
        .eq('user_id', user?.id)
        .order('match_score', { ascending: false });

      setSkillMatches((matchesData || []).map(m => ({
        ...m,
        matched_skills: (m.matched_skills as string[]) || []
      })));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    setApplying(jobId);
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          user_id: user?.id,
          status: 'applied'
        });

      if (error) throw error;

      toast({
        title: 'Application Submitted',
        description: 'Your application has been sent to the employer.'
      });
      fetchData();
    } catch (error) {
      console.error('Error applying:', error);
      toast({
        title: 'Application Failed',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setApplying(null);
    }
  };

  const getApplicationStatus = (jobId: string) => {
    return applications.find(a => a.job_id === jobId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Applied</Badge>;
      case 'shortlisted':
        return <Badge className="bg-blue-100 text-blue-800"><Star className="h-3 w-3 mr-1" />Shortlisted</Badge>;
      case 'interview':
        return <Badge className="bg-purple-100 text-purple-800"><Calendar className="h-3 w-3 mr-1" />Interview</Badge>;
      case 'selected':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Selected</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.employer?.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const matchedJobs = skillMatches
    .filter(m => !m.is_notified)
    .map(match => {
      const job = jobs.find(j => j.id === match.job_id);
      return job ? { ...job, match } : null;
    })
    .filter(Boolean);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Placement Portal</h2>
        <p className="text-muted-foreground">Find and apply for jobs matching your skills</p>
      </div>

      {/* Matched Jobs Alert */}
      {matchedJobs.length > 0 && (
        <Card className="shadow-card border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Profile Matches Found!</h3>
                <p className="text-sm text-muted-foreground">
                  Your profile matches {matchedJobs.length} job{matchedJobs.length > 1 ? 's' : ''}. Check them out!
                </p>
              </div>
              <Button>View Matches</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Jobs</p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Interviews</p>
                <p className="text-2xl font-bold">
                  {applications.filter(a => a.status === 'interview').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profile Matches</p>
                <p className="text-2xl font-bold">{skillMatches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="jobs">
        <TabsList>
          <TabsTrigger value="jobs">All Jobs</TabsTrigger>
          <TabsTrigger value="applications">My Applications ({applications.length})</TabsTrigger>
          <TabsTrigger value="matches">Profile Matches ({skillMatches.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="mt-4">
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="py-16 text-center">
                  <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
                  <p className="text-muted-foreground">Check back later for new opportunities</p>
                </CardContent>
              </Card>
            ) : (
              filteredJobs.map(job => {
                const application = getApplicationStatus(job.id);
                return (
                  <Card key={job.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            {job.employer?.company_logo ? (
                              <img 
                                src={job.employer.company_logo} 
                                alt={job.employer.company_name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Building2 className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{job.title}</h3>
                            <p className="text-muted-foreground">
                              {job.employer?.company_name} • {job.employer?.industry}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {job.location && (
                                <Badge variant="outline">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {job.location}
                                </Badge>
                              )}
                              <Badge variant="outline">{job.job_type}</Badge>
                              {job.experience_min !== undefined && (
                                <Badge variant="outline">
                                  {job.experience_min}-{job.experience_max || '5+'}y exp
                                </Badge>
                              )}
                              {job.salary_min && (
                                <Badge variant="outline">
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  ₹{(job.salary_min / 100000).toFixed(1)}-{job.salary_max ? (job.salary_max / 100000).toFixed(1) : ''}L
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <p className="text-sm text-muted-foreground">
                            Posted {new Date(job.posted_at).toLocaleDateString('en-IN')}
                          </p>
                          {application ? (
                            getStatusBadge(application.status)
                          ) : (
                            <Button
                              onClick={() => handleApply(job.id)}
                              disabled={applying === job.id}
                            >
                              {applying === job.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Send className="h-4 w-4 mr-2" />
                              )}
                              Apply Now
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Skills */}
                      {job.skills.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex flex-wrap gap-1">
                            {job.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="mt-4">
          {applications.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="py-16 text-center">
                <Send className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground">Start applying to jobs to track them here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {applications.map(application => {
                const job = jobs.find(j => j.id === application.job_id);
                if (!job) return null;
                return (
                  <Card key={application.id} className="shadow-card">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {job.employer?.company_name} • Applied on {new Date(application.applied_at).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(application.status)}
                          {application.interview_date && (
                            <p className="text-sm text-primary">
                              Interview: {new Date(application.interview_date).toLocaleDateString('en-IN')}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="matches" className="mt-4">
          {skillMatches.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="py-16 text-center">
                <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Matches Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Complete your profile and resume to get matched with relevant jobs
                </p>
                <Button asChild>
                  <a href="/dashboard/resume">Update Resume</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {skillMatches.map(match => {
                const job = jobs.find(j => j.id === match.job_id);
                if (!job) return null;
                return (
                  <Card key={match.id} className="shadow-card border-primary/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-primary">
                          {match.match_score}% Match
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          Matched skills: {match.matched_skills.join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {job.employer?.company_name} • {job.location}
                            </p>
                          </div>
                        </div>
                        <Button onClick={() => handleApply(job.id)}>
                          <Send className="h-4 w-4 mr-2" />
                          Apply Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPlacement;
