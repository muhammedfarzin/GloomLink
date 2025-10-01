import { useState, useEffect, useCallback } from "react";

export enum ScreenSizeEnum {
  xs = 0,
  sm = 1,
  md = 2,
  lg = 3,
  xl = 4,
  "2xl" = 5,
}

export interface UseScreenSizeOutput {
  screenSize: ScreenSizeEnum;
  screenGreaterThan: (size: ScreenSizeEnum) => boolean;
  screenLessThan: (size: ScreenSizeEnum) => boolean;
  screenEqualTo: (size: ScreenSizeEnum) => boolean;
}

function getScreenSizeEnum(): ScreenSizeEnum {
  const width =
    typeof window !== "undefined" ? window.innerWidth : ScreenSizeEnum.md;

  if (width < 640) return ScreenSizeEnum.xs;
  if (width < 768) return ScreenSizeEnum.sm;
  if (width < 1024) return ScreenSizeEnum.md;
  if (width < 1280) return ScreenSizeEnum.lg;
  if (width < 1536) return ScreenSizeEnum.xl;
  return ScreenSizeEnum["2xl"];
}

export const useScreenSize = (): UseScreenSizeOutput => {
  const [screenSize, setScreenSize] = useState<ScreenSizeEnum>(
    getScreenSizeEnum()
  );

  useEffect(() => {
    const handleResize = () => setScreenSize(getScreenSizeEnum());

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const screenGreaterThan = useCallback(
    (size: ScreenSizeEnum) => screenSize > size,
    [screenSize]
  );
  const screenLessThan = useCallback(
    (size: ScreenSizeEnum) => screenSize < size,
    [screenSize]
  );
  const screenEqualTo = useCallback(
    (size: ScreenSizeEnum) => screenSize === size,
    [screenSize]
  );

  return { screenSize, screenGreaterThan, screenLessThan, screenEqualTo };
};
