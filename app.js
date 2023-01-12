import { html, render } from 'https://unpkg.com/lit-html?module';
import { tw } from 'https://cdn.skypack.dev/twind';
import schedule from "./schedule.js";

import createvm from "./vm.js";

const scoreLine = html`
  <div class=${tw`p-4 m-4 rounded-3xl bg-red-400 grid items-center text-8xl`}>
    <div class=${`${tw`p-4`} entryTeam`}></div>
    <input autofocus class=${`${tw`rounded-3xl m-4 p-0 w-1/2 place-self-end text-right focus:ring-[16px]`} entryScore`}
      type="number">
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
    ${scores.map(v => pastScoreLine(v))}
  </div>
`;

const team = (t) => html`
  <div class=${`${tw`col-span-2`} team`}>${t}</div>
  <div class=${`${tw`justify-self-end`} score`}></div>
`;

const game = (id, teams) => html`
  <div @click=${async () => await vm.gotoPage(id)}
    class=${`${tw`rounded-2xl bg-blue-400 p-4 m-4 grid grid-flow-col grid-cols-7 items-center`} game`}>
    ${team(teams[0])}
    <div></div>
    ${team(teams[1])}
  </div>
`;

const heading = (s) => html`<div class=${tw`text-6xl text-center font-semibold`}>${s}</div>`;

const title = (s) => html`<div class=${tw`text-4xl p-3 italic`}>${s}</div>`;

const {htmlArray, date} = schedule(title, heading, game);

const dom = html`
  <div id="mainPage" class=${tw`grid text-8xl`}> ${htmlArray} </div>
  <div id="entryPage" class=${tw`${'grid hidden'}`}> ${scorePage} </div>
`;

render(dom, document.body);

function renderPast(s, e) { render(s?.map(x => pastScores(x.scores)), e); }

const vm = createvm(date, renderPast);

window.addEventListener("popstate", async () => { await vm.showPage((window.location.hash).substring(1)); });

vm.showPage((window.location.hash).substring(1));

await vm.getScores();

setInterval(async () => {
  await vm.getScores();
  await vm.getPastScores();
}, 60000);
