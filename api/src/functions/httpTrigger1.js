import { CosmosClient } from '@azure/cosmos';
import { AppConfigurationClient } from "@azure/app-configuration";
import { app } from '@azure/functions';
import dotenv from 'dotenv';

import { getContainerMetadataWithConnectionString } from './getTimeStamp.js';

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

    const latest = await items.query(`SELECT VALUE MAX(c._ts) FROM c WHERE c.date='${date}' GROUP BY c.game`).fetchAll();
    return await items.query(`SELECT c.game, c.scores FROM c WHERE ARRAY_CONTAINS(${JSON.stringify(latest.resources)}, c._ts, false)`).fetchAll();
  } catch (error) {
    console.error('Error querying container:', error);
    throw error;
  }
}

async function getConfigurationSetting() {
  try {
    console.log("Retrieving configuration setting...");
    const configClient = new AppConfigurationClient(process.env.APPCONFIG_CONNECTION_STRING);
    const setting = await configClient.getConfigurationSetting({ key: "stage" });
    return setting.value;
  } catch (err) {
    console.error("Error retrieving configuration setting:", err);
    throw err;
  }
}

async function updateConfigurationSetting(setting) {
  try {
    const configClient = new AppConfigurationClient(process.env.APPCONFIG_CONNECTION_STRING);
    const updatedSetting = await configClient.setConfigurationSetting({
      key: "stage",
      value: setting.toString()
    });
    console.log(`Updated Key: ${updatedSetting.key}, New Value: ${updatedSetting.value}`);
  } catch (err) {
    console.error("Error updating configuration setting:", err);
    throw err;
  }
}


async function hasContainerChanged(previousContinuationToken = null) {
  const client = new CosmosClient(process.env.COSMOSDB_CONNECTION_STRING);

  try {
    const response = await client.database(databaseId).container(containerId).items.changeFeed({
      continuationToken: previousContinuationToken,
      maxItemCount: 1, // We only need to know if there's at least one change
    }).fetchAll();

    const hasChanged = response.resources && response.resources.length > 0;
    const latestContinuationToken = response.continuationToken;

    return { hasChanged, latestContinuationToken };

  } catch (error) {
    console.error("Error checking for changes:", error);
    return { hasChanged: false, latestContinuationToken: previousContinuationToken }; // Return previous token on error
  }
}

app.http('V3', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    console.log(request.params);
    try {
      const { stage, date, game } = request.params; 
      const { hasChanged, setting } = await hasContainerChanged(stage);

      console.log(stage, date, game, setting);
      if (!hasChanged) {
        return {
          body: JSON.stringify({
            stage: setting
          })
        };
      } else {
        const { resources } = await queryContainer(date, game);
        console.log(resources);
        return {
          body: JSON.stringify({
            data: resources,
            stage: setting
          })
        }
      }
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
      //const data = JSON.parse(await request.text());
      const data = await request.json();
      console.log(data);
      const client = new CosmosClient(process.env.COSMOSDB_CONNECTION_STRING);
      const { resource } = await client.database(databaseId).container(containerId).items.create(data);
      console.log(resource);
      //await updateConfigurationSetting(resource._ts);
      return {
        body: JSON.stringify({
          data: resource
        })
      }
    } catch (error) {
      console.error('Error creating item:', error);
      request.status(500).send(error);
    }
  }
});
