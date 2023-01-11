import { html, render } from 'https://unpkg.com/lit-html?module';
import { tw } from 'https://cdn.skypack.dev/twind';
import schedule from "./schedule.js";

const scoreLine = html`
  <div class=${tw`p-4 m-4 rounded-3xl bg-red-400 grid items-center text-8xl`}>
    <div class=${`${tw`p-4`} entryTeam`}></div>
    <input autofocus class=${`${tw`rounded-3xl m-4 p-0 w-1/2 place-self-end text-right focus:ring-[16px]`} entryScore`} type="number">
  </div>
`;

const pastScoreLine = (score) => html`
<div class=${tw`m-4 rounded-3xl bg-red-400 grid items-center text-7xl`}>
  <div class=${tw`rounded-3xl w-1/2 place-self-end text-right mx-8`}>${score}</div>
</div>
`;

const scorePage = html`
  <div class=${tw`grid content-start`}>
    <i class=${`${tw`text-8xl m-4 p-4`} material-icons`} @click=${() => history.back()}>close</i>
    <div class=${tw`grid grid-cols-2`}>
      ${scoreLine}
      ${scoreLine}
    </div>
  
    <button tabindex="0" class=${tw`text-6xl m-8 p-8 font-semibold text-white bg-blue-500 border-b-4 border-blue-700
                            rounded-3xl shadow-md hover:bg-blue-600 hover:border-blue-800`} @click=${async () => vm.saveScore()}>Save</button>
    <div id="history"></div>
  </div>

`;

const pastScores = (scores) => html`
  <div class=${tw`grid grid-cols-2`}>
    ${scores.map(v=>pastScoreLine(v))}
  </div>
`;

const team = (t) => html`
  <div class=${`${tw`col-span-2`} team`}>${t}</div>
  <div class=${`${tw`justify-self-end`} score`}></div>
`;

const game = (id, teams) => html`
  <div @click=${async () => await vm.setPage(id)}
    class=${`${tw`rounded-2xl bg-blue-400 p-4 m-4 grid grid-flow-col grid-cols-7 items-center`} game`}>
    ${team(teams[0])}
    <div></div>
    ${team(teams[1])}
  </div>
`;

const heading = (s) => html`
  <div class=${tw`text-6xl text-center font-semibold`}>${s}</div>
`;

const title = (s) => html`
  <div class=${tw`text-4xl p-3 italic`}>${s}</div>
`;

let vm = {};

let gameIndex = 0;
const htmlArray = schedule.split('\n').map((element) => {
  let entry = element.split('\t');
  switch(entry[0]) {  
    case 'g':
      return game(`${gameIndex++}`, [entry[1], entry[2]])
    case 't':
      return heading(entry[1]);
    case 'h':
      return title(entry[1]);
    case 'd':
      vm.date = entry[1];
  }
})

const dom = html`
  <div id="mainPage" class=${tw`grid text-8xl`}> ${htmlArray} </div>
  <div id="entryPage" class=${tw`${'grid hidden'}`}> ${scorePage} </div>
`;

render(dom, document.body);

vm.stage = -1;
vm.entryStage = -1;
vm.scroll = 0;
vm.mainPage = document.getElementById("mainPage");
vm.entryPage = document.getElementById("entryPage");
vm.entryTeams = Array.from(vm.entryPage.getElementsByClassName('entryTeam'));
vm.entryScores = Array.from(vm.entryPage.getElementsByClassName('entryScore'));
vm.entryHistory = document.getElementById("history");
vm.gameScores = Array.from(vm.mainPage.getElementsByClassName('game')).map(s => { return {
    scores: Array.from(s.getElementsByClassName('score')),
    teams: Array.from(s.getElementsByClassName('team'))
  }
}
);

//vm.setScores = (id, scores) => scores.map((v,i) => vm.gameScores[id][i].innerHTML = v);

vm.setScores = (id, scores) => vm.gameScores[id].scores.map((v,i) => v.innerHTML = scores[i]);

window.addEventListener("popstate", async e => {
  const uu = new URL(window.location.href).pathname;
  await vm.renderContent(uu.length > 1 ? uu.substring(1) : null);
}
);

vm.setPage = async (id) => {
  window.history.pushState({}, "", id ? `/${id}` : '/');
  vm.renderContent(id);
}

vm.renderContent = async (id) => {
  vm.entryId = id;
  if (id) {
    try{
      render(html`<div></div>`, document.getElementById("history"));

      vm.entryTeams.map((x, i) => x.innerHTML = vm.gameScores[id].teams[i].innerHTML);
      vm.entryScores.map(x => x.value = '');

      vm.mainPage.style.display = 'none';
      vm.entryPage.style.display = 'block';
      vm.entryScores[0].focus();

      vm.entryStage = -1;

      await vm.getPastScores();
    } catch {
      const r = 0;
    }
    } else {
    vm.entryPage.style.display = 'none';
    vm.mainPage.style.display = '';
  }
}

//const uri = "http://localhost:3000";
const uri = "https://node12351232153234.azurewebsites.net"

vm.saveScore = async () => {
  let score = {
    date: vm.date,
    game: vm.entryId,
    scores: vm.entryScores.map(v=>v.value)
  };
  const response = await fetch(uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(score)
  });

  vm.setScores(vm.entryId, score.scores);
  history.back();
}

vm.getScores = async () => {
  const scores = await (await fetch(`${uri}/date/'${vm.date}'/${vm.stage}`)).json();
  vm.stage = scores.stage;
  scores.data?.map(v=>vm.setScores(v.game, v.scores));
}

vm.getPastScores = async () => {
  const id = vm.entryId;
  if (id) {
    const scores = await (await fetch(`${uri}/date/'${vm.date}'/game/'${id}'/${vm.entryStage}`)).json();
    vm.entryStage = scores.stage;
    if (scores.data) render(scores.data.map(x => pastScores(x.scores)), vm.entryHistory);
  }
}

await vm.getScores();

 setInterval(async () => {
  await vm.getScores();
  await vm.getPastScores();
}, 60000);