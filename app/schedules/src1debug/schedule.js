export default function schedule(title, heading, game) {

    let date = '';
    let gameIndex = 0;
    let games = [];
    const htmlArray = window.schedule.split('\n').map((e) => {
      let entry = e.split('\t');
      switch (entry[0]) {
        case 'g':
          const game1 = game(`${gameIndex++}`, entry.slice(1));
          games.push(game1);
          return game1.view;
        case 't':
          return heading(entry[1]);
        case 'h':
          return title(entry[1]);
        case 's':
          return side(entry[1]);
        case 'd':
          date = entry[1];
      }
    });

    return { htmlArray, date }
}