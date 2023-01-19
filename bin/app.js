//import { } from '../schedules/bin/app.js';

import { html, render } from 'https://unpkg.com/lit-html?module';
import { tw } from 'https://cdn.skypack.dev/twind';
// import schedule from "./schedule.js";
// import createvm from "./vm.js";



const dom = html`
<div class=${tw`mx-auto max-w-[1024px] min-w-[720px]`}>
  <div id="mainPage" class=${tw`grid text-7xl`}> ${"hellow"} </div>
</div>
`;

render(dom, document.body);

