import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Plus, 
  Trash2, 
  Loader2,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Save,
  Eye,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResumeData {
  id: string;
  personal_info: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    summary: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    grade: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  template: string;
}

const templates = [
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
  { id: 'professional', name: 'Professional', description: 'Traditional corporate style' },
  { id: 'creative', name: 'Creative', description: 'Bold and colorful layout' },
];

const DashboardResume = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  const defaultResumeData: Omit<ResumeData, 'id'> = {
    personal_info: {
      name: profile?.full_name || '',
      email: user?.email || '',
      phone: profile?.mobile || '',
      address: '',
      linkedin: '',
      summary: ''
    },
    education: [{ degree: '', institution: '', year: '', grade: '' }],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    template: 'modern'
  };

  useEffect(() => {
    if (user) {
      fetchResumeData();
    }
  }, [user]);

  const fetchResumeData = async () => {
    try {
      const { data, error } = await supabase
        .from('resume_data')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setResumeData({
          ...data,
          personal_info: data.personal_info as ResumeData['personal_info'] || defaultResumeData.personal_info,
          education: data.education as ResumeData['education'] || defaultResumeData.education,
          experience: data.experience as ResumeData['experience'] || defaultResumeData.experience,
          skills: data.skills as string[] || defaultResumeData.skills,
          projects: data.projects as ResumeData['projects'] || defaultResumeData.projects,
          certifications: data.certifications as ResumeData['certifications'] || defaultResumeData.certifications,
        });
        setSelectedTemplate(data.template || 'modern');
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSave = {
        user_id: user?.id,
        personal_info: resumeData?.personal_info || defaultResumeData.personal_info,
        education: resumeData?.education || defaultResumeData.education,
        experience: resumeData?.experience || defaultResumeData.experience,
        skills: resumeData?.skills || defaultResumeData.skills,
        projects: resumeData?.projects || defaultResumeData.projects,
        certifications: resumeData?.certifications || defaultResumeData.certifications,
        template: selectedTemplate
      };

      if (resumeData?.id) {
        const { error } = await supabase
          .from('resume_data')
          .update(dataToSave)
          .eq('id', resumeData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('resume_data')
          .insert(dataToSave);
        if (error) throw error;
      }

      toast({
        title: 'Resume Saved',
        description: 'Your resume has been saved successfully.'
      });
      fetchResumeData();
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: 'Save Failed',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev!,
      personal_info: {
        ...(prev?.personal_info || defaultResumeData.personal_info),
        [field]: value
      }
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev!,
      education: [...(prev?.education || []), { degree: '', institution: '', year: '', grade: '' }]
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev!,
      education: (prev?.education || []).map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev!,
      education: (prev?.education || []).filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev!,
      experience: [...(prev?.experience || []), { title: '', company: '', duration: '', description: '' }]
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev!,
      experience: (prev?.experience || []).map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev!,
      experience: (prev?.experience || []).filter((_, i) => i !== index)
    }));
  };

  const [skillInput, setSkillInput] = useState('');
  
  const addSkill = () => {
    if (skillInput.trim()) {
      setResumeData(prev => ({
        ...prev!,
        skills: [...(prev?.skills || []), skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev!,
      skills: (prev?.skills || []).filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const personalInfo = resumeData?.personal_info || defaultResumeData.personal_info;
  const education = resumeData?.education || defaultResumeData.education;
  const experience = resumeData?.experience || defaultResumeData.experience;
  const skills = resumeData?.skills || defaultResumeData.skills;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Resume Builder</h2>
          <p className="text-muted-foreground">Create your professional resume</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>
        </div>
      </div>

      {/* Template Selection */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Choose Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {templates.map(template => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === template.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="h-24 bg-muted rounded mb-3 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h4 className="font-semibold">{template.name}</h4>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resume Sections */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">
            <User className="h-4 w-4 mr-2" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="education">
            <GraduationCap className="h-4 w-4 mr-2" />
            Education
          </TabsTrigger>
          <TabsTrigger value="experience">
            <Briefcase className="h-4 w-4 mr-2" />
            Experience
          </TabsTrigger>
          <TabsTrigger value="skills">
            <Code className="h-4 w-4 mr-2" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="certifications">
            <Award className="h-4 w-4 mr-2" />
            Certifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={personalInfo.name}
                    onChange={(e) => updatePersonalInfo('name', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input
                    value={personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    placeholder="linkedin.com/in/username"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={personalInfo.address}
                  onChange={(e) => updatePersonalInfo('address', e.target.value)}
                  placeholder="City, State, Country"
                />
              </div>
              <div className="space-y-2">
                <Label>Professional Summary</Label>
                <Textarea
                  value={personalInfo.summary}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  placeholder="Brief summary of your professional background..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Education</CardTitle>
              <Button variant="outline" size="sm" onClick={addEducation}>
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Education {index + 1}</h4>
                    {education.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeEducation(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        placeholder="B.Tech in Computer Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        placeholder="University Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Input
                        value={edu.year}
                        onChange={(e) => updateEducation(index, 'year', e.target.value)}
                        placeholder="2020 - 2024"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Grade/CGPA</Label>
                      <Input
                        value={edu.grade}
                        onChange={(e) => updateEducation(index, 'grade', e.target.value)}
                        placeholder="8.5 CGPA"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Work Experience</CardTitle>
              <Button variant="outline" size="sm" onClick={addExperience}>
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {experience.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No experience added yet</p>
                  <Button variant="outline" className="mt-2" onClick={addExperience}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Experience
                  </Button>
                </div>
              ) : (
                experience.map((exp, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Experience {index + 1}</h4>
                      <Button variant="ghost" size="sm" onClick={() => removeExperience(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Job Title</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) => updateExperience(index, 'title', e.target.value)}
                          placeholder="Software Developer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(index, 'company', e.target.value)}
                          placeholder="Company Name"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Duration</Label>
                        <Input
                          value={exp.duration}
                          onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                          placeholder="Jan 2022 - Present"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          placeholder="Describe your responsibilities and achievements..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill..."
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {skill}
                    <button
                      onClick={() => removeSkill(index)}
                      className="ml-2 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              {skills.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Add your technical and soft skills
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Your earned certificates will appear here automatically</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardResume;
