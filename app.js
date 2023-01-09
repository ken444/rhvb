"use strict";

import { html, render } from 'https://unpkg.com/lit-html?module';


import { tw } from 'https://cdn.skypack.dev/twind';

const scoreLine = (t1, id) => html`
  <div class=${tw`p-4 m-4 rounded-3xl bg-red-400 grid grid-cols-3 items-center text-8xl `}>
    <div class=${tw`col-span-2`}>${t1}</div>
    <input id = ${id} class=${tw`rounded-3xl`} type="number">
  </div>
`;

const scorePage = (t1, t2, id) => html`
  <div class=${tw`grid`}>
    <i class=${tw`material-icons text-8xl m-4 p-4`} @click=${()=> rerender(null)}>close</i>
  
    ${scoreLine(t1, "in1")}
    ${scoreLine(t2, "in2")}
  

      <button tabindex="0" class=${tw`text-4xl m-8 p-8 font-semibold text-white bg-blue-500 border-b-4 border-blue-700 rounded-3xl
        shadow-md hover:bg-blue-600 hover:border-blue-800`} @click=${()=> rerender(null)}>Save</button>

  </div>
`;





{/* <a class=${tw`text-gray-700 hover:text-red-500 px-2 py-1 font-bold text-white bg-red-500 rounded-full shadow-md hover:bg-red-600 hover:text-red-800`} @click=${() => {
  // Perform cancel action here
}}>
  <svg class="close-icon" width="96" height="96" viewBox="0 0 96 96" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
    <line x1="90" y1="6" x2="6" y2="90"></line>
    <line x1="6" y1="6" x2="90" y2="90"></line>
</svg> */}

//const uri = "http://localhost:3000";
const uri = "https://node12351232153234.azurewebsites.net"

const dom1 = () => html`
<div class=${tw`grid`}>
  <div>
    Enter score:
    <input type="number" value=${name1}>
  </div>
  <button @click=${async () => document.getElementById("demo1").innerHTML = await userAction1()
      }
    }>post</button>
  <div id="demo1" class=${tw`place-self-center`}>01</div>
</div>
`;

const dom2 = () => html`
  <div class=${tw`grid`}>
    <button @click=${
      async () => 
        document.getElementById("demo2").innerHTML = await (await fetch(uri + "/date/'20220101'")).text()
  }>get</button>
    <div id="demo2" class=${tw`place-self-center`}>01</div>
  </div>
`;

const dom3 = () => html`
  <div class=${tw`border-black border-2 text-red-600 grid`}>
    <button @click=${
      async () => 
        document.getElementById("demo3").innerHTML = await (await fetch(uri + "/date/'20220101'/game/'815 Philip-Lev'")).text()
    } >get</button>
    <div id="demo3" class=${tw`place-self-center`}>01</div>
  </div>
`;


const game = (t1, t2, id) => html`
  <div id="${id}" @click=${() => rerender(dom(scorePage(t1,t2,id)))}
    class=${tw`rounded-2xl bg-blue-400 p-4 m-4 grid grid-flow-col grid-cols-7 items-center`}>
    <div class=${tw`col-span-2`}>${t1}</div>
    <div class=${tw`justify-self-end score1`}></div>
    <div></div>
    <div class=${tw`col-span-2`}>${t2}</div>
    <div class=${tw`justify-self-end score2`}></div>
  </div>
`;

const heading = (s) => html`
  <div
    class=${tw`rounded-2xl bg-red-400 p-4 m-4 text-6xl text-center font-semibold `}>
    <div class=${tw``}>${s}</div>
  </div>
`;

const schedule = 
`
d	20230112		
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

let date1 = '';
let gameIndex = 0;
const scheduleArray = schedule.split('\n');
const htmlArray = scheduleArray.map((element) => {
  let r = element.split('\t');
  switch(r[0]) {
    case 'g':
      return game(r[1], r[2], `game${gameIndex++}`)
    case 't':
      return heading(r[1]);
    case 'd':
      date1 = r[1]
  }
})

const vis = (v) => v ? "" : "hidden";

const mainPage = html`
  <div class=${tw`grid text-8xl`}> ${htmlArray} </div>
`;

const dom = (page2) => html`
  <main class=${tw``}>
    <div class=${tw`${vis(page2)}`}> ${page2} </div>
    <div class=${tw`${vis(!page2)}`}> ${mainPage} </div>
  </main>
`;

const rerender = page => {
 render(dom(page), document.body);
 if (page) document.getElementById("in1").focus();
}

rerender(null);

