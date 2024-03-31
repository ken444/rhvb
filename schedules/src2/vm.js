import createview from "./view.js";

export default function vm(schedule) {
  
  const view = createview(schedule);

  const mainPage = document.querySelector("#mainPage");
  const entryPage = document.querySelector("#entryPage");
  const entryGame = document.querySelector("#entryGame");
  const entryHeading = document.querySelector("[data-entryheading]");
  const entryTeams = Array.from(entryPage.querySelectorAll('[data-entryTeam]'));
  const entryScores = Array.from(entryPage.querySelectorAll('[data-entryScore]'));
  const entryHistory = document.querySelector("#history");
  const gameScores = Array.from(mainPage.querySelectorAll('[data-schedule]')).map(s => (
    Array.from(s.querySelectorAll('[data-score]'))
  ));

  let index = null;

  function setPage(game) {
    index = game;
    if (index) {
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

  function resetEntry(game) {

    view.setPastScores(null, entryHistory);

    entryTeams.map((x, i) => x.innerHTML = game.teams[i]);

    entryScores.map(x => x.value = '');

    entryHeading.innerHTML = game.game;

    entryGame.classList.remove(...entryGame.classList);

    entryGame.classList.add(game.color);

  }

  return {
    setScores: (index, score) => gameScores[index]?.map(
      (v, i) => v.innerHTML = score?.[i]
      ),
    setEntryPastScores: (s = null) => view.setPastScores(s, entryHistory),
    getPage: () => index,
    setPage,
    getEntryScores: () => (entryScores.map(v => v.value) ),
    resetEntry,
  }

}

// state defined by scores, id from web address

