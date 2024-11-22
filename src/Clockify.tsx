import { useState, useEffect } from "react";

interface Timer {
  seconds: number;
  minutes: number;
  hours: number;
}

function Clockify(): JSX.Element {
  const [time, setTime] = useState<Timer>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [inputTime, setInputTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputTime(event.target.value);
  };

  useEffect(() => {
    let intervalId: number;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime: Timer) => {
          const newTime = { ...prevTime };
          newTime.seconds += 1;
          if (newTime.seconds >= 60) {
            newTime.minutes += 1;
            newTime.seconds = 0;
          }
          if (newTime.minutes >= 60) {
            newTime.hours += 1;
            newTime.minutes = 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleStart = (): void => {
    const now = new Date();
    setDate("Today");

    const timeString = now.toLocaleTimeString()
    setInputTime(timeString);
    setIsRunning(true);
  };

  const handleCustomTime = (): void => {
    if (!isRunning) {
      return;
    }
    const now = new Date();

    const [timePart, meridiem] = inputTime.split(" ");
    const [hours, minutes, seconds] = timePart.split(":").map(Number) as [
      number,
      number,
      number
    ];

    const inputDate = new Date();
    let adjustedHours = hours;

    if (meridiem?.toLowerCase() === "pm" && hours < 12) {
      adjustedHours += 12;
    } else if (meridiem?.toLowerCase() === "am" && hours === 12) {
      adjustedHours = 0;
    }

    inputDate.setHours(adjustedHours, minutes, seconds || 0);

    if (inputDate > now) {
      inputDate.setDate(inputDate.getDate() - 1);
      const yesterdayDate = new Date(now);
      yesterdayDate.setDate(now.getDate() - 1);
      setDate(formatDate(yesterdayDate));
    } else {
      const elapsedMs = now.getTime() - inputDate.getTime();
      const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));

      if (elapsedHours >= 24) {
        const yesterdayDate = new Date(now);
        yesterdayDate.setDate(now.getDate() - 1);
        setDate(formatDate(yesterdayDate));
      } else {
        setDate("Today");
      }
    }

    const elapsedMs = now.getTime() - inputDate.getTime();

    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    const elapsedHours = Math.floor(elapsedSeconds / 3600);
    const elapsedMinutes = Math.floor((elapsedSeconds % 3600) / 60);
    const remainingSeconds = elapsedSeconds % 60;

    setTime({
      hours: elapsedHours,
      minutes: elapsedMinutes,
      seconds: remainingSeconds,
    });

    setIsRunning(true);
  };

  const handleStop = (): void => {
    setIsRunning(false);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
    setInputTime("");
    setDate("");
  };

  return (
    <div className="w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex justify-center items-center gap-4">
          <label htmlFor="start" /> Start:
          <input
            value={inputTime}
            onChange={handleInputChange}
            className="w-24 bg-blue-100 border focus:border-blue-500 p-2"
          />
          <p>{date}</p>
          <button
            onClick={handleCustomTime}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium"
          >
            Set Time
          </button>
          {!isRunning ? (
            <div className="px-3 py-1 text-sm font-mono">00:00:00</div>
          ) : (
            <div className="px-3 py-1 text-sm font-mono">
              {time.hours > 9 ? time.hours : `0${time.hours}`}:
              {time.minutes > 9 ? time.minutes : `0${time.minutes}`}:
              {time.seconds > 9 ? time.seconds : `0${time.seconds}`}
            </div>
          )}
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium flex items-center gap-1"
            >
              START
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded text-sm font-medium flex items-center gap-1"
            >
              STOP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Clockify;
