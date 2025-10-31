import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RefreshCw, Settings, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";

const quotes = {
  work: [
    "Focus on progress, not perfection.",
    "Deep work leads to deep satisfaction.",
    "You’re doing great — stay consistent.",
  ],
  shortBreak: [
    "Take a breath. You’ve earned it.",
    "A short rest fuels long focus.",
    "Step away and reset your mind.",
  ],
  longBreak: [
    "You’ve worked hard — relax fully.",
    "Let your brain recharge completely.",
    "Balance is productivity’s secret.",
  ],
};

const PomodoroTimer = () => {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState("work");
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [quote, setQuote] = useState("");
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const audioRef = useRef(null);

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("pomodoro-settings");
    return (
      JSON.parse(saved) || {
        work: 25,
        shortBreak: 5,
        longBreak: 15,
        longBreakInterval: 4,
      }
    );
  });

  useEffect(() => {
    localStorage.setItem("pomodoro-settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    setQuote(randomQuote(sessionType));
  }, [sessionType]);

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => setTime((t) => t - 1), 1000);
    } else if (time === 0) {
      handleSessionEnd();
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((perm) => {
        setPermissionGranted(perm === "granted");
      });
    }
  }, []);

  const randomQuote = (type) => {
    const list = quotes[type];
    return list[Math.floor(Math.random() * list.length)];
  };

  const handleSessionEnd = () => {
    setIsActive(false);
    if (audioRef.current) audioRef.current.play();
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

    if (permissionGranted && document.hidden) {
      new Notification("Pomodoro Session Complete!", {
        body:
          sessionType === "work"
            ? "Time for a break!"
            : "Break’s over, back to work!",
        icon: "/favicon.ico",
      });
    }

    if (sessionType === "work") {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      if (newCount % settings.longBreakInterval === 0) {
        setSessionType("longBreak");
        setTime(settings.longBreak * 60);
      } else {
        setSessionType("shortBreak");
        setTime(settings.shortBreak * 60);
      }
    } else {
      setSessionType("work");
      setTime(settings.work * 60);
    }
  };

  const toggleTimer = () => setIsActive((prev) => !prev);
  const resetTimer = () => {
    setIsActive(false);
    setSessionType("work");
    setTime(settings.work * 60);
    setPomodoroCount(0);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const applySettings = () => {
    resetTimer();
    setShowSettings(false);
  };

  const totalSeconds =
    sessionType === "work"
      ? settings.work * 60
      : sessionType === "shortBreak"
      ? settings.shortBreak * 60
      : settings.longBreak * 60;

  const progress = (1 - time / totalSeconds) * 816;

  return (
    <div
      className={clsx(
        "min-h-[calc(100vh-120px)] flex flex-col items-center justify-center transition-colors duration-300",
        "bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100",
        "px-4 py-8 sm:px-6 md:px-8"
      )}
    >
      <div className="w-full max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
        <Card className="border dark:border-neutral-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-semibold capitalize">
              {sessionType === "work"
                ? "Focus Time"
                : sessionType === "shortBreak"
                ? "Short Break"
                : "Long Break"}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-6 sm:gap-8 py-6 sm:py-8">
            {/* Responsive Circular Progress */}
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              <svg
                viewBox="0 0 300 300"
                className="w-full h-full transform -rotate-90"
              >
                {/* Background Circle */}
                <circle
                  cx="150"
                  cy="150"
                  r="130"
                  stroke="currentColor"
                  strokeOpacity="0.2"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-300 dark:text-gray-700"
                />

                {/* Progress Circle */}
                <motion.circle
                  cx="150"
                  cy="150"
                  r="130"
                  strokeLinecap="round"
                  strokeWidth="12"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="816"
                  strokeDashoffset={816 - progress}
                  animate={{ strokeDashoffset: 816 - progress }}
                  transition={{ ease: "easeOut", duration: 0.5 }}
                  className="text-blue-600 dark:text-blue-400 drop-shadow-md"
                />
              </svg>

              {/* Timer Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                <span className="text-5xl sm:text-7xl font-extrabold leading-tight">
                  {formatTime(time)}
                </span>
                <span className="text-sm sm:text-base opacity-70 mt-2">
                  Pomodoros: {pomodoroCount}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Button onClick={toggleTimer} size="lg" className="min-w-32">
                {isActive ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" /> Start
                  </>
                )}
              </Button>

              <Button onClick={resetTimer} variant="outline" size="lg" className="min-w-32">
                <RefreshCw className="mr-2 h-5 w-5" /> Reset
              </Button>

              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="min-w-32">
                    <Settings className="mr-2 h-5 w-5" /> Settings
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-sm sm:max-w-md bg-white dark:bg-neutral-900">
                  <DialogHeader>
                    <DialogTitle>Pomodoro Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-2">
                    {[
                      "work",
                      "shortBreak",
                      "longBreak",
                      "longBreakInterval",
                    ].map((key) => (
                      <div key={key}>
                        <Label htmlFor={key} className="font-semibold text-sm">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (s) => s.toUpperCase())}{" "}
                          {key !== "longBreakInterval" && "(minutes)"}
                        </Label>
                        <Input
                          id={key}
                          name={key}
                          type="number"
                          value={settings[key]}
                          onChange={handleSettingsChange}
                          className="mt-1"
                        />
                      </div>
                    ))}
                    <Button onClick={applySettings} className="w-full">
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Save & Close
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Motivational Quote */}
            <AnimatePresence mode="wait">
              <motion.p
                key={quote}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="italic text-base sm:text-lg mt-4 text-gray-600 dark:text-gray-400 max-w-md mx-auto px-4"
              >
                “{quote}”
              </motion.p>
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-4">
          Notifications {permissionGranted ? "enabled" : "off"} | Focus App
        </div>
      </div>

      <audio
        ref={audioRef}
        src="https://dpgaire.github.io/image-server/sounds/beep.wav"
      />
    </div>
  );
};

export default PomodoroTimer;