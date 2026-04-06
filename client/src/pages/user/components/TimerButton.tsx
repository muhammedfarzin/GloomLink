import React, { useEffect, useState } from "react";

interface TimerButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  disableDuration?: number;
  isDisabledByDefault?: boolean;
  showTimer?: boolean;
  className?: string;
}

const formatTime = (totalSeconds: number) => {
  let result = "";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (totalSeconds >= 3600) {
    result += `${hours.toString().padStart(2, "0")}:`;
  }
  if (totalSeconds >= 60) {
    result += `${minutes.toString().padStart(2, "0")}:`;
  }

  result += seconds.toString().padStart(2, "0");
  return result;
};

const TimerButton: React.FC<TimerButtonProps> = ({
  children,
  onClick,
  disableDuration = 60,
  isDisabledByDefault = true,
  showTimer = true,
  className,
}) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] =
    useState<number>(disableDuration);

  const startTimer = () => {
    setIsDisabled(true);
    let remainingSeconds = disableDuration;
    setRemainingSeconds(disableDuration);
    const timerId = setInterval(() => {
      setRemainingSeconds(--remainingSeconds);
      if (remainingSeconds <= 0) {
        clearInterval(timerId);
        setIsDisabled(false);
      }
    }, 1000);
  };

  useEffect(() => {
    if (isDisabledByDefault && !isDisabled) {
      startTimer();
    }
  }, []);

  const handleOnClick: React.MouseEventHandler = (e) => {
    e.preventDefault();
    onClick?.();
    startTimer();
  };

  return (
    <div
      className={`${
        isDisabled
          ? "text-foreground/35 cursor-not-allowed"
          : "text-foreground cursor-pointer"
      } ${className}`}
      onClick={!isDisabled ? handleOnClick : undefined}
    >
      {children}{" "}
      {showTimer && isDisabled ? (
        <span>({formatTime(remainingSeconds)})</span>
      ) : null}
    </div>
  );
};

export default TimerButton;
