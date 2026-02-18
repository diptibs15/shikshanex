import { useState, useEffect, useRef, useCallback } from 'react';

export interface ProctoringState {
  cameraEnabled: boolean;
  faceDetected: boolean;
  multipleFaces: boolean;
  tabFocused: boolean;
  violations: number;
  isDisqualified: boolean;
  error: string | null;
}

interface UseWebcamProctoringOptions {
  maxViolations?: number;
  checkInterval?: number;
  onViolation?: (type: string) => void;
  onDisqualify?: () => void;
}

export const useWebcamProctoring = (options: UseWebcamProctoringOptions = {}) => {
  const { 
    maxViolations = 5, 
    checkInterval = 2000,
    onViolation,
    onDisqualify 
  } = options;
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [state, setState] = useState<ProctoringState>({
    cameraEnabled: false,
    faceDetected: true, // Default to true until we can verify
    multipleFaces: false,
    tabFocused: true,
    violations: 0,
    isDisqualified: false,
    error: null,
  });

  const addViolation = useCallback((type: string) => {
    setState(prev => {
      const newViolations = prev.violations + 1;
      const isDisqualified = newViolations >= maxViolations;
      
      if (onViolation) onViolation(type);
      if (isDisqualified && onDisqualify) onDisqualify();
      
      return {
        ...prev,
        violations: newViolations,
        isDisqualified,
      };
    });
  }, [maxViolations, onViolation, onDisqualify]);

  // Tab focus detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isHidden = document.hidden;
      setState(prev => ({ ...prev, tabFocused: !isHidden }));
      if (isHidden && state.cameraEnabled && !state.isDisqualified) {
        addViolation('tab_switch');
      }
    };

    const handleBlur = () => {
      setState(prev => ({ ...prev, tabFocused: false }));
      if (state.cameraEnabled && !state.isDisqualified) {
        addViolation('window_blur');
      }
    };

    const handleFocus = () => {
      setState(prev => ({ ...prev, tabFocused: true }));
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [state.cameraEnabled, state.isDisqualified, addViolation]);

  // Simple face detection using canvas brightness analysis
  const detectFace = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx || video.videoWidth === 0) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    // Get image data from center region (where face should be)
    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;
    const regionWidth = canvas.width / 2;
    const regionHeight = canvas.height / 2;
    
    try {
      const imageData = ctx.getImageData(centerX, centerY, regionWidth, regionHeight);
      const data = imageData.data;
      
      // Calculate average brightness and color variance
      let totalBrightness = 0;
      let skinTonePixels = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const brightness = (r + g + b) / 3;
        totalBrightness += brightness;
        
        // Simple skin tone detection (works for various skin tones)
        if (r > 60 && g > 40 && b > 20 && r > g && r > b && 
            Math.abs(r - g) > 15 && r - b > 15) {
          skinTonePixels++;
        }
      }
      
      const avgBrightness = totalBrightness / (data.length / 4);
      const skinToneRatio = skinTonePixels / (data.length / 4);
      
      // Face detected if there's enough skin-tone pixels and reasonable brightness
      const faceDetected = skinToneRatio > 0.05 && avgBrightness > 30 && avgBrightness < 240;
      
      setState(prev => {
        if (!faceDetected && prev.faceDetected && !prev.isDisqualified) {
          // Face was there but now gone
          addViolation('no_face');
        }
        return { ...prev, faceDetected };
      });
    } catch (error) {
      console.error('Face detection error:', error);
    }
  }, [addViolation]);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: true 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setState(prev => ({ ...prev, cameraEnabled: true, error: null }));
      
      // Start face detection interval
      intervalRef.current = setInterval(detectFace, checkInterval);
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Camera access denied';
      setState(prev => ({ ...prev, error: errorMessage, cameraEnabled: false }));
      return false;
    }
  }, [detectFace, checkInterval]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setState(prev => ({ ...prev, cameraEnabled: false }));
  }, []);

  // Get current video frame as base64
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    state,
    startCamera,
    stopCamera,
    captureFrame,
    addViolation,
  };
};
