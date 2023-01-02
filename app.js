import { html, render } from 'https://unpkg.com/lit-html?module';

import { tw } from 'https://cdn.skypack.dev/twind';



const userAction = async () => {
  const response = await fetch('https://principaspcoretest123452323.azurewebsites.net/api/todo', {
  
  });
  const myJson = await response.json(); //extract JSON from the http response
  return JSON.stringify(myJson)
}
let name1 = "Ken";


const dom1 = () => html`

      Enter your name:
      <input value=${name1} @input=${({ target })=> alert(target.value)} >
      <button @click=${()=>{}}>hi</button>

`;




// If you want to render based on the current values of multiple observables, you
// want to use combineLatest(), which returns an observable that emits the latest
// values whenever any of them change in an array.
const dom = () => html`
  <main class=${tw`h-screen bg-purple-400 flex flex-col items-center justify-center`}>
    <div class=${tw`text-red-600 text(5xl)`}>
    ${dom1()}

    </div>
    <div></div>
    </div>
  </main>
`;

// And then call subscribe in order to get the TemplateResult every time it changes.

let rerender2 = () => render(dom(), document.body);

rerender2();

name1  = await userAction();

rerender2();
