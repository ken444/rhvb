import { h } from './h_function.js';

const d = (cl, ch) => h('div', { className: cl }, ch);

export default function view() {

    const pastScoreLine = () => {
        const view = d("m-2 py-2 px-8 rounded-xl bg-blue-400 text-3xl text-right");
        return {
            view,
            setScore: (s) => view.innerText = s
        }
    };

    // Component: Past Scores
    const pastScoresItem = () => {
        const lines = [pastScoreLine(), pastScoreLine()];
        const view = d("grid grid-flow-col auto-cols-fr", lines.map(l => l.view));
        return {
            view,
            setScores: (s) => lines.map((v, i) => v.setScore(s[i])),
            hide: (v) => view.style.display = v ? 'none' : ''
        };
    };

    const myArray = (element, createItem) => {
        let arrayIndex = 0;

        const add = (x) => {
            if (arrayIndex == 0) {
                const newChild = createItem();
                element.insertAdjacentElement('afterbegin', newChild.view);
            }
            const r = element.childNodes[arrayIndex];
            r.x();
            r.hide(false);
            arrayIndex--;
        }
        const clear = () => {
            element.childNodes.forEach((v) => v?.hide(true));
            arrayIndex = element.childNodes.length;
        }
    }

    const pastScores = () => {

        //const my = myArray(pastScoresItem);

        let arrayIndex = 0;
        let displayIndex = 0;

        let id = "";

        const warn = d(
            "text-lg p-2 italic text-center leading-tight",
            "List of past score submissions (unless an error was corrected this should have at most one submission)"
        );

        const history = d();

        const pastScores = [];

        const view = [
            warn,
            history
        ];


        const setEntry = (g) => {   // reset

            id = g.id;

            warn.style.display = 'none';

            arrayIndex = 0;

            pastScores.forEach((v) => v?.hide(true));

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
                        history.insertAdjacentElement('afterbegin', newChild.view);
                    }
                    pastScores[displayIndex].setScores(x.scores);
                    pastScores[displayIndex].hide(false);
                    displayIndex++;
                    warn.style.display = 'block';
                }
            }

        };

        return { view, setEntry, updatePastScores };
    };


    // Component: Close Button (SVG)
    const closeX = h('svg', { viewBox: "0 0 24 24" },
        h('path', { "stroke-linecap": "round", "stroke-linejoin": "round", d: "M6 18L18 6M6 6l12 12", "stroke-width": "2.5", stroke: "black" })
    );

    // Component: Score Line
    const scoreLine = () => {
        const teamText = d("p-2 truncate");

        const entryScore = h('input',
            {
                type: 'number',
                className: "form-input rounded-xl m-4 p-2 w-1/2 justify-self-end text-right leading-none bg-white focus:ring-8 ring-black ring-offset-4"
            }
        );

        const view = d("m-2 rounded-xl grid font-medium text-3xl leading-none", [
            teamText,
            entryScore
        ]);

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
        const headingText = d("text-lg italic font-bold tracking-widest text-white text-center");

        const view = d("grid rounded-xl m-2", [
            headingText,
            d("grid grid-flow-col auto-cols-fr", scoreLines.map(x => x.view))
        ]);

        const setEntry = (g) => {
            headingText.innerText = g.game;
            view.className = `grid ${g.color} rounded-xl m-2`;
            g.teams.map((v, i) => scoreLines[i].setSingleEntry(v));
        };

        const getEntry = () => scoreLines.map(v => v.getSingleEntry());

        return { view, setEntry, getEntry };
    };

    // Component: Score Page
    const scoreEntryPage = () => {
        const { view: innerView, setEntry: setInnerEntry, getEntry, ...innerApi } = innerScorePage();
        const { view: pastScoresView, setEntry: setPastScoresEntry, ...pastScoresApi } = pastScores();
    
        let id = null;
    
        const closeButton = h('div', {
            className: "w-1/6 justify-self-end",
            onclick: () => {
                const event = new CustomEvent('navigate', { detail: null });
                document.dispatchEvent(event);
            }
        }, closeX);
    
        const saveButton = h('div', {
            tabindex: "0",
            text: "4xl center white",
            border: "b-4 blue-800",
            className: "p-4 m-4 font-semibold rounded-3xl shadow-xl cursor-pointer bg-blue-600 hover:bg-blue-700",
            onclick: () => {
                document.dispatchEvent(new CustomEvent('save-score', {
                    detail: { date: document.date, game: id, scores: getEntry() }
                }));
            }
        }, "Save");

        const view = d("grid", [
            closeButton,
            innerView,
            saveButton,
            pastScoresView
        ]);
    
        const setEntry = (game) => {
            id = game.id;
            setInnerEntry(game);
            setPastScoresEntry(game);
        };
    
        return { view, setEntry, ...innerApi, ...pastScoresApi };
    };

    // Component: Team
    const team = (t) => {
        const scoreText = d("justify-self-end");
        const view = d("px-3 font-medium text-3xl leading-none grid grid-cols-[auto_1fr] gap-4", [
            d("pb-2 truncate", t),
            scoreText
        ]);
    
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

        const view = h('div', { className: `rounded-xl ${line[3]} m-1`, 
            onclick: () => document.dispatchEvent(new CustomEvent('navigate', { detail: yy })) }, [
                d("text-lg italic font-bold tracking-widest text-white text-center leading-none", line[2]),
                d("grid grid-flow-col auto-cols-fr", teams.map(x => x.view))
        ]);

        return {
            view,
            setScores: (scores) => teams.map((t, i) => t.setScore(scores[i])),
        };
    };

    const heading = (s) => d("text-xs text-end font-bold text-blue-300 h-3", s);

    const title = (s) => d("text-xl px-4 italic", s);

    const side = (s) => d("text-lg px-4", s);

    // Component: Games
    const games = () => {
        let gameIndex = 0;
        let games = {};
        const view = window.schedule.split('\n').map((e) => {
            let entry = e.split('\t');
            switch (entry[0]) {
                case 'g': {
                    const id = entry[5] ? entry[5] : `${gameIndex++}`;
                    const game1 = game(id, entry.slice(1));
                    games[id] = game1;
                    return game1.view;
                }
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
        const { view: entryView, setEntry, ...entryApi } = scoreEntryPage();

        const mainPage = h('div', { style: "display: none" }, mainView);
        const entryPage = h('div', { style: "display: none" }, entryView);

        const view = d("mx-auto max-w-screen-sm", [
            mainPage,
            entryPage
        ]);

        const setPage = (game) => {
            if (game) {
                setEntry(game);
                mainPage.style.display = 'none';
                entryPage.style.display = '';
                document.querySelector("input").focus();
            } else {
                entryPage.style.display = 'none';
                mainPage.style.display = '';
            }
        };

        return { view, setPage, ...mainApi, ...entryApi };
    };

    // Initialize and render the DOM
    const { view, ...api } = dom();

    return { view, ...api };
}