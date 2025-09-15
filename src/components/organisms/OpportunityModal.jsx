import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";

const OpportunityModal = ({ isOpen, onClose, onSave, opportunity }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    potentialValue: "",
    stage: "Prospecting",
    closeDate: "",
    ownerId: ""
  });
  
  const [errors, setErrors] = useState({});

  const stages = [
    "Prospecting",
    "Qualification",
    "Needs Analysis",
    "Value Proposition",
    "Id. Decision Makers",
    "Proposal/Price Quote",
    "Negotiation/Review",
    "Closed Won",
    "Closed Lost"
  ];

  useEffect(() => {
    if (opportunity) {
      setFormData({
        name: opportunity.name || "",
        description: opportunity.description || "",
        potentialValue: opportunity.potentialValue || "",
        stage: opportunity.stage || "Prospecting",
        closeDate: opportunity.closeDate ? new Date(opportunity.closeDate).toISOString().split("T")[0] : "",
        ownerId: opportunity.ownerId || ""
      });
    } else {
      setFormData({
        name: "",
        description: "",
        potentialValue: "",
        stage: "Prospecting",
        closeDate: "",
        ownerId: ""
      });
    }
    setErrors({});
  }, [opportunity, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const opportunityData = {
      ...formData,
      potentialValue: formData.potentialValue ? parseFloat(formData.potentialValue) : 0,
      closeDate: formData.closeDate ? new Date(formData.closeDate) : null,
      ownerId: formData.ownerId || null
    };

    onSave(opportunityData);
    onClose();
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({ ...prev, name }));
    
    // Clear name error when user starts typing
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-md"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-display font-semibold text-gray-900">
              {opportunity ? "Edit Opportunity" : "New Opportunity"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opportunity Name
              </label>
              <Input
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g., Acme Corp Website Redesign"
                className={errors.name ? "border-red-300 focus:ring-red-500" : ""}
                autoFocus
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add details about this opportunity..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Potential Value ($)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.potentialValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, potentialValue: e.target.value }))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stage
                </label>
                <Select
                  value={formData.stage}
                  onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value }))}
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Close Date
              </label>
              <Input
                type="date"
                value={formData.closeDate}
                onChange={(e) => setFormData(prev => ({ ...prev, closeDate: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {opportunity ? "Save Changes" : "Create Opportunity"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OpportunityModal;