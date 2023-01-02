import { html, render } from 'https://unpkg.com/lit-html?module';

import { tw } from 'https://cdn.skypack.dev/twind';

import { map, startWith, tap, BehaviorSubject, interval, switchMap, combineLatest, of } from 'https://unpkg.com/rxjs/dist/esm?module';
//import 'https://unpkg.com/rxjs/dist/esm?module';

const name$ = new BehaviorSubject('bob');
const over$ = new BehaviorSubject(false);

//import {css, LitElement} from 'https://unpkg.com/lit-element?module';

// export class SimpleGreeting extends LitElement {
//   static styles = css`p { color: blue }`;

//   static properties = {
//     name: {type: String},
//   };

//   constructor() {
//     super();
//     this.name = 'Somebody';
//   }

//   render() {
//     return html`<p>Hello, ${this.name}!</p>`;
//   }
// }
// customElements.define('simple-greeting', SimpleGreeting);


// // Define a template
// const myTemplate = (name) => html`
// <div class=${tw`flex items-center flex-col overflow-hidden bg-gray-100 sm:py-12`}>
// <p class=${tw`h-6 text-indigo-600 dark:text-indigo-400 hover:text-sky-600`}>Hello ${name}</p>
// </div>
// `;

// const ff = myTemplate('World4-200022');

// // Render the template to the document
// render(ff, document.body);

// This is an observable that *when subscribed*, gets the current time once per second.
// It prints it to the console so you can see how many times it's been subscribed to.
const date$ = interval(1000).pipe(
  startWith(null),
  map(() => new Date()),
  tap(console.log),
);

// You can factor out individual transformations pretty easily.
// Here, date$ could be used in lots of places, but we may want to
// factor out a common rendering of in the UI that can be easily re-used.
const timeString$ = date$.pipe(map(date => date.toLocaleTimeString()));

// switchMap() is an operator that *maps* a value to an observable, and
// *switches* the subscription its own subscribers are subscribed to (insted of
// merging or concatenating). Here it's switching between rendering nothing if
// the mouse is not over .hover, or the popup.
const popup$ = over$.pipe(
  switchMap(over => !over
    ? of(null)
    : combineLatest(name$, timeString$).pipe(map(([name, timeString]) => html`
      <div class=${tw`text-indigo-600`}>
        Hello, ${name}. This is a popup. The time is ${timeString}
      </div>
    `))
  )
);

const page = html``;


// If you want to render based on the current values of multiple observables, you
// want to use combineLatest(), which returns an observable that emits the latest
// values whenever any of them change in an array.
const dom$ = combineLatest(name$, popup$).pipe(map(([name, popup]) => html`
  <main class=${tw`h-screen bg-purple-400 flex flex-col items-center justify-center`}>
    <div class=${tw`text-red-600 text(5xl)`}>
      Enter your name:
      <input value=${name} @input=${({ target })=> name$.next(target.value)}
      >
    </div>
    <div class=hover @mouseenter=${()=> over$.next(true)}
      @mouseleave=${() => over$.next(false)}
      >
      Hover over me1
      ${popup}
    </div>
  </main>
`));


// And then call subscribe in order to get the TemplateResult every time it changes.
dom$.subscribe(dom => render(dom, document.body));

