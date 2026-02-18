import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Loader2, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  description: string | null;
  project_type: string | null;
  price: number;
  is_active: boolean;
  tech_stack: string[] | null;
  preview_url: string | null;
  category_id: string | null;
  category?: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_type: '',
    price: 5000,
    is_active: true,
    tech_stack: '',
    preview_url: '',
    category_id: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, categoriesRes] = await Promise.all([
        supabase
          .from('live_projects')
          .select('*, category:course_categories(name)')
          .order('created_at', { ascending: false }),
        supabase.from('course_categories').select('id, name').order('name'),
      ]);

      if (projectsRes.error) throw projectsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setProjects(projectsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      project_type: '',
      price: 5000,
      is_active: true,
      tech_stack: '',
      preview_url: '',
      category_id: '',
    });
    setDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      project_type: project.project_type || '',
      price: project.price,
      is_active: project.is_active,
      tech_stack: project.tech_stack?.join(', ') || '',
      preview_url: project.preview_url || '',
      category_id: project.category_id || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a project title',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const projectData = {
        title: formData.title,
        description: formData.description || null,
        project_type: formData.project_type || null,
        price: formData.price,
        is_active: formData.is_active,
        tech_stack: formData.tech_stack
          ? formData.tech_stack.split(',').map((t) => t.trim())
          : null,
        preview_url: formData.preview_url || null,
        category_id: formData.category_id || null,
      };

      if (editingProject) {
        const { error } = await supabase
          .from('live_projects')
          .update(projectData)
          .eq('id', editingProject.id);
        if (error) throw error;
        toast({ title: 'Project updated successfully' });
      } else {
        const { error } = await supabase.from('live_projects').insert(projectData);
        if (error) throw error;
        toast({ title: 'Project created successfully' });
      }

      setDialogOpen(false);
      fetchData();
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

  const toggleProjectStatus = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('live_projects')
        .update({ is_active: !project.is_active })
        .eq('id', project.id);

      if (error) throw error;

      setProjects(
        projects.map((p) =>
          p.id === project.id ? { ...p, is_active: !p.is_active } : p
        )
      );
      toast({
        title: project.is_active ? 'Project deactivated' : 'Project activated',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const projectTypes = [
    'IT Projects',
    'AI Projects',
    'Web Applications',
    'Mobile Apps',
    'Digital Marketing',
    'HR Automation',
    'Hospital Management',
    'ERP Systems',
    'Final Year Project',
    'Mini Project',
    'Major Project',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Project Management</h2>
          <p className="text-muted-foreground">Manage live projects and college projects</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            All Projects ({projects.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Tech Stack</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No projects found. Click "Add Project" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {project.title}
                        </TableCell>
                        <TableCell>{project.project_type || '-'}</TableCell>
                        <TableCell>{project.category?.name || '-'}</TableCell>
                        <TableCell>₹{project.price.toLocaleString()}</TableCell>
                        <TableCell className="max-w-[150px]">
                          <div className="flex flex-wrap gap-1">
                            {project.tech_stack?.slice(0, 2).map((tech) => (
                              <Badge key={tech} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                            {(project.tech_stack?.length || 0) > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{project.tech_stack!.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={project.is_active ? 'default' : 'secondary'}
                            className={project.is_active ? 'bg-green-500' : ''}
                          >
                            {project.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(project)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleProjectStatus(project)}
                          >
                            {project.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., E-commerce Website with Admin Panel"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project_type">Project Type</Label>
                <Select
                  value={formData.project_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, project_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Project description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
              <Input
                id="tech_stack"
                value={formData.tech_stack}
                onChange={(e) =>
                  setFormData({ ...formData, tech_stack: e.target.value })
                }
                placeholder="e.g., React, Node.js, MongoDB, Express"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preview_url">Preview URL</Label>
              <Input
                id="preview_url"
                value={formData.preview_url}
                onChange={(e) =>
                  setFormData({ ...formData, preview_url: e.target.value })
                }
                placeholder="https://demo.example.com"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="active">Project is active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingProject ? 'Update Project' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjects;
