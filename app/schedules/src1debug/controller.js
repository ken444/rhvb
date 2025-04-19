import createdb from "./db.js";
import createview from "./view.js";

export default function controller() {
    const db = createdb();
    const view = createview();

    document.body.appendChild(view.view);

    // Listener for the 'navigate' event
    document.addEventListener('navigate', async (event) => await gotoPage(event.detail));

    // Listener for the 'save-score' event
    document.addEventListener('save-score', async (event) => {
        view.setScores(event.detail);
        await db.saveScore(event.detail);
        await gotoPage();
    });

    async function updateScores() {
        let change = false;
        while (true) {
            const { items, complete } = await db.changeFeed(document.date);
            if (items) {
                items.map(v => document.allScores.push(v));
                items.map(v => view.setScores(v));
                change = true;
            }
            if (complete) break;
        };
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

        setInterval(async () => await updateScores(), 60000);
    }

    return { startup };
}