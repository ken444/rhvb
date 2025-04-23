export default function db() {

    const puri = "/api";    

    const devuri = "http://localhost:4280/api";

 
    const uri = window.location.hostname == '127.0.0.1' ?  devuri : puri;
    
    let stage1 = '';
    let stage2 = '';
    let stage3 = '';

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
        },
        
        async changeFeed(date) {
            try {
                const response = await fetch(`${uri}/V4?date=${date}&stage=${stage3}`);
                if (!response.ok) throw new Error(`Failed to fetch change feed: ${response.status} ${response.statusText}`);

                const { continuation, ...rest } = await response.json();
                stage3 = continuation;
                return { ...rest };
            } catch (error) {
                console.error("Error in changeFeed:", error);
                throw error;
            }
        },
    }
}