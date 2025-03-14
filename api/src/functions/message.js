import { app } from '@azure/functions';

app.http('myFunction9871', {
  methods: ['GET'],
  route: 'V9/date/{date}/{stage}',
  authLevel: 'anonymous',
  handler: async (request, context) => {
    return {
        body: JSON.stringify({
            text: `Hello in Cosmos DB.`
        })
    };
  }
});