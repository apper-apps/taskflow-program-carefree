import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "./store/store";
import { taskService } from "@/services/api/taskService";
import People from "@/components/pages/People";
import { categoryService } from "@/services/api/categoryService";
import { clearUser, setUser } from "@/store/userSlice";
import Sidebar from "@/components/organisms/Sidebar";
import Signup from "@/components/pages/Signup";
import Callback from "@/components/pages/Callback";
import ResetPassword from "@/components/pages/ResetPassword";
import ErrorPage from "@/components/pages/ErrorPage";
import Login from "@/components/pages/Login";
import PromptPassword from "@/components/pages/PromptPassword";
import { getOverdueTasks, getTodayTasks, getUpcomingTasks } from "@/utils/dateUtils";
import TasksPage from "@/pages/TasksPage";
import OpportunitiesPage from "@/components/pages/OpportunitiesPage";

import 'react-toastify/dist/ReactToastify.css';

export const AuthContext = createContext(null);

function AppContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("all");
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
          loadData();
        } else {
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, []);

async function loadData() {
    try {
      setLoading(true);
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  const taskCounts = {
    all: tasks.filter(t => !t.completed_c).length,
    today: getTodayTasks(tasks).length,
    upcoming: getUpcomingTasks(tasks).length,
    overdue: getOverdueTasks(tasks).length,
    completed: tasks.filter(t => t.completed_c).length
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setCurrentCategoryId(null);
  };

  const handleCategorySelect = (categoryId) => {
    setCurrentCategoryId(categoryId);
    setCurrentView("all");
  };

  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  if (!isInitialized) {
    return <div className="loading flex items-center justify-center p-6 h-full w-full"><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg></div>;
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
        <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
<Route path="/" element={
          <div className="flex h-screen bg-gray-50">
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
            <TasksPage
              currentView={currentView}
              currentCategoryId={currentCategoryId}
              onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
              tasks={tasks}
              categories={categories}
              loading={loading}
            />
          </div>
        } />
        <Route path="/opportunities" element={<OpportunitiesPage onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />} />
        <Route path="/people" element={<People />} />
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
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;