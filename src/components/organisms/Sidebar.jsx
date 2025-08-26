import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import CategoryPill from "@/components/molecules/CategoryPill";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ 
  categories, 
  currentView, 
  currentCategoryId, 
  onViewChange, 
  onCategorySelect,
  taskCounts,
  isOpen,
  onClose
}) => {
  const views = [
    { key: "all", label: "All Tasks", icon: "List", count: taskCounts.all },
    { key: "today", label: "Today", icon: "Calendar", count: taskCounts.today },
    { key: "upcoming", label: "Upcoming", icon: "Clock", count: taskCounts.upcoming },
    { key: "overdue", label: "Overdue", icon: "AlertCircle", count: taskCounts.overdue },
    { key: "completed", label: "Completed", icon: "CheckCircle", count: taskCounts.completed }
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-display font-bold text-gray-900">TaskFlow</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Views */}
        <div>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Views
          </h3>
          <nav className="space-y-1">
            {views.map((view) => (
              <Button
                key={view.key}
                variant="ghost"
                onClick={() => {
                  onViewChange(view.key);
                  onClose();
                }}
                className={cn(
                  "w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  currentView === view.key
                    ? "bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <ApperIcon name={view.icon} className="h-4 w-4" />
                <span className="flex-1 text-left">{view.label}</span>
                {view.count > 0 && (
                  <span className={cn(
                    "px-2 py-0.5 text-xs rounded-full",
                    currentView === view.key
                      ? "bg-primary-200 text-primary-800"
                      : "bg-gray-200 text-gray-600"
                  )}>
                    {view.count}
                  </span>
                )}
              </Button>
            ))}
          </nav>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <Button
                  key={category.Id}
                  variant="ghost"
                  onClick={() => {
                    onCategorySelect(category.Id);
                    onClose();
                  }}
                  className={cn(
                    "w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    currentCategoryId === category.Id
                      ? "bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="flex-1 text-left">{category.name}</span>
                  {category.taskCount > 0 && (
                    <span className={cn(
                      "px-2 py-0.5 text-xs rounded-full",
                      currentCategoryId === category.Id
                        ? "bg-primary-200 text-primary-800"
                        : "bg-gray-200 text-gray-600"
                    )}>
                      {category.taskCount}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <ApperIcon name="Zap" className="h-4 w-4" />
          <span>Stay productive!</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <div className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;