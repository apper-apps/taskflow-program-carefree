import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import ApperIcon from "@/components/ApperIcon";
import { formatDate, isOverdue } from "@/utils/dateUtils";

const TaskCard = ({ task, category, onComplete, onEdit, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    await onComplete(task.Id);
    // Animation handled in parent component
  };

  const priorityBorderColor = {
    low: "border-l-gray-300",
    medium: "border-l-yellow-400",
    high: "border-l-orange-400", 
    urgent: "border-l-red-400"
  };

  const isTaskOverdue = isOverdue(task.dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: task.completed ? 0.6 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "card p-4 border-l-4 hover:scale-[1.02] transition-all duration-200",
        priorityBorderColor[task.priority],
        task.completed && "opacity-60",
        isCompleting && "animate-task-complete"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={handleComplete}
            className={cn(
              "flex items-center justify-center w-5 h-5 rounded border-2 mt-0.5 transition-all duration-200",
              task.completed
                ? "bg-primary-500 border-primary-500 text-white"
                : "border-gray-300 hover:border-primary-500"
            )}
            disabled={isCompleting}
          >
            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <ApperIcon name="Check" className="h-3 w-3" />
              </motion.div>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-medium text-gray-900 mb-1",
              task.completed && "line-through text-gray-500"
            )}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={cn(
                "text-sm text-gray-600 mb-2 line-clamp-2",
                task.completed && "text-gray-400"
              )}>
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              {task.dueDate && (
                <Badge variant={isTaskOverdue ? "danger" : "default"} className="flex items-center gap-1">
                  <ApperIcon name="Calendar" className="h-3 w-3" />
                  {formatDate(task.dueDate)}
                </Badge>
              )}
              
              <PriorityBadge priority={task.priority} />
              
              {category && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8"
          >
            <ApperIcon name="Edit2" className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.Id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 text-red-500 hover:text-red-700"
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;