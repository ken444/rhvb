export default function db() {

    //const puri = "https://rhvb568.azurewebsites.net";    
    const puri = "/api";    

    //const devuri = "http://localhost:3000";
    const devuri = puri;
 
    const uri = window.location.hostname == '127.0.0.1' ?  devuri : puri;
    
    let stage1 = '';
    let stage2 = '';

    return {

        async saveScore(x) {
            await fetch(`${uri}/V3p`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                body: JSON.stringify(x)
            });
        },

        async getScores(date) {
            const scores = await (await fetch(`${uri}/V3?date=${date}&stage=${stage1}`)).json();
            stage1 = scores.stage;
            return scores.data;
        },

        async getPastScores(date, game, force) {
            const scores = await (await fetch(`${uri}/V3?date=${date}&game=${game}&stage=${force ? '' : stage2}`)).json();
            stage2 = scores.stage;
            return scores.data;
        }
        
    }
}