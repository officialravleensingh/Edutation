import { useState, useEffect } from "react";
import { Bell, Moon, Sun, Settings, X, Play, Pause, RotateCcw, Check } from "lucide-react";
import { NavBar } from "@/components/layout/NavBar";

const PomodoroTimer = () => {
  const [activeMode, setActiveMode] = useState("pomodoro");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [timerSettings, setTimerSettings] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: true,
    autoStartPomodoros: false,
    longBreakInterval: 4
  });

  useEffect(() => {
    let time;
    switch (activeMode) {
      case "pomodoro":
        time = timerSettings.pomodoro * 60;
        break;
      case "shortBreak":
        time = timerSettings.shortBreak * 60;
        break;
      case "longBreak":
        time = timerSettings.longBreak * 60;
        break;
      default:
        time = timerSettings.pomodoro * 60;
    }
    setTimeLeft(time);
    setIsRunning(false);
  }, [activeMode, timerSettings]);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      new Audio('/notification.mp3').play().catch(() => {
        console.log("Notification sound blocked");
      });
      
      if (activeMode === "pomodoro") {
        setCompletedPomodoros(prev => prev + 1);
        const shouldTakeLongBreak = completedPomodoros > 0 && 
          (completedPomodoros + 1) % timerSettings.longBreakInterval === 0;
        
        if (shouldTakeLongBreak) {
          setActiveMode("longBreak");
          showToast("Time for a long break!");
          if (timerSettings.autoStartBreaks) setIsRunning(true);
          else setIsRunning(false);
        } else {
          setActiveMode("shortBreak");
          showToast("Time for a short break!");
          if (timerSettings.autoStartBreaks) setIsRunning(true);
          else setIsRunning(false);
        }
      } else {
        setActiveMode("pomodoro");
        showToast("Break complete! Ready for the next focus session?");
        if (timerSettings.autoStartPomodoros) setIsRunning(true);
        else setIsRunning(false);
      }
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, activeMode, completedPomodoros, timerSettings]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateProgress = () => {
    let totalTime;
    switch (activeMode) {
      case "pomodoro":
        totalTime = timerSettings.pomodoro * 60;
        break;
      case "shortBreak":
        totalTime = timerSettings.shortBreak * 60;
        break;
      case "longBreak":
        totalTime = timerSettings.longBreak * 60;
        break;
      default:
        totalTime = timerSettings.pomodoro * 60;
    }
    
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: "" });
    }, 3000);
  };

  const updateSettings = (newSettings) => {
    setTimerSettings(newSettings);
    setIsSettingsOpen(false);
    showToast("Settings updated successfully");
  };

  const resetTimer = () => {
    let time;
    switch (activeMode) {
      case "pomodoro":
        time = timerSettings.pomodoro * 60;
        break;
      case "shortBreak":
        time = timerSettings.shortBreak * 60;
        break;
      case "longBreak":
        time = timerSettings.longBreak * 60;
        break;
      default:
        time = timerSettings.pomodoro * 60;
    }
    setTimeLeft(time);
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1 flex mb-8 shadow-md">
        <button
          onClick={() => setActiveMode("pomodoro")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            activeMode === "pomodoro"
              ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => setActiveMode("shortBreak")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            activeMode === "shortBreak"
              ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-green-400 shadow-sm"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Short Break
        </button>
        <button
          onClick={() => setActiveMode("longBreak")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            activeMode === "longBreak"
              ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-purple-400 shadow-sm"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Long Break
        </button>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-gray-200 dark:text-gray-700 stroke-current"
            strokeWidth="4"
            cx="50"
            cy="50"
            r="46"
            fill="transparent"
          />
          <circle
            className={`stroke-current ${
              activeMode === "pomodoro"
                ? "text-blue-500"
                : activeMode === "shortBreak"
                ? "text-green-500"
                : "text-purple-500"
            }`}
            strokeWidth="4"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="46"
            fill="transparent"
            strokeDasharray="289.02"
            strokeDashoffset={289.02 - (289.02 * calculateProgress()) / 100}
          />
        </svg>
        
        <div className="text-center z-10">
          <div className="text-5xl font-bold">{formatTime(timeLeft)}</div>
          <div className="mt-2 text-sm font-medium uppercase text-gray-500 dark:text-gray-400">
            {activeMode === "pomodoro" ? "Focus" : activeMode === "shortBreak" ? "Short Break" : "Long Break"}
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all ${
            isRunning
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={resetTimer}
          className="w-14 h-14 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center shadow-md transition-colors"
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-14 h-14 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center shadow-md transition-colors"
        >
          <Settings size={20} />
        </button>
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <SettingsModal 
            settings={timerSettings}
            onClose={() => setIsSettingsOpen(false)}
            onSave={updateSettings}
          />
        </div>
      )}

      {toast.visible && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg max-w-xs z-50 flex items-center justify-between">
          <span>{toast.message}</span>
          <button onClick={() => setToast({ visible: false, message: "" })} className="ml-2">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

const SettingsModal = ({ settings, onClose, onSave }) => {
  const [tempSettings, setTempSettings] = useState({ ...settings });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTempSettings({
      ...tempSettings,
      [name]: type === "checkbox" ? checked : parseInt(value, 10)
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(tempSettings);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Timer Settings</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSave}>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Focus Length (minutes)</label>
            <input
              type="number"
              name="pomodoro"
              value={tempSettings.pomodoro}
              onChange={handleChange}
              min="1"
              max="60"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Short Break Length (minutes)</label>
            <input
              type="number"
              name="shortBreak"
              value={tempSettings.shortBreak}
              onChange={handleChange}
              min="1"
              max="30"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Long Break Length (minutes)</label>
            <input
              type="number"
              name="longBreak"
              value={tempSettings.longBreak}
              onChange={handleChange}
              min="1"
              max="60"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Long Break Interval</label>
            <input
              type="number"
              name="longBreakInterval"
              value={tempSettings.longBreakInterval}
              onChange={handleChange}
              min="1"
              max="10"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoStartBreaks"
              name="autoStartBreaks"
              checked={tempSettings.autoStartBreaks}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="autoStartBreaks" className="ml-2 text-sm">
              Auto-start breaks
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoStartPomodoros"
              name="autoStartPomodoros"
              checked={tempSettings.autoStartPomodoros}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="autoStartPomodoros" className="ml-2 text-sm">
              Auto-start focus sessions
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);
  
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <NavBar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      <main className="flex-1 py-12 container max-w-4xl mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4">
            FocusFlow
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Enhance your productivity with the proven Pomodoro technique. 
            Focus intensely, take strategic breaks, and achieve more.
          </p>
        </div>
        
        <PomodoroTimer />
      </main>
      
      <footer className="py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="container text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Design with focus in mind. Use FocusFlow to boost your productivity.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;