//import { html, render, TemplateResult } from '/node_modules/lit-html/lit-html.js';
import { html, render } from 'https://unpkg.com/lit@latest?module';

export default function view() {
    // Utility function to render a template into a DocumentFragment
    function htmlR(strings, ...values) {
        const fragment = document.createDocumentFragment();
        render(html(strings, ...values), fragment);
        return fragment.firstElementChild;
    }

    const pastScoreLine = () => {
        const view = htmlR`<div class="m-2 py-2 px-8 rounded-xl bg-blue-400 text-3xl text-right"></div>`;
        return {
            view,
            setScore: (s) => view.innerText = s
        }
    };

    // Component: Past Scores
    const pastScoresItem = () => {
        const lines = [pastScoreLine(), pastScoreLine()];
        return {
            view: htmlR`<div><div class="grid grid-flow-col auto-cols-fr">${lines.map(l => l.view)}</div></div>`,
            setScores: (s) => s.map((v, i) => lines[i].setScore(v))
        };
    };

    const pastScores = () => {

        let arrayIndex = 0;
        let displayIndex = 0;

        let id = "";

        const warn = htmlR`
            <div class="text-lg p-2 italic text-center leading-tight">
                List of past score submissions (unless an error was corrected this should have at most one submission)
            </div>
        `;

        const history = htmlR`<div></div>`;

        const pastScores = [];

        const view = html`
            ${warn}
            ${history}
        `;


        const setEntry = (g) => {   // reset

            id = g.id;

            warn.style.display = 'none';

            arrayIndex = 0;

            pastScores.forEach((v) => v.view.style.display = 'none');

            displayIndex = 0;

            updatePastScores();
        }

        const updatePastScores = () => {

            while (arrayIndex < document.allScores.length) {
                const x = document.allScores[arrayIndex++];

                if (x.game === id) {
                    if (displayIndex == pastScores.length) {
                        const newChild = pastScoresItem();
                        pastScores.push(newChild);
                        if (history.firstChild) {
                            history.insertBefore(newChild.view, history.firstChild);
                        } else {
                            history.appendChild(newChild.view);
                        }
                    }
                    pastScores[displayIndex].setScores(x.scores);
                    pastScores[displayIndex].view.style.display = 'block';
                    displayIndex++;
                    warn.style.display = 'block';
                }
            }

        };


        return { view, setEntry, updatePastScores };
    };


    // Component: Close Button (SVG)
    const closeX = html`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" stroke-width="2.5" stroke="black" />
        </svg>
    `;

    
    // Component: Score Line
    const scoreLine = () => {
        const teamText = htmlR`<div class="p-2 truncate"></div>`;
        const entryScore = htmlR`
            <input type="number" autofocus class="form-input rounded-xl m-4 w-1/2 justify-self-end text-right font-medium text-3xl leading-none focus:(ring-8 ring-offset-4 ring-red-500)"/>
        `;

        const view = html`
            <div class="m-2 rounded-xl grid font-medium text-3xl leading-none">
                ${teamText}
                ${entryScore}
            </div>
        `;

        const setSingleEntry = (t) => {
            teamText.innerText = t;
            entryScore.value = '';
        };

        const getSingleEntry = () => entryScore.value;

        return { view, setSingleEntry, getSingleEntry };
    };

    // Component: Inner Score Page
    const innerScorePage = () => {
        const scoreLines = [scoreLine(), scoreLine()];
        const headingText = htmlR`<div class="text-lg italic font-bold tracking-widest text-white text-center"></div>`;

        const view = htmlR`
            <div class="grid rounded-xl m-2">
                ${headingText}
                <div class="grid grid-flow-col auto-cols-fr">
                    ${scoreLines.map(x => x.view)}
                </div>
            </div>
        `;

        const setEntry = (g) => {
            headingText.innerText = g.game;
            view.className = `grid ${g.color} rounded-xl m-2`;
            g.teams.map((v, i) => scoreLines[i].setSingleEntry(v));
        };

        const getEntry = () => scoreLines.map(v => v.getSingleEntry());

        return { view, setEntry, getEntry };
    };

    // Component: Score Page
    const scorePage = () => {
        const { view: view1, setEntry: setEntry1, getEntry, ...api } = innerScorePage();
        const { view: view2, setEntry: setEntry2, ...api2 } = pastScores();

        let id = null;

        const view = html`
            <div class="grid mx-4">
                <p></p>
                <div class="w-1/6 justify-self-end" @click=${() => {
                const event = new CustomEvent('navigate', { detail: null });
                document.dispatchEvent(event);
            }}>${closeX}</div>
            </div>
            ${view1}
            <div tabindex="0" class="text-4xl text-center p-4 m-4 font-semibold text-white bg-blue-600 border-b-4 border-blue-800 rounded-3xl shadow-xl" 
                @click=${() => {
                document.dispatchEvent(new CustomEvent('save-score', { detail: {date: document.date, game: id, scores: getEntry()} }));
            }}>
                    Save
            </div>
            ${view2}
        `;

        //const updatePastScores = (s) => render(pastScores(s), historyDiv); // replace with search array from index and add if needed

        const setEntry = (g) => {
            id = g.id;
            setEntry1(g);
            setEntry2(g);
        }

        return { view, setEntry, ...api, ...api2 };
    };


    // Component: Team
    const team = (t) => {
        const scoreText = htmlR`<div></div>`;

        const view = html`
            <div class="px-3 font-medium text-3xl leading-none flex">
                <div class="pb-2 flex-1 truncate">${t}</div>
                ${scoreText}
            </div>
        `;

        const setScore = (s) => scoreText.innerText = s;

        return { view, setScore };
    };

    // Component: Game
    const game = (id, line) => {
        const yy = {
            id,
            teams: line.slice(0, 2),
            color: line[3],
            game: line[2],
        };

        const teams = yy.teams.map(team);

        const view = html`
            <div class="rounded-xl ${line[3]} m-1" @click=${() => document.dispatchEvent(new CustomEvent('navigate', { detail: yy }))}>
                <div class="text-lg italic font-bold tracking-widest text-white text-center leading-none">${line[2]}</div>
                <div class="grid grid-flow-col auto-cols-fr">
                    ${teams.map(x => x.view)}
                </div>
            </div>
        `;

        return {
            view,
            setScores: (scores) => teams.map((t, i) => t.setScore(scores[i])),
        };
    };

    const heading = (s) => html`<div class="text-xs text-end font-bold text-blue-300 h-3"></div>`;

    const title = (s) => html`<div class="text-xl px-4 italic">${s}</div>`;

    // Component: Games
    const games = () => {

        let gameIndex = 0;
        let games = {};
        const view = window.schedule.split('\n').map((e) => {
            let entry = e.split('\t');
            switch (entry[0]) {
                case 'g':
                    const id = entry[5] ? entry[5] : `${gameIndex++}`;
                    const game1 = game(id, entry.slice(1));
                    games[id] = game1;
                    return game1.view;
                case 't':
                    return heading(entry[1]);
                case 'h':
                    return title(entry[1]);
                case 's':
                    return side(entry[1]);
                case 'd':
                    document.date = entry[1];
            }
        });

        const setScores = (t) => games[t.game]?.setScores(t.scores);

        return { view, setScores };
    };

    // Component: DOM
    const dom = () => {

        const { view: mainView, ...mainApi } = games();
        const { view: entryView, setEntry, ...entryApi } = scorePage();

        const mainPage = htmlR`<div style="display: none">${mainView}</div>`;
        const entryPage = htmlR`<div style="display: none">${entryView}</div>`;

        const view = html`
            <div class="mx-auto max-w-screen-sm">
                ${mainPage}
                ${entryPage}
            </div>
        `;

        const setPage = (game) => {
            if (game) {
                setEntry(game);
                mainPage.style.display = 'none';
                entryPage.style.display = 'block';
                document.querySelector("input").focus();
            } else {
                entryPage.style.display = 'none';
                mainPage.style.display = 'block';
            }
        };

        return { view, setPage, ...mainApi, ...entryApi };
    };

    // Initialize and render the DOM
    const { view, ...api } = dom();
    render(view, document.body);

    return { ...api };
}