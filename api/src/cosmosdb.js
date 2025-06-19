import { CosmosClient, ChangeFeedStartFrom, StatusCodes } from '@azure/cosmos';

const databaseId = 'volleyball';
const containerId = 'Scores';

const client = new CosmosClient(process.env.COSMOSDB_CONNECTION_STRING);
const database = client.database(databaseId);
const containerClient = database.container(containerId);

/**
 * Create the database if it does not exist
 */
export async function createDatabase() {
  const { database: db } = await client.databases.createIfNotExists({ id: databaseId });
  console.log(`Created database:\n${db.id}\n`);
  return db;
}

/**
 * Create the container if it does not exist
 */
export async function createContainer() {
  const partitionKey = { kind: 'Hash', paths: ['/FOS'] };
  const { container } = await database.containers.createIfNotExists({ id: containerId, partitionKey });
  console.log(`Created container:\n${container.id}\n`);
  return container;
}

/**
 * Gets the Cosmos DB container client.
 * @returns {import('@azure/cosmos').Container} The container client.
 */
export function getContainerClient() {
  return containerClient;
}

export async function queryContainer(date, game) {
  try {
    const currentContainer = getContainerClient();
    if (game) return await currentContainer.scripts.storedProcedure("getScoresByGame").execute([date], game);
    return await currentContainer.scripts.storedProcedure("getLatestScores").execute([date]);
  } catch (error) {
    console.error('Error querying container:', error);
    throw error;
  }
}

export async function changeFeed(date, continuationToken) {
  try {
    const iterator = getContainerClient().items.getChangeFeedIterator({
      changeFeedStartFrom: continuationToken ? ChangeFeedStartFrom.Continuation(continuationToken) : ChangeFeedStartFrom.Beginning(date)
    });

    const response = await iterator.readNext();
    const items = response.result ? response.result.map((item) => ({ game: item.game, scores: item.scores })) : [];

    return { continuation: response.continuationToken, complete: response.statusCode === StatusCodes.NotModified, items };
  } catch (error) {
    console.error('Error processing change feed:', error);
    throw error;
  }
}

export async function hasContainerChanged(previousContinuationToken) {
  try {
    const { count, continuationToken } = await getContainerClient().items.getChangeFeedIterator({
      maxItemCount: 1, // We only need to know if there's at least one change
      changeFeedStartFrom: !previousContinuationToken ? ChangeFeedStartFrom.Now() : ChangeFeedStartFrom.Continuation(previousContinuationToken),
    }).readNext();

    const hasChanged = count > 0; // Simplified: if previousContinuationToken is null, ChangeFeedStartFrom.Now() will only show *new* changes.
    return { hasChanged, continuationToken };
  } catch (error) {
    console.error("Error checking for changes:", error);
    return { hasChanged: false, continuationToken: previousContinuationToken || '' }; // Return previous token on error
  }
}

export async function createItemInContainer(item) {
  return getContainerClient().items.create(item);
}