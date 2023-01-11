const schedule1 = 
`
h	Thursday Jan z 2023		
d	20230102		
t	8:15 OLQW		
g	Karen	Derek	N
g	Pao	Lev	C
g	Philip	Brent	S
t	8:35 OLQW		
g	Derek	Jorge	N
g	Scott	Pao	C
g	Brent	Sandy	S
t	8:55 OLQW		
g	Jorge	Karen	N
g	Lev	Scott	C
g	Sandy	Philip	S
t	9:15 OLQW		
g	Karen	Derek	N
g	Pao	Lev	C
g	Philip	Brent	S
t	9:35 OLQW		
g	Derek	Jorge	N
g	Scott	Pao	C
g	Brent	Sandy	S
t	9:55 OLQW		
g	Jorge	Karen	N
g	Lev	Scott	C
g	Sandy	Philip	S
			
t	8:15 SP		
g	Marcia	Aven	
t	8:35 SP		
g	Wayne	Marcia	
t	8:55 SP		
g	Aven	Wayne	
t	9:15 SP		
g	Marcia	Aven	
t	9:35 SP		
g	Wayne	Marcia	
t	9:55 SP		
g	Aven	Wayne	

`



export default function schedule(title, heading, game) {

    let date = '';
    let gameIndex = 0;
    const htmlArray = schedule1.split('\n').map((e) => {
      let entry = e.split('\t');
      switch (entry[0]) {
        case 'g':
          return game(`${gameIndex++}`, [entry[1], entry[2]])
        case 't':
          return heading(entry[1]);
        case 'h':
          return title(entry[1]);
        case 'd':
          date = entry[1];
      }
    });

    return { htmlArray, date }
}