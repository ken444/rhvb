import { html, render } from 'https://unpkg.com/lit-html?module';
import { tw } from 'https://cdn.skypack.dev/twind';
import schedule from "./schedule.js";

const arrayMap = (...args) => Array.prototype.map.call(...args);

const scoreLine = html`
  <div class=${tw`p-4 m-4 rounded-3xl bg-red-400 grid items-center text-8xl `}>
    <div class=${tw`p-4 entryTeam`}></div>
    <input autofocus class=${tw`rounded-3xl m-4 p-0 w-1/2 place-self-end text-right focus:ring-[16px] entryScore`} type="number">
  </div>
`;

const scoreLine1 = (score) => html`
<div class=${tw`p-4 m-4 rounded-3xl bg-red-400 grid items-center text-7xl`}>
  <div class=${tw`rounded-3xl w-1/2 place-self-end text-right mx-8`}>${score}</div>
</div>
`;

const scorePage = html`
  <div class=${tw`grid border-8 border-black h-full`}>
    <i class=${tw`material-icons text-8xl m-4 p-4`} @click=${() => vm.doEntry()}>close</i>
    <div class=${tw`grid grid-cols-2`}>
      ${scoreLine}
      ${scoreLine}
    </div>
  
    <button tabindex="0" class=${tw`text-6xl m-8 p-8 font-semibold text-white bg-blue-500 border-b-4 border-blue-700
      rounded-3xl shadow-md hover:bg-blue-600 hover:border-blue-800`} @click=${async () => vm.saveScore()}>Save</button>
    <div class=${tw`overflow-auto border-8 border-red-800`}>
      <div id="history"></div>
    </div>
  </div>

`;

const game1 = (scores) => html`
  <div class=${tw`grid grid-cols-2`}>
    ${scoreLine1(scores[0])}
    ${scoreLine1(scores[1])}
  </div>
`;

const team = (t) => html`
  <div class=${tw`col-span-2`}>${t}</div>
  <div class=${tw`justify-self-end score`}></div>
`;

const game = (id, teams) => html`
  <div @click=${() => vm.doEntry(id, teams)}
    class=${tw`rounded-2xl bg-blue-400 p-4 m-4 grid grid-flow-col grid-cols-7 items-center game`}>
    ${team(teams[0])}
    <div></div>
    ${team(teams[1])}
  </div>
`;

const heading = (s) => html`
  <div class=${tw`text-6xl text-center font-semibold`}>${s}</div>
`;

const title = (s) => html`
  <div class=${tw`rounded-2xl bg-red-400 text-8xl text-center px-8 py-4 place-self-center`}>${s}</div>
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

const mainPage = html`
  <div class=${tw`grid text-8xl`}> ${htmlArray} </div>
`;

const dom = html`
  <div id="mainPage" class=${tw`${''}`}> ${mainPage} </div>
  <div id="entryPage" class=${tw`${'fixed inset-2 border-8 hidden'}`}> ${scorePage} </div>
`;

render(dom, document.body);

vm.stage = -1;
vm.entryStage = -1;
vm.mainPage = document.getElementById("mainPage");
vm.entryPage = document.getElementById("entryPage");
vm.entryTeams = vm.entryPage.getElementsByClassName('entryTeam');
vm.entryScores = vm.entryPage.getElementsByClassName('entryScore');
vm.entryHistory = document.getElementById("history");
vm.gameScores = arrayMap(vm.mainPage.getElementsByClassName('game'), s => s.getElementsByClassName('score'));

vm.setScores = (id, scores) => {
  scores.map((v,i) => vm.gameScores[id][i].innerHTML = v);
}

vm.doEntry = (id, teams) => {
  vm.entryId = id;
  if (id) {
    render(html``, vm.entryHistory);
    arrayMap(vm.entryTeams, (x, i) => x.innerHTML = teams[i]);
    arrayMap(vm.entryScores, x => x.value = '');

    vm.mainPage.style.visibility = 'hidden';
    vm.entryPage.style.display = 'block';
    vm.entryScores[0].focus();

    vm.entryStage = -1;

    vm.getPastScores();
  } else {
    vm.entryPage.style.display = 'none';
    vm.mainPage.style.visibility = '';
  }
}

//const uri = "http://localhost:3000";
const uri = "https://node12351232153234.azurewebsites.net"

vm.saveScore = async () => {
  let score = {
    date: vm.date,
    game: vm.entryId,
    scores: [vm.entryScores[0].value, vm.entryScores[1].value]
  };
  const response = await fetch(uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(score)
  });

  vm.setScores(vm.entryId, score.scores);
  vm.doEntry()
}

vm.getScores = async () => {
  const t = await (await fetch(`${uri}/date/'${vm.date}'/${vm.stage}`)).json();
  vm.stage = t.stage;
  t.data?.map(v=>vm.setScores(v.game, v.scores));
}

vm.getPastScores = async () => {
  const id = vm.entryId;
  if (id) {
    const t = await (await fetch(`${uri}/date/'${vm.date}'/game/'${id}'/${vm.entryStage}`)).json();
    vm.entryStage = t.stage;
    if (t.data) render(t.data.map(x => game1(x.scores)), vm.entryHistory);
  }
}

await vm.getScores();

setInterval(async () => {
  await vm.getScores();
  await vm.getPastScores();
}, 5000);