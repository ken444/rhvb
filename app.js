"use strict";

import { html, render } from 'https://unpkg.com/lit-html?module';

import { tw } from 'https://cdn.skypack.dev/twind';

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
    class=${tw`rounded-3xl bg-blue-400 p-8 m-4 grid grid-flow-col grid-cols-7 items-center`}>
    <div class=${tw`col-span-2`}>${t1}</div>
    <div class=${tw`justify-self-end score1`}></div>
    <div></div>
    <div class=${tw`col-span-2`}>${t2}</div>
    <div class=${tw`justify-self-end score2`}></div>
  </div>
`;

const heading = (s) => html`
  <div
    class=${tw`rounded-3xl bg-red-400 p-8 m-4`}>
    <div class=${tw``}>${s}</div>
  </div>
`;

const scoreLine = t1 => html`
  <div class=${tw`rounded-3xl bg-red-400 p-8 m-4 grid grid-flow-col grid-cols-3 items-center`}>
    <div class=${tw`col-span-2`}>${t1}</div>
    <input class=${tw`rounded-3xl`} type="number" name="score1">
  </div>
`;

const scorePage = (t1, t2, id) => html`
  ${scoreLine(t1)}
  ${scoreLine(t2)}
  <button @click=${()=>rerender(null)}>save</button>
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
  <div class=${tw``}> ${htmlArray} </div>
`;

const dom = (page2) => html`
  <main class=${tw`grid text-8xl`}>
    <div class=${tw`${vis(page2)}`}> ${page2} </div>
    <div class=${tw`${vis(!page2)}`}> ${mainPage} </div>
  </main>
`;

const rerender = page => render(dom(page), document.body);

rerender(null);

