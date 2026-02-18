import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  XCircle,
  Target,
  Award,
  BarChart3,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from 'date-fns';

interface Enrollment {
  id: string;
  course_id: string;
  progress: number;
  status: string;
  enrolled_at: string;
  completed_at: string | null;
  courses: {
    id: string;
    title: string;
    duration: string | null;
  };
}

interface ExamAttempt {
  id: string;
  exam_id: string;
  score: number | null;
  max_score: number | null;
  passed: boolean | null;
  completed_at: string | null;
  module_exams: {
    id: string;
    title: string;
    pass_percentage: number | null;
    course_modules: {
      id: string;
      title: string;
      order_index: number;
      courses: {
        id: string;
        title: string;
      };
    };
  };
}

interface ProgressStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalExams: number;
  passedExams: number;
  averageScore: number;
  totalModulesCompleted: number;
}

const CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--healthcare))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

const DashboardProgress = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalExams: 0,
    passedExams: 0,
    averageScore: 0,
    totalModulesCompleted: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgressData();
    }
  }, [user]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);

      // Fetch enrollments with course details
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select(`
          id,
          course_id,
          progress,
          status,
          enrolled_at,
          completed_at,
          courses (
            id,
            title,
            duration
          )
        `)
        .eq('user_id', user!.id)
        .order('enrolled_at', { ascending: false });

      if (enrollmentError) throw enrollmentError;

      // Fetch exam attempts with module and course details
      const { data: examData, error: examError } = await supabase
        .from('exam_attempts')
        .select(`
          id,
          exam_id,
          score,
          max_score,
          passed,
          completed_at,
          module_exams (
            id,
            title,
            pass_percentage,
            course_modules (
              id,
              title,
              order_index,
              courses (
                id,
                title
              )
            )
          )
        `)
        .eq('user_id', user!.id)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (examError) throw examError;

      const typedEnrollments = (enrollmentData || []) as unknown as Enrollment[];
      const typedExamAttempts = (examData || []) as unknown as ExamAttempt[];

      setEnrollments(typedEnrollments);
      setExamAttempts(typedExamAttempts);

      // Calculate stats
      const completedCourses = typedEnrollments.filter(e => e.status === 'completed').length;
      const inProgressCourses = typedEnrollments.filter(e => e.status === 'active').length;
      const passedExams = typedExamAttempts.filter(e => e.passed === true).length;
      const totalScore = typedExamAttempts.reduce((sum, e) => {
        if (e.score !== null && e.max_score !== null && e.max_score > 0) {
          return sum + (e.score / e.max_score) * 100;
        }
        return sum;
      }, 0);
      const averageScore = typedExamAttempts.length > 0 ? totalScore / typedExamAttempts.length : 0;

      setStats({
        totalCourses: typedEnrollments.length,
        completedCourses,
        inProgressCourses,
        totalExams: typedExamAttempts.length,
        passedExams,
        averageScore: Math.round(averageScore),
        totalModulesCompleted: passedExams
      });
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const courseProgressData = enrollments.map(e => ({
    name: e.courses?.title?.substring(0, 15) + '...' || 'Course',
    progress: e.progress || 0
  }));

  const examScoreData = examAttempts.slice(0, 10).map(e => ({
    name: e.module_exams?.course_modules?.title?.substring(0, 12) + '...' || 'Exam',
    score: e.score !== null && e.max_score !== null ? Math.round((e.score / e.max_score) * 100) : 0,
    passed: e.passed
  }));

  const pieChartData = [
    { name: 'Completed', value: stats.completedCourses, color: 'hsl(var(--primary))' },
    { name: 'In Progress', value: stats.inProgressCourses, color: 'hsl(var(--healthcare))' },
    { name: 'Pending', value: stats.totalCourses - stats.completedCourses - stats.inProgressCourses, color: 'hsl(var(--muted))' }
  ].filter(d => d.value > 0);

  const examResultsData = [
    { name: 'Passed', value: stats.passedExams, color: 'hsl(var(--primary))' },
    { name: 'Failed', value: stats.totalExams - stats.passedExams, color: 'hsl(var(--destructive))' }
  ].filter(d => d.value > 0);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Progress Report</h1>
        <p className="text-muted-foreground">Track your learning journey and achievements</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-healthcare/10 to-healthcare/5 border-healthcare/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-healthcare/20 rounded-lg">
                <Trophy className="h-5 w-5 text-healthcare" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{stats.completedCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Target className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Exams Passed</p>
                <p className="text-2xl font-bold text-foreground">{stats.passedExams}/{stats.totalExams}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/50 to-secondary/30 border-secondary">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <TrendingUp className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
                <p className="text-2xl font-bold text-foreground">{stats.averageScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="courses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BookOpen className="h-4 w-4 mr-2" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="exams" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Award className="h-4 w-4 mr-2" />
            Exams
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Progress</CardTitle>
                <CardDescription>Your progress across enrolled courses</CardDescription>
              </CardHeader>
              <CardContent>
                {courseProgressData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={courseProgressData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Progress']}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="progress" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No course data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Status Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Status</CardTitle>
                <CardDescription>Distribution of your course progress</CardDescription>
              </CardHeader>
              <CardContent>
                {pieChartData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No course data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Exam Scores Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Exam Scores</CardTitle>
                <CardDescription>Your performance in recent module exams</CardDescription>
              </CardHeader>
              <CardContent>
                {examScoreData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={examScoreData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Score']}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar 
                          dataKey="score" 
                          radius={[4, 4, 0, 0]}
                          fill="hsl(var(--healthcare))"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No exam data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Exam Results Pie */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exam Results</CardTitle>
                <CardDescription>Pass/fail ratio for all exams</CardDescription>
              </CardHeader>
              <CardContent>
                {examResultsData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={examResultsData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {examResultsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No exam data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          {enrollments.length > 0 ? (
            <div className="grid gap-4">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{enrollment.courses?.title}</h3>
                          <Badge 
                            variant={enrollment.status === 'completed' ? 'default' : 'secondary'}
                            className={enrollment.status === 'completed' ? 'bg-primary' : ''}
                          >
                            {enrollment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Enrolled: {format(new Date(enrollment.enrolled_at), 'MMM d, yyyy')}
                          </span>
                          {enrollment.courses?.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {enrollment.courses.duration}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full sm:w-48">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{enrollment.progress || 0}%</span>
                        </div>
                        <Progress value={enrollment.progress || 0} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Courses Enrolled</h3>
                <p className="text-muted-foreground">Start your learning journey by enrolling in a course.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Exams Tab */}
        <TabsContent value="exams" className="space-y-4">
          {examAttempts.length > 0 ? (
            <div className="grid gap-4">
              {examAttempts.map((attempt) => (
                <Card key={attempt.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {attempt.passed ? (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          ) : (
                            <XCircle className="h-5 w-5 text-destructive" />
                          )}
                          <h3 className="font-semibold text-foreground">
                            {attempt.module_exams?.title || 'Module Exam'}
                          </h3>
                          <Badge 
                            variant={attempt.passed ? 'default' : 'destructive'}
                            className={attempt.passed ? 'bg-primary' : ''}
                          >
                            {attempt.passed ? 'Passed' : 'Failed'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            Course: {attempt.module_exams?.course_modules?.courses?.title || 'N/A'}
                          </span>
                          <span>
                            Module: {attempt.module_exams?.course_modules?.title || 'N/A'}
                          </span>
                          {attempt.completed_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(attempt.completed_at), 'MMM d, yyyy')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">
                          {attempt.score !== null && attempt.max_score !== null 
                            ? Math.round((attempt.score / attempt.max_score) * 100) 
                            : 0}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {attempt.score || 0} / {attempt.max_score || 0} points
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Exams Taken</h3>
                <p className="text-muted-foreground">Complete course modules to unlock and take exams.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardProgress;
