import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import AddImageIcon from "../../../assets/icons/Add-Image.svg";
import CloseIcon from "../../../assets/icons/Close.svg";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface ImageInputProps {
  className?: string;
  cardClassName?: string;
  backgroundColor?: `#${string}`;
  color?: `#${string}`;
  values?: File[];
  onChange?: (imageList: File[]) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({
  className,
  cardClassName = "",
  backgroundColor,
  color,
  values = [],
  onChange,
}) => {
  const { toast } = useToast();
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const cardStyle = {
    backgroundColor: backgroundColor || colorTheme.background,
    borderColor: colorTheme.border,
  };

  const handleOnUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      const fileArray: File[] = [];
      Array.from(e.target.files).forEach((file) => {
        if (file.type.split("/")[0] !== "image") {
          toast({
            description: "Please upload only images",
            variant: "destructive",
          });
          return;
        }

        fileArray.push(file);
      });
      onChange?.(values.concat(fileArray));
    }
  };

  const handleOnRemove = (image: File) => {
    onChange?.(values.filter((value) => value !== image));
  };

  return (
    <div className="flex overflow-x-scroll no-scrollbar">
      <div className={`flex ${className || "gap-2"}`}>
        {/* Added Image Listing */}
        {values.map((image, index) => (
          <div
            key={index}
            className={`flex relative justify-center items-center rounded-lg border h-40 ${cardClassName}`}
            style={cardStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                cardStyle.backgroundColor + "bb")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                cardStyle.backgroundColor)
            }
          >
            <img
              className="opacity-50 h-full w-full object-contain rounded-lg"
              src={URL.createObjectURL(image)}
              alt="Image"
              onLoad={(e) => {
                const img = e.currentTarget;
                const heightPercentage = img.height / img.naturalHeight;
                img.parentElement!.style.width = `${
                  img.naturalWidth * heightPercentage
                }px`;
              }}
            />

            {/* Remove Image Icon */}
            <div
              className="absolute border rounded-tr-lg rounded-bl-lg cursor-pointer p-2 top-0 right-0"
              style={{
                backgroundColor: cardStyle.backgroundColor,
                borderColor: cardStyle.borderColor,
              }}
              onClick={() => handleOnRemove(image)}
            >
              <img
                src={CloseIcon}
                alt="close"
                style={{
                  filter: `invert(${
                    (color || colorTheme.text) === "#ffffff" ? 0 : 1
                  })`,
                }}
              />
            </div>
          </div>
        ))}

        {/* Add Image Button */}
        <div
          className={`flex justify-center items-center border cursor-pointer rounded-lg h-40 w-72 ${cardClassName}`}
          style={cardStyle}
          onClick={() => imageInputRef.current?.click()}
        >
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            value={[]}
            multiple
            hidden
            onChange={handleOnUpload}
          />
          <img
            className="opacity-50 w-8"
            src={AddImageIcon}
            alt="close"
            style={{
              filter: `invert(${
                (color || colorTheme.text) === "#ffffff" ? 0 : 1
              })`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageInput;
