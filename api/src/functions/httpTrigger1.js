import { CosmosClient, ChangeFeedStartFrom } from '@azure/cosmos';
import { app } from '@azure/functions';
import dotenv from 'dotenv';

dotenv.config();

const databaseId = 'volleyball';
const containerId = 'Scores';


/**
 * Create the database if it does not exist
 */
async function createDatabase() {
  const client = new CosmosClient(process.env.COSMOSDB_CONNECTION_STRING);
  const { database } = await client.databases.createIfNotExists({ id: databaseId })
  console.log(`Created database:\n${database.id}\n`)
}

/**
 * Create the container if it does not exist
 */
async function createContainer() {
  const client = new CosmosClient(process.env.COSMOSDB_CONNECTION_STRING);
  const partitionKey = { kind: 'Hash', paths: ['/date'] }
  const { container } = await client.database(databaseId).containers.createIfNotExists({ id: containerId, partitionKey });
  console.log(`Created container:\n${_container.id}\n`)
}

function container() {
  const client = new CosmosClient(process.env.COSMOSDB_CONNECTION_STRING);
  return client.database(databaseId).container(containerId);
}

async function queryContainer(date, game) {
  try {
    if (game) return await container().scripts.storedProcedure("getScoresByGame").execute([date], game);
    return await container().scripts.storedProcedure("getLatestScores").execute([date]);
  } catch (error) {
    console.error('Error querying container:', error);
    throw error;
  }
}

async function hasContainerChanged(previousContinuationToken) {
  try {
    const { count, continuationToken } = await container().items.getChangeFeedIterator({
      maxItemCount: 1, // We only need to know if there's at least one change
      changeFeedStartFrom: !previousContinuationToken ? ChangeFeedStartFrom.Now() : ChangeFeedStartFrom.Continuation(previousContinuationToken),
    }).readNext();

    const hasChanged = !previousContinuationToken || count > 0;
    return { hasChanged, continuationToken };

  } catch (error) {
    console.error("Error checking for changes:", error);
    return { hasChanged: false, continuationToken: '' };
  }
}

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
      console.error('Error handling request:', error);
      return {
        status: 500,
        body: error.message
      };
    }
  }
});

app.http('V3p', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request) => {
    try {
      const data = await request.json();
      const { resource } = await container().items.create(data);
      return { body: JSON.stringify(resource) };
    } catch (error) {
      console.error('Error creating item:', error);
      request.status(500).send(error);
    }
  }
});
