import { setColorTheme } from "@/redux/reducers/theme";
import { colorThemes } from "@/redux/reducers/themes/colorThemes";
import { useDispatch } from "react-redux";

const ColorThemeList: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-wrap justify-center items-center h-full">
      {Object.entries(colorThemes).map(([title, colorTheme]) => {
        return (
          <div
            className="flex justify-center items-center font-bold capitalize rounded-full h-12 w-5/12 m-2 cursor-pointer"
            onClick={() => dispatch(setColorTheme(title))}
            style={{
              backgroundColor: colorTheme.primary,
              color: colorTheme.text,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                colorTheme.primary + "bb")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = colorTheme.primary)
            }
          >
            {title}
          </div>
        );
      })}
    </div>
  );
};

export default ColorThemeList;
