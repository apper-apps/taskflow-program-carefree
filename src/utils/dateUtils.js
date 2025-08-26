import { format, isToday, isTomorrow, isPast, startOfDay, endOfDay, isWithinInterval } from "date-fns";

export const formatDate = (date) => {
  if (!date) return "";
  
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return "Today";
  }
  
  if (isTomorrow(dateObj)) {
    return "Tomorrow";
  }
  
  return format(dateObj, "MMM d");
};

export const formatDateTime = (date) => {
  if (!date) return "";
  return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
};

export const isOverdue = (date) => {
  if (!date) return false;
  return isPast(new Date(date)) && !isToday(new Date(date));
};

export const isToday = (date) => {
  if (!date) return false;
  return isToday(new Date(date));
};

export const isTodayOrTomorrow = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  return isToday(dateObj) || isTomorrow(dateObj);
};

export const getTodayTasks = (tasks) => {
  const today = new Date();
  return tasks.filter(task => 
    !task.completed && 
    task.dueDate && 
    isWithinInterval(new Date(task.dueDate), {
      start: startOfDay(today),
      end: endOfDay(today)
    })
  );
};

export const getUpcomingTasks = (tasks) => {
  const today = new Date();
  return tasks.filter(task => 
    !task.completed && 
    task.dueDate && 
    new Date(task.dueDate) > endOfDay(today)
  );
};

export const getOverdueTasks = (tasks) => {
  const today = startOfDay(new Date());
  return tasks.filter(task => 
    !task.completed && 
    task.dueDate && 
    new Date(task.dueDate) < today
  );
};

export const parseDueDateFromText = (text) => {
  const today = new Date();
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes("today")) {
    return today;
  }
  
  if (lowerText.includes("tomorrow")) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
  
  const dateMatch = lowerText.match(/(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)/);
  if (dateMatch) {
    const dateStr = dateMatch[1];
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }
  
  return null;
};