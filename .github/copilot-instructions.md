## About this Workspace

This repository contains the frontend and backend for a volleyball league management application.

-   **Frontend (`/app`):** An Azure Static Web App that displays schedules, scores, and allows for score entry. It's built with plain HTML, JavaScript, and the `twind` library for styling.
-   **Backend (`/api`):** An Azure Functions app written in Node.js. It provides a RESTful API for managing scores, which are stored in Azure Cosmos DB.

## Architecture & Patterns

### Frontend: Evolving Schedule App

The core of the frontend is the schedule viewer. There are multiple, independent versions of this app located in `app/schedules/src*/`. Each version has its own approach to rendering and state management.

-   **HTML Structure:** Schedule data is embedded directly within each `app/schedules/*.html` file in a `<script>` tag as `window.schedule`.
-   **App Versions:**
    -   `src1`: Uses `lit-html` for templating. See [`app/schedules/src1/view.js`](app/schedules/src1/view.js).
    -   `src4`, `src6`: Use a custom hyperscript-style rendering function `h`. See [`app/schedules/src6/view.js`](app/schedules/src6/view.js).
-   **Styling:** The project uses `twind` (a Tailwind-in-JS library). A bundled and configured version is at [`app/twind/twind.js`](app/twind/twind.js).

When working on the schedule pages, identify which `src` version the HTML file is using and apply patterns from that directory.

### Backend: Azure Functions & Cosmos DB

The backend is a standard Node.js Azure Functions app.

-   **API Endpoints:** Functions are defined in `api/src/functions/`. For example, [`api/src/functions/getScoresV5.js`](api/src/functions/getScoresV5.js) defines endpoints for fetching and saving scores.
-   **Database Interaction:** All database logic is in [`api/src/cosmosdb.js`](api/src/cosmosdb.js). It uses the `@azure/cosmos` SDK to interact with the `scores` container. The API uses stored procedures (`getScoresByGame`, `getLatestScores`) and change feeds to efficiently retrieve data.
-   **API Routing:** The frontend is configured to proxy requests from `/api/*` to the backend functions. This is defined in [`app/staticwebapp.config.json`](app/staticwebapp.config.json). The frontend makes API calls to relative paths like `/api/V5`. See [`app/schedules/src4/db.js`](app/schedules/src4/db.js).

## Development Workflow

### Running Locally

The project is designed to be run using the Azure Static Web Apps CLI (`swa`).

1.  **Start the API:**
    ```bash
    # In the /api directory
    npm install
    npm start
    ```

2.  **Start the Frontend and SWA CLI:**
    ```bash
    # In the root directory
    swa start app --api-location api
    ```
    This command serves the frontend from the `app` folder and proxies API requests to the function app running on port 7071.

### Environment Variables

The backend requires a connection string for Cosmos DB. Create a `api/local.settings.json` file with your connection string:

````json
// filepath: api/local.settings.json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "COSMOSDB2_CONNECTION_STRING": "your-cosmos-db-connection-string"
  }
}