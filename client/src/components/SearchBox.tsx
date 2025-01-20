import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import InputBox, { type InputBoxProps } from "./InputBox";
import SearchIcon from "../assets/icons/Search.svg";

interface SearchBoxProps extends InputBoxProps {
  showSearchIcon?: boolean;
  onSubmit?: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  backgroundColor,
  className = "",
  showSearchIcon = true,
  onSubmit,
  ...props
}) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  const backgroundColorTheme = backgroundColor || colorTheme.primary;

  return (
    <div
      className={"search-box w-full " + className}
      style={{ backgroundColor: `${backgroundColorTheme}bb` }}
      onFocus={(e) =>
        (e.currentTarget.style.backgroundColor = backgroundColorTheme + "cf")
      }
      onBlur={(e) =>
        (e.currentTarget.style.backgroundColor = `${backgroundColorTheme}bb`)
      }
    >
      <InputBox
        type="search"
        id="searchBox"
        placeholder="Search"
        className="!bg-transparent !m-0"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit?.();
          }
        }}
        {...props}
      />

      {showSearchIcon ? (
        <button
          className="p-2 rounded-lg"
          style={{ backgroundColor: backgroundColorTheme }}
          onClick={() => onSubmit?.()}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              colorTheme.selection + "55")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = backgroundColorTheme)
          }
        >
          <img src={SearchIcon} alt="Search" />
        </button>
      ) : null}
    </div>
  );
};

export default SearchBox;
