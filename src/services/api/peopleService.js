// Contact Service using ApperClient for contact_c table integration
// Replaces mock people service with proper database operations

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all contacts from contact_c table
export const getAll = async () => {
  await delay(300);
  
  try {
    const tableName = 'contact_c';
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "firstName_c" } },
        { field: { Name: "lastName_c" } },
        { field: { Name: "email_c" } },
        { field: { Name: "phone_c" } },
        { field: { Name: "opportunity_id_c" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "ModifiedOn" } }
      ],
      orderBy: [
        {
          fieldName: "CreatedOn",
          sorttype: "DESC"
        }
      ]
    };
    
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching contacts:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  }
};

// Get contact by ID
export const getById = async (id) => {
  await delay(250);
  
  try {
    const tableName = 'contact_c';
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "firstName_c" } },
        { field: { Name: "lastName_c" } },
        { field: { Name: "email_c" } },
        { field: { Name: "phone_c" } },
        { field: { Name: "opportunity_id_c" } }
      ]
    };
    
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.getRecordById(tableName, parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching contact with ID ${id}:`, error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error(`Error fetching contact with ID ${id}:`, error);
      throw error;
    }
  }
};

// Create new contact - only include Updateable fields
export const create = async (contactData) => {
  await delay(400);
  
  try {
    const tableName = 'contact_c';
    
    // Prepare data with only Updateable fields from contact_c table
    const params = {
      records: [{
        firstName_c: contactData.firstName_c || "",
        lastName_c: contactData.lastName_c || "",
        email_c: contactData.email_c || "",
        phone_c: contactData.phone_c || "",
        opportunity_id_c: contactData.opportunity_id_c ? parseInt(contactData.opportunity_id_c) : null
      }]
    };
    
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.createRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create contact ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            throw new Error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) throw new Error(record.message);
        });
      }
      
      return successfulRecords[0]?.data || {};
    }
    
    return {};
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating contact:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error creating contact:", error);
      throw error;
    }
  }
};

// Update contact - only include Updateable fields
export const update = async (id, contactData) => {
  await delay(350);
  
  try {
    const tableName = 'contact_c';
    
    // Prepare data with only Updateable fields from contact_c table
    const params = {
      records: [{
        Id: parseInt(id),
        firstName_c: contactData.firstName_c || "",
        lastName_c: contactData.lastName_c || "",
        email_c: contactData.email_c || "",
        phone_c: contactData.phone_c || "",
        opportunity_id_c: contactData.opportunity_id_c ? parseInt(contactData.opportunity_id_c) : null
      }]
    };
    
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update contact ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            throw new Error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) throw new Error(record.message);
        });
      }
      
      return successfulUpdates[0]?.data || {};
    }
    
    return {};
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating contact:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error updating contact:", error);
      throw error;
    }
  }
};

// Delete contact
export const deletePerson = async (id) => {
  await delay(300);
  
  try {
    const tableName = 'contact_c';
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete contact ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) throw new Error(record.message);
        });
      }
      
      return true;
    }
    
    return true;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting contact:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error deleting contact:", error);
      throw error;
    }
  }
};

// Keep alias for backward compatibility
export const deleteContact = deletePerson;

// Search contacts by query
export const search = async (query) => {
  await delay(200);
  
  try {
    const tableName = 'contact_c';
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "firstName_c" } },
        { field: { Name: "lastName_c" } },
        { field: { Name: "email_c" } },
        { field: { Name: "phone_c" } },
        { field: { Name: "opportunity_id_c" } }
      ],
      whereGroups: [
        {
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "firstName_c",
                  operator: "Contains",
                  subOperator: "",
                  values: [query]
                }
              ],
              operator: ""
            },
            {
              conditions: [
                {
                  fieldName: "lastName_c",
                  operator: "Contains",
                  subOperator: "",
                  values: [query]
                }
              ],
              operator: ""
            },
            {
              conditions: [
                {
                  fieldName: "email_c",
                  operator: "Contains",
                  subOperator: "",
                  values: [query]
                }
              ],
              operator: ""
            },
            {
              conditions: [
                {
                  fieldName: "phone_c",
                  operator: "Contains",
                  subOperator: "",
                  values: [query]
                }
              ],
              operator: ""
            }
          ]
        }
      ]
    };
    
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error searching contacts:", error?.response?.data?.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error searching contacts:", error);
      throw error;
    }
  }
};

// Export service object for consistency
export const peopleService = {
  getAll,
  getById, 
  create,
  update,
  delete: deletePerson,
  deletePerson,
  search
};