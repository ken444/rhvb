import { app } from '@azure/functions';
import { changeFeed, createItemInContainer, queryContainer, hasContainerChanged }  from '../cosmosdbOld.js';

app.http('V5', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request) => {
    try {
      const { stage, date } = request.params;
      return { body: JSON.stringify(await changeFeed(date, stage)) };
    } catch (error) {
      console.error('Error handling V5 request:', error);
      return {
        status: 500,
        body: error.message
      };
    }
  }
});

app.http('V5p', {
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

app.http('V5g', {
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