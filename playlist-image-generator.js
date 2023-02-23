function generateArt(prompt) {
    const apiKey = '${{ secrets.DALLE_KEY }}';
    const apiUrl = 'https://api.openai.com/v1/images/generations';

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            "model": "image-alpha-001",
            "prompt": prompt,
            "num_images": 1,
            "size": "1024x1024",
            "response_format": "url"
        })
    })
        .then(response => response.json())
        .then(data => {
            const imageSource = data.data[0].url;
            console.log(imageSource); // log image source to console
            document.getElementById("playlist-art").src = imageSource;
            return imageSource;
        })
        .catch(error => console.error(error));
}