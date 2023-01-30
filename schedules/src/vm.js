import createview from "./view.js";

export default function vm() {
  
  window.view = createview();

  const mainPage = document.getElementById("mainPage");
  const entryPage = document.getElementById("entryPage");
  const entryTeams = Array.from(entryPage.getElementsByClassName('entryTeam'));
  const entryScores = Array.from(entryPage.getElementsByClassName('entryScore'));
  const entryHistory = document.getElementById("history");
  const gameScores = Array.from(mainPage.getElementsByClassName('game')).map(s => ({
    scores: Array.from(s.getElementsByClassName('score')),
    teams: Array.from(s.getElementsByClassName('team'))
  }));

  function setScores1(id, scores) { gameScores[id]?.scores?.map((v, i) => v.innerHTML = scores?.[i] ); };

  function setPastScores(s = null) { view.setPastScores(s, entryHistory) };

  let id = null;

  async function setPage(game) {
    id = game;
    if (id) {
      try {
        setPastScores();

        entryTeams.map((x, i) => x.innerHTML = gameScores[id].teams[i].innerHTML);
        entryScores.map(x => x.value = '');

        mainPage.style.display = 'none';
        entryPage.style.display = 'block';
        entryScores[0].focus();

        await getPastScores(view, true);
      } catch {
      }
    } else {
      entryPage.style.display = 'none';
      mainPage.style.display = '';
    }
  };

  const getPage = () => id;

  async function setScores(list) { await list?.map(v => setScores1(v?.game, v?.scores)); };

  return {
    setPage,
    setScores,
    setPastScores,
    getPage
  }

}

// state defined by scores, id from web address
// stae
