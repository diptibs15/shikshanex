import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, PlayCircle, FileText, ClipboardCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ModuleSidebar from '@/components/lms/ModuleSidebar';
import VideoPlayer from '@/components/lms/VideoPlayer';
import PDFNotes from '@/components/lms/PDFNotes';
import ModuleExam from '@/components/lms/ModuleExam';
import { cn } from '@/lib/utils';

interface Module {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  duration_minutes: number | null;
  video_url: string | null;
  notes_url: string | null;
}

interface Exam {
  id: string;
  module_id: string;
  title: string;
  pass_percentage: number | null;
  time_limit_minutes: number | null;
}

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  points: number;
}

interface ModuleProgress {
  module_id: string;
  video_completed: boolean;
  notes_viewed: boolean;
  exam_passed: boolean;
  exam_score?: number;
  exam_max_score?: number;
}

const CourseLearning = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<{ id: string; title: string } | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('video');
  const [moduleProgress, setModuleProgress] = useState<Record<string, ModuleProgress>>({});
  const [exams, setExams] = useState<Record<string, Exam>>({});
  const [questions, setQuestions] = useState<Record<string, Question[]>>({});
  const [enrollment, setEnrollment] = useState<{ id: string; progress: number } | null>(null);

  const currentModule = modules[currentModuleIndex];

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId || !user) return;

      try {
        // Fetch course
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('id, title')
          .eq('id', courseId)
          .single();

        if (courseError) throw courseError;
        setCourse(courseData);

        // Fetch enrollment
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('id, progress, current_module')
          .eq('course_id', courseId)
          .eq('user_id', user.id)
          .single();

        if (enrollmentError) {
          toast.error('You are not enrolled in this course');
          navigate('/dashboard/courses');
          return;
        }
        setEnrollment(enrollmentData);

        // Fetch modules
        const { data: modulesData, error: modulesError } = await supabase
          .from('course_modules')
          .select('*')
          .eq('course_id', courseId)
          .order('order_index', { ascending: true });

        if (modulesError) throw modulesError;
        setModules(modulesData || []);

        // Set current module from enrollment
        if (enrollmentData.current_module && modulesData) {
          const currentIdx = modulesData.findIndex(
            (m) => m.order_index === enrollmentData.current_module
          );
          if (currentIdx >= 0) setCurrentModuleIndex(currentIdx);
        }

        // Fetch exams for all modules
        if (modulesData && modulesData.length > 0) {
          const moduleIds = modulesData.map((m) => m.id);
          const { data: examsData } = await supabase
            .from('module_exams')
            .select('*')
            .in('module_id', moduleIds);

          const examsMap: Record<string, Exam> = {};
          examsData?.forEach((exam) => {
            examsMap[exam.module_id] = exam;
          });
          setExams(examsMap);

          // Fetch questions for each exam
          if (examsData && examsData.length > 0) {
            const examIds = examsData.map((e) => e.id);
            const { data: questionsData } = await supabase
              .from('exam_questions')
              .select('*')
              .in('exam_id', examIds)
              .order('order_index', { ascending: true });

            const questionsMap: Record<string, Question[]> = {};
            questionsData?.forEach((q) => {
              const exam = examsData.find((e) => e.id === q.exam_id);
              if (exam) {
                if (!questionsMap[exam.module_id]) questionsMap[exam.module_id] = [];
                questionsMap[exam.module_id].push({
                  id: q.id,
                  question_text: q.question_text,
                  options: Array.isArray(q.options) ? q.options as string[] : [],
                  correct_answer: q.correct_answer,
                  points: q.points || 1,
                });
              }
            });
            setQuestions(questionsMap);
          }

          // Fetch exam attempts to determine progress
          const { data: attemptsData } = await supabase
            .from('exam_attempts')
            .select('*')
            .eq('user_id', user.id)
            .in('exam_id', examsData?.map((e) => e.id) || []);

          // Build progress map
          const progressMap: Record<string, ModuleProgress> = {};
          modulesData.forEach((m, idx) => {
            const exam = examsMap[m.id];
            const attempt = attemptsData?.find((a) => a.exam_id === exam?.id && a.passed);
            
            // For now, assume video/notes viewed based on exam status or if it's a past module
            const examPassed = !!attempt;
            const isPastModule = idx < (enrollmentData.current_module || 0);
            
            progressMap[m.id] = {
              module_id: m.id,
              video_completed: examPassed || isPastModule,
              notes_viewed: examPassed || isPastModule,
              exam_passed: examPassed,
              exam_score: attempt?.score || undefined,
              exam_max_score: attempt?.max_score || undefined,
            };
          });
          setModuleProgress(progressMap);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        toast.error('Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, user, navigate]);

  const handleVideoComplete = async () => {
    if (!currentModule || !user) return;

    setModuleProgress((prev) => ({
      ...prev,
      [currentModule.id]: {
        ...prev[currentModule.id],
        module_id: currentModule.id,
        video_completed: true,
        notes_viewed: prev[currentModule.id]?.notes_viewed || false,
        exam_passed: prev[currentModule.id]?.exam_passed || false,
      },
    }));

    toast.success('Video completed!');
  };

  const handleNotesView = async () => {
    if (!currentModule || !user) return;

    setModuleProgress((prev) => ({
      ...prev,
      [currentModule.id]: {
        ...prev[currentModule.id],
        module_id: currentModule.id,
        video_completed: prev[currentModule.id]?.video_completed || false,
        notes_viewed: true,
        exam_passed: prev[currentModule.id]?.exam_passed || false,
      },
    }));

    toast.success('Notes marked as viewed!');
  };

  const handleExamComplete = async (passed: boolean, score: number, maxScore: number) => {
    if (!currentModule || !user || !enrollment) return;

    const exam = exams[currentModule.id];
    if (!exam) return;

    try {
      // Save exam attempt
      await supabase.from('exam_attempts').insert({
        exam_id: exam.id,
        user_id: user.id,
        score,
        max_score: maxScore,
        passed,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        answers: {},
      });

      setModuleProgress((prev) => ({
        ...prev,
        [currentModule.id]: {
          ...prev[currentModule.id],
          module_id: currentModule.id,
          video_completed: true,
          notes_viewed: true,
          exam_passed: passed,
          exam_score: score,
          exam_max_score: maxScore,
        },
      }));

      if (passed) {
        toast.success('Congratulations! You passed the exam!');

        // Update enrollment progress
        const newProgress = Math.round(
          ((currentModuleIndex + 1) / modules.length) * 100
        );
        const newCurrentModule = Math.min(currentModuleIndex + 2, modules.length);

        await supabase
          .from('enrollments')
          .update({
            progress: newProgress,
            current_module: newCurrentModule,
          })
          .eq('id', enrollment.id);

        // Auto-advance to next module if available
        if (currentModuleIndex < modules.length - 1) {
          setTimeout(() => {
            setCurrentModuleIndex(currentModuleIndex + 1);
            setActiveTab('video');
          }, 2000);
        }
      } else {
        toast.error('You did not pass. Please review and try again.');
      }
    } catch (error) {
      console.error('Error saving exam attempt:', error);
      toast.error('Failed to save exam results');
    }
  };

  const overallProgress = Math.round(
    (Object.values(moduleProgress).filter((p) => p.exam_passed).length / modules.length) * 100
  ) || 0;

  const currentProgress = moduleProgress[currentModule?.id];
  const canTakeExam = currentProgress?.video_completed && currentProgress?.notes_viewed;
  const currentExam = currentModule ? exams[currentModule.id] : null;
  const currentQuestions = currentModule ? questions[currentModule.id] || [] : [];

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="w-80 border-r p-4">
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-4 w-3/4 mb-6" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full mb-2" />
          ))}
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="aspect-video w-full mb-6" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ModuleSidebar
        modules={modules}
        currentModuleIndex={currentModuleIndex}
        moduleProgress={moduleProgress}
        onModuleSelect={setCurrentModuleIndex}
        courseName={course?.title || ''}
        overallProgress={overallProgress}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/courses')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-heading font-bold text-xl text-foreground">
                  {currentModule?.title || 'Loading...'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Module {currentModuleIndex + 1} of {modules.length}
                </p>
              </div>
            </div>
            {currentProgress?.exam_passed && (
              <Badge className="bg-primary/20 text-primary">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>

        {/* Content Tabs */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="video" className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4" />
                Video
                {currentProgress?.video_completed && (
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                )}
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes
                {currentProgress?.notes_viewed && (
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                )}
              </TabsTrigger>
              <TabsTrigger value="exam" className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                Exam
                {currentProgress?.exam_passed && (
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="video" className="space-y-6">
              <VideoPlayer
                videoUrl={currentModule?.video_url || null}
                title={currentModule?.title || ''}
                onComplete={handleVideoComplete}
              />
              {currentModule?.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>About this module</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{currentModule.description}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="notes">
              <PDFNotes
                notesUrl={currentModule?.notes_url || null}
                moduleTitle={currentModule?.title || ''}
                isViewed={currentProgress?.notes_viewed || false}
                onView={handleNotesView}
              />
            </TabsContent>

            <TabsContent value="exam">
              {!canTakeExam ? (
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="py-12 text-center">
                    <ClipboardCheck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <CardTitle className="mb-2">Complete Video & Notes First</CardTitle>
                    <CardDescription>
                      You must watch the video and view the notes before taking the exam.
                    </CardDescription>
                    <div className="flex justify-center gap-4 mt-6">
                      <div className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm',
                        currentProgress?.video_completed
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      )}>
                        <PlayCircle className="h-4 w-4" />
                        Video {currentProgress?.video_completed ? '✓' : '○'}
                      </div>
                      <div className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm',
                        currentProgress?.notes_viewed
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      )}>
                        <FileText className="h-4 w-4" />
                        Notes {currentProgress?.notes_viewed ? '✓' : '○'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : currentExam && currentQuestions.length > 0 ? (
                <ModuleExam
                  examId={currentExam.id}
                  examTitle={currentExam.title}
                  questions={currentQuestions}
                  passPercentage={currentExam.pass_percentage || 70}
                  timeLimitMinutes={currentExam.time_limit_minutes}
                  onComplete={handleExamComplete}
                  previousAttempt={
                    currentProgress?.exam_score !== undefined
                      ? {
                          score: currentProgress.exam_score,
                          max_score: currentProgress.exam_max_score || 0,
                          passed: currentProgress.exam_passed,
                        }
                      : null
                  }
                />
              ) : (
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="py-12 text-center">
                    <ClipboardCheck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <CardTitle className="mb-2">No Exam Available</CardTitle>
                    <CardDescription>
                      There is no exam configured for this module. You can proceed to the next module.
                    </CardDescription>
                    {currentModuleIndex < modules.length - 1 && (
                      <Button
                        className="mt-6"
                        onClick={() => {
                          // Mark as complete and move to next
                          setModuleProgress((prev) => ({
                            ...prev,
                            [currentModule.id]: {
                              ...prev[currentModule.id],
                              exam_passed: true,
                            },
                          }));
                          setCurrentModuleIndex(currentModuleIndex + 1);
                          setActiveTab('video');
                        }}
                      >
                        Continue to Next Module
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;
