import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { parseDueDateFromText } from "@/utils/dateUtils";

const QuickAdd = ({ onAdd, categories }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedDate = parseDueDateFromText(title);
    const taskData = {
      title: title.trim(),
      description: "",
      categoryId: categories.length > 0 ? categories[0].Id : "",
      priority: "medium",
      dueDate: parsedDate
    };

    onAdd(taskData);
    setTitle("");
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setTitle("");
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <motion.button
        onClick={() => setIsExpanded(true)}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors duration-200 flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <ApperIcon name="Plus" className="h-5 w-5" />
        <span>Add a new task...</span>
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="card p-4"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done? (try 'review report by tomorrow')"
              className="flex-1"
              onBlur={(e) => {
                // Don't close if clicking on buttons
                if (!e.currentTarget.closest("form").contains(e.relatedTarget)) {
                  setTimeout(handleCancel, 150);
                }
              }}
            />
            <Button type="submit" size="icon" disabled={!title.trim()}>
              <ApperIcon name="Plus" className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={handleCancel}>
              <ApperIcon name="X" className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            💡 Try typing "review slides by tomorrow" or "call client on 12/25"
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickAdd;