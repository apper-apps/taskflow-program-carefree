import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import TaskList from "@/components/organisms/TaskList";
import TaskModal from "@/components/organisms/TaskModal";
import QuickAdd from "@/components/organisms/QuickAdd";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import { getTodayTasks, getUpcomingTasks, getOverdueTasks } from "@/utils/dateUtils";

const TasksPage = ({ 
  currentView, 
  currentCategoryId, 
  onMenuToggle 
}) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Filter by view
    switch (currentView) {
      case "today":
        filtered = getTodayTasks(filtered);
        break;
      case "upcoming":
        filtered = getUpcomingTasks(filtered);
        break;
      case "overdue":
        filtered = getOverdueTasks(filtered);
        break;
      case "completed":
        filtered = filtered.filter(task => task.completed);
        break;
      default:
        filtered = filtered.filter(task => !task.completed);
    }

    // Filter by category
if (currentCategoryId) {
      filtered = filtered.filter(task => task.categoryId === parseInt(currentCategoryId));
    }

    // Filter by search query
if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tasks, currentView, currentCategoryId, searchQuery]);

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
      toast.success("Task created successfully!");
    } catch (err) {
      toast.error("Failed to create task");
      console.error("Error creating task:", err);
    }
  };

  const handleEditTask = async (taskData) => {
    try {
      const updatedTask = await taskService.update(editingTask.Id, taskData);
      setTasks(prev => prev.map(task => 
        task.Id === editingTask.Id ? updatedTask : task
      ));
      toast.success("Task updated successfully!");
      setEditingTask(null);
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Error updating task:", err);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const updatedTask = await taskService.complete(taskId);
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      
      if (updatedTask.completed) {
        toast.success("Great job! Task completed 🎉");
      } else {
        toast.info("Task marked as incomplete");
      }
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Error completing task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", err);
    }
  };

  const getEmptyStateProps = () => {
    switch (currentView) {
      case "today":
        return {
          message: "No tasks for today",
          description: "Enjoy your free time or add a new task to stay productive!",
          icon: "Calendar",
          action: {
            label: "Add Today's Task",
            onClick: () => setIsModalOpen(true)
          }
        };
      case "upcoming":
        return {
          message: "No upcoming tasks",
          description: "Great! You're all caught up. Plan ahead by adding future tasks.",
          icon: "Clock"
        };
      case "overdue":
        return {
          message: "No overdue tasks",
          description: "Excellent! You're staying on top of your deadlines.",
          icon: "CheckCircle"
        };
      case "completed":
        return {
          message: "No completed tasks yet",
          description: "Complete some tasks to see your accomplishments here!",
          icon: "Trophy"
        };
      default:
        return {
          message: "No tasks found",
          description: "Start by creating your first task to get organized!",
          action: {
            label: "Create First Task",
            onClick: () => setIsModalOpen(true)
          }
        };
    }
  };

  if (loading) {
    return (
      <div className="flex-1 lg:ml-64">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentView={currentView}
          onMenuToggle={onMenuToggle}
          onAddTask={() => setIsModalOpen(true)}
        />
        <main className="p-6">
          <Loading message="Loading your tasks..." />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 lg:ml-64">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentView={currentView}
          onMenuToggle={onMenuToggle}
          onAddTask={() => setIsModalOpen(true)}
        />
        <main className="p-6">
          <Error message={error} onRetry={loadData} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 lg:ml-64">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentView={currentView}
        onMenuToggle={onMenuToggle}
        onAddTask={() => setIsModalOpen(true)}
      />
      
      <main className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {currentView !== "completed" && (
            <QuickAdd
              onAdd={handleAddTask}
              categories={categories}
            />
          )}
          
          <TaskList
            tasks={filteredTasks}
            categories={categories}
            onComplete={handleCompleteTask}
            onEdit={(task) => {
              setEditingTask(task);
              setIsModalOpen(true);
            }}
            onDelete={handleDeleteTask}
            {...getEmptyStateProps()}
          />
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={editingTask ? handleEditTask : handleAddTask}
        task={editingTask}
        categories={categories}
      />
    </div>
  );
};

export default TasksPage;