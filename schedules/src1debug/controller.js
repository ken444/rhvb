import createdb from "./db.js";
import createvm from "./vm.js";

export default function controller() {

    const db = createdb();
    const vm = createvm();

    async function updatePastScores(force = false) {
        const id = vm.getPage();
        if (id) {
            const scores = await db.getPastScores(view.date, id, force);
            if (scores) vm.setPastScores(scores);
        }
    };

    async function saveScore() {
        const scores = vm.getEntry();
        vm.setScores(scores);
        await db.saveScore(scores);
        await gotoPage();
    };

    async function updateScores() {
        const scores = await db.getScores(view.date);
        await scores?.map(v => vm.setScores(v));
    };

    async function setPage(game) {
        if (game) {
            try {
                //vm.entryGame window.getComputedStyle( document.body ,null).getPropertyValue('background-color')
                
                vm.setEntryTeams(game);
                vm.setPage(game);
                await updatePastScores(true);
            } catch {
            }
        } else {
            vm.setPage();
        }
    };

    async function gotoPage(game) {
        if (game) {
            history.pushState({}, '', '#');
            await setPage(game);
        } else {
            history.back();
        }
    };

    async function startup() {

        await setPage();

        window.addEventListener("popstate", async () => await setPage());

        await updateScores();

        setInterval(async () => {
            await updateScores();
            await updatePastScores();
        }, 60000);
    }

    return {
        gotoPage,
        saveScore,
        startup
    }

}