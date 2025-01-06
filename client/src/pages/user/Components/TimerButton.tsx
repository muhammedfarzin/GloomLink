import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";

interface TimerButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  color?: string;
  disableDuration?: number;
  isDisabledByDefault?: boolean;
  showTimer?: boolean;
  className?: string;
}

const TimerButton: React.FC<TimerButtonProps> = ({
  children,
  onClick,
  color,
  disableDuration = 300,
  isDisabledByDefault = true,
  showTimer = true,
  className,
}) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] =
    useState<number>(disableDuration);

  const textColor = color || colorTheme.text;

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
  }

  return (
    <div
      className={className || "cursor-pointer"}
      onClick={!isDisabled ? handleOnClick : undefined}
      onMouseEnter={(e) =>
        !isDisabled ? (e.currentTarget.style.color = textColor + "cc") : null
      }
      onMouseLeave={(e) =>
        !isDisabled ? (e.currentTarget.style.color = textColor) : null
      }
      style={{ color: textColor + (isDisabled ? "55" : "") }}
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
