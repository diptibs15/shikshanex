import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, XCircle, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  points: number;
}

interface ModuleExamProps {
  examId: string;
  examTitle: string;
  questions: Question[];
  passPercentage: number;
  timeLimitMinutes: number | null;
  onComplete: (passed: boolean, score: number, maxScore: number) => void;
  previousAttempt?: {
    score: number;
    max_score: number;
    passed: boolean;
  } | null;
}

const ModuleExam = ({
  examId,
  examTitle,
  questions,
  passPercentage,
  timeLimitMinutes,
  onComplete,
  previousAttempt,
}: ModuleExamProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimitMinutes ? timeLimitMinutes * 60 : null);
  const [examStarted, setExamStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);

  useEffect(() => {
    if (!examStarted || timeRemaining === null || showResults) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, timeRemaining, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startExam = () => {
    setExamStarted(true);
    setAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    if (timeLimitMinutes) {
      setTimeRemaining(timeLimitMinutes * 60);
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    let calculatedMaxScore = 0;

    questions.forEach((q) => {
      calculatedMaxScore += q.points || 1;
      if (answers[q.id] === q.correct_answer) {
        calculatedScore += q.points || 1;
      }
    });

    setScore(calculatedScore);
    setMaxScore(calculatedMaxScore);
    setShowResults(true);

    const percentage = (calculatedScore / calculatedMaxScore) * 100;
    const passed = percentage >= passPercentage;
    onComplete(passed, calculatedScore, calculatedMaxScore);
  };

  const question = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  // Show previous attempt or start screen
  if (!examStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{examTitle}</CardTitle>
          <CardDescription>
            Complete this exam to unlock the next module
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">{questions.length}</p>
              <p className="text-sm text-muted-foreground">Questions</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">{passPercentage}%</p>
              <p className="text-sm text-muted-foreground">Pass Score</p>
            </div>
            {timeLimitMinutes && (
              <div className="p-4 bg-muted rounded-lg col-span-2">
                <p className="text-2xl font-bold text-foreground">{timeLimitMinutes} min</p>
                <p className="text-sm text-muted-foreground">Time Limit</p>
              </div>
            )}
          </div>

          {previousAttempt && (
            <div className={cn(
              'p-4 rounded-lg border',
              previousAttempt.passed ? 'bg-primary/10 border-primary/20' : 'bg-destructive/10 border-destructive/20'
            )}>
              <div className="flex items-center gap-2 mb-2">
                {previousAttempt.passed ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                <span className="font-medium">
                  {previousAttempt.passed ? 'Previous Attempt: Passed' : 'Previous Attempt: Failed'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Score: {previousAttempt.score}/{previousAttempt.max_score} ({Math.round((previousAttempt.score / previousAttempt.max_score) * 100)}%)
              </p>
            </div>
          )}

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Important</p>
                <p className="text-sm text-muted-foreground">
                  You must score at least {passPercentage}% to pass this exam and unlock the next module.
                  {timeLimitMinutes && ` You have ${timeLimitMinutes} minutes to complete the exam.`}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={startExam} className="w-full" size="lg">
            {previousAttempt ? 'Retake Exam' : 'Start Exam'}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Show results
  if (showResults) {
    const percentage = Math.round((score / maxScore) * 100);
    const passed = percentage >= passPercentage;

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className={cn(
            'mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-4',
            passed ? 'bg-primary/20' : 'bg-destructive/20'
          )}>
            {passed ? (
              <CheckCircle2 className="h-10 w-10 text-primary" />
            ) : (
              <XCircle className="h-10 w-10 text-destructive" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {passed ? 'Congratulations!' : 'Keep Trying!'}
          </CardTitle>
          <CardDescription>
            {passed
              ? 'You have passed the exam and unlocked the next module.'
              : `You need ${passPercentage}% to pass. Review and try again.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-5xl font-bold text-foreground">{percentage}%</p>
            <p className="text-muted-foreground mt-1">
              {score} out of {maxScore} points
            </p>
          </div>

          <div className="space-y-2">
            {questions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correct_answer;
              return (
                <div
                  key={q.id}
                  className={cn(
                    'p-3 rounded-lg border flex items-center gap-3',
                    isCorrect ? 'bg-primary/5 border-primary/20' : 'bg-destructive/5 border-destructive/20'
                  )}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive shrink-0" />
                  )}
                  <span className="text-sm truncate">Q{idx + 1}: {q.question_text}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          {!passed && (
            <Button onClick={startExam} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retry Exam
            </Button>
          )}
          {passed && (
            <Button className="flex-1">
              Continue to Next Module
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  // Active exam
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="outline">Question {currentQuestion + 1} of {questions.length}</Badge>
        </div>
        {timeRemaining !== null && (
          <div className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full',
            timeRemaining < 60 ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'
          )}>
            <Clock className="h-4 w-4" />
            <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-2" />

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{question.question_text}</CardTitle>
          {question.points > 1 && (
            <CardDescription>{question.points} points</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers[question.id] || ''}
            onValueChange={(value) => handleAnswer(question.id, value)}
          >
            {question.options.map((option, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors',
                  answers[question.id] === option
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-muted'
                )}
                onClick={() => handleAnswer(question.id, option)}
              >
                <RadioGroupItem value={option} id={`option-${idx}`} />
                <Label htmlFor={`option-${idx}`} className="cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <div className="flex gap-2">
            {currentQuestion < questions.length - 1 ? (
              <Button
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                disabled={!answers[question.id]}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={answeredCount < questions.length}
              >
                Submit Exam
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Question navigator */}
      <div className="flex flex-wrap gap-2 justify-center">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuestion(idx)}
            className={cn(
              'h-8 w-8 rounded-full text-sm font-medium transition-colors',
              idx === currentQuestion && 'ring-2 ring-primary ring-offset-2',
              answers[q.id]
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModuleExam;
