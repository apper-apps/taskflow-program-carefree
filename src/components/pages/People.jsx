import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { peopleService } from '@/services/api/peopleService';
import { taskService } from '@/services/api/taskService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import PeopleModal from '@/components/organisms/PeopleModal';

const People = () => {
  const [people, setPeople] = useState([]);
  const [tasks, setTasks] = useState([]);
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
      const [peopleData, tasksData] = await Promise.all([
        peopleService.getAll(),
        taskService.getAll()
      ]);
      setPeople(peopleData);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message || 'Failed to load people');
      console.error('Error loading people:', err);
    } finally {
      setLoading(false);
    }
  };

// Filter people based on search
  const filteredPeople = people.filter(person => {
    const managerName = getManagerName(person.manager_id);
    return person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      managerName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get task count for a person
  const getTaskCount = (personId) => {
    return tasks.filter(task => task.assignedTo === personId && !task.completed).length;
  };

  // Handle add person
  const handleAddPerson = async (personData) => {
    try {
      const newPerson = await peopleService.create(personData);
      setPeople(prev => [...prev, newPerson]);
      setIsModalOpen(false);
      toast.success('Person added successfully');
    } catch (err) {
      console.error('Error adding person:', err);
      toast.error(err.message || 'Failed to add person');
    }
  };

  // Handle edit person
  const handleEditPerson = async (personData) => {
    try {
      const updatedPerson = await peopleService.update(editingPerson.Id, personData);
      setPeople(prev => prev.map(p => p.Id === updatedPerson.Id ? updatedPerson : p));
      setIsModalOpen(false);
      setEditingPerson(null);
      toast.success('Person updated successfully');
    } catch (err) {
      console.error('Error updating person:', err);
      toast.error(err.message || 'Failed to update person');
    }
  };

  // Handle delete person
  const handleDeletePerson = async (personId) => {
    if (!confirm('Are you sure you want to delete this person?')) {
      return;
    }

    setDeleting(personId);
    try {
      await peopleService.delete(personId);
      setPeople(prev => prev.filter(p => p.Id !== personId));
      toast.success('Person deleted successfully');
    } catch (err) {
      console.error('Error deleting person:', err);
      toast.error(err.message || 'Failed to delete person');
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
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active Tasks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manager
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
{filteredPeople.map((person) => (
                  <tr key={person.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-700">
                              {person.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{person.name}</div>
                          <div className="text-sm text-gray-500">{person.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.department}</div>
                      <div className="text-sm text-gray-500">{person.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{person.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        person.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {person.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getManagerName(person.manager_id)}</div>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">
                              {person.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{person.name}</div>
                          <div className="text-sm text-gray-500">{person.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {person.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {person.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getTaskCount(person.Id)} tasks
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        person.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {person.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(person)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <ApperIcon name="Edit" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePerson(person.Id)}
                          disabled={deleting === person.Id}
                          className="text-red-600 hover:text-red-900"
                        >
                          {deleting === person.Id ? (
                            <ApperIcon name="Loader2" size={14} className="animate-spin" />
                          ) : (
                            <ApperIcon name="Trash2" size={14} />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
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
      />
    </div>
  );
};

export default People;