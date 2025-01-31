import React, { useEffect, useState } from "react";

interface TimerButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  disableDuration?: number;
  isDisabledByDefault?: boolean;
  showTimer?: boolean;
  className?: string;
}

const TimerButton: React.FC<TimerButtonProps> = ({
  children,
  onClick,
  disableDuration = 300,
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
      className={`cursor-pointer text-foreground ${
        isDisabled ? "text-opacity-35 cursor-not-allowed" : ""
      } ${className}`}
      onClick={!isDisabled ? handleOnClick : undefined}
    >
      {children}
      {showTimer && isDisabled ? (
        <span>
          ({`${Math.floor(remainingSeconds / 60)}:${remainingSeconds % 60}`})
        </span>
      ) : null}
    </div>
  );
};

export default TimerButton;
