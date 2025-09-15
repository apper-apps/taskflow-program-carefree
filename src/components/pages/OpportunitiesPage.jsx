import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import OpportunityModal from "@/components/organisms/OpportunityModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { opportunityService } from "@/services/api/opportunityService";
import { cn } from "@/utils/cn";

const OpportunitiesPage = ({ onMenuToggle }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);

  const stages = [
    { key: "all", label: "All Stages", count: 0 },
    { key: "Prospecting", label: "Prospecting", count: 0 },
    { key: "Qualification", label: "Qualification", count: 0 },
    { key: "Needs Analysis", label: "Needs Analysis", count: 0 },
    { key: "Value Proposition", label: "Value Proposition", count: 0 },
    { key: "Id. Decision Makers", label: "Decision Makers", count: 0 },
    { key: "Proposal/Price Quote", label: "Proposal", count: 0 },
    { key: "Negotiation/Review", label: "Negotiation", count: 0 },
    { key: "Closed Won", label: "Closed Won", count: 0 },
    { key: "Closed Lost", label: "Closed Lost", count: 0 }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const opportunitiesData = await opportunityService.getAll();
      setOpportunities(opportunitiesData);
    } catch (err) {
      setError("Failed to load opportunities. Please try again.");
      console.error("Error loading opportunities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredOpportunities = useMemo(() => {
    let filtered = [...opportunities];

    // Filter by stage
    if (stageFilter !== "all") {
      filtered = filtered.filter(opportunity => opportunity.stage === stageFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(opportunity =>
        opportunity.name.toLowerCase().includes(query) ||
        opportunity.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [opportunities, stageFilter, searchQuery]);

  const handleAddOpportunity = async (opportunityData) => {
    try {
      const newOpportunity = await opportunityService.create(opportunityData);
      setOpportunities(prev => [newOpportunity, ...prev]);
      toast.success("Opportunity created successfully!");
    } catch (err) {
      toast.error("Failed to create opportunity");
      console.error("Error creating opportunity:", err);
    }
  };

  const handleEditOpportunity = async (opportunityData) => {
    try {
      const updatedOpportunity = await opportunityService.update(editingOpportunity.Id, opportunityData);
      setOpportunities(prev => prev.map(opportunity => 
        opportunity.Id === editingOpportunity.Id ? updatedOpportunity : opportunity
      ));
      toast.success("Opportunity updated successfully!");
      setEditingOpportunity(null);
    } catch (err) {
      toast.error("Failed to update opportunity");
      console.error("Error updating opportunity:", err);
    }
  };

  const handleDeleteOpportunity = async (opportunityId) => {
    if (!window.confirm("Are you sure you want to delete this opportunity?")) {
      return;
    }

    try {
      await opportunityService.delete(opportunityId);
      setOpportunities(prev => prev.filter(opportunity => opportunity.Id !== opportunityId));
      toast.success("Opportunity deleted successfully");
    } catch (err) {
      toast.error("Failed to delete opportunity");
      console.error("Error deleting opportunity:", err);
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      "Prospecting": "bg-gray-100 text-gray-800",
      "Qualification": "bg-blue-100 text-blue-800",
      "Needs Analysis": "bg-purple-100 text-purple-800",
      "Value Proposition": "bg-indigo-100 text-indigo-800",
      "Id. Decision Makers": "bg-yellow-100 text-yellow-800",
      "Proposal/Price Quote": "bg-orange-100 text-orange-800",
      "Negotiation/Review": "bg-red-100 text-red-800",
      "Closed Won": "bg-green-100 text-green-800",
      "Closed Lost": "bg-gray-100 text-gray-600"
    };
    return colors[stage] || "bg-gray-100 text-gray-800";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date set";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex-1 lg:ml-64">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentView="opportunities"
          onMenuToggle={onMenuToggle}
          onAddTask={() => setIsModalOpen(true)}
        />
        <main className="p-6">
          <Loading message="Loading opportunities..." />
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
          currentView="opportunities"
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
        currentView="opportunities"
        onMenuToggle={onMenuToggle}
        onAddTask={() => setIsModalOpen(true)}
      />
      
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stage Filters */}
          <div className="flex flex-wrap gap-2">
            {stages.map((stage) => (
              <Button
                key={stage.key}
                variant={stageFilter === stage.key ? "primary" : "secondary"}
                size="sm"
                onClick={() => setStageFilter(stage.key)}
                className="text-sm"
              >
                {stage.label}
              </Button>
            ))}
          </div>

          {/* Opportunities Grid */}
          {filteredOpportunities.length === 0 ? (
            <Empty 
              message="No opportunities found"
              description="Start by creating your first opportunity to track potential deals!"
              icon="Coins"
              action={{
                label: "Create Opportunity",
                onClick: () => setIsModalOpen(true)
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opportunity) => (
                <div
                  key={opportunity.Id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                      {opportunity.name}
                    </h3>
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingOpportunity(opportunity);
                          setIsModalOpen(true);
                        }}
                        className="h-8 w-8 text-gray-500 hover:text-gray-700"
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteOpportunity(opportunity.Id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="DollarSign" className="h-4 w-4 text-green-600" />
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(opportunity.potentialValue)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-xs font-medium px-2 py-1", getStageColor(opportunity.stage))}>
                        {opportunity.stage}
                      </Badge>
                    </div>

                    {opportunity.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {opportunity.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <ApperIcon name="Calendar" className="h-4 w-4" />
                      <span>Close: {formatDate(opportunity.closeDate)}</span>
                    </div>

                    {opportunity.ownerName && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <ApperIcon name="User" className="h-4 w-4" />
                        <span>{opportunity.ownerName}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <OpportunityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOpportunity(null);
        }}
        onSave={editingOpportunity ? handleEditOpportunity : handleAddOpportunity}
        opportunity={editingOpportunity}
      />
    </div>
  );
};

export default OpportunitiesPage;