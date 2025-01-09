import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import CloseIcon from "../../../assets/icons/Close.svg";
import { useState } from "react";

interface TagsInputProps {
  className?: string;
  backgroundColor?: `#${string}`;
  color?: `#${string}`;
  placeholder?: string;
  values?: string[];
  onChange?: (values: string[]) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({
  className = "",
  backgroundColor,
  color,
  placeholder = "Add tags",
  values = [],
  onChange,
}) => {
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  const backgroundColorTheme = backgroundColor || colorTheme.primary;
  const [tagInput, setTagInput] = useState<string>("");

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputValue = e.target.value;
    if (inputValue.includes(" ") && inputValue !== " ") {
      const newTag = inputValue.trim();
      const newTagSet = new Set([...values, newTag]);
      onChange?.([...newTagSet]);
      setTagInput("");
    } else setTagInput(inputValue.toLowerCase().trim());
  };

  const handleRemoveTags = (value: string) => {
    const newList = values.filter((tag) => tag !== value);
    onChange?.(newList);
  };

  return (
    <div
      className={`rounded-lg ${className}`}
      onFocus={(e) =>
        (e.currentTarget.style.backgroundColor = backgroundColorTheme + "bb")
      }
      onBlur={(e) =>
        (e.currentTarget.style.backgroundColor = backgroundColorTheme)
      }
      style={{
        backgroundColor: backgroundColorTheme,
        color: color || colorTheme.text,
      }}
    >
      {values.length ? (
        <div className="flex gap-1 px-1 py-1 overflow-x-scroll no-scrollbar">
          {values.map((value) => (
            <div
              key={value}
              className="flex gap-1 rounded-md bg-[#9ca3af33] cursor-pointer px-2 py-1"
              onClick={() => handleRemoveTags(value)}
            >
              {value}
              <img
                className="w-2 mx-1"
                src={CloseIcon}
                alt="close"
                style={{
                  filter: `invert(${
                    (color || colorTheme.text) === "#ffffff" ? 0 : 1
                  })`,
                }}
              />
            </div>
          ))}
        </div>
      ) : null}

      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent w-full"
        value={tagInput}
        onChange={handleOnChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            const newTagSet = new Set([...values, tagInput.trim()]);
            onChange?.([...newTagSet]);
            setTagInput("");
          }
        }}
      />
    </div>
  );
};

export default TagsInput;
