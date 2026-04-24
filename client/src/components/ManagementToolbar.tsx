import { Filter, Search } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  searchQuery: string;
  searchPlaceholder?: string;
  filter: string;
  filters: Record<string, string>;
  onSearch?: (e: React.FormEvent) => void;
  onSearchQueryChange?: (query: string) => void;
  onFilterChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ManagementToolbar = ({
  title,
  description,
  searchQuery,
  searchPlaceholder,
  filter,
  filters,
  onSearchQueryChange,
  onSearch,
  onFilterChange,
}: Props) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-in slide-in-from-top duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {title}
        </h1>
        {description && <p className="text-gray-400 mt-1">{description}</p>}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-primary/30 p-2 rounded-lg border border-primary/10 shadow-md">
        <form
          onSubmit={onSearch}
          className="relative flex items-center w-full sm:w-auto"
        >
          <Search className="absolute left-3 text-gray-500 z-10" size={16} />
          <input
            type="text"
            placeholder={searchPlaceholder || "Search..."}
            className="bg-primary/50 border border-primary/20 rounded-md pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan transition-all w-full sm:w-64"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange?.(e.target.value)}
          />
        </form>

        <div className="flex items-center relative w-full sm:w-auto mt-2 sm:mt-0">
          <Filter
            className="absolute left-3 text-gray-500 pointer-events-none z-10"
            size={16}
          />
          <select
            className="bg-primary/50 border border-primary/20 rounded-md pl-9 pr-8 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan appearance-none cursor-pointer transition-all w-full sm:w-auto"
            onChange={onFilterChange}
            value={filter}
          >
            {Object.entries(filters).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ManagementToolbar;
