"use strict";

import { html, render } from 'https://unpkg.com/lit-html?module';


import { tw } from 'https://cdn.skypack.dev/twind';

const scoreLine = html`
  <div class=${tw`p-4 m-4 rounded-3xl bg-red-400 grid items-center text-8xl `}>
    <div class=${tw`p-4 entryTeam`}></div>
    <input autofocus class=${tw`rounded-3xl m-4 p-0 w-1/2 place-self-end text-right entryScore`} type="number">
  </div>
`;

const scorePage = html`
  <div class=${tw`grid`}>
    <i class=${tw`material-icons text-8xl m-4 p-4`} @click=${()=> vm.doEntry()}>close</i>
    <div class=${tw`grid grid-cols-2`}>
      ${scoreLine}
      ${scoreLine}
    </div>
  
    <button tabindex="0" class=${tw`text-4xl m-8 p-8 font-semibold text-white bg-blue-500 border-b-4 border-blue-700
      rounded-3xl shadow-md hover:bg-blue-600 hover:border-blue-800`} @click=${async ()=> saveScore()}>Save</button>
  </div>
  
  <div id="history"></div>
    
`;

const uri = "http://localhost:3000";
//const uri = "https://node12351232153234.azurewebsites.net"

const  saveScore = async () => {

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

  vm.doEntry()

  vm.setScores(vm.entryId, score.scores);
}


{/* <a class=${tw`text-gray-700 hover:text-red-500 px-2 py-1 font-bold text-white bg-red-500 rounded-full shadow-md hover:bg-red-600 hover:text-red-800`} @click=${() => {
  // Perform cancel action here
}}>
  <svg class="close-icon" width="96" height="96" viewBox="0 0 96 96" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
    <line x1="90" y1="6" x2="6" y2="90"></line>
    <line x1="6" y1="6" x2="90" y2="90"></line>
</svg> */}


const game1 = (teams, scores) => html`
  <div class=${tw`text-8xl rounded-2xl bg-blue-400 p-4 m-4 grid grid-flow-col grid-cols-7 items-center game`}>
    ${team(teams[0], scores[0])}
    <div></div>
    ${team(teams[1], scores[1])}
  </div>
`;

const getPastScores = async (id, teams) => {
  const t = await (await fetch(`${uri}/date/'${vm.date}'/game/'${id}'`)).json();

  render(t.map(x => game1(teams, x.scores)), vm.entryHistory);

}

const team = (t, s) => html`
  <div class=${tw`col-span-2 team`}>${t}</div>
  <div class=${tw`justify-self-end score`}>${s}</div>
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
  <div class=${tw`rounded-2xl bg-red-400 p-4 m-4 text-6xl text-center font-semibold`}>${s}</div>
`;

const schedule = 
`
d	20230102		
t	8:15 OLQW		
g	Karen	Derek	N
g	Pao	Lev	C
g	Philip	Brent	S
t	8:35 OLQW		
g	Derek	Jorge	N
g	Scott	Pao	C
g	Brent	Sandy	S
t	8:55 OLQW		
g	Jorge	Karen	N
g	Lev	Scott	C
g	Sandy	Philip	S
t	9:15 OLQW		
g	Karen	Derek	N
g	Pao	Lev	C
g	Philip	Brent	S
t	9:35 OLQW		
g	Derek	Jorge	N
g	Scott	Pao	C
g	Brent	Sandy	S
t	9:55 OLQW		
g	Jorge	Karen	N
g	Lev	Scott	C
g	Sandy	Philip	S
			
t	8:15 SP		
g	Marcia	Aven	
t	8:35 SP		
g	Wayne	Marcia	
t	8:55 SP		
g	Aven	Wayne	
t	9:15 SP		
g	Marcia	Aven	
t	9:35 SP		
g	Wayne	Marcia	
t	9:55 SP		
g	Aven	Wayne	
`

let vm = {};

let gameIndex = 0;
const htmlArray = schedule.split('\n').map((element) => {
  let entry = element.split('\t');
  switch(entry[0]) {
    case 'g':
      return game(`${gameIndex++}`, [entry[1], entry[2]])
    case 't':
      return heading(entry[1]);
    case 'd':
      vm.date = entry[1]
  }
})

const mainPage = html`
  <div class=${tw`grid text-7xl`}> ${htmlArray} </div>
`;

const dom = html`
  <div id="mainPage" class=${tw`${''}`}> ${mainPage} </div>
  <div id="entryPage" class=${tw`${'fixed inset-0 hidden'}`}> ${scorePage} </div>
`;

render(dom, document.body);

const arrayMap = (...args) => Array.prototype.map.call(...args);

vm.mainPage = document.getElementById("mainPage");
vm.entryPage = document.getElementById("entryPage");
vm.entryTeams = vm.entryPage.getElementsByClassName('entryTeam');
vm.entryScores = vm.entryPage.getElementsByClassName('entryScore');
vm.entryHistory = document.getElementById("history");
vm.gameScores = arrayMap(vm.mainPage.getElementsByClassName('game'), s => s.getElementsByClassName('score'));

vm.setScores = (id, scores) => {
  scores.map((v,i) => vm.gameScores[id][i].innerHTML = v);
}

vm.getScores = async () => {
  const t = await (await fetch(`${uri}/date/'${vm.date}'`)).json();
  t.map(v=>vm.setScores(v.game, v.scores));
}

vm.doEntry = (id, teams) => {
  if (id) {
    vm.entryId = id;
    arrayMap(vm.entryTeams, (x, i) => x.innerHTML = teams[i]);
    arrayMap(vm.entryScores, x => x.value = '');

    vm.mainPage.style.visibility = 'hidden';
    vm.entryPage.style.display = 'block';
    vm.entryScores[0].focus();

    getPastScores(id, teams);
  } else {
    vm.entryPage.style.display = 'none';
    vm.mainPage.style.visibility = '';
  }
}

await vm.getScores();

