import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

const PeopleModal = ({ isOpen, onClose, onSave, person, people = [], opportunities = [] }) => {
  const [formData, setFormData] = useState({
    firstName_c: '',
    lastName_c: '',
    email_c: '',
    phone_c: '',
    opportunity_id_c: null
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Departments list
  const departments = [
    'Engineering',
    'Product',
    'Design',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations'
  ];

  // Reset form when modal opens/closes or person changes
useEffect(() => {
    if (isOpen) {
      if (person) {
        // Editing existing contact
        setFormData({
          firstName_c: person.firstName_c || '',
          lastName_c: person.lastName_c || '',
          email_c: person.email_c || '',
          phone_c: person.phone_c || '',
          opportunity_id_c: person.opportunity_id_c?.Id || person.opportunity_id_c || null
        });
      } else {
        // Adding new contact
        setFormData({
          firstName_c: '',
          lastName_c: '',
          email_c: '',
          phone_c: '',
          opportunity_id_c: null
        });
      }
      setErrors({});
    }
  }, [isOpen, person]);

  // Handle input changes
const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'opportunity_id_c' && value ? parseInt(value) : value)
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName_c.trim()) {
      newErrors.firstName_c = 'First name is required';
    }

    if (!formData.lastName_c.trim()) {
      newErrors.lastName_c = 'Last name is required';
    }

    if (!formData.email_c.trim()) {
      newErrors.email_c = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_c)) {
      newErrors.email_c = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving person:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
<h3 className="text-lg font-medium leading-6 text-gray-900">
                {person ? 'Edit Contact' : 'Add New Contact'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            {/* Form */}
<form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div>
                <label htmlFor="firstName_c" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <Input
                  id="firstName_c"
                  name="firstName_c"
                  type="text"
                  value={formData.firstName_c}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={errors.firstName_c ? 'border-red-300' : ''}
                />
                {errors.firstName_c && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName_c}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName_c" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <Input
                  id="lastName_c"
                  name="lastName_c"
                  type="text"
                  value={formData.lastName_c}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className={errors.lastName_c ? 'border-red-300' : ''}
                />
                {errors.lastName_c && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName_c}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email_c" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <Input
                  id="email_c"
                  name="email_c"
                  type="email"
                  value={formData.email_c}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className={errors.email_c ? 'border-red-300' : ''}
                />
                {errors.email_c && (
                  <p className="mt-1 text-sm text-red-600">{errors.email_c}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone_c" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <Input
                  id="phone_c"
                  name="phone_c"
                  type="tel"
                  value={formData.phone_c}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className={errors.phone_c ? 'border-red-300' : ''}
                />
                {errors.phone_c && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone_c}</p>
                )}
              </div>

              {/* Opportunity Lookup */}
              <div>
                <label htmlFor="opportunity_id_c" className="block text-sm font-medium text-gray-700 mb-1">
                  Opportunity
                </label>
                <Select
                  id="opportunity_id_c"
                  name="opportunity_id_c"
                  value={formData.opportunity_id_c || ''}
                  onChange={handleChange}
                  className={errors.opportunity_id_c ? 'border-red-300' : ''}
                >
                  <option value="">Select Opportunity</option>
                  {opportunities.map(opportunity => (
                    <option key={opportunity.Id} value={opportunity.Id}>
                      {opportunity.name_c || opportunity.Name} - {opportunity.stage_c}
                    </option>
                  ))}
                </Select>
                {errors.opportunity_id_c && (
                  <p className="mt-1 text-sm text-red-600">{errors.opportunity_id_c}</p>
                )}
              </div>

              {/* Department */}

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              {/* Status */}
              <div className="flex items-center">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={loading}
>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
                  {person ? 'Update Contact' : 'Add Contact'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default PeopleModal;