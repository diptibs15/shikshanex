import { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Mic, 
  MicOff,
  Play,
  Square,
  ChevronRight,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import WebcamMonitor from './WebcamMonitor';
import { useWebcamProctoring } from '@/hooks/useWebcamProctoring';
import { useToast } from '@/hooks/use-toast';

interface HRQuestion {
  id: string;
  question_text: string;
  time_limit: number; // seconds
}

interface AIHRInterviewProps {
  questions: HRQuestion[];
  onComplete: (recordings: Record<string, string>) => void;
  onDisqualify: () => void;
}

const AIHRInterview = ({ questions, onComplete, onDisqualify }: AIHRInterviewProps) => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 = intro screen
  const [recordings, setRecordings] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  const currentQuestion = currentIndex >= 0 ? questions[currentIndex] : null;
  const maxTime = currentQuestion?.time_limit || 120;

  // Timer for recording
  useEffect(() => {
    if (isRecording && recordingTime < maxTime) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxTime - 1) {
            stopRecording();
            return maxTime;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, maxTime]);

  const handleStartInterview = async () => {
    const cameraStarted = await startCamera();
    if (cameraStarted) {
      setInterviewStarted(true);
      setCurrentIndex(0);
    } else {
      toast({
        title: 'Camera Required',
        description: 'Please allow camera and microphone access.',
        variant: 'destructive',
      });
    }
  };

  const startRecording = useCallback(async () => {
    if (!videoRef.current?.srcObject) return;
    
    try {
      const stream = videoRef.current.srcObject as MediaStream;
      
      // Get audio stream separately to combine
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const combinedStream = new MediaStream([
        ...stream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);
      
      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      });
      
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        if (currentQuestion) {
          setRecordings(prev => ({ ...prev, [currentQuestion.id]: url }));
        }
        
        // Cleanup audio stream
        audioStream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        title: 'Recording Error',
        description: 'Failed to start recording. Please check your camera and microphone.',
        variant: 'destructive',
      });
    }
  }, [currentQuestion, toast, videoRef]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const handleNextQuestion = () => {
    if (isRecording) {
      stopRecording();
    }
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setRecordingTime(0);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    stopCamera();
    onComplete(recordings);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isProcessing) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-16 w-16 mx-auto animate-spin text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Processing Your Interview</h2>
          <p className="text-muted-foreground">
            Our AI is evaluating your responses. This may take a moment...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!interviewStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            AI HR Interview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Video className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Video Interview</p>
                <p className="text-sm text-muted-foreground">
                  You will be asked {questions.length} questions. Record your video answer for each.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Time Limit</p>
                <p className="text-sm text-muted-foreground">
                  Each question has a 2-minute time limit for your response.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">AI Evaluation</p>
                <p className="text-sm text-muted-foreground">
                  Our AI will evaluate your communication, confidence, and content.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Tips for Success:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Speak clearly and maintain eye contact with the camera</li>
              <li>• Keep your answers concise and relevant</li>
              <li>• Ensure good lighting and minimal background noise</li>
              <li>• Stay calm and confident throughout</li>
            </ul>
          </div>

          <Button onClick={handleStartInterview} className="w-full" size="lg">
            <Video className="h-5 w-5 mr-2" />
            Start Interview
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Video Area */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Question {currentIndex + 1} of {questions.length}
              </CardTitle>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(maxTime - recordingTime)} remaining
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question */}
            <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
              <p className="text-lg font-medium">{currentQuestion?.question_text}</p>
            </div>

            {/* Video Preview */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-destructive text-destructive-foreground px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-medium">REC {formatTime(recordingTime)}</span>
                </div>
              )}
              
              {/* Recording progress */}
              {isRecording && (
                <div className="absolute bottom-0 left-0 right-0">
                  <Progress 
                    value={(recordingTime / maxTime) * 100} 
                    className="h-1 rounded-none"
                  />
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isRecording ? (
                  <Badge variant="destructive" className="gap-1">
                    <Mic className="h-3 w-3" />
                    Recording
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <MicOff className="h-3 w-3" />
                    Not Recording
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {!isRecording && !recordings[currentQuestion?.id || ''] ? (
                  <Button onClick={startRecording} size="lg" className="gap-2">
                    <Play className="h-5 w-5" />
                    Start Recording
                  </Button>
                ) : isRecording ? (
                  <Button onClick={stopRecording} variant="destructive" size="lg" className="gap-2">
                    <Square className="h-5 w-5" />
                    Stop Recording
                  </Button>
                ) : (
                  <>
                    <Button onClick={startRecording} variant="outline" className="gap-2">
                      <Play className="h-4 w-4" />
                      Re-record
                    </Button>
                    <Button onClick={handleNextQuestion} size="lg" className="gap-2">
                      {currentIndex < questions.length - 1 ? (
                        <>
                          Next Question
                          <ChevronRight className="h-5 w-5" />
                        </>
                      ) : (
                        'Submit Interview'
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Proctoring Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Proctoring Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Camera</span>
                <Badge variant={state.cameraEnabled ? 'default' : 'destructive'}>
                  {state.cameraEnabled ? 'Active' : 'Off'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Face Detection</span>
                <Badge variant={state.faceDetected ? 'default' : 'destructive'}>
                  {state.faceDetected ? 'Detected' : 'Not Found'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Tab Focus</span>
                <Badge variant={state.tabFocused ? 'default' : 'destructive'}>
                  {state.tabFocused ? 'Focused' : 'Switched'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Violations</span>
                <Badge variant={state.violations > 3 ? 'destructive' : 'secondary'}>
                  {state.violations}/5
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {questions.map((q, index) => (
                <div 
                  key={q.id}
                  className={`flex items-center gap-2 p-2 rounded ${
                    index === currentIndex ? 'bg-primary/10' : ''
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    recordings[q.id] 
                      ? 'bg-green-500 text-white' 
                      : index === currentIndex 
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {recordings[q.id] ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  <span className="text-sm truncate">Question {index + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIHRInterview;
