import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import TasksPage from "@/pages/TasksPage";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import { getTodayTasks, getUpcomingTasks, getOverdueTasks } from "@/utils/dateUtils";
import { useEffect } from "react";

function App() {
  const [currentView, setCurrentView] = useState("all");
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  // Load data for sidebar counts
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksData, categoriesData] = await Promise.all([
          taskService.getAll(),
          categoryService.getAll()
        ]);
        setTasks(tasksData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error loading data for sidebar:", err);
      }
    };
    loadData();
  }, []);

  const taskCounts = {
    all: tasks.filter(t => !t.completed).length,
    today: getTodayTasks(tasks).length,
    upcoming: getUpcomingTasks(tasks).length,
    overdue: getOverdueTasks(tasks).length,
    completed: tasks.filter(t => t.completed).length
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setCurrentCategoryId(null);
  };

  const handleCategorySelect = (categoryId) => {
    setCurrentCategoryId(categoryId);
    setCurrentView("all");
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Sidebar
          categories={categories}
          currentView={currentView}
          currentCategoryId={currentCategoryId}
          onViewChange={handleViewChange}
          onCategorySelect={handleCategorySelect}
          taskCounts={taskCounts}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <Routes>
          <Route
            path="/"
            element={
              <TasksPage
                currentView={currentView}
                currentCategoryId={currentCategoryId}
                onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;