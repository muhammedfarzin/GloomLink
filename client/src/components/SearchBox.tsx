import SearchIcon from "../assets/icons/Search.svg";

interface SearchBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
      <input
        id="searchBox"
        type="search"
        placeholder="Search"
        className="input-box !m-0"
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
