import { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Camera, CameraOff, Eye, EyeOff, Monitor } from 'lucide-react';
import { ProctoringState } from '@/hooks/useWebcamProctoring';

interface WebcamMonitorProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  state: ProctoringState;
  compact?: boolean;
}

const WebcamMonitor = ({ videoRef, canvasRef, state, compact = false }: WebcamMonitorProps) => {
  if (compact) {
    return (
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-32 h-24 rounded-lg object-cover bg-black"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Status indicators */}
        <div className="absolute bottom-1 left-1 right-1 flex gap-1">
          {state.cameraEnabled ? (
            <Badge variant="default" className="text-xs py-0 px-1 bg-green-500">
              <Camera className="h-3 w-3" />
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-xs py-0 px-1">
              <CameraOff className="h-3 w-3" />
            </Badge>
          )}
          
          {!state.faceDetected && state.cameraEnabled && (
            <Badge variant="destructive" className="text-xs py-0 px-1">
              <EyeOff className="h-3 w-3" />
            </Badge>
          )}
          
          {!state.tabFocused && (
            <Badge variant="destructive" className="text-xs py-0 px-1">
              <Monitor className="h-3 w-3" />
            </Badge>
          )}
        </div>
        
        {state.violations > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute top-1 right-1 text-xs py-0 px-1"
          >
            {state.violations}/5
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full aspect-video object-cover bg-black"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Overlay when camera is off */}
          {!state.cameraEnabled && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <CameraOff className="h-12 w-12 mx-auto mb-2" />
                <p>Camera not enabled</p>
              </div>
            </div>
          )}
          
          {/* Warning overlay for no face */}
          {state.cameraEnabled && !state.faceDetected && (
            <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
              <div className="text-center text-destructive-foreground bg-destructive/80 p-4 rounded-lg">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <p className="font-semibold">Face not detected!</p>
                <p className="text-sm">Please position your face in the camera</p>
              </div>
            </div>
          )}
          
          {/* Warning overlay for tab switch */}
          {!state.tabFocused && (
            <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
              <div className="text-center text-destructive-foreground bg-destructive/80 p-4 rounded-lg">
                <Monitor className="h-8 w-8 mx-auto mb-2" />
                <p className="font-semibold">Tab switch detected!</p>
                <p className="text-sm">Please stay on this tab</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Status bar */}
        <div className="p-3 bg-card border-t flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {state.cameraEnabled ? (
                <Camera className="h-4 w-4 text-green-500" />
              ) : (
                <CameraOff className="h-4 w-4 text-destructive" />
              )}
              <span className="text-xs">
                {state.cameraEnabled ? 'Camera On' : 'Camera Off'}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              {state.faceDetected ? (
                <Eye className="h-4 w-4 text-green-500" />
              ) : (
                <EyeOff className="h-4 w-4 text-destructive" />
              )}
              <span className="text-xs">
                {state.faceDetected ? 'Face Detected' : 'No Face'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Violations:</span>
            <Badge 
              variant={state.violations > 3 ? 'destructive' : state.violations > 0 ? 'secondary' : 'default'}
            >
              {state.violations}/5
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebcamMonitor;
