import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, BookOpen, TrendingUp, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CourseRecommendation {
  courseId: string;
  courseTitle: string;
  matchScore: number;
  reason: string;
  careerPaths: string[];
}

interface RecommendationResult {
  recommendations: CourseRecommendation[];
  overallAdvice: string;
}

const AICourseAdvisor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [interests, setInterests] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [result, setResult] = useState<RecommendationResult | null>(null);

  const handleGetRecommendations = async () => {
    if (!interests.trim()) {
      toast.error('Please enter your interests');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-course-recommendations', {
        body: {
          userInterests: interests,
          qualification,
          experience
        }
      });

      if (error) throw error;

      if (data.success) {
        setResult(data.data);
      } else {
        throw new Error(data.error || 'Failed to get recommendations');
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast.error('Failed to get AI recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-primary text-primary-foreground';
    if (score >= 60) return 'bg-accent text-accent-foreground';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader className="text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">AI Course Advisor</CardTitle>
        <CardDescription>
          Tell us about yourself and get personalized course recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!result ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="interests">What are you interested in learning?</Label>
              <Input
                id="interests"
                placeholder="e.g., Web development, Data Science, HR, Marketing..."
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Select value={qualification} onValueChange={setQualification}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10th">10th Pass</SelectItem>
                    <SelectItem value="12th">12th Pass</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                    <SelectItem value="postgraduate">Post Graduate</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fresher">Fresher</SelectItem>
                    <SelectItem value="1-2">1-2 Years</SelectItem>
                    <SelectItem value="3-5">3-5 Years</SelectItem>
                    <SelectItem value="5+">5+ Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGetRecommendations}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get AI Recommendations
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-6">
            {/* Overall Advice */}
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm text-foreground">{result.overallAdvice}</p>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Recommended Courses
              </h4>
              
              {result.recommendations.map((rec, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-medium text-foreground">{rec.courseTitle}</h5>
                          <Badge className={cn('text-xs', getScoreColor(rec.matchScore))}>
                            {rec.matchScore}% Match
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{rec.reason}</p>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          {rec.careerPaths.slice(0, 3).map((path, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {path}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => navigate(`/courses/${rec.courseId}`)}
                      >
                        View
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setResult(null)}
              className="w-full"
            >
              Get New Recommendations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AICourseAdvisor;
