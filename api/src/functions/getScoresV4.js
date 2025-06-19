import { app } from '@azure/functions';
import { changeFeed }  from '../cosmosdb.js';

app.http('V4', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request) => {
    try {
      const { stage, date } = request.params;
      return { body: JSON.stringify(await changeFeed(date, stage)) };
    } catch (error) {
      console.error('Error handling V4 request:', error);
      return {
        status: 500,
        body: error.message
      };
    }
  }
});