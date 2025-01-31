import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";

interface DateInputProps {
  date?: Date;
  setDate?: React.Dispatch<React.SetStateAction<Date | undefined>>;
  className?: string;
  maxDate?: Date;
}

const DateInput: React.FC<DateInputProps> = ({
  date,
  setDate,
  className,
  maxDate,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal text-base text-foreground bg-primary border-border",
            !date && "text-muted-foreground",
            className
          )}
        >
          {date ? (
            format(date, "PPP")
          ) : (
            <span className="text-[#9ca3af]">Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          className="bg-primary text-foreground border-border"
          toDate={maxDate}
          pagedNavigation
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateInput;
