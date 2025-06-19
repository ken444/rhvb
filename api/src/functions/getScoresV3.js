import { app } from '@azure/functions';
import { queryContainer, hasContainerChanged } from '../cosmosdb.js';

app.http('V3', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request) => {
    try {
      const { stage, date, game } = request.params;
      const { hasChanged, continuationToken } = await hasContainerChanged(stage);
      const r = { stage: continuationToken };
      if (hasChanged) {
        const { resource } = await queryContainer(date, game);
        r.data = resource;
      }
      return { body: JSON.stringify(r) };
    } catch (error) {
      console.error('Error handling V3 request:', error);
      return {
        status: 500,
        body: error.message
      };
    }
  }
});