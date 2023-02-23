const apiKey = '${{ secrets.OPEN_AI_KEY }}';
const selectedEngine = "text-davinci-003";
var playlistPrompt = "";

async function generateResponse(userInput) {
    const response = await fetch(`https://api.openai.com/v1/engines/${selectedEngine}/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            prompt: userInput,
            max_tokens: 2048,
            n: 1,
            temperature: 0.7
        })
    });

    const responseData = await response.json();
    prompt = responseData.choices[0].text;
    playlistPrompt = prompt;
}
