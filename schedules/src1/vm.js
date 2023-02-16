import createview from "./view.js";

export default function vm() {
  
  window.view = createview();

  const mainPage = document.querySelector("#mainPage");
  const entryPage = document.querySelector("#entryPage");
  const entryTeams = Array.from(entryPage.querySelectorAll('[data-entryTeam]'));
  const entryScores = Array.from(entryPage.querySelectorAll('[data-entryScore]'));
  const entryHistory = document.querySelector("#history");
  const gameScores = Array.from(mainPage.querySelectorAll('[data-game]')).map(s => ({
    scores: Array.from(s.querySelectorAll('[data-score]')),
    teams: Array.from(s.querySelectorAll('[data-team]'))
  }));

  let id = null;

  function setPage(game) {
    id = game;
    if (id) {
      try {
        mainPage.style.display = 'none';
        entryPage.style.display = 'block';
        entryScores[0].focus();
      } catch {
      }
    } else {
      entryPage.style.display = 'none';
      mainPage.style.display = 'block';
    }
  };

  const getTeams = (g) => gameScores[g].teams.map((x) => x.innerHTML);

  const setEntryTeams = (g) => {
    view.setPastScores(null, entryHistory);
    entryTeams.map((x, i) => x.innerHTML = getTeams(g)[i]);
    entryScores.map(x => x.value = '');
  }

  return {
    setScores: (s) => gameScores[s.game]?.scores?.map((v, i) => v.innerHTML = s.scores?.[i]),
    setPastScores: (s = null) => view.setPastScores(s, entryHistory),
    getPage: () => id,
    setPage,
    getEntry: () => ({date: view.date, game: id, scores: entryScores.map(v => v.value) }),
    setEntryTeams,
  }

}

// state defined by scores, id from web address

