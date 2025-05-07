import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Settings, 
  Bell, 
  Volume2, 
  VolumeX 
} from "lucide-react";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

// Professional timer circle component
const TimerCircle = ({ progress, currentMode, children }) => {
  // Define color schemes for different modes
  const colorScheme = {
    pomodoro: {
      stroke: "#ef4444", // Red for focus
      shadow: "0 0 15px rgba(239, 68, 68, 0.4)"
    },
    shortBreak: {
      stroke: "#10b981", // Green for short break
      shadow: "0 0 15px rgba(16, 185, 129, 0.4)"
    },
    longBreak: {
      stroke: "#3b82f6", // Blue for long break
      shadow: "0 0 15px rgba(59, 130, 246, 0.4)"
    }
  };

  return (
    <div className="relative h-64 w-64 flex items-center justify-center">
      <svg className="absolute h-full w-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        {/* Progress circle with animation */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={colorScheme[currentMode].stroke}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 45}`}
          strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
          transform="rotate(-90 50 50)"
          style={{
            transition: "stroke-dashoffset 0.5s ease-in-out",
            filter: `drop-shadow(${colorScheme[currentMode].shadow})`
          }}
        />
      </svg>
      <div className="z-10">{children}</div>
    </div>
  );
};

export default function PomodoroTimer() {
  const [timerSettings, setTimerSettings] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15
  });
  
  const [currentMode, setCurrentMode] = useState("pomodoro");
  const [timeRemaining, setTimeRemaining] = useState(timerSettings.pomodoro * 60);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  
  // Refs for audio
  const alarmSoundRef = useRef(null);
  const tickSoundRef = useRef(null);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  // Calculate total time based on current mode
  const totalTime = timerSettings[currentMode] * 60;
  
  // Calculate progress percentage
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  // Create audio elements when component mounts
  useEffect(() => {
    // Create audio elements
    alarmSoundRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    tickSoundRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/1517/1517-preview.mp3");
    
    // Adjust volumes
    alarmSoundRef.current.volume = 0.7;
    tickSoundRef.current.volume = 0.2;
    
    // Cleanup
    return () => {
      if (alarmSoundRef.current) {
        alarmSoundRef.current.pause();
        alarmSoundRef.current = null;
      }
      if (tickSoundRef.current) {
        tickSoundRef.current.pause();
        tickSoundRef.current = null;
      }
    };
  }, []);
  
  // Request notification permission on component mount
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);
  
  // Function to play alarm sound
  const playAlarm = () => {
    if (soundEnabled && alarmSoundRef.current) {
      alarmSoundRef.current.currentTime = 0;
      alarmSoundRef.current.play();
    }
  };
  
  // Function to play tick sound
  const playTick = () => {
    if (soundEnabled && tickSoundRef.current && timeRemaining <= 3 && timeRemaining > 0) {
      tickSoundRef.current.currentTime = 0;
      tickSoundRef.current.play();
    }
  };

  // Show browser notification
  const showBrowserNotification = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "/favicon.ico" // Replace with your favicon path
      });
    }
  };
  
  // Timer logic
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        playTick();
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeRemaining === 0) {
      setIsActive(false);
      playAlarm();
      
      // Show alert and notification
      setShowAlert(true);
      setShowNotification(true);
      
      // Update completed count if it was a focus session
      if (currentMode === "pomodoro") {
        setCompletedCount(prev => prev + 1);
      }
      
      // Show browser notification
      const nextMode = currentMode === "pomodoro" ? "shortBreak" : 
                      (currentMode === "shortBreak" ? "pomodoro" : "pomodoro");
      const notifTitle = `${currentMode === "pomodoro" ? "Focus" : "Break"} session completed!`;
      const notifBody = `Time for ${nextMode === "pomodoro" ? "focus" : "a break"}`;
      showBrowserNotification(notifTitle, notifBody);
      
      // Auto transition after 5 seconds
      setTimeout(() => {
        setShowAlert(false);
        setShowNotification(false);
        
        // Auto switch to the next mode
        const nextMode = currentMode === "pomodoro" ? 
          (completedCount % 4 === 3 ? "longBreak" : "shortBreak") : "pomodoro";
        handleModeChange(nextMode);
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, currentMode, completedCount]);
  
  // Handle mode change
  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    setTimeRemaining(timerSettings[mode] * 60);
    setIsActive(false);
    setShowAlert(false);
  };
  
  // Handle timer controls
  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeRemaining(timerSettings[currentMode] * 60);
    setShowAlert(false);
  };
  
  // Handle settings change
  const updateTimerSettings = (mode, value) => {
    setTimerSettings(prev => ({
      ...prev,
      [mode]: value[0]
    }));
    
    if (mode === currentMode) {
      setTimeRemaining(value[0] * 60);
    }
  };

  // Function to get the title based on mode
  const getModeTitle = (mode) => {
    switch(mode) {
      case "pomodoro": return "Focus Time";
      case "shortBreak": return "Short Break";
      case "longBreak": return "Long Break";
      default: return "Timer";
    }
  };
  
  // Set document title with timer
  useEffect(() => {
    document.title = `${formatTime(timeRemaining)} - ${getModeTitle(currentMode)}`;
    return () => {
      document.title = "Pomodoro Timer";
    };
  }, [timeRemaining, currentMode]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-md mx-auto transition-all duration-300">
      {/* Session counter */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Sessions completed: {completedCount}
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          <span className="sr-only">{soundEnabled ? "Mute" : "Unmute"}</span>
        </Button>
      </div>
      
      {/* Mode tabs */}
      <Tabs 
        value={currentMode}
        onValueChange={handleModeChange}
        className="mb-8"
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="pomodoro" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">Focus</TabsTrigger>
          <TabsTrigger value="shortBreak" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">Short Break</TabsTrigger>
          <TabsTrigger value="longBreak" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Long Break</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Timer display */}
      <div className="flex justify-center mb-8">
        <TimerCircle progress={progress} currentMode={currentMode}>
          <div className="flex flex-col items-center">
            <span className="text-6xl font-light tracking-tight">{formatTime(timeRemaining)}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {currentMode === "pomodoro" ? "Stay focused" : "Take a break"}
            </span>
          </div>
        </TimerCircle>
      </div>
      
      {/* Timer controls */}
      <div className="flex justify-center gap-4 mb-6">
        <Button 
          size="lg" 
          onClick={toggleTimer}
          className={`px-6 py-2 rounded-full shadow-sm hover:shadow ${
            currentMode === "pomodoro" ? "bg-red-500 hover:bg-red-600" :
            currentMode === "shortBreak" ? "bg-green-500 hover:bg-green-600" :
            "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
          {isActive ? "Pause" : "Start"}
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={resetTimer}
          className="rounded-full"
        >
          <RefreshCw className="h-5 w-5" />
          <span className="sr-only">Reset Timer</span>
        </Button>
      </div>
      
      {/* Settings button */}
      <div className="flex justify-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowSettings(true)}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center"
        >
          <Settings className="h-4 w-4 mr-1" />
          Settings
        </Button>
      </div>
      
      {/* Alert notification when timer completes */}
      {showNotification && (
        <Alert className="mt-6 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 animate-in fade-in slide-in-from-top-5 duration-300">
          <Bell className="h-4 w-4" />
          <AlertTitle>Time's up!</AlertTitle>
          <AlertDescription>
            {currentMode === "pomodoro" 
              ? "Great work! Take a break now." 
              : "Break time is over. Ready to focus?"}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Settings dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Timer Settings</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Focus Duration</label>
                <span className="text-sm text-gray-500">{timerSettings.pomodoro} min</span>
              </div>
              <Slider
                min={1}
                max={60}
                step={1}
                value={[timerSettings.pomodoro]}
                onValueChange={(value) => updateTimerSettings("pomodoro", value)}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Short Break</label>
                <span className="text-sm text-gray-500">{timerSettings.shortBreak} min</span>
              </div>
              <Slider
                min={1}
                max={30}
                step={1}
                value={[timerSettings.shortBreak]}
                onValueChange={(value) => updateTimerSettings("shortBreak", value)}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Long Break</label>
                <span className="text-sm text-gray-500">{timerSettings.longBreak} min</span>
              </div>
              <Slider
                min={5}
                max={60}
                step={5}
                value={[timerSettings.longBreak]}
                onValueChange={(value) => updateTimerSettings("longBreak", value)}
                className="w-full"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowSettings(false)}>
              Apply Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}