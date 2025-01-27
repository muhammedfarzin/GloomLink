import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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
  const colorTheme = useSelector((state: RootState) => state.theme.colorTheme);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal text-base",
            !date && "text-muted-foreground",
            className
          )}
          style={{
            color: colorTheme.text,
            backgroundColor: colorTheme.primary,
            borderColor: colorTheme.border,
          }}
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
          style={{
            backgroundColor: colorTheme.primary,
            color: colorTheme.text,
            borderColor: colorTheme.border,
          }}
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
