import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import WebcamMonitor from './WebcamMonitor';
import { useWebcamProctoring } from '@/hooks/useWebcamProctoring';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  question_text: string;
  options: string[];
  difficulty: string;
  points: number;
}

interface MCQTestProps {
  questions: Question[];
  timeLimit: number; // in minutes
  onComplete: (answers: Record<string, string>, score: number) => void;
  onDisqualify: () => void;
}

const MCQTest = ({ questions, timeLimit, onComplete, onDisqualify }: MCQTestProps) => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  const { videoRef, canvasRef, state, startCamera, stopCamera } = useWebcamProctoring({
    maxViolations: 5,
    onViolation: (type) => {
      toast({
        title: 'Warning!',
        description: `Proctoring violation detected: ${type.replace('_', ' ')}`,
        variant: 'destructive',
      });
    },
    onDisqualify: () => {
      stopCamera();
      onDisqualify();
    },
  });

  // Timer effect
  useEffect(() => {
    if (!testStarted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, timeRemaining]);

  // Prevent context menu and keyboard shortcuts
  useEffect(() => {
    if (!testStarted) return;

    const preventCopy = (e: Event) => {
      e.preventDefault();
      toast({
        title: 'Action Blocked',
        description: 'Copy/paste is not allowed during the test.',
        variant: 'destructive',
      });
    };

    const preventKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'a', 'p'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        toast({
          title: 'Action Blocked',
          description: 'Keyboard shortcuts are disabled during the test.',
          variant: 'destructive',
        });
      }
    };

    document.addEventListener('copy', preventCopy);
    document.addEventListener('paste', preventCopy);
    document.addEventListener('contextmenu', preventCopy);
    document.addEventListener('keydown', preventKeys);

    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('paste', preventCopy);
      document.removeEventListener('contextmenu', preventCopy);
      document.removeEventListener('keydown', preventKeys);
    };
  }, [testStarted, toast]);

  const handleStartTest = async () => {
    const cameraStarted = await startCamera();
    if (cameraStarted) {
      setTestStarted(true);
    } else {
      toast({
        title: 'Camera Required',
        description: 'Please allow camera access to start the test.',
        variant: 'destructive',
      });
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const toggleFlag = (questionId: string) => {
    setFlagged(prev => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(questionId)) {
        newFlagged.delete(questionId);
      } else {
        newFlagged.add(questionId);
      }
      return newFlagged;
    });
  };

  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);
    stopCamera();
    
    // Calculate score (in real app, this would be server-side)
    const score = Object.keys(answers).length * 10; // Simplified scoring
    onComplete(answers, score);
  }, [answers, stopCamera, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  if (state.isDisqualified) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="text-destructive mb-4">
            <AlertTriangle className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-destructive mb-2">Disqualified</h2>
          <p className="text-muted-foreground">
            You have been disqualified due to multiple proctoring violations.
            This attempt has been recorded.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!testStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>MCQ Test Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Test Overview</p>
                <p className="text-sm text-muted-foreground">
                  {questions.length} questions • {timeLimit} minutes • AI Proctored
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <p className="font-medium">Proctoring Rules</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Webcam must remain on throughout the test</li>
                  <li>Your face must be visible at all times</li>
                  <li>Do not switch tabs or windows</li>
                  <li>Copy/paste is disabled</li>
                  <li>5 violations = automatic disqualification</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              By clicking "Start Test", you agree to the proctoring rules and confirm that you will attempt this test honestly.
            </p>
          </div>

          <Button onClick={handleStartTest} className="w-full" size="lg">
            Start Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-4">
        {/* Timer and Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className={`h-5 w-5 ${timeRemaining < 300 ? 'text-destructive' : 'text-muted-foreground'}`} />
                <span className={`font-mono text-lg font-bold ${timeRemaining < 300 ? 'text-destructive' : ''}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {answeredCount}/{questions.length} answered
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Question {currentIndex + 1} of {questions.length}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={currentQuestion.difficulty === 'hard' ? 'destructive' : currentQuestion.difficulty === 'medium' ? 'secondary' : 'default'}>
                  {currentQuestion.difficulty}
                </Badge>
                <Badge variant="outline">{currentQuestion.points} pts</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg leading-relaxed">{currentQuestion.question_text}</p>
            
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => toggleFlag(currentQuestion.id)}
                className={flagged.has(currentQuestion.id) ? 'text-warning' : ''}
              >
                <Flag className="h-4 w-4 mr-1" />
                {flagged.has(currentQuestion.id) ? 'Flagged' : 'Flag'}
              </Button>
              
              {currentIndex < questions.length - 1 ? (
                <Button onClick={() => setCurrentIndex(prev => prev + 1)}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Test'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Webcam */}
        <WebcamMonitor
          videoRef={videoRef}
          canvasRef={canvasRef}
          state={state}
        />

        {/* Question Navigator */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Question Navigator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, index) => (
                <Button
                  key={q.id}
                  variant="outline"
                  size="sm"
                  className={`p-0 h-8 w-8 ${
                    index === currentIndex ? 'ring-2 ring-primary' : ''
                  } ${
                    answers[q.id] ? 'bg-primary text-primary-foreground' : ''
                  } ${
                    flagged.has(q.id) ? 'border-warning border-2' : ''
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-primary" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded border-2 border-warning" />
                <span>Flagged</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MCQTest;
