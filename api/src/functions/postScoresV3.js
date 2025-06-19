import { app } from '@azure/functions';
import { createItemInContainer } from '../cosmosdb.js';

app.http('V3p', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request) => {
    try {
      const data = await request.json();
      const { resource } = await createItemInContainer(data);
      return { body: JSON.stringify(resource) };
    } catch (error) {
      console.error('Error creating item (V3p):', error);
      // Note: Azure Functions v4 programming model expects a returned object for errors.
      // `request.status(500).send(error)` is more Express-like.
      return { status: 500, body: error.message || 'Error creating item' };
    }
  }
});