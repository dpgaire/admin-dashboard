import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Play, Pause, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

const PomodoroTimer = () => {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const [settings, setSettings] = useState({
    work: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
  });

  const audioRef = useRef(null);

  useEffect(() => {
    let interval = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      if (audioRef.current) {
        audioRef.current.play();
      }
      handleSessionEnd();
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const handleSessionEnd = () => {
    setIsActive(false);
    if (sessionType === 'work') {
      setPomodoroCount(pomodoroCount + 1);
      if (pomodoroCount > 0 && (pomodoroCount + 1) % settings.longBreakInterval === 0) {
        setSessionType('longBreak');
        setTime(settings.longBreak * 60);
      } else {
        setSessionType('shortBreak');
        setTime(settings.shortBreak * 60);
      }
    } else {
      setSessionType('work');
      setTime(settings.work * 60);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSessionType('work');
    setTime(settings.work * 60);
    setPomodoroCount(0);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  const applySettings = () => {
    resetTimer();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pomodoro Timer</h1>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl capitalize">{sessionType.replace('B', ' B')} Session</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="text-8xl font-bold text-gray-900 dark:text-white">
            {formatTime(time)}
          </div>
          <div className="flex gap-4">
            <Button onClick={toggleTimer} size="lg">
              {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
              {isActive ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={resetTimer} variant="outline" size="lg">
              <RefreshCw className="mr-2" />
              Reset
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg">
                  <Settings />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="work">Work (minutes)</Label>
                    <Input id="work" name="work" type="number" value={settings.work} onChange={handleSettingsChange} />
                  </div>
                  <div>
                    <Label htmlFor="shortBreak">Short Break (minutes)</Label>
                    <Input id="shortBreak" name="shortBreak" type="number" value={settings.shortBreak} onChange={handleSettingsChange} />
                  </div>
                  <div>
                    <Label htmlFor="longBreak">Long Break (minutes)</Label>
                    <Input id="longBreak" name="longBreak" type="number" value={settings.longBreak} onChange={handleSettingsChange} />
                  </div>
                  <div>
                    <Label htmlFor="longBreakInterval">Long Break Interval (pomodoros)</Label>
                    <Input id="longBreakInterval" name="longBreakInterval" type="number" value={settings.longBreakInterval} onChange={handleSettingsChange} />
                  </div>
                  <Button onClick={applySettings}>Apply</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Pomodoros completed: {pomodoroCount}
          </div>
        </CardContent>
      </Card>
      <audio ref={audioRef} src="https://dpgaire.github.io/image-server/sounds/beep.wav" />
    </div>
  );
};

export default PomodoroTimer;
