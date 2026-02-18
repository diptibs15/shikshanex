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
import { supabase } from '@/integrations/supabase/client';
import { Search, Eye, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Student {
  id: string;
  user_id: string;
  full_name: string;
  mobile: string | null;
  qualification: string | null;
  created_at: string;
  enrollments?: Array<{
    id: string;
    status: string;
    course: {
      title: string;
    };
  }>;
  interview_attempts?: Array<{
    id: string;
    round: string;
    status: string;
    passed: boolean | null;
    score: number | null;
  }>;
}

const AdminStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch enrollments with course titles
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('id, user_id, status, course:courses(title)');

      // Fetch interview attempts
      const { data: interviews } = await supabase
        .from('interview_attempts')
        .select('id, user_id, round, status, passed, score');

      // Join data manually
      const studentsWithData = (profiles || []).map((profile) => ({
        ...profile,
        enrollments: (enrollments || [])
          .filter((e) => e.user_id === profile.user_id)
          .map((e) => ({ id: e.id, status: e.status, course: e.course })),
        interview_attempts: (interviews || [])
          .filter((i) => i.user_id === profile.user_id)
          .map((i) => ({
            id: i.id,
            round: i.round,
            status: i.status,
            passed: i.passed,
            score: i.score,
          })),
      })) as Student[];

      setStudents(studentsWithData);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.mobile?.includes(searchQuery)
  );

  const viewStudentDetails = (student: Student) => {
    setSelectedStudent(student);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Student Management</h2>
        <p className="text-muted-foreground">View and manage all registered students</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>All Students ({filteredStudents.length})</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
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
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Qualification</TableHead>
                    <TableHead>Enrolled Courses</TableHead>
                    <TableHead>Interview Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No students found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.full_name}</TableCell>
                        <TableCell>{student.mobile || '-'}</TableCell>
                        <TableCell>{student.qualification || '-'}</TableCell>
                        <TableCell>
                          {student.enrollments?.length || 0} course(s)
                        </TableCell>
                        <TableCell>
                          {student.interview_attempts?.some((a) => a.passed) ? (
                            <Badge className="bg-green-500">Passed</Badge>
                          ) : student.interview_attempts?.some((a) => a.status === 'completed') ? (
                            <Badge variant="destructive">Failed</Badge>
                          ) : student.interview_attempts?.length ? (
                            <Badge variant="secondary">In Progress</Badge>
                          ) : (
                            <Badge variant="outline">Not Started</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {format(new Date(student.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewStudentDetails(student)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
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

      {/* Student Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{selectedStudent.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium">{selectedStudent.mobile || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Qualification</p>
                  <p className="font-medium">{selectedStudent.qualification || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">
                    {format(new Date(selectedStudent.created_at), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Enrolled Courses</h4>
                {selectedStudent.enrollments?.length ? (
                  <div className="space-y-2">
                    {selectedStudent.enrollments.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <span>{enrollment.course?.title || 'Unknown Course'}</span>
                        <Badge
                          variant={enrollment.status === 'active' ? 'default' : 'secondary'}
                        >
                          {enrollment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No courses enrolled</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Interview Attempts</h4>
                {selectedStudent.interview_attempts?.length ? (
                  <div className="space-y-2">
                    {selectedStudent.interview_attempts.map((attempt) => (
                      <div
                        key={attempt.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <span className="capitalize">{attempt.round} Round</span>
                        <div className="flex items-center gap-2">
                          {attempt.score !== null && (
                            <span className="text-sm text-muted-foreground">
                              Score: {attempt.score}
                            </span>
                          )}
                          <Badge
                            variant={
                              attempt.passed
                                ? 'default'
                                : attempt.status === 'completed'
                                ? 'destructive'
                                : 'secondary'
                            }
                            className={attempt.passed ? 'bg-green-500' : ''}
                          >
                            {attempt.passed
                              ? 'Passed'
                              : attempt.status === 'completed'
                              ? 'Failed'
                              : attempt.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No interview attempts</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStudents;
