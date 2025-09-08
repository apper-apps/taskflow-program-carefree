import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import CategoryPill from '@/components/molecules/CategoryPill';
import { cn } from '@/utils/cn';

const SidebarWithPeople = ({ 
  categories, 
  currentView, 
  currentCategoryId, 
  onViewChange, 
  onCategorySelect, 
  taskCounts, 
  isOpen, 
  onClose 
}) => {
  const location = useLocation();
  const isOnPeoplePage = location.pathname === '/people';

  const views = [
    { id: 'all', label: 'All Tasks', icon: 'List', count: taskCounts.all },
    { id: 'today', label: 'Today', icon: 'Calendar', count: taskCounts.today },
    { id: 'upcoming', label: 'Upcoming', icon: 'Clock', count: taskCounts.upcoming },
    { id: 'overdue', label: 'Overdue', icon: 'AlertCircle', count: taskCounts.overdue },
    { id: 'completed', label: 'Completed', icon: 'CheckCircle', count: taskCounts.completed }
  ];

  const navigationItems = [
    {
      path: '/',
      label: 'Tasks',
      icon: 'CheckSquare',
      isActive: location.pathname === '/'
    },
    {
      path: '/people',
      label: 'People',
      icon: 'Users',
      isActive: isOnPeoplePage
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          "fixed left-0 top-0 h-full w-72 bg-white shadow-lg z-50 flex flex-col",
          "lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4 border-b border-gray-200">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  item.isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <ApperIcon name={item.icon} size={18} />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Task Views (only show when not on people page) */}
        {!isOnPeoplePage && (
          <>
            <div className="p-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Views
              </h2>
              <nav className="space-y-1">
                {views.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => {
                      onViewChange(view.id);
                      onClose();
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                      currentView === view.id
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <ApperIcon name={view.icon} size={16} />
                      <span>{view.label}</span>
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      currentView === view.id
                        ? "bg-primary-100 text-primary-700"
                        : "bg-gray-100 text-gray-600"
                    )}>
                      {view.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Categories */}
            <div className="p-4 flex-1 overflow-y-auto">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Categories
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onCategorySelect(null);
                    onClose();
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    !currentCategoryId
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <div key={category.Id} onClick={onClose}>
                    <CategoryPill
                      category={{
                        name: category.Name,
                        color: category.color_c || '#6366f1'
                      }}
                      count={taskCounts.categories?.[category.Id] || 0}
                      isActive={currentCategoryId === category.Id}
                      onClick={() => onCategorySelect(category.Id)}
                      showCount={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
};

export default SidebarWithPeople;