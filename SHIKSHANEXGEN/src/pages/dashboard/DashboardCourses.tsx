import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Play,
  Loader2,
  Monitor,
  Users,
  TrendingUp,
  Palette,
  Heart,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  price: number;
  category: {
    name: string;
    slug: string;
    color: string;
  };
}

interface Enrollment {
  id: string;
  status: string;
  progress: number;
  current_module: number;
  course: Course;
}

const categoryIcons: Record<string, typeof Monitor> = {
  it: Monitor,
  hr: Users,
  'digital-marketing': TrendingUp,
  'graphic-design': Palette,
  nursing: Heart,
};

const DashboardCourses = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch user's enrollments with course details
        const { data: enrollmentData } = await supabase
          .from('enrollments')
          .select(`
            id,
            status,
            progress,
            current_module,
            course:courses (
              id,
              title,
              slug,
              description,
              duration,
              price,
              category:course_categories (
                name,
                slug,
                color
              )
            )
          `)
          .eq('user_id', user.id);

        // Fetch all available courses
        const { data: coursesData } = await supabase
          .from('courses')
          .select(`
            id,
            title,
            slug,
            description,
            duration,
            price,
            category:course_categories (
              name,
              slug,
              color
            )
          `)
          .eq('is_active', true);

        // Filter out courses user is already enrolled in
        const enrolledCourseIds = enrollmentData?.map((e: any) => e.course?.id) || [];
        const available = coursesData?.filter(
          (c: any) => !enrolledCourseIds.includes(c.id)
        ) || [];

        setEnrollments(enrollmentData as any || []);
        setAvailableCourses(available as any);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeCourses = enrollments.filter(e => e.status === 'active');
  const completedCourses = enrollments.filter(e => e.status === 'completed');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">My Courses</h2>
        <p className="text-muted-foreground">Manage your enrolled courses and explore new ones</p>
      </div>

      <Tabs defaultValue="enrolled" className="space-y-6">
        <TabsList>
          <TabsTrigger value="enrolled">
            Enrolled ({activeCourses.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedCourses.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available Courses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled" className="space-y-4">
          {activeCourses.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Courses</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't enrolled in any courses yet. Take the entrance test to get started!
                </p>
                <Link to="/dashboard/interview">
                  <Button>Take Entrance Test</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeCourses.map((enrollment) => {
                const IconComponent = categoryIcons[enrollment.course?.category?.slug] || BookOpen;
                return (
                  <Card key={enrollment.id} className="shadow-card">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className={`h-16 w-16 rounded-xl bg-${enrollment.course?.category?.color || 'primary'}/10 flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className={`h-8 w-8 text-${enrollment.course?.category?.color || 'primary'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-semibold">{enrollment.course?.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {enrollment.course?.description}
                              </p>
                            </div>
                            <Badge variant="secondary">
                              {enrollment.course?.category?.name}
                            </Badge>
                          </div>
                          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {enrollment.course?.duration}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span className="font-medium">{enrollment.progress}%</span>
                              </div>
                              <Progress value={enrollment.progress} />
                            </div>
                            <Link to={`/dashboard/courses/${enrollment.course?.id}/learn`}>
                              <Button className="gap-2">
                                <Play className="h-4 w-4" />
                                Continue Learning
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedCourses.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Completed Courses</h3>
                <p className="text-muted-foreground">
                  Complete your enrolled courses to see them here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {completedCourses.map((enrollment) => (
                <Card key={enrollment.id} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-healthcare/10 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-healthcare" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{enrollment.course?.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {enrollment.course?.category?.name}
                        </p>
                      </div>
                      <Link to="/dashboard/certificates">
                        <Button variant="outline">View Certificate</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {availableCourses.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground">
                  You've enrolled in all available courses.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCourses.map((course) => {
                const IconComponent = categoryIcons[course.category?.slug] || BookOpen;
                return (
                  <Card key={course.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                    <CardHeader className="pb-3">
                      <div className={`h-12 w-12 rounded-lg bg-${course.category?.color || 'primary'}/10 flex items-center justify-center mb-3`}>
                        <IconComponent className={`h-6 w-6 text-${course.category?.color || 'primary'}`} />
                      </div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </div>
                        <div className="text-lg font-bold text-primary">
                          ₹{course.price?.toLocaleString()}
                        </div>
                      </div>
                      <Link to="/dashboard/interview">
                        <Button className="w-full">Apply Now</Button>
                      </Link>
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

export default DashboardCourses;
