import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const PriorityBadge = ({ priority, showIcon = true }) => {
  const priorityConfig = {
    low: {
      variant: "low",
      icon: "Minus",
      label: "Low"
    },
    medium: {
      variant: "medium", 
      icon: "Equal",
      label: "Medium"
    },
    high: {
      variant: "high",
      icon: "ChevronUp",
      label: "High"
    },
    urgent: {
      variant: "urgent",
      icon: "AlertTriangle",
      label: "Urgent"
    }
  };

  const config = priorityConfig[priority] || priorityConfig.low;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      {showIcon && <ApperIcon name={config.icon} className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
};

export default PriorityBadge;