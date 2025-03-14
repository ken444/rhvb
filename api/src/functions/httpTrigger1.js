import { CosmosClient } from '@azure/cosmos';
import { AppConfigurationClient } from "@azure/app-configuration";
import { app } from '@azure/functions';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.API_KEY;
console.log(apiKey);

const databaseId = 'volleyball';
const containerId = 'Scores';
const partitionKey = { kind: 'Hash', paths: ['/date'] }

const configConnectionString = process.env.APPCONFIG_CONNECTION_STRING;

const dbConnection = process.env.COSMOSDB_CONNECTION_STRING;
/**
 * Create the database if it does not exist
 */
async function createDatabase() {
  const { database } = await client.databases.createIfNotExists({ id: databaseId })
  console.log(`Created database:\n${database.id}\n`)
}

/**
 * Create the container if it does not exist
 */
async function createContainer() {
  const { container } = await client.database(databaseId).containers.createIfNotExists({ id: containerId, partitionKey });
  console.log(`Created container:\n${_container.id}\n`)
}

/**
 * Query the container using SQL
 */

async function queryContainerV2(date, game) {

  try {
    const client = new CosmosClient(dbConnection);
    const items = client.database(databaseId).container(containerId).items;
    //if (game) return await items.query(`SELECT c.scores FROM c WHERE (c.date='${date}') and (c.game='${game}') ORDER BY c._ts DESC`).fetchAll();
    const latest = await items.query(`SELECT VALUE MAX(c._ts) FROM c WHERE c.date='${date}' GROUP BY c.game`).fetchAll();
    return await items.query(`SELECT c.game, c.scores FROM c WHERE ARRAY_CONTAINS(${JSON.stringify(latest.resources)}, c._ts, false)`).fetchAll();
  } catch (error) {
    console.error('Error querying container:', error);
    throw error;
  }
}

async function queryContainer1V2(date, game) {
  const client = new CosmosClient(dbConnection);
  const items = client.database(databaseId).container(containerId).items;
  if (game) return await items.query(`SELECT c.scores FROM c WHERE (c.date='${date}') and (c.game='${game}') ORDER BY c._ts DESC`).fetchAll();

  const latest = await items.query(`SELECT VALUE MAX(c._ts) FROM c WHERE c.date='${date}' GROUP BY c.game`).fetchAll();
  return await items.query(`SELECT c.game, c.scores FROM c WHERE ARRAY_CONTAINS(${JSON.stringify(latest.resources)}, c._ts, false)`).fetchAll();
}

async function queryContainerV3(date, game) {
  if (!game) {
    return await queryContainerV2(date);
  }
  return await queryContainer1V2(date, game);
}

async function getConfigurationSetting() {
  try {
    console.log("Retrieving configuration setting...");
    const configClient = new AppConfigurationClient(configConnectionString);
    const setting = await configClient.getConfigurationSetting({ key: "stage" });
    console.log(`Key: ${setting.key}, Value: ${setting.value}`);
    return setting.value;
  } catch (err) {
    console.error("Error retrieving configuration setting:", err);
    throw err;
  }
}

async function updateConfigurationSetting(setting) {
  try {
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

app.http('myFunction98769', {
  methods: ['GET'],
  route: 'V2/date/{date}/game/{game}/{stage}',
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const setting = await getConfigurationSetting();
      if (request.params.stage == setting) {
        return {
          body: JSON.stringify({
            stage: setting
          })
        };
      } else {
        const { resources } = await queryContainer1V2(request.params.date, request.params.game);
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

app.http('myFunction987', {
  methods: ['GET'],
  route: 'V2/date/{date}/{stage}',
  authLevel: 'anonymous',
  handler: async (request, context) => {
    console.log(request.params);
    try {
      const setting = await getConfigurationSetting();
      console.log(setting); 
      if (request.params.stage == setting) {
        return {
          body: JSON.stringify({
            stage: setting
          })
        };
      } else {
        const { resources } = await queryContainerV2(request.params.date, null);
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

app.http('myFunction9875', {
  methods: ['POST'],
  route: 'V2',
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const { resource } = await client.database(databaseId).container(containerId).items.create(request.body);
      await updateConfigurationSetting(resource._ts);
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


// get('/V3', async (req, res, next) => {
//   try {
//     const { date, game, stage } = req.query;
//     if (!date || !stage) {
//       return res.status(400).send('Missing required query parameters');
//     }
//     const setting = await getConfigurationSetting();
//     if (stage == setting) {
//       res.send({stage: setting});
//     } else {
//       const { resources } = !game ? await queryContainerV2(date) : await queryContainer1V2(date, game);
//       res.send(
//         JSON.stringify({
//           data: resources,
//           stage: setting
//         })
//       )
//     }
//   } catch (error) { return next(error) }
// })

// post('/V3/', async (req, res) => {
//   try {
//     const { resource } = await client.database(databaseId).container(containerId).items.create(req.body);
//     updateConfigurationSetting(resource._ts);
//     res.send(resource);
//   } catch (error) {
//     console.error('Error creating item:', error);
//     res.status(500).send(error);
//   }
// });

// listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })


