const mockPeople = [
  {
    Id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    department: "Engineering",
    role: "Senior Developer",
    phone: "+1 (555) 123-4567",
    isActive: true,
    manager_id: 5,
    createdAt: "2024-01-15T09:00:00Z"
  },
  {
    Id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    department: "Product",
    role: "Product Manager",
    phone: "+1 (555) 234-5678",
    isActive: true,
    manager_id: null,
    createdAt: "2024-01-16T10:30:00Z"
  },
  {
    Id: 3,
    name: "Michael Chen",
    email: "michael.chen@company.com",
    department: "Design",
    role: "UX Designer",
    phone: "+1 (555) 345-6789",
    isActive: true,
    manager_id: 2,
    createdAt: "2024-01-17T14:15:00Z"
  },
  {
    Id: 4,
    name: "Emily Davis",
    email: "emily.davis@company.com",
    department: "Marketing",
    role: "Marketing Specialist",
    phone: "+1 (555) 456-7890",
    isActive: true,
    manager_id: 6,
    createdAt: "2024-01-18T11:45:00Z"
  },
  {
    Id: 5,
    name: "David Wilson",
    email: "david.wilson@company.com",
    department: "Engineering",
    role: "Tech Lead",
    phone: "+1 (555) 567-8901",
    isActive: true,
    manager_id: null,
    createdAt: "2024-01-19T08:20:00Z"
  },
  {
    Id: 6,
    name: "Lisa Brown",
    email: "lisa.brown@company.com",
    department: "Sales",
    role: "Sales Manager",
    phone: "+1 (555) 678-9012",
    isActive: true,
    manager_id: null,
    createdAt: "2024-01-20T16:30:00Z"
  },
  {
    Id: 7,
    name: "James Anderson",
    email: "james.anderson@company.com",
    department: "Engineering",
    role: "Frontend Developer",
    phone: "+1 (555) 789-0123",
    isActive: true,
    manager_id: 1,
    createdAt: "2024-01-21T13:10:00Z"
  },
  {
    Id: 8,
    name: "Maria Garcia",
    email: "maria.garcia@company.com",
    department: "HR",
    role: "HR Coordinator",
    phone: "+1 (555) 890-1234",
    isActive: true,
    manager_id: null,
    createdAt: "2024-01-22T09:50:00Z"
  },
  {
    Id: 9,
    name: "Robert Taylor",
    email: "robert.taylor@company.com",
    department: "Finance",
    role: "Financial Analyst",
    phone: "+1 (555) 901-2345",
    isActive: true,
    manager_id: 8,
    createdAt: "2024-01-23T12:25:00Z"
  },
  {
    Id: 10,
    name: "Jennifer Lee",
    email: "jennifer.lee@company.com",
    department: "Product",
    role: "Product Designer",
    phone: "+1 (555) 012-3456",
    isActive: true,
    manager_id: 2,
    createdAt: "2024-01-24T15:40:00Z"
  }
];

// Helper function for delay simulation
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all people
export const getAll = async () => {
  await delay(300);
  return [...mockPeople];
};

// Get person by ID
export const getById = async (id) => {
  await delay(200);
  const person = mockPeople.find(p => p.Id === parseInt(id));
  if (!person) {
    throw new Error(`Person with ID ${id} not found`);
  }
  return { ...person };
};

// Create new person
export const create = async (personData) => {
  await delay(400);
  
  const newPerson = {
    ...personData,
    Id: Date.now(),
    isActive: true,
    manager_id: personData.manager_id || null,
    createdAt: new Date().toISOString()
  };
  
  mockPeople.push(newPerson);
  return { ...newPerson };
};

// Update person
export const update = async (id, personData) => {
  await delay(350);
  
  const index = mockPeople.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Person with ID ${id} not found`);
  }
  
  const updatedPerson = {
    ...mockPeople[index],
    ...personData,
    Id: parseInt(id),
    manager_id: personData.manager_id !== undefined ? personData.manager_id : mockPeople[index].manager_id,
    updatedAt: new Date().toISOString()
  };
  
  mockPeople[index] = updatedPerson;
  return { ...updatedPerson };
};

// Delete person
export const deletePerson = async (id) => {
  await delay(300);
  
  const index = mockPeople.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Person with ID ${id} not found`);
  }
  
  mockPeople.splice(index, 1);
  return { success: true };
};

// Search people
export const search = async (query) => {
  await delay(250);
  
  const searchTerm = query.toLowerCase();
  return mockPeople.filter(person => {
    const manager = person.manager_id ? mockPeople.find(p => p.Id === person.manager_id) : null;
    const managerName = manager ? manager.name.toLowerCase() : '';
    
    return person.name.toLowerCase().includes(searchTerm) ||
      person.email.toLowerCase().includes(searchTerm) ||
      person.department.toLowerCase().includes(searchTerm) ||
      person.role.toLowerCase().includes(searchTerm) ||
      managerName.includes(searchTerm);
  });
};

// Get people by department
export const getByDepartment = async (department) => {
  await delay(200);
  
  return mockPeople.filter(person => 
    person.department.toLowerCase() === department.toLowerCase()
  );
};

export const peopleService = {
  getAll,
  getById,
  create,
  update,
  delete: deletePerson,
  search,
  getByDepartment
};