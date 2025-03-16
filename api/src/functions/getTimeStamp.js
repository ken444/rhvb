import crypto from 'crypto';

async function getContainerMetadataWithConnectionString(connectionString, databaseId, containerId) {
  const resourcePath = `dbs/${databaseId}/colls/${containerId}`;
  const resourceType = 'colls';
  const method = 'GET';
  const apiVersion = '2018-12-31'; 
  const currentDate = new Date().toUTCString();

  // Parse the connection string to extract AccountEndpoint and AccountKey
  const parsedConnectionString = parseCosmosDBConnectionString(connectionString);
  if (!parsedConnectionString) {
    console.error('Invalid Cosmos DB connection string format.');
    return null;
  }
  const accountEndpoint = parsedConnectionString.AccountEndpoint;
  const masterKey = parsedConnectionString.AccountKey;
  const requestUrl = `${accountEndpoint}${resourcePath}`;

  // Construct the signature for Master Key authorization
  const signature = getMasterKeySignature(method, resourceType, resourcePath, currentDate, masterKey);
  const authorizationHeader = `type=master&ver=1.0&sig=${encodeURIComponent(signature)}`;

  const headers = {
    'x-ms-version': apiVersion,
    'x-ms-date': currentDate,
    'Accept': 'application/json',
    'Authorization': authorizationHeader,
  };

  try {
    const response = await fetch(requestUrl, {
      method: method,
      headers: headers,
    });

    if (response.ok) {
      const metadata = await response.json();
      return metadata;
    } else {
      console.error(`Error fetching container metadata. Status: ${response.status}`);
      const errorBody = await response.text();
      console.error(`Error Body: ${errorBody}`);
      return null;
    }
  } catch (error) {
    console.error('An error occurred:', error);
    return null;
  }
}

function parseCosmosDBConnectionString(connectionString) {
    const parts = connectionString.split(';');
    const result = {};
    for (const part of parts) {
      const index = part.indexOf('=');
      if (index > 0) {
        const key = part.substring(0, index).trim();
        const value = part.substring(index + 1).trim();
        result[key] = value;
      }
    }
    if (result.AccountEndpoint && result.AccountKey) {
      return {
        AccountEndpoint: result.AccountEndpoint,
        AccountKey: result.AccountKey,
      };
    }
    return null;
  }

function getMasterKeySignature(method, resourceType, resourceLink, date, masterKey) {
  const key = Buffer.from(masterKey, 'base64');
  const text = `${method.toLowerCase()}\n${resourceType.toLowerCase()}\n${resourceLink}\n${date.toLowerCase()}\n\n`;
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(text);
  const signature = hmac.digest('base64');
  return signature;
}

export { getContainerMetadataWithConnectionString };