import createview from "./view.js";

export default function vm() {
  
  const view = createview();

  const entryPage = () => document.querySelector("#entryPage");
  const entryGame = () => document.querySelector("#entryGame");
  const entryHeading = () => document.querySelector("[data-entryheading]");
  const entryTeams = () => Array.from(entryPage.querySelectorAll('[data-entryTeam]'));
  const entryScores = () => Array.from(entryPage.querySelectorAll('[data-entryScore]'));
  const entryHistory = () => document.querySelector("#history");
  ;

  let id = null;

  function setPage(game) {
    id = game;
    if (id) {
      try {
        entryPage().style.display = 'block';
        entryScores()[0].focus();
      } catch {
      }
    } else {
      entryPage().style.display = 'none';
    }
  };

  const getTeams = (g) => gameScores[g].teams.map((x) => x.innerHTML);

  const setEntryTeams = (g) => {
    view.setPastScores(null, entryHistory());
    entryTeams().map((x, i) => x.innerHTML = getTeams(g)[i]);
    entryScores().map(x => x.value = '');
    const x = gameScores[g];
    entryHeading().innerHTML = x.game.innerHTML;
    const cc = window.getComputedStyle(x.color).getPropertyValue('background-color');
    entryGame().style.backgroundColor = cc;
  }

  return {
    page: view.scorePage,
    getPage: () => id,
    setPage,
    setPastScores: (s = null) => view.setPastScores(s, entryHistory()),
    getEntry: () => ({date: view.date, game: id, scores: entryScores().map(v => v.value) }),
    setEntryTeams,
  }

}

// state defined by scores, id from web address

