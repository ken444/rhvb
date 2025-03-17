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

/**
 * Query the container using SQL
 */
async function queryContainer(date, game) {
  try {
    const client = new CosmosClient(process.env.COSMOSDB_CONNECTION_STRING);
    const items = client.database(databaseId).container(containerId).items;
    if (game) return await items.query(`SELECT c.scores FROM c WHERE (c.date='${date}') and (c.game='${game}') ORDER BY c._ts DESC`).fetchAll();
    const { resources } = await items.query(`SELECT VALUE MAX(c._ts) FROM c WHERE c.date='${date}' GROUP BY c.game`).fetchAll();
    return await items.query(`SELECT c.game, c.scores FROM c WHERE ARRAY_CONTAINS(${JSON.stringify(resources)}, c._ts, false)`).fetchAll();
  } catch (error) {
    console.error('Error querying container:', error);
    throw error;
  }
}

async function hasContainerChanged(previousContinuationToken) {
  try {
    const client = new CosmosClient(process.env.COSMOSDB_CONNECTION_STRING);

    const { count, continuationToken } = await client.database(databaseId).container(containerId).items.getChangeFeedIterator({
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
  handler: async (request, context) => {
    console.log(request.params);
    try {
      const { stage, date, game } = request.params;
      const { hasChanged, continuationToken } = await hasContainerChanged(stage);
      const r = { stage: continuationToken };
      if (hasChanged) {
        const { resources } = await queryContainer(date, game);
        console.log(resources);
        r.data = resources;
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
  handler: async (request, context) => {
    try {
      const data = await request.json();
      console.log(data);
      const client = new CosmosClient(process.env.COSMOSDB_CONNECTION_STRING);
      const { resource } = await client.database(databaseId).container(containerId).items.create(data);
      console.log(resource);
      return { body: JSON.stringify(resource) };
    } catch (error) {
      console.error('Error creating item:', error);
      request.status(500).send(error);
    }
  }
});
