import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  className = "",
  iconClassName = "",
}: StatCardProps) => (
  <div
    className={`bg-primary/40 border border-primary/20 p-6 rounded-xl flex items-center justify-between shadow-lg transition-transform hover:-translate-y-1 duration-300 ${className}`}
  >
    <div>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-bold mt-1 text-white">{value}</h3>
    </div>
    <div className={`p-4 rounded-full ${iconClassName}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

export default StatCard;
