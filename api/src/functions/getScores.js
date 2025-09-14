import { app } from '@azure/functions';
import { getItemsFromContainer } from '../cosmosdbOld.js';

app.http('getScoresData', {
    methods: ['GET'],
    authLevel: 'anonymous', // Adjust authLevel based on your security requirements
    route: 'scores', // API route will be /api/scores
    handler: async (request, context) => {
        context.log('JavaScript HTTP trigger function processed a GET request for /api/scores.');

        try {
            // TODO: Implement any specific querying logic if needed.
            // For example, you could use request.query to filter results:
            // const filterParam = request.query.get('filter');
            // const items = await getItemsFromContainer(filterParam);

            const items = await getItemsFromContainer(); // Fetches all items

            // Return items, even if it's an empty array (standard for GET collections)
            return {
                status: 200, // OK
                jsonBody: items
            };

        } catch (error) {
            context.log.error('Error retrieving data from database:', error);
            return {
                status: 500,
                jsonBody: { message: "Failed to retrieve data due to a server error." }
            };
        }
    }
});