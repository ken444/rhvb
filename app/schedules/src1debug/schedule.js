export default function schedule(title, heading, game) {

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

    return { view, games }
}