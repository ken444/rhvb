import { html, render, svg } from '/node_modules/lit-html/lit-html.js';

export default function view() {

    const scoreLine = html`
        <div class="m-2 rounded-xl grid font-medium text-3xl leading-none">
            <div data-entryTeam class="p-2 truncate"></div>
            <input type="number" title="entryScore" data-entryScore autofocus class="form-input rounded-xl m-4 w-1/2 justify-self-end text-right ${teamNameStyle}
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
        <div id="entryGame" class="grid rounded-xl m-2">
            <div data-entryheading class="text-lg italic font-bold tracking-widest text-white text-center"></div>
            <div class="grid grid-flow-col auto-cols-fr">
                ${scoreLine}
                ${scoreLine}
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

    function setPastScores(s, e) { render(pastScores(s), e) };

    return {
        setPastScores,
        scorePage
    }

}