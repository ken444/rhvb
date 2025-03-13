export default function db() {

    const puri = "https://rhvb568.azurewebsites.net";    

    //const devuri = "http://localhost:3000";
    const devuri = puri;
 
    const uri = window.location.hostname == '127.0.0.1' ?  devuri : puri;
    
    let stage1 = -1;
    let stage2 = -1;

    return {

        async saveScore(x) {
            await fetch(uri, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify(x)
            });
        },

        async getScores(date) {
            const scores1 = await fetch(`${uri}/V2/date/'${date}'/${stage1}`);
            const scores = await scores1.json();
            stage1 = scores.stage;
            return scores.data;
        },

        async getPastScores(date, id, force) {
            const scores = await (await fetch(`${uri}/V2/date/'${date}'/game/'${id}'/${force ? -1 : stage2}`)).json();
            stage2 = scores.stage;
            return scores.data;
        }

    }
}