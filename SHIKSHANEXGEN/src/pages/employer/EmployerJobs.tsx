import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Briefcase, 
  MapPin, 
  Clock, 
  IndianRupee,
  Users,
  Edit,
  Trash2,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  skills: string[];
  experience_min: number;
  experience_max: number | null;
  salary_min: number | null;
  salary_max: number | null;
  location: string;
  job_type: string;
  is_active: boolean;
  is_approved: boolean;
  posted_at: string;
  application_count?: number;
}

const jobTypes = ['full-time', 'part-time', 'internship', 'contract', 'remote'];

const EmployerJobs = () => {
  const { employer } = useOutletContext<{ employer: { id: string; is_verified: boolean } }>();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    skills: [] as string[],
    experience_min: 0,
    experience_max: null as number | null,
    salary_min: null as number | null,
    salary_max: null as number | null,
    location: '',
    job_type: 'full-time',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, [employer?.id]);

  const fetchJobs = async () => {
    if (!employer?.id) return;

    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', employer.id)
        .order('posted_at', { ascending: false });

      if (error) throw error;

      // Map skills from JSON to array of strings
      const jobsWithSkills: Job[] = (data || []).map(job => ({
        ...job,
        skills: Array.isArray(job.skills) ? (job.skills as unknown as string[]) : [],
      }));

      setJobs(jobsWithSkills);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      requirements: '',
      skills: [],
      experience_min: 0,
      experience_max: null,
      salary_min: null,
      salary_max: null,
      location: '',
      job_type: 'full-time',
    });
    setEditingJob(null);
    setSkillInput('');
  };

  const openEditDialog = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description || '',
      requirements: job.requirements || '',
      skills: job.skills || [],
      experience_min: job.experience_min,
      experience_max: job.experience_max,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      location: job.location || '',
      job_type: job.job_type,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employer?.id) return;

    setSaving(true);

    try {
      const jobData = {
        employer_id: employer.id,
        ...formData,
        skills: formData.skills,
      };

      if (editingJob) {
        const { error } = await supabase
          .from('jobs')
          .update(jobData)
          .eq('id', editingJob.id);

        if (error) throw error;
        toast({ title: 'Job updated successfully' });
      } else {
        const { error } = await supabase
          .from('jobs')
          .insert(jobData);

        if (error) throw error;
        toast({ 
          title: 'Job posted successfully',
          description: employer.is_verified 
            ? 'Your job is now visible to students.' 
            : 'Your job will be visible once your company is verified.',
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchJobs();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleJobStatus = async (jobId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ is_active: isActive })
        .eq('id', jobId);

      if (error) throw error;

      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, is_active: isActive } : job
      ));

      toast({ title: isActive ? 'Job activated' : 'Job deactivated' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;

      setJobs(prev => prev.filter(job => job.id !== jobId));
      toast({ title: 'Job deleted successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Postings</h1>
          <p className="text-muted-foreground">Manage your job listings</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingJob ? 'Edit Job' : 'Post a New Job'}</DialogTitle>
              <DialogDescription>
                Fill in the details to {editingJob ? 'update your' : 'create a new'} job listing
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Full Stack Developer"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="job_type">Job Type *</Label>
                  <Select
                    value={formData.job_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, job_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map(type => (
                        <SelectItem key={type} value={type} className="capitalize">
                          {type.replace('-', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Chennai, Tamil Nadu"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and what makes it exciting..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="List the qualifications, skills, and experience required..."
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Required Skills</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill (e.g., React, Python)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" variant="outline" onClick={addSkill}>Add</Button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Experience (Years)</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      min="0"
                      placeholder="Min"
                      value={formData.experience_min}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience_min: parseInt(e.target.value) || 0 }))}
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Max"
                      value={formData.experience_max || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience_max: e.target.value ? parseInt(e.target.value) : null }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Salary Range (₹ LPA)</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      min="0"
                      placeholder="Min"
                      value={formData.salary_min || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, salary_min: e.target.value ? parseInt(e.target.value) : null }))}
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Max"
                      value={formData.salary_max || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, salary_max: e.target.value ? parseInt(e.target.value) : null }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {editingJob ? 'Update Job' : 'Post Job'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">No jobs posted yet</h3>
            <p className="text-muted-foreground text-center max-w-md mt-1">
              Create your first job posting to start receiving applications from talented students.
            </p>
            <Button className="mt-4" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Post Your First Job
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {job.title}
                      <Badge variant={job.is_active ? 'default' : 'secondary'}>
                        {job.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {!job.is_approved && (
                        <Badge variant="outline" className="text-amber-600 border-amber-300">
                          Pending Approval
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {job.job_type}
                      </span>
                      {job.salary_min && (
                        <span className="flex items-center gap-1">
                          <IndianRupee className="h-3 w-3" />
                          {job.salary_min}{job.salary_max ? ` - ${job.salary_max}` : '+'} LPA
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={job.is_active}
                      onCheckedChange={(checked) => toggleJobStatus(job.id, checked)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(job)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteJob(job.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {job.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skills.map(skill => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <span className="text-xs text-muted-foreground">
                    Posted {format(new Date(job.posted_at), 'MMM d, yyyy')}
                  </span>
                  <span className="text-xs flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {job.application_count || 0} applications
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerJobs;
