import { html, render, svg } from '/node_modules/lit-html/lit-html.js';
import "./pastScoreLine.js"
import "./pastScoreItem.js"

export default function view(schedule) {

    const scoreLine = html`
        <div class="m-2 rounded-xl grid font-medium text-3xl leading-none">
            <div data-entryTeam class="p-2 truncate"></div>
            <input type="number" title="entryScore" data-entryScore autofocus class="form-input rounded-xl m-4 w-1/2 justify-self-end text-right font-medium text-3xl leading-none
                                        focus:(ring-8 ring-offset-4 ring-red-500)">
        </div>
    `;

    const pastScoreLine = (score) => html`
        <div class="m-2 py-2 px-8 rounded-xl bg-blue-400 text-3xl text-right">${score}</div>
    `;

    const closeX = html`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" stroke-width="2.5" stroke="black" />
        </svg>
    `;

    const scorePage = html`
        <div class="grid mx-4">
            <p></p>
            <div class="w-1/6 justify-self-end" @click=${() => controller?.gotoPage()}>${closeX}</div>
        </div>
        <div class="grid m-2 rounded-xl overflow-hidden">
            <div id="entryGame" class="bg-blue-600 ">
                <div data-entryheading class="text-lg italic font-bold tracking-widest text-white text-center"></div>
                <div class="grid grid-flow-col auto-cols-fr">
                    ${scoreLine}
                    ${scoreLine}
                </div>
            </div>
        </div>
        <div data-button tabindex="0" class="text-4xl text-center p-4 m-4 font-semibold text-white bg-blue-600 border-b-4
                                    border-blue-800 rounded-3xl shadow-xl" @click=${async () => controller?.saveScore()}>Save
        </div>
        <div id="history"></div>
    `;


    const pastScoresItem = (scores) => html`
        <div class="grid grid-flow-col auto-cols-fr">
            ${scores.map(v => pastScoreLine(v))}
        </div>
    `;


    const pastScores = (s) => (!s || s.length == 0) ? null : html`
        <div class="text-lg p-2 italic text-center leading-tight">
            List of past score submissions (unless an error was corrected this should have at most one submission)
        </div>
        ${s.map(x => pastScoresItem(x.scores))}
    `;

    const team = (t, s) => html`
        <div class="px-3 font-medium text-3xl leading-none flex">
            <div data-team class="pb-2 flex-1 truncate">${t}</div>
            <div data-score>${s}</div>
        </div>
    `;

    const game = (index, e) => html`
        <div data-schedule class="rounded-xl ${e.color} m-1" @click=${async () => await controller?.gotoPage(index)} >
            <div class="text-lg italic font-bold tracking-widest text-white text-center leading-none">${e.game}</div>
            <div class="grid grid-flow-col auto-cols-fr">
                ${e.teams.map(x => team(x))}
            </div>
        </div>
    `;

    const heading = (s) => html`<div class="text-xs text-end font-bold text-blue-300 h-3"></div>`;

    const title = (s) => html`<div class="text-xl px-4 italic">${s}</div>`;

    const htmlArray = schedule.map((e, i) => {
        switch (e[1]) {
            case 'g':
                return game(i, e[2])
            case 't':
                return heading(e[2]);
            case 'h':
                return title(e[2]);
        }
    });

    const dom = html`
        <div class="mx-auto max-w-screen-sm">
            <div id="mainPage" style="display: none"> ${htmlArray} </div>
            <div id="entryPage" style="display: none"> ${scorePage} </div>
        </div>
    `;

    render(dom, document.body);

    function setPastScores(s, e) { render(pastScores(s), e) };

    return {
        setPastScores,
    }

}