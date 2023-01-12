import createdb from "./db.js";

export default function vm(date, renderPast) {

  const db = createdb();

  let entryId = '';

  const mainPage = document.getElementById("mainPage");
  const entryPage = document.getElementById("entryPage");
  const entryTeams = Array.from(entryPage.getElementsByClassName('entryTeam'));
  const entryScores = Array.from(entryPage.getElementsByClassName('entryScore'));
  const entryHistory = document.getElementById("history");
  const gameScores = Array.from(mainPage.getElementsByClassName('game')).map(s => ({
    scores: Array.from(s.getElementsByClassName('score')),
    teams: Array.from(s.getElementsByClassName('team'))
  }));

  function setScores(id, scores) { gameScores[id].scores.map((v, i) => v.innerHTML = scores[i]); };

  function renderPast1(s = null) { renderPast(s, entryHistory) };

  async function getPastScores(force = false) {
    const id = entryId;
    if (id) {
      const scores = await db.getPastScores(date, id, force);
      if (scores) renderPast1(scores);
    }
  };

  async function showPage(id) {
    entryId = id;
    if (id) {
      try {
        renderPast1();

        entryTeams.map((x, i) => x.innerHTML = gameScores[id].teams[i].innerHTML);
        entryScores.map(x => x.value = '');

        mainPage.style.display = 'none';
        entryPage.style.display = 'block';
        entryScores[0].focus();

        await getPastScores(true);
      } catch {
      }
    } else {
      entryPage.style.display = 'none';
      mainPage.style.display = '';
    }
  };

  async function gotoPage(id) {
    window.history.pushState({}, "", id ? `/#${id}` : '/');
    showPage(id);
  };

  async function saveScore() {
    const scores = entryScores.map(v => v.value)
    db.saveScore(date, entryId, scores);
    setScores(entryId, scores);
    history.back();
  };

  async function getScores() { (await db.getScores(date))?.map(v => setScores(v.game, v.scores)); };

  return {
    showPage,
    gotoPage,
    saveScore,
    getScores,
    getPastScores
  }

}

