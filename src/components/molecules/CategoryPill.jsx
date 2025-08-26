import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const CategoryPill = ({ category, count, isActive = false, onClick, showCount = false }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105",
        isActive
          ? "bg-primary-100 text-primary-800 shadow-sm"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      )}
    >
      <div 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: category.color }}
      />
      <span>{category.name}</span>
      {showCount && count !== undefined && (
        <span className="text-xs bg-white rounded-full px-2 py-0.5">
          {count}
        </span>
      )}
    </button>
  );
};

export default CategoryPill;