export const opportunityService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "potential_value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "close_date_c" } },
          { 
            field: { Name: "owner_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [
          {
            fieldName: "ModifiedOn",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('opportunity_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(opportunity => ({
        Id: opportunity.Id,
        name: opportunity.name_c || opportunity.Name || '',
        description: opportunity.description_c || '',
        potentialValue: opportunity.potential_value_c || 0,
        stage: opportunity.stage_c || 'Prospecting',
        closeDate: opportunity.close_date_c,
        ownerId: opportunity.owner_id_c?.Id || opportunity.owner_id_c,
        ownerName: opportunity.owner_id_c?.Name || null,
        createdOn: opportunity.CreatedOn,
        modifiedOn: opportunity.ModifiedOn
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching opportunities:", error?.response?.data?.message);
      } else {
        console.error("Error fetching opportunities:", error);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "potential_value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "close_date_c" } },
          { 
            field: { Name: "owner_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };

      const response = await apperClient.getRecordById('opportunity_c', id, params);

      if (!response || !response.data) {
        throw new Error("Opportunity not found");
      }

      const opportunity = response.data;
      return {
        Id: opportunity.Id,
        name: opportunity.name_c || opportunity.Name || '',
        description: opportunity.description_c || '',
        potentialValue: opportunity.potential_value_c || 0,
        stage: opportunity.stage_c || 'Prospecting',
        closeDate: opportunity.close_date_c,
        ownerId: opportunity.owner_id_c?.Id || opportunity.owner_id_c,
        ownerName: opportunity.owner_id_c?.Name || null,
        createdOn: opportunity.CreatedOn,
        modifiedOn: opportunity.ModifiedOn
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching opportunity with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching opportunity with ID ${id}:`, error);
      }
      throw error;
    }
  },

  async create(opportunityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: opportunityData.name || 'Untitled Opportunity',
          name_c: opportunityData.name || '',
          description_c: opportunityData.description || '',
          potential_value_c: opportunityData.potentialValue || 0,
          stage_c: opportunityData.stage || 'Prospecting',
          close_date_c: opportunityData.closeDate ? new Date(opportunityData.closeDate).toISOString().split('T')[0] : null,
          owner_id_c: opportunityData.ownerId ? parseInt(opportunityData.ownerId) : null
        }]
      };

      const response = await apperClient.createRecord('opportunity_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} opportunity records:${JSON.stringify(failedRecords)}`);
        }

        if (successfulRecords.length > 0) {
          const opportunity = successfulRecords[0].data;
          return {
            Id: opportunity.Id,
            name: opportunity.name_c || opportunity.Name || '',
            description: opportunity.description_c || '',
            potentialValue: opportunity.potential_value_c || 0,
            stage: opportunity.stage_c || 'Prospecting',
            closeDate: opportunity.close_date_c,
            ownerId: opportunity.owner_id_c,
            ownerName: null,
            createdOn: opportunity.CreatedOn,
            modifiedOn: opportunity.ModifiedOn
          };
        }
      }

      throw new Error('Failed to create opportunity');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating opportunity:", error?.response?.data?.message);
      } else {
        console.error("Error creating opportunity:", error);
      }
      throw error;
    }
  },

  async update(id, opportunityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id)
      };

      if (opportunityData.name !== undefined) {
        updateData.Name = opportunityData.name;
        updateData.name_c = opportunityData.name;
      }
      if (opportunityData.description !== undefined) updateData.description_c = opportunityData.description;
      if (opportunityData.potentialValue !== undefined) updateData.potential_value_c = opportunityData.potentialValue;
      if (opportunityData.stage !== undefined) updateData.stage_c = opportunityData.stage;
      if (opportunityData.closeDate !== undefined) {
        updateData.close_date_c = opportunityData.closeDate ? new Date(opportunityData.closeDate).toISOString().split('T')[0] : null;
      }
      if (opportunityData.ownerId !== undefined) updateData.owner_id_c = opportunityData.ownerId ? parseInt(opportunityData.ownerId) : null;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('opportunity_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} opportunity records:${JSON.stringify(failedUpdates)}`);
        }

        if (successfulUpdates.length > 0) {
          const opportunity = successfulUpdates[0].data;
          return {
            Id: opportunity.Id,
            name: opportunity.name_c || opportunity.Name || '',
            description: opportunity.description_c || '',
            potentialValue: opportunity.potential_value_c || 0,
            stage: opportunity.stage_c || 'Prospecting',
            closeDate: opportunity.close_date_c,
            ownerId: opportunity.owner_id_c,
            ownerName: opportunity.owner_id_c?.Name || null,
            createdOn: opportunity.CreatedOn,
            modifiedOn: opportunity.ModifiedOn
          };
        }
      }

      throw new Error('Failed to update opportunity');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating opportunity:", error?.response?.data?.message);
      } else {
        console.error("Error updating opportunity:", error);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('opportunity_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} opportunity records:${JSON.stringify(failedDeletions)}`);
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting opportunity:", error?.response?.data?.message);
      } else {
        console.error("Error deleting opportunity:", error);
      }
      throw error;
    }
  },

  async search(query) {
    try {
      if (!query.trim()) {
        return await this.getAll();
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "potential_value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "close_date_c" } },
          { 
            field: { Name: "owner_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [{
            conditions: [{
              fieldName: "name_c",
              operator: "Contains",
              values: [query]
            }],
            operator: "OR"
          }, {
            conditions: [{
              fieldName: "description_c", 
              operator: "Contains",
              values: [query]
            }],
            operator: "OR"
          }]
        }]
      };

      const response = await apperClient.fetchRecords('opportunity_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(opportunity => ({
        Id: opportunity.Id,
        name: opportunity.name_c || opportunity.Name || '',
        description: opportunity.description_c || '',
        potentialValue: opportunity.potential_value_c || 0,
        stage: opportunity.stage_c || 'Prospecting',
        closeDate: opportunity.close_date_c,
        ownerId: opportunity.owner_id_c?.Id || opportunity.owner_id_c,
        ownerName: opportunity.owner_id_c?.Name || null,
        createdOn: opportunity.CreatedOn,
        modifiedOn: opportunity.ModifiedOn
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching opportunities:", error?.response?.data?.message);
      } else {
        console.error("Error searching opportunities:", error);
      }
      return [];
    }
  }
};