import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { opportunityService } from "@/services/api/opportunityService";
import { create, getAll, peopleService, update } from "@/services/api/peopleService";
import ApperIcon from "@/components/ApperIcon";
import PeopleModal from "@/components/organisms/PeopleModal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
const People = () => {
const [people, setPeople] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [deleting, setDeleting] = useState(null);
  // Helper function to get manager name
  const getManagerName = (managerId) => {
    if (!managerId) return 'None';
    const manager = people.find(p => p.Id === managerId);
    return manager ? manager.name : 'Unknown';
  };
  // Load data on mount
useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [peopleData, opportunitiesData] = await Promise.all([
        peopleService.getAll(),
        opportunityService.getAll()
      ]);
      setPeople(peopleData);
      setOpportunities(opportunitiesData);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
      console.error('Error loading contacts:', err);
    } finally {
      setLoading(false);
    }
  };

// Filter people based on search
const filteredPeople = people.filter(person => {
    const fullName = `${person.firstName_c || ''} ${person.lastName_c || ''}`.trim();
    const opportunityName = getOpportunityName(person.opportunity_id_c);
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (person.email_c || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (person.phone_c || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunityName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Helper function to get opportunity name from ID or object
  function getOpportunityName(opportunityId) {
    if (!opportunityId) return 'No Opportunity';
    
    // If it's already an object with Name property
    if (typeof opportunityId === 'object' && opportunityId.Name) {
      return opportunityId.Name;
    }
    
    // If it's an ID, find the opportunity
    const opportunity = opportunities.find(o => o.Id === opportunityId);
    return opportunity ? (opportunity.name_c || opportunity.Name) : 'Unknown';
  }


// Handle add contact
  const handleAddPerson = async (contactData) => {
    try {
      const newContact = await peopleService.create(contactData);
      setPeople(prev => [...prev, newContact]);
      setIsModalOpen(false);
      toast.success('Contact added successfully');
    } catch (err) {
      console.error('Error adding contact:', err);
      toast.error(err.message || 'Failed to add contact');
    }
  };

  // Handle edit contact
  const handleEditPerson = async (contactData) => {
    try {
      const updatedContact = await peopleService.update(editingPerson.Id, contactData);
      setPeople(prev => prev.map(p => p.Id === updatedContact.Id ? updatedContact : p));
      setIsModalOpen(false);
      setEditingPerson(null);
      toast.success('Contact updated successfully');
    } catch (err) {
      console.error('Error updating contact:', err);
      toast.error(err.message || 'Failed to update contact');
    }
  };

  // Handle delete contact
  const handleDeletePerson = async (personId) => {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    setDeleting(personId);
    try {
      await peopleService.delete(personId);
      setPeople(prev => prev.filter(p => p.Id !== personId));
      toast.success('Contact deleted successfully');
    } catch (err) {
      console.error('Error deleting contact:', err);
      toast.error(err.message || 'Failed to delete contact');
    } finally {
      setDeleting(null);
    }
  };

  // Open edit modal
  const openEditModal = (person) => {
    setEditingPerson(person);
    setIsModalOpen(true);
  };

  // Close modal and reset editing state
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPerson(null);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">People</h1>
          <p className="text-gray-600 mt-1">Manage team members and assign tasks</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          Add Person
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <ApperIcon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            type="text"
            placeholder="Search people..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* People List */}
      {filteredPeople.length === 0 ? (
        <Empty 
          message={searchTerm ? "No people match your search" : "No people found"}
          action={!searchTerm && {
            label: "Add First Person",
            onClick: () => setIsModalOpen(true)
          }}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
<tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opportunity
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
{filteredPeople.map((person) => {
                  const fullName = `${person.firstName_c || ''} ${person.lastName_c || ''}`.trim();
                  const firstInitial = person.firstName_c ? person.firstName_c.charAt(0).toUpperCase() : 'C';
                  
                  return (
                    <tr key={person.Id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-700">
                                {firstInitial}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{fullName}</div>
                            <div className="text-sm text-gray-500">{person.email_c}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{person.email_c}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{person.phone_c || 'No phone'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getOpportunityName(person.opportunity_id_c)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => openEditModal(person)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <ApperIcon name="Edit" size={16} />
                        </button>
                        <button
                          onClick={() => handleDeletePerson(person.Id)}
                          disabled={deleting === person.Id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deleting === person.Id ? (
                            <ApperIcon name="Loader2" size={16} className="animate-spin" />
                          ) : (
                            <ApperIcon name="Trash2" size={16} />
                          )}
                        </button>
                      </td>
                    </tr>
);
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* People Modal */}
<PeopleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={editingPerson ? handleEditPerson : handleAddPerson}
        person={editingPerson}
        people={people}
        opportunities={opportunities}
      />
    </div>
  );
};

export default People;