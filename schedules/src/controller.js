import createdb from "./db.js";

export default function controller() {

    const db = createdb();

    function setScores(id, scores) { gameScores[id]?.scores?.map((v, i) => v.innerHTML = scores?.[i]); };

    function renderPastScores( s = null) { vm.renderPast(s, entryHistory) };

    async function getPastScores( force = false) {
        const id = vm.game;
        if (id) {
            const scores = await db.getPastScores(date, id, force);
            if (scores) renderPastScores( scores);
        }
    };

    async function gotoPage(game) {
        vm.setid(game);
    };

    async function saveScore() {
        const scores = vm.entryScores.map(v => v.value);
        db.saveScore(view.date, vm.id, scores);
        setScores(view, view.id, scores);
        mainPageReturn();
    };

    async function getScores() { vm.setScores(await db.getScores(view.date)) };


    async function gotoPage(id) {
        history.pushState({}, '', `${location.pathname}#${id}`);
        vm.setPage(id);
    };

    function mainPageReturn() {
        if (history.length > 1) history.back();
        else vm.gotoPage();
    }

    vm.setPage();

    async function startup() {

        window.addEventListener("popstate", async () => {
            const id = location.hash.substring(1);
            await vm.setPage(id);
        });

        await getScores();

        setInterval(async () => {
            await getScores();
            await getPastScores();
        }, 60000);
    }

    return {
        gotoPage,
        mainPageReturn,
        saveScore,
        startup
    }

}