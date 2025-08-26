import { useState } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ViewToggle from "@/components/molecules/ViewToggle";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ 
  searchQuery, 
  onSearchChange, 
  currentView, 
  onViewChange, 
  onMenuToggle,
  onAddTask
}) => {
  const getViewTitle = (view) => {
    const titles = {
      all: "All Tasks",
      today: "Today",
      upcoming: "Upcoming",
      overdue: "Overdue",
      completed: "Completed"
    };
    return titles[view] || "Tasks";
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              {getViewTitle(currentView)}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {currentView === "today" && "Focus on what matters today"}
              {currentView === "upcoming" && "Plan ahead and stay organized"}
              {currentView === "overdue" && "Catch up on missed tasks"}
              {currentView === "completed" && "Review your accomplishments"}
              {currentView === "all" && "Manage all your tasks"}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="w-full sm:w-64">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search tasks..."
            />
          </div>

          {/* Add Task Button */}
          <Button
            onClick={onAddTask}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
            <span className="hidden sm:inline">Add Task</span>
          </Button>
        </div>
      </div>

      {/* View Toggle - Mobile */}
      <div className="mt-4 lg:hidden">
        <ViewToggle
          currentView={currentView}
          onViewChange={onViewChange}
        />
      </div>
    </header>
  );
};

export default Header;