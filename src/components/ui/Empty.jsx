import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  message = "No tasks found", 
  description,
  action,
  icon = "CheckSquare"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{message}</h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-sm">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} className="flex items-center gap-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          {action.label}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;