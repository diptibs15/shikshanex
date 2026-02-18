import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, CheckCircle, XCircle, Trophy } from 'lucide-react';
import MCQTest from '@/components/interview/MCQTest';
import CodingTest from '@/components/interview/CodingTest';
import AIHRInterview from '@/components/interview/AIHRInterview';

type RoundType = 'mcq' | 'coding' | 'hr';

interface Question {
  id: string;
  question_text: string;
  options: string[];
  difficulty: string;
  points: number;
  correct_answer?: string;
  time_limit?: number;
}

interface CodingProblem {
  id: string;
  title: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  difficulty: string;
  testCases: { input: string; expected: string }[];
}

const InterviewRoundPage = () => {
  const { categoryId, round } = useParams<{ categoryId: string; round: RoundType }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [codingProblems, setCodingProblems] = useState<CodingProblem[]>([]);
  const [hrQuestions, setHrQuestions] = useState<{ id: string; question_text: string; time_limit: number }[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [result, setResult] = useState<{ passed: boolean; score: number; maxScore: number } | null>(null);

  useEffect(() => {
    if (!user || !categoryId || !round) return;
    
    const initializeRound = async () => {
      try {
        // Check if already has attempt
        const { data: existingAttempt } = await supabase
          .from('interview_attempts')
          .select('id, status')
          .eq('user_id', user.id)
          .eq('course_id', categoryId)
          .eq('round', round)
          .single();

        if (existingAttempt?.status === 'completed') {
          toast({
            title: 'Already Completed',
            description: 'You have already completed this round.',
          });
          navigate('/dashboard/interview');
          return;
        }

        // Create or use existing attempt
        let attemptIdToUse = existingAttempt?.id;
        
        if (!existingAttempt) {
          const { data: newAttempt, error } = await supabase
            .from('interview_attempts')
            .insert({
              user_id: user.id,
              course_id: categoryId,
              round,
              status: 'in_progress',
              started_at: new Date().toISOString(),
            })
            .select('id')
            .single();

          if (error) throw error;
          attemptIdToUse = newAttempt.id;
        }

        setAttemptId(attemptIdToUse || null);

        // Load questions based on round
        if (round === 'mcq') {
          await loadMCQQuestions();
        } else if (round === 'coding') {
          loadCodingProblems();
        } else if (round === 'hr') {
          loadHRQuestions();
        }

        setLoading(false);
      } catch (error) {
        console.error('Error initializing round:', error);
        toast({
          title: 'Error',
          description: 'Failed to load interview round.',
          variant: 'destructive',
        });
        navigate('/dashboard/interview');
      }
    };

    initializeRound();
  }, [user, categoryId, round, navigate, toast]);

  const loadMCQQuestions = async () => {
    // Try to get questions from database
    const { data: dbQuestions } = await supabase
      .from('interview_questions')
      .select('*')
      .eq('round', 'mcq')
      .limit(30);

    if (dbQuestions && dbQuestions.length > 0) {
      setQuestions(dbQuestions.map(q => ({
        id: q.id,
        question_text: q.question_text,
        options: (q.options as string[]) || [],
        difficulty: q.difficulty || 'medium',
        points: q.points || 1,
        correct_answer: q.correct_answer || '',
      })));
    } else {
      // Fallback to sample questions
      setQuestions(generateSampleMCQs());
    }
  };

  const generateSampleMCQs = (): Question[] => {
    const sampleQuestions = [
      { q: 'What does HTML stand for?', opts: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], ans: 'Hyper Text Markup Language', diff: 'easy' },
      { q: 'Which of the following is not a programming language?', opts: ['Python', 'Java', 'HTML', 'C++'], ans: 'HTML', diff: 'easy' },
      { q: 'What is the time complexity of binary search?', opts: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], ans: 'O(log n)', diff: 'medium' },
      { q: 'Which data structure uses LIFO?', opts: ['Queue', 'Stack', 'Array', 'Linked List'], ans: 'Stack', diff: 'easy' },
      { q: 'What does SQL stand for?', opts: ['Structured Query Language', 'Simple Question Language', 'System Query Logic', 'Standard Query Logic'], ans: 'Structured Query Language', diff: 'easy' },
      { q: 'Which is a NoSQL database?', opts: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle'], ans: 'MongoDB', diff: 'medium' },
      { q: 'What is the default port for HTTP?', opts: ['21', '80', '443', '3000'], ans: '80', diff: 'medium' },
      { q: 'What does API stand for?', opts: ['Application Programming Interface', 'Advanced Programming Integration', 'Application Protocol Interface', 'Automated Programming Interface'], ans: 'Application Programming Interface', diff: 'easy' },
      { q: 'Which protocol is used for secure communication?', opts: ['HTTP', 'FTP', 'HTTPS', 'SMTP'], ans: 'HTTPS', diff: 'easy' },
      { q: 'What is the purpose of CSS?', opts: ['Styling web pages', 'Database management', 'Server-side scripting', 'Network security'], ans: 'Styling web pages', diff: 'easy' },
      { q: 'Which sorting algorithm has the best average-case time complexity?', opts: ['Bubble Sort', 'Quick Sort', 'Selection Sort', 'Insertion Sort'], ans: 'Quick Sort', diff: 'hard' },
      { q: 'What is polymorphism in OOP?', opts: ['Same name, different behaviors', 'Data hiding', 'Code reuse', 'Object creation'], ans: 'Same name, different behaviors', diff: 'medium' },
      { q: 'What is the output of 2 + "2" in JavaScript?', opts: ['4', '22', 'Error', 'undefined'], ans: '22', diff: 'medium' },
      { q: 'Which HTTP method is idempotent?', opts: ['POST', 'GET', 'PATCH', 'None'], ans: 'GET', diff: 'hard' },
      { q: 'What is a REST API?', opts: ['Representational State Transfer', 'Remote State Transfer', 'Resource State Transfer', 'Request State Transfer'], ans: 'Representational State Transfer', diff: 'medium' },
    ];

    return sampleQuestions.map((q, i) => ({
      id: `q-${i}`,
      question_text: q.q,
      options: q.opts,
      difficulty: q.diff,
      points: q.diff === 'hard' ? 3 : q.diff === 'medium' ? 2 : 1,
      correct_answer: q.ans,
    }));
  };

  const loadCodingProblems = () => {
    setCodingProblems([
      {
        id: 'prob-1',
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
        examples: [
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
          { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
        ],
        constraints: ['2 <= nums.length <= 10⁴', '-10⁹ <= nums[i] <= 10⁹', '-10⁹ <= target <= 10⁹'],
        difficulty: 'easy',
        testCases: [
          { input: '[2,7,11,15], 9', expected: '[0,1]' },
          { input: '[3,2,4], 6', expected: '[1,2]' },
          { input: '[3,3], 6', expected: '[0,1]' },
        ],
      },
      {
        id: 'prob-2',
        title: 'Reverse Linked List',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        examples: [
          { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
          { input: 'head = [1,2]', output: '[2,1]' },
        ],
        constraints: ['The number of nodes is in the range [0, 5000]', '-5000 <= Node.val <= 5000'],
        difficulty: 'medium',
        testCases: [
          { input: '[1,2,3,4,5]', expected: '[5,4,3,2,1]' },
          { input: '[1,2]', expected: '[2,1]' },
          { input: '[]', expected: '[]' },
        ],
      },
    ]);
  };

  const loadHRQuestions = () => {
    setHrQuestions([
      { id: 'hr-1', question_text: 'Tell me about yourself and your background.', time_limit: 120 },
      { id: 'hr-2', question_text: 'Why are you interested in this training program?', time_limit: 90 },
      { id: 'hr-3', question_text: 'What are your greatest strengths and how will they help you in this field?', time_limit: 90 },
      { id: 'hr-4', question_text: 'Describe a challenging situation you faced and how you handled it.', time_limit: 120 },
      { id: 'hr-5', question_text: 'Where do you see yourself in 5 years?', time_limit: 90 },
    ]);
  };

  const handleMCQComplete = async (answers: Record<string, string>, score: number) => {
    if (!attemptId || !user || !categoryId) return;

    try {
      // Calculate actual score based on correct answers
      let correctCount = 0;
      let totalPoints = 0;
      
      questions.forEach(q => {
        totalPoints += q.points;
        if (answers[q.id] === q.correct_answer) {
          correctCount += q.points;
        }
      });

      const percentage = (correctCount / totalPoints) * 100;
      const passed = percentage >= 60; // 60% passing

      // Update attempt
      await supabase
        .from('interview_attempts')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          score: correctCount,
          max_score: totalPoints,
          passed,
        })
        .eq('id', attemptId);

      // Save individual answers
      const answersToInsert = Object.entries(answers).map(([questionId, answer]) => ({
        attempt_id: attemptId,
        question_id: questionId,
        user_answer: answer,
        is_correct: questions.find(q => q.id === questionId)?.correct_answer === answer,
      }));

      // Only insert if using real question IDs from database
      if (questions[0]?.id && !questions[0].id.startsWith('q-')) {
        await supabase.from('interview_answers').insert(answersToInsert);
      }

      setResult({ passed, score: correctCount, maxScore: totalPoints });
    } catch (error) {
      console.error('Error saving MCQ results:', error);
      toast({
        title: 'Error',
        description: 'Failed to save results. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCodingComplete = async (solutions: Record<string, { code: string; language: string; passed: boolean }>) => {
    if (!attemptId || !user) return;

    try {
      const totalProblems = Object.keys(solutions).length;
      const passedProblems = Object.values(solutions).filter(s => s.passed).length;
      const passed = passedProblems === totalProblems;

      await supabase
        .from('interview_attempts')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          score: passedProblems,
          max_score: totalProblems,
          passed,
          ai_evaluation: solutions,
        })
        .eq('id', attemptId);

      setResult({ passed, score: passedProblems, maxScore: totalProblems });
    } catch (error) {
      console.error('Error saving coding results:', error);
    }
  };

  const handleHRComplete = async (recordings: Record<string, string>) => {
    if (!attemptId || !user) return;

    try {
      // Simulate AI evaluation
      const aiScore = Math.floor(Math.random() * 30) + 70; // 70-100
      const passed = aiScore >= 75;

      await supabase
        .from('interview_attempts')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          score: aiScore,
          max_score: 100,
          passed,
          ai_evaluation: {
            communication: Math.floor(Math.random() * 20) + 80,
            confidence: Math.floor(Math.random() * 20) + 75,
            content: Math.floor(Math.random() * 20) + 70,
            overall: aiScore,
          },
        })
        .eq('id', attemptId);

      setResult({ passed, score: aiScore, maxScore: 100 });
    } catch (error) {
      console.error('Error saving HR results:', error);
    }
  };

  const handleDisqualify = async () => {
    if (!attemptId) return;

    await supabase
      .from('interview_attempts')
      .update({
        status: 'disqualified',
        completed_at: new Date().toISOString(),
        passed: false,
      })
      .eq('id', attemptId);

    setResult({ passed: false, score: 0, maxScore: 100 });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <Card>
          <CardContent className="p-8 text-center">
            {result.passed ? (
              <>
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Congratulations! 🎉</h2>
                <p className="text-muted-foreground mb-4">
                  You passed the {round?.toUpperCase()} round with a score of {result.score}/{result.maxScore}!
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Round Not Passed</h2>
                <p className="text-muted-foreground mb-4">
                  Your score: {result.score}/{result.maxScore}. Don't give up - you can try again!
                </p>
              </>
            )}
            
            <Button onClick={() => navigate('/dashboard/interview')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Interview Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/dashboard/interview')} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Exit (Progress will be lost)
      </Button>

      {round === 'mcq' && questions.length > 0 && (
        <MCQTest
          questions={questions}
          timeLimit={30}
          onComplete={handleMCQComplete}
          onDisqualify={handleDisqualify}
        />
      )}

      {round === 'coding' && codingProblems.length > 0 && (
        <CodingTest
          problems={codingProblems}
          timeLimit={60}
          onComplete={handleCodingComplete}
          onDisqualify={handleDisqualify}
        />
      )}

      {round === 'hr' && hrQuestions.length > 0 && (
        <AIHRInterview
          questions={hrQuestions}
          onComplete={handleHRComplete}
          onDisqualify={handleDisqualify}
        />
      )}
    </div>
  );
};

export default InterviewRoundPage;
