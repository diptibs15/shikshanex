import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Download, 
  Search,
  ShoppingCart,
  Loader2,
  ExternalLink,
  FileText,
  Play,
  Filter,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  description: string | null;
  price: number;
  tech_stack: string[];
  preview_url: string | null;
  project_type: string | null;
  category_id: string | null;
  includes: {
    source_code: boolean;
    documentation: boolean;
    ppt: boolean;
    synopsis: boolean;
    demo_video: boolean;
  };
}

interface Purchase {
  id: string;
  project_id: string;
  status: string;
  download_url: string | null;
  created_at: string;
}

const projectCategories = [
  { id: 'all', name: 'All Projects' },
  { id: 'it', name: 'IT Projects' },
  { id: 'ai', name: 'AI Projects' },
  { id: 'web', name: 'Web Applications' },
  { id: 'mobile', name: 'Mobile Apps' },
  { id: 'digital-marketing', name: 'Digital Marketing' },
  { id: 'hr', name: 'HR Automation' },
  { id: 'hospital', name: 'Hospital Management' },
  { id: 'erp', name: 'ERP Systems' },
];

const DashboardProjects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch projects
      const { data: projectsData } = await supabase
        .from('live_projects')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      setProjects((projectsData || []).map(p => ({
        ...p,
        tech_stack: p.tech_stack || [],
        includes: (p.includes as Project['includes']) || {
          source_code: true,
          documentation: true,
          ppt: true,
          synopsis: true,
          demo_video: true
        }
      })));

      // Fetch user purchases
      if (user) {
        const { data: purchasesData } = await supabase
          .from('project_purchases')
          .select('*')
          .eq('user_id', user.id);

        setPurchases(purchasesData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (project: Project) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to purchase projects.',
        variant: 'destructive'
      });
      return;
    }

    setPurchasing(project.id);
    try {
      // Simulate payment (in production, integrate Razorpay)
      const { error } = await supabase
        .from('project_purchases')
        .insert({
          project_id: project.id,
          user_id: user.id,
          amount: project.price,
          status: 'completed'
        });

      if (error) throw error;

      toast({
        title: 'Purchase Successful',
        description: 'You can now download the project files.'
      });
      fetchData();
    } catch (error) {
      console.error('Error purchasing:', error);
      toast({
        title: 'Purchase Failed',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setPurchasing(null);
    }
  };

  const isPurchased = (projectId: string) => {
    return purchases.some(p => p.project_id === projectId && p.status === 'completed');
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.project_type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        <h2 className="text-2xl font-heading font-bold">Live Projects</h2>
        <p className="text-muted-foreground">Access 300+ ready-to-use projects for your portfolio</p>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {projectCategories.slice(0, 5).map(cat => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="whitespace-nowrap"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="browse">
        <TabsList>
          <TabsTrigger value="browse">Browse Projects</TabsTrigger>
          <TabsTrigger value="purchased">My Purchases ({purchases.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map(project => (
              <Card key={project.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {project.project_type || 'General'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">₹{project.price.toLocaleString()}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description || 'Complete project with source code and documentation.'}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1">
                    {project.tech_stack.slice(0, 4).map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.tech_stack.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.tech_stack.length - 4}
                      </Badge>
                    )}
                  </div>

                  {/* Includes */}
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium">Includes:</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {project.includes.source_code && <span>✓ Source Code</span>}
                      {project.includes.documentation && <span>✓ Documentation</span>}
                      {project.includes.ppt && <span>✓ PPT</span>}
                      {project.includes.synopsis && <span>✓ Synopsis</span>}
                      {project.includes.demo_video && <span>✓ Demo Video</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {project.preview_url && (
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <a href={project.preview_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Preview
                        </a>
                      </Button>
                    )}
                    {isPurchased(project.id) ? (
                      <Button size="sm" className="flex-1" variant="secondary">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handlePurchase(project)}
                        disabled={purchasing === project.id}
                      >
                        {purchasing === project.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <ShoppingCart className="h-4 w-4 mr-2" />
                        )}
                        Buy Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <Code className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="purchased" className="mt-4">
          {purchases.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="py-16 text-center">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Purchases Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Browse our collection and purchase projects for your portfolio
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {purchases.map(purchase => {
                const project = projects.find(p => p.id === purchase.project_id);
                if (!project) return null;
                return (
                  <Card key={purchase.id} className="shadow-card">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-full bg-primary/10">
                            <Code className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{project.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Purchased on {new Date(purchase.created_at).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Purchased
                          </Badge>
                          <Button>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>

                      {/* Download Options */}
                      <div className="mt-4 grid grid-cols-5 gap-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          Source Code
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          Documentation
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          PPT
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          Synopsis
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <Play className="h-3 w-3 mr-1" />
                          Demo Video
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

      {/* Info Card */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Code className="h-8 w-8 text-primary flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">About Live Projects</h4>
              <p className="text-sm text-muted-foreground">
                Each project includes complete source code, documentation, PPT, synopsis, and a demo video. 
                Perfect for final year projects, mini projects, and portfolio building. 
                All projects are thoroughly tested and ready to use.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardProjects;
