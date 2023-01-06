import { html, render } from 'https://unpkg.com/lit-html?module';

import { tw } from 'https://cdn.skypack.dev/twind';

//const uri = "http://localhost:3000";
const uri = "https://node12351232153234.azurewebsites.net"


const userAction = async () => {
  const response = await fetch('https://principaspcoretest123452323.azurewebsites.net/api/todo', {

  });
  const myJson = await response.json(); //extract JSON from the http response
  return JSON.stringify(myJson)
}

const userAction1 = async () => {
  let score = {
    date: '20220101',
    game: '815 Philip-Lev',
    score1: Math.floor(Math.random() * 25),
    score2: Math.floor(Math.random() * 25)
  };
  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(score)
  });
  return (await response.json()).date;
}

const userAction2 = async () => {
  const r = await fetch(uri + "/date/20220101", {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  
});
  return await r.text();
}

const postScore = async (game, score1, score2) => {
  const response = await fetch('https://principaspcoretest123452323.azurewebsites.net/api/todo', {

  });
  const myJson = await response.json(); //extract JSON from the http response
  return JSON.stringify(myJson)
}
let name1 = 98;

async function doit() {
  // name1 = 8;
  // rerender2();
  // let url = location.hostname === "127.0.0.1" ? "http://localhost:3000/api/repos/?api-key=foo" : "56485";
  // let response = await fetch("http://localhost:3000/api/repos/?api-key=foo");

  // if (response.ok) { // if HTTP-status is 200-299
  //   let text1 = await response.text();
  //   document.getElementById("demo").innerHTML = text1;
  // } else {
  //   alert("HTTP-Error: " + response.status);
  // }


  document.getElementById("demo").innerHTML = await userAction1();
}

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



// If you want to render based on the current values of multiple observables, you
// want to use combineLatest(), which returns an observable that emits the latest
// values whenever any of them change in an array.
const dom = () => html`
  <main class=${tw`h-screen grid auto-rows-[minmax(200px,400px)] text-1xl`}>
    <div class=${tw`border-black border-2 grid`}>
      <div id="demo" class=${tw`place-self-center`}>01</div>
    </div>
    <div class=${tw`border-black border-2 grid`}>${location.hostname}</div>
    <div class=${tw`border-black border-2 text-red-600 text(5xl)`}>
      ${dom1()}
    </div>
    ${dom2()}
    ${dom3()}
  </main>
`;

// And then call subscribe in order to get the TemplateResult every time it changes.

let rerender2 = () => render(dom(), document.body);

rerender2();

document.getElementById("demo").innerHTML = "Hello JavaScript!";
//document.getElementById("demo").innerHTML = await userAction2();

//rerender2();
