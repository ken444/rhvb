import { CosmosClient, ChangeFeedStartFrom, StatusCodes } from '@azure/cosmos';

const databaseId = 'volleyball';
const containerId = 'Scores';

const client = new CosmosClient(process.env.COSMOSDB_CONNECTION_STRING);
const containerClient = client.database(databaseId).container(containerId);

export async function queryContainer(date, game) {
  try {
    if (game) return await containerClient.scripts.storedProcedure("getScoresByGame").execute([date], game);
    return await containerClient.scripts.storedProcedure("getLatestScores").execute([date]);
  } catch (error) {
    console.error('Error querying container:', error);
    throw error;
  }
}

export async function changeFeed(date, continuationToken) {
  try {
    const iterator = containerClient.items.getChangeFeedIterator({
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
    const { count, continuationToken } = await containerClient.items.getChangeFeedIterator({
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
  return containerClient.items.create(item);
}

/**
 * Fetches all items from the container.
 * @returns {Promise<Array<any>>} A promise that resolves to an array of items.
 */
export async function getItemsFromContainer() {
  try {
    const { resources: items } = await containerClient.items.readAll().fetchAll();
    return items;
  } catch (error) {
    console.error('Error fetching items from container:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}