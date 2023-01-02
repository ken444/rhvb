import { html, render } from 'https://unpkg.com/lit-html?module';

import { tw } from 'https://cdn.skypack.dev/twind';



const userAction = async () => {
  const response = await fetch('https://principaspcoretest123452323.azurewebsites.net/api/todo', {

  });
  const myJson = await response.json(); //extract JSON from the http response
  return JSON.stringify(myJson)
}

const userAction1 = async () => {
  let score = {
    date: '20221222',
    time: '815',
    game: 'Aven-Jorge',
    score1: 12,
    score2: 25
  };
  const response = await fetch('https://localhost:3000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(score)
  });
  return await response.text(); 
}

const userAction2 = async () => {
  const item = {
    name: 'my book ken',
    category: "Fuck",
    author: "Hemming"

  };

  const uri = "http://localhost:3000/api/repos/?api-key=foo";

  var tt = JSON.stringify(item);

  const response = await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
  const j = await response.json();
  

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
  let response = await fetch("http://localhost:3000/api/repos/?api-key=foo");

  if (response.ok) { // if HTTP-status is 200-299
    let text1 = await response.text();
    document.getElementById("demo").innerHTML = text1;
  } else {
    alert("HTTP-Error: " + response.status);
  }
}

const dom1 = () => html`
<div class=${tw`grid`}>
  <div>
    Enter score:
    <input type="number" value=${name1} >
  </div>
  <button @click=${
    () => doit() 
    }>submit</button>
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
    <div class=${tw`border-black border-2 grid`}>HI</div>
    <div class=${tw`border-black border-2 grid`}>2</div>
    <div class=${tw`border-black border-2 grid`}>3</div>   
  
    <div class=${tw`border-black border-2  text-red-600 text(5xl)`}>
      ${dom1()}
    </div>
  </main>
`;

// And then call subscribe in order to get the TemplateResult every time it changes.

let rerender2 = () => render(dom(), document.body);

rerender2();

document.getElementById("demo").innerHTML = "Hello JavaScript!"; 
document.getElementById("demo").innerHTML = await userAction2();

//rerender2();
