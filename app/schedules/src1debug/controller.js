import createdb from "./db.js";
import createview from "./view.js";

export default function controller() {
    const db = createdb();
    const view = createview();

    // Listener for the 'navigate' event
    document.addEventListener('navigate', async (event) => {
        const game = event.detail; // Retrieve game details from the event
        await gotoPage(game);
    });

    // Listener for the 'save-score' event
    document.addEventListener('save-score', async (event) => {
        const scores = event.detail; // Retrieve scores from the event
        await saveScore(scores);
    });

    async function saveScore(scores) {
        view.setScores(scores);
        await db.saveScore(scores);

        await gotoPage();
    }

    async function updateScores() {
        let complete = false;
        let change = false;
        do {
            const r = await db.changeFeed(document.date);
            if (r.items) {
                r.items.map(v => document.allScores.push(v));
                r.items.map(v => view.setScores(v));
                change = true;
            }
            complete = r.complete;
        } while (!complete);
        if (change) view.updatePastScores();

    }

    document.allScores = [];

    async function gotoPage(game) {
        await updateScores();
        if (game) {
            history.pushState({}, '', '#');
            view.setPage(game);
        } else {
            history.back();
        }
    }

    async function startup() {
        view.setPage();

        window.addEventListener("popstate", () => view.setPage());

        await updateScores();

        setInterval(async () => {
            await updateScores();
        }, 60000);
    }

    return {
        startup
    };
}