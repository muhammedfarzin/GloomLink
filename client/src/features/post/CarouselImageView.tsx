import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  images: string[];
}

const CarouselImageView: React.FC<Props> = ({ images, ...props }) => {
  return (
    <Carousel className="relative w-full">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <img
              className="mt-1 w-full bg-foreground/5 border-border object-contain rounded-xl min-h-40 max-h-80 border"
              src={image}
              {...props}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absulute left-2 bg-transparent opacity-10 hover:opacity-100 disabled:opacity-0 hidden md:inline-flex" />
      <CarouselNext className="absulute right-2 bg-transparent opacity-10 hover:opacity-100 disabled:opacity-0 hidden md:inline-flex" />
    </Carousel>
  );
};

export default CarouselImageView;
