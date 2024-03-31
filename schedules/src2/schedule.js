export default function buildSchedule() {

  let date = '';
  const schedule = window.schedule.split('\n').map((e) => {
    let entry = e.split('\t');
    switch (entry[0]) {
      case 'g':
        return [entry[5], 'g', { teams: entry.slice(1,3), game: entry[3], color: entry[4], id: entry[5] }]
      case 'd':
        date = entry[1];
        return [null, null]
     default:
        return [null, entry[0], entry[1]]
    }
  });  
  
  return { schedule, date }
}
