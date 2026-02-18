import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Search, Eye, Video, Loader2, ClipboardCheck } from 'lucide-react';
import { format } from 'date-fns';

interface InterviewAttempt {
  id: string;
  user_id: string;
  course_id: string;
  round: string;
  status: string;
  passed: boolean | null;
  score: number | null;
  max_score: number | null;
  video_url: string | null;
  proctoring_violations: number | null;
  ai_evaluation: any;
  created_at: string;
  completed_at: string | null;
  profile?: {
    full_name: string;
    mobile: string | null;
  };
  course?: {
    title: string;
  };
}

const AdminInterviews = () => {
  const [interviews, setInterviews] = useState<InterviewAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roundFilter, setRoundFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInterview, setSelectedInterview] = useState<InterviewAttempt | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      // Fetch interview attempts
      const { data: attempts, error } = await supabase
        .from('interview_attempts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles and courses
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, mobile');

      const { data: courses } = await supabase
        .from('courses')
        .select('id, title');

      // Join data manually
      const interviewsWithData = (attempts || []).map((attempt) => ({
        ...attempt,
        profile: profiles?.find((p) => p.user_id === attempt.user_id) || null,
        course: courses?.find((c) => c.id === attempt.course_id) || null,
      })) as InterviewAttempt[];

      setInterviews(interviewsWithData);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch =
      interview.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.profile?.mobile?.includes(searchQuery);
    const matchesRound = roundFilter === 'all' || interview.round === roundFilter;
    const matchesStatus = statusFilter === 'all' || interview.status === statusFilter;
    return matchesSearch && matchesRound && matchesStatus;
  });

  const viewInterviewDetails = (interview: InterviewAttempt) => {
    setSelectedInterview(interview);
    setDetailsOpen(true);
  };

  const getStatusBadge = (interview: InterviewAttempt) => {
    if (interview.status === 'disqualified') {
      return <Badge variant="destructive">Disqualified</Badge>;
    }
    if (interview.passed === true) {
      return <Badge className="bg-green-500">Passed</Badge>;
    }
    if (interview.passed === false) {
      return <Badge variant="destructive">Failed</Badge>;
    }
    if (interview.status === 'completed') {
      return <Badge variant="secondary">Completed</Badge>;
    }
    if (interview.status === 'in_progress') {
      return <Badge variant="outline">In Progress</Badge>;
    }
    return <Badge variant="outline">{interview.status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Interview Management</h2>
        <p className="text-muted-foreground">Review interview recordings and results</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              All Interviews ({filteredInterviews.length})
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-48"
                />
              </div>
              <Select value={roundFilter} onValueChange={setRoundFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Round" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rounds</SelectItem>
                  <SelectItem value="mcq">MCQ</SelectItem>
                  <SelectItem value="coding">Coding</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="disqualified">Disqualified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Round</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Violations</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInterviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No interviews found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInterviews.map((interview) => (
                      <TableRow key={interview.id}>
                        <TableCell className="font-medium">
                          {interview.profile?.full_name || 'Unknown'}
                        </TableCell>
                        <TableCell>{interview.course?.title || '-'}</TableCell>
                        <TableCell className="capitalize">{interview.round}</TableCell>
                        <TableCell>
                          {interview.score !== null
                            ? `${interview.score}/${interview.max_score || 100}`
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {interview.proctoring_violations !== null ? (
                            <Badge
                              variant={interview.proctoring_violations > 2 ? 'destructive' : 'outline'}
                            >
                              {interview.proctoring_violations}
                            </Badge>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(interview)}</TableCell>
                        <TableCell>
                          {format(new Date(interview.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewInterviewDetails(interview)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {interview.video_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(interview.video_url!, '_blank')}
                            >
                              <Video className="h-4 w-4" />
                            </Button>
                          )}
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

      {/* Interview Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Interview Details</DialogTitle>
          </DialogHeader>
          {selectedInterview && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Student</p>
                  <p className="font-medium">{selectedInterview.profile?.full_name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium">{selectedInterview.profile?.mobile || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Course</p>
                  <p className="font-medium">{selectedInterview.course?.title || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Round</p>
                  <p className="font-medium capitalize">{selectedInterview.round}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="font-medium">
                    {selectedInterview.score !== null
                      ? `${selectedInterview.score}/${selectedInterview.max_score || 100}`
                      : 'Not scored'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Proctoring Violations</p>
                  <p className="font-medium">{selectedInterview.proctoring_violations || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Started At</p>
                  <p className="font-medium">
                    {format(new Date(selectedInterview.created_at), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed At</p>
                  <p className="font-medium">
                    {selectedInterview.completed_at
                      ? format(new Date(selectedInterview.completed_at), 'MMM d, yyyy h:mm a')
                      : 'Not completed'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Status</p>
                {getStatusBadge(selectedInterview)}
              </div>

              {selectedInterview.ai_evaluation && (
                <div>
                  <h4 className="font-semibold mb-2">AI Evaluation</h4>
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    {selectedInterview.ai_evaluation.communication !== undefined && (
                      <div className="flex justify-between">
                        <span>Communication</span>
                        <span className="font-medium">
                          {selectedInterview.ai_evaluation.communication}/10
                        </span>
                      </div>
                    )}
                    {selectedInterview.ai_evaluation.confidence !== undefined && (
                      <div className="flex justify-between">
                        <span>Confidence</span>
                        <span className="font-medium">
                          {selectedInterview.ai_evaluation.confidence}/10
                        </span>
                      </div>
                    )}
                    {selectedInterview.ai_evaluation.technicalClarity !== undefined && (
                      <div className="flex justify-between">
                        <span>Technical Clarity</span>
                        <span className="font-medium">
                          {selectedInterview.ai_evaluation.technicalClarity}/10
                        </span>
                      </div>
                    )}
                    {selectedInterview.ai_evaluation.overallScore !== undefined && (
                      <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                        <span>Overall Score</span>
                        <span>{selectedInterview.ai_evaluation.overallScore}/100</span>
                      </div>
                    )}
                    {selectedInterview.ai_evaluation.feedback && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-muted-foreground mb-1">Feedback</p>
                        <p className="text-sm">{selectedInterview.ai_evaluation.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedInterview.video_url && (
                <div>
                  <h4 className="font-semibold mb-2">Interview Recording</h4>
                  <Button
                    onClick={() => window.open(selectedInterview.video_url!, '_blank')}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Watch Recording
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInterviews;
