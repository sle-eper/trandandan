export async function history() {
    try {
        const response = await fetch(`/api/spy/users/history`, {
             method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        } );
        if (!response.ok) {
            return `<p class="text-red-500">No history found</p>`;
        }

        const { data } = await response.json();
        return `
        <div id='historySection' class="hidden flex flex-col items-center justify-center gap-4 py-12">
            <div class="col-span-2 md:col-span-3  flex justify-center mb-10 text-4xl font-bold uppercase text-[#ff4d4d] tracking-wide font-['Share_Tech_Mono']
                [text-shadow:0_0_5px_#ff0000,0_0_15px_#ff0000] select-none">HISTORY</div>

            <p>Total matches: <b>${data.totalMatches ? data.totalMatches :0}</b></p>
            <p>Spy: <b>${data.spyCount ? data.spyCount:0}</b></p>
            <p>Investigator: <b>${data.investigatorCount ? data.investigatorCount:0}</b></p>
            <p>Win: <b>${data.winCount ? data.winCount : 0}</b></p>
            <p>Lose: <b>${data.loseCount ? data.loseCount: 0}</b></p>

            <button id="confirm-btn"
                    class="px-10 py-4 text-xl mt-10 font-bold rounded-lg 
                        bg-gradient-to-b from-[#9B1C1C] to-[#6F1414]
                        hover:from-[#B32626] hover:to-[#8B1E1E]
                        text-white shadow-lg
                        hover:scale-105 
                        transition-all duration-200 cursor-pointer
                        font-['Share_Tech_Mono'] tracking-wider">
                CONFIRM 
            </button>
        </div>
        `;
    } catch (err) {
        return `<p class="text-red-500">Server unreachable</p>`;
    }
}
