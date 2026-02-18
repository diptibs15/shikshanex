import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Globe, 
  Plus, 
  Trash2, 
  Loader2,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Save,
  Eye,
  Link2,
  Image,
  Code
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Portfolio {
  id: string;
  slug: string;
  bio: string | null;
  skills: string[];
  projects: Array<{
    title: string;
    description: string;
    image_url: string;
    live_url: string;
    github_url: string;
    technologies: string[];
  }>;
  social_links: {
    github: string;
    linkedin: string;
    twitter: string;
    website: string;
  };
  theme: string;
  is_public: boolean;
}

const themes = [
  { id: 'default', name: 'Default', color: 'bg-primary' },
  { id: 'dark', name: 'Dark', color: 'bg-slate-800' },
  { id: 'gradient', name: 'Gradient', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'minimal', name: 'Minimal', color: 'bg-white border' },
];

const DashboardPortfolio = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const defaultPortfolio: Omit<Portfolio, 'id'> = {
    slug: profile?.full_name?.toLowerCase().replace(/\s+/g, '-') || 'my-portfolio',
    bio: '',
    skills: [],
    projects: [],
    social_links: { github: '', linkedin: '', twitter: '', website: '' },
    theme: 'default',
    is_public: true
  };

  useEffect(() => {
    if (user) {
      fetchPortfolio();
    }
  }, [user]);

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setPortfolio({
          ...data,
          skills: (data.skills as string[]) || [],
          projects: (data.projects as Portfolio['projects']) || [],
          social_links: (data.social_links as Portfolio['social_links']) || defaultPortfolio.social_links
        });
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSave = {
        user_id: user?.id,
        slug: portfolio?.slug || defaultPortfolio.slug,
        bio: portfolio?.bio || '',
        skills: portfolio?.skills || [],
        projects: portfolio?.projects || [],
        social_links: portfolio?.social_links || defaultPortfolio.social_links,
        theme: portfolio?.theme || 'default',
        is_public: portfolio?.is_public ?? true
      };

      if (portfolio?.id) {
        const { error } = await supabase
          .from('portfolios')
          .update(dataToSave)
          .eq('id', portfolio.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolios')
          .insert(dataToSave);
        if (error) throw error;
      }

      toast({
        title: 'Portfolio Saved',
        description: 'Your portfolio has been updated successfully.'
      });
      fetchPortfolio();
    } catch (error) {
      console.error('Error saving portfolio:', error);
      toast({
        title: 'Save Failed',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof Portfolio, value: any) => {
    setPortfolio(prev => ({
      ...prev!,
      [field]: value
    }));
  };

  const updateSocialLink = (platform: string, value: string) => {
    setPortfolio(prev => ({
      ...prev!,
      social_links: {
        ...(prev?.social_links || defaultPortfolio.social_links),
        [platform]: value
      }
    }));
  };

  const addProject = () => {
    setPortfolio(prev => ({
      ...prev!,
      projects: [
        ...(prev?.projects || []),
        { title: '', description: '', image_url: '', live_url: '', github_url: '', technologies: [] }
      ]
    }));
  };

  const updateProject = (index: number, field: string, value: any) => {
    setPortfolio(prev => ({
      ...prev!,
      projects: (prev?.projects || []).map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const removeProject = (index: number) => {
    setPortfolio(prev => ({
      ...prev!,
      projects: (prev?.projects || []).filter((_, i) => i !== index)
    }));
  };

  const [skillInput, setSkillInput] = useState('');

  const addSkill = () => {
    if (skillInput.trim()) {
      setPortfolio(prev => ({
        ...prev!,
        skills: [...(prev?.skills || []), skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setPortfolio(prev => ({
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

  const currentPortfolio = portfolio || defaultPortfolio;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Portfolio Builder</h2>
          <p className="text-muted-foreground">Showcase your work to potential employers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a 
              href={`/portfolio/${currentPortfolio.slug}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </a>
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

      {/* Portfolio URL */}
      <Card className="shadow-card border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Globe className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Your Portfolio URL</p>
              <p className="font-medium text-lg">
                shikshanex.com/portfolio/{currentPortfolio.slug}
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Link2 className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Portfolio URL Slug</Label>
              <Input
                value={currentPortfolio.slug}
                onChange={(e) => updateField('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="your-name"
              />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={currentPortfolio.bio || ''}
                onChange={(e) => updateField('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Public Portfolio</p>
                <p className="text-sm text-muted-foreground">
                  Make your portfolio visible to everyone
                </p>
              </div>
              <Switch
                checked={currentPortfolio.is_public}
                onCheckedChange={(checked) => updateField('is_public', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Github className="h-4 w-4" /> GitHub
              </Label>
              <Input
                value={currentPortfolio.social_links.github}
                onChange={(e) => updateSocialLink('github', e.target.value)}
                placeholder="github.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </Label>
              <Input
                value={currentPortfolio.social_links.linkedin}
                onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                placeholder="linkedin.com/in/username"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Twitter className="h-4 w-4" /> Twitter
              </Label>
              <Input
                value={currentPortfolio.social_links.twitter}
                onChange={(e) => updateSocialLink('twitter', e.target.value)}
                placeholder="twitter.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" /> Website
              </Label>
              <Input
                value={currentPortfolio.social_links.website}
                onChange={(e) => updateSocialLink('website', e.target.value)}
                placeholder="yourwebsite.com"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Theme Selection */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {themes.map(theme => (
              <div
                key={theme.id}
                onClick={() => updateField('theme', theme.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  currentPortfolio.theme === theme.id 
                    ? 'border-primary' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className={`h-16 rounded mb-3 ${theme.color}`} />
                <p className="font-medium text-center">{theme.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
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
            {(currentPortfolio.skills || []).map((skill, index) => (
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
        </CardContent>
      </Card>

      {/* Projects */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Projects</CardTitle>
          <Button variant="outline" size="sm" onClick={addProject}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {(currentPortfolio.projects || []).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No projects added yet</p>
              <Button variant="outline" className="mt-2" onClick={addProject}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Project
              </Button>
            </div>
          ) : (
            (currentPortfolio.projects || []).map((project, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Project {index + 1}</h4>
                  <Button variant="ghost" size="sm" onClick={() => removeProject(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={project.title}
                      onChange={(e) => updateProject(index, 'title', e.target.value)}
                      placeholder="Project Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={project.image_url}
                      onChange={(e) => updateProject(index, 'image_url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Live URL</Label>
                    <Input
                      value={project.live_url}
                      onChange={(e) => updateProject(index, 'live_url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>GitHub URL</Label>
                    <Input
                      value={project.github_url}
                      onChange={(e) => updateProject(index, 'github_url', e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      placeholder="Describe your project..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPortfolio;
