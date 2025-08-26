import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "./TaskCard";
import Empty from "@/components/ui/Empty";

const TaskList = ({ tasks, categories, onComplete, onEdit, onDelete, emptyMessage, emptyAction }) => {
  if (tasks.length === 0) {
    return (
      <Empty 
        message={emptyMessage || "No tasks found"}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => {
          const category = categories.find(cat => cat.Id === task.categoryId);
          return (
            <div key={task.Id} className="group">
              <TaskCard
                task={task}
                category={category}
                onComplete={onComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;