import CarouselImageView from "./CarouselImageView";

interface Props {
  caption: string;
  images: string[];

  captionLine?: number;
}

const PostView: React.FC<Props> = ({ caption, images, captionLine = 3 }) => {
  return (
    <div className="h-full overflow-y-scroll no-scrollbar">
      <p
        className={`text-base max-h-[4.5rem] transition-all duration-1000 hover:max-h-[5000px] line-clamp-${captionLine} hover:line-clamp-none`}
      >
        {caption}
      </p>

      <CarouselImageView images={images} />
    </div>
  );
};

export default PostView;
