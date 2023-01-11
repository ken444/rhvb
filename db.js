export default function db() {

    const puri = "https://node12351232153234.azurewebsites.net";    

    const devuri = "http://localhost:3000";
    //const devuri = puri;

 
    const uri = window.location.hostname == '127.0.0.1' ?  devuri : puri;
    
    let stage1 = -1;
    let stage2 = -1;

    return {

        async saveScore(date, game, scores) {
            await fetch(uri, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify({ date, game, scores })
            });
        },

        async getScores(date) {
            const scores = await (await fetch(`${uri}/date/'${date}'/${stage1}`)).json();
            stage1 = scores.stage;
            return scores.data;
        },

        async getPastScores(date, id, force) {
            const scores = await (await fetch(`${uri}/date/'${date}'/game/'${id}'/${force ? -1 : stage2}`)).json();
            stage2 = scores.stage;
            return scores.data;
        }

    }
}