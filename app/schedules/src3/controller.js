import createdb from "./db.js";
import createvm from "./vm.js";
import buildschedule from "./schedule.js";

export default function controller() {

    const db = createdb();
    const { schedule, date } = buildschedule();
    const vm = createvm(schedule);

    const findIndex = (id) => schedule.findIndex((e) => e[0] == id);

    async function updatePastScores(force = false) {
        const index = vm.getPage();
        if (index) {
            const id = schedule[index][0];
            const scores = await db.getPastScores(date, id, force);
            if (scores && index == vm.getPage()) vm.setEntryPastScores(scores);
        }
    };

    async function saveScore() {
        const scores = vm.getEntryScores();
        const index = vm.getPage();
        vm.setScores(index, scores);
        const game = schedule[index][0];
        await db.saveScore(date, game, scores);
        await gotoPage();
    };

    async function updateScores() {
        const scores = await db.getScores(date);
        await scores?.map(v => {
            const index = findIndex(v.game);
            vm.setScores(index, v.scores)
        });
    };

    async function setPage(game) {
        if (game) {
            try {
                vm.resetEntry(schedule[game][2]);
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