import { html, render, svg } from 'https://unpkg.com/lit-html?module';
import schedule from "./schedule.js";

export default function view() {

    const scoreLine = html`
        <div class="p-4 m-4 rounded-3xl bg-blue-400 grid text-7xl">
            <div data-entryTeam class="p-4 truncate"></div>
            <input data-entryScore autofocus class="rounded-3xl m-4 p-0 w-1/2 justify-self-end text-right focus:ring-[20px]
                focus:ring-offset-[4px] focus:ring-red-500" type="number">
        </div>
    `;

    const pastScoreLine = (score) => html`
        <div class="m-2 py-2 px-8 rounded-3xl bg-blue-400 text-7xl text-right">${score}</div>
    `;

    const closeX = html`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" stroke-width="2.5" stroke="black" />
        </svg>
    `;

    const scorePage = html`
        <div class="w-1/6" @click=${()=> controller?.gotoPage()}>${closeX}</div>
        <div class="grid grid-flow-col auto-cols-fr">
            ${scoreLine}
            ${scoreLine}
        </div>
        <div tabindex="0" class="text-6xl text-center p-8 m-4 font-semibold text-white bg-blue-600 border-b-4
            border-blue-800 rounded-3xl shadow-xl" @click=${async ()=> controller?.saveScore()}>Save</div>
        <div id="history"></div>
    `;

    const pastScoresItem = (scores) => html`
        <div class="grid grid-flow-col auto-cols-fr">
            ${scores.map(v => pastScoreLine(v))}
        </div>
    `;

    const pastScores = (s) => (!s || s.length == 0) ? null : html`
        <div class="text-4xl p-3 italic text-center">
            List of past score submissions (unless an error was corrected this should have at most one submission)
        </div>
        ${s.map(x => pastScoresItem(x.scores))}
    `;

    const team = (t, s) => html`
        <div class="px-6 text-6xl flex">
            <div data-team class="pb-4 flex-1 truncate">${t}</div>
            <div data-score>${s}</div>
        </div>
    `;

    const game = (id, teams) => html`
        <div data-game class="rounded-2xl ${teams[3]} m-2" @click=${async ()=> await controller?.gotoPage(id)} >
            <div class="text-4xl italic font-bold tracking-widest text-white text-center">${teams[2]}</div>
            <div class="grid grid-flow-col auto-cols-fr">
                ${teams.slice(0, 2).map(x => team(x))}
            </div>
        </div>
    `;

    const heading = (s) => html`<div class="text-5xl text-center font-semibold text-blue-800">${s}</div>`;

    const title = (s) => html`<div class="text-4xl p-3 italic">${s}</div>`;

    const { htmlArray, date } = schedule(title, heading, game);

    const dom = html`
        <div class="mx-auto max-w-5xl min-w-[720px]">
            <div id="mainPage" class="hidden"> ${htmlArray} </div>
            <div id="entryPage" class="hidden"> ${scorePage} </div>
        </div>
    `;

    render(dom, document.body);

    function setPastScores(s, e) { render(pastScores(s), e) };

    return {
        setPastScores,
        date
    }

}