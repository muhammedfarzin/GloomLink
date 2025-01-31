import InputBox, { type InputBoxProps } from "./InputBox";
import SearchIcon from "../assets/icons/Search.svg";

interface SearchBoxProps extends InputBoxProps {
  showSearchIcon?: boolean;
  onSubmit?: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  className = "",
  showSearchIcon = true,
  onSubmit,
  ...props
}) => {
  return (
    <div className={"search-box w-full bg-primary " + className}>
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
          className="p-2 rounded-lg bg-primary"
          onClick={() => onSubmit?.()}
        >
          <img src={SearchIcon} alt="Search" />
        </button>
      ) : null}
    </div>
  );
};

export default SearchBox;
