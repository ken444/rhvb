export default function schedule(title, heading, game) {

    let date = '';
    let gameIndex = 0;
    const htmlArray = window.schedule.split('\n').map((e) => {
      let entry = e.split('\t');
      switch (entry[0]) {
        case 'g':
          return game(`${gameIndex++}`, [entry[1], entry[2]])
        case 't':
          return heading("");
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