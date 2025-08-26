import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ViewToggle = ({ currentView, onViewChange }) => {
  const views = [
    { key: "all", label: "All Tasks", icon: "List" },
    { key: "today", label: "Today", icon: "Calendar" },
    { key: "upcoming", label: "Upcoming", icon: "Clock" },
    { key: "overdue", label: "Overdue", icon: "AlertCircle" },
    { key: "completed", label: "Completed", icon: "CheckCircle" }
  ];

  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {views.map((view) => (
        <Button
          key={view.key}
          variant="ghost"
          size="sm"
          onClick={() => onViewChange(view.key)}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
            currentView === view.key
              ? "bg-white text-primary-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          <ApperIcon name={view.icon} className="h-4 w-4" />
          <span className="hidden sm:inline">{view.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default ViewToggle;