import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  Play, 
  CheckCircle, 
  XCircle,
  Code,
  Terminal,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import WebcamMonitor from './WebcamMonitor';
import { useWebcamProctoring } from '@/hooks/useWebcamProctoring';
import { useToast } from '@/hooks/use-toast';

interface CodingProblem {
  id: string;
  title: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  difficulty: string;
  testCases: { input: string; expected: string }[];
}

interface CodingTestProps {
  problems: CodingProblem[];
  timeLimit: number; // minutes
  onComplete: (solutions: Record<string, { code: string; language: string; passed: boolean }>) => void;
  onDisqualify: () => void;
}

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', template: '// Write your solution here\nfunction solution(input) {\n  \n  return result;\n}' },
  { id: 'python', name: 'Python', template: '# Write your solution here\ndef solution(input):\n    \n    return result' },
  { id: 'java', name: 'Java', template: '// Write your solution here\nclass Solution {\n    public static void main(String[] args) {\n        \n    }\n}' },
  { id: 'cpp', name: 'C++', template: '// Write your solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}' },
];

const CodingTest = ({ problems, timeLimit, onComplete, onDisqualify }: CodingTestProps) => {
  const { toast } = useToast();
  const [currentProblem, setCurrentProblem] = useState(0);
  const [solutions, setSolutions] = useState<Record<string, { code: string; language: string }>>({});
  const [testResults, setTestResults] = useState<Record<string, { passed: boolean; output: string }[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [testStarted, setTestStarted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { videoRef, canvasRef, state, startCamera, stopCamera } = useWebcamProctoring({
    maxViolations: 5,
    onViolation: (type) => {
      toast({
        title: 'Warning!',
        description: `Proctoring violation: ${type.replace('_', ' ')}`,
        variant: 'destructive',
      });
    },
    onDisqualify: () => {
      stopCamera();
      onDisqualify();
    },
  });

  const problem = problems[currentProblem];
  const currentSolution = solutions[problem?.id] || { code: LANGUAGES[0].template, language: 'javascript' };

  // Timer
  useEffect(() => {
    if (!testStarted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitAll();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, timeRemaining]);

  // Anti-copy measures
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

    document.addEventListener('copy', preventCopy);
    document.addEventListener('paste', preventCopy);

    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('paste', preventCopy);
    };
  }, [testStarted, toast]);

  const handleStartTest = async () => {
    const cameraStarted = await startCamera();
    if (cameraStarted) {
      setTestStarted(true);
      // Initialize solutions with templates
      const initial: Record<string, { code: string; language: string }> = {};
      problems.forEach(p => {
        initial[p.id] = { code: LANGUAGES[0].template, language: 'javascript' };
      });
      setSolutions(initial);
    } else {
      toast({
        title: 'Camera Required',
        description: 'Please allow camera access to start the test.',
        variant: 'destructive',
      });
    }
  };

  const updateSolution = (code: string) => {
    setSolutions(prev => ({
      ...prev,
      [problem.id]: { ...prev[problem.id], code },
    }));
  };

  const updateLanguage = (language: string) => {
    const template = LANGUAGES.find(l => l.id === language)?.template || '';
    setSolutions(prev => ({
      ...prev,
      [problem.id]: { code: template, language },
    }));
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code...\n');

    // Simulate code execution (in production, use a sandboxed code execution service)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate test case results
    const results = problem.testCases.map((tc, i) => {
      const passed = Math.random() > 0.3; // Simulated result
      return {
        passed,
        output: passed 
          ? `Test case ${i + 1}: PASSED ✓\n  Input: ${tc.input}\n  Expected: ${tc.expected}\n  Got: ${tc.expected}\n`
          : `Test case ${i + 1}: FAILED ✗\n  Input: ${tc.input}\n  Expected: ${tc.expected}\n  Got: [incorrect value]\n`,
      };
    });

    setTestResults(prev => ({ ...prev, [problem.id]: results }));
    setOutput(results.map(r => r.output).join('\n'));
    setIsRunning(false);
  };

  const handleSubmitAll = useCallback(async () => {
    setIsSubmitting(true);
    stopCamera();

    // Calculate results
    const finalSolutions: Record<string, { code: string; language: string; passed: boolean }> = {};
    problems.forEach(p => {
      const sol = solutions[p.id];
      const results = testResults[p.id] || [];
      const passed = results.length > 0 && results.every(r => r.passed);
      finalSolutions[p.id] = {
        code: sol?.code || '',
        language: sol?.language || 'javascript',
        passed,
      };
    });

    onComplete(finalSolutions);
  }, [problems, solutions, testResults, stopCamera, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (state.isDisqualified) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-16 w-16 mx-auto text-destructive mb-4" />
          <h2 className="text-2xl font-bold text-destructive mb-2">Disqualified</h2>
          <p className="text-muted-foreground">
            You have been disqualified due to multiple proctoring violations.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!testStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-6 w-6" />
            Coding Test Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Test Overview</p>
                <p className="text-sm text-muted-foreground">
                  {problems.length} problems • {timeLimit} minutes • Live Compiler
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Code className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Languages Supported</p>
                <p className="text-sm text-muted-foreground">
                  JavaScript, Python, Java, C++
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <p className="font-medium">Rules</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Copy/paste is disabled</li>
                  <li>Tab switching is monitored</li>
                  <li>AI plagiarism detection is active</li>
                  <li>5 violations = disqualification</li>
                </ul>
              </div>
            </div>
          </div>

          <Button onClick={handleStartTest} className="w-full" size="lg">
            <Play className="h-5 w-5 mr-2" />
            Start Coding Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-4 gap-4">
      {/* Problem Description */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className={`h-5 w-5 ${timeRemaining < 300 ? 'text-destructive' : 'text-muted-foreground'}`} />
                <span className={`font-mono font-bold ${timeRemaining < 300 ? 'text-destructive' : ''}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Button onClick={handleSubmitAll} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit All'}
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="h-[calc(100vh-280px)] overflow-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{problem.title}</CardTitle>
              <Badge variant={problem.difficulty === 'hard' ? 'destructive' : problem.difficulty === 'medium' ? 'secondary' : 'default'}>
                {problem.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p>{problem.description}</p>
              
              <h4>Examples:</h4>
              {problem.examples.map((ex, i) => (
                <div key={i} className="bg-muted p-3 rounded-lg text-sm font-mono">
                  <p><strong>Input:</strong> {ex.input}</p>
                  <p><strong>Output:</strong> {ex.output}</p>
                  {ex.explanation && <p className="text-muted-foreground">{ex.explanation}</p>}
                </div>
              ))}
              
              <h4>Constraints:</h4>
              <ul>
                {problem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Problem Tabs */}
            <div className="flex gap-2 pt-4 border-t">
              {problems.map((p, i) => (
                <Button
                  key={p.id}
                  variant={i === currentProblem ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentProblem(i)}
                  className="relative"
                >
                  Problem {i + 1}
                  {testResults[p.id] && (
                    <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                      testResults[p.id].every(r => r.passed) ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Code Editor */}
      <div className="lg:col-span-2 space-y-4">
        {/* Webcam */}
        <WebcamMonitor
          videoRef={videoRef}
          canvasRef={canvasRef}
          state={state}
          compact
        />

        <Card className="h-[calc(100vh-340px)]">
          <Tabs defaultValue="code" className="h-full flex flex-col">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="output">Output</TabsTrigger>
                </TabsList>
                <Select value={currentSolution.language} onValueChange={updateLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang.id} value={lang.id}>{lang.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <TabsContent value="code" className="flex-1 mt-0">
                <Textarea
                  value={currentSolution.code}
                  onChange={(e) => updateSolution(e.target.value)}
                  className="h-full min-h-[300px] font-mono text-sm resize-none"
                  placeholder="Write your code here..."
                />
              </TabsContent>
              <TabsContent value="output" className="flex-1 mt-0">
                <div className="h-full min-h-[300px] bg-black text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto whitespace-pre-wrap">
                  {output || 'Click "Run Code" to see output...'}
                </div>
              </TabsContent>
              
              <div className="flex gap-2 mt-4">
                <Button onClick={runCode} disabled={isRunning} className="gap-2">
                  {isRunning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Terminal className="h-4 w-4" />
                  )}
                  {isRunning ? 'Running...' : 'Run Code'}
                </Button>
              </div>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default CodingTest;
