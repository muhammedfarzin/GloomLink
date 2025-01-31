import { ColorTheme, setColorTheme } from "@/redux/reducers/theme";
import { useDispatch } from "react-redux";

const ColorThemeList: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-wrap justify-center items-center bg-background text-foreground h-full">
      {Object.keys(ColorTheme).map((themeTitle) => {
        return (
          <div
            data-theme={themeTitle}
            className="flex justify-center items-center bg-primary text-foreground hover:opacity-75 font-bold capitalize rounded-full h-12 w-5/12 m-2 cursor-pointer"
            onClick={() =>
              dispatch(
                setColorTheme(ColorTheme[themeTitle as keyof typeof ColorTheme])
              )
            }
          >
            {themeTitle}
          </div>
        );
      })}
    </div>
  );
};

export default ColorThemeList;
