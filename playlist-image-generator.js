function generateArt(prompt) {
    let DALLE_API_KEY;

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const config = JSON.parse(xhr.responseText);
                DALLE_API_KEY = config.DALLE_KEY;
                const apiUrl = 'https://api.openai.com/v1/images/generations';

                fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${DALLE_API_KEY}`
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
                        console.log(data);
                        console.log(imageSource); // log image source to console
                        document.getElementById("playlist-art").src = imageSource;
                        return imageSource;
                    })
                    .catch(error => console.error(error));
            } else {
                console.error('Error loading configuration file:', xhr.statusText);
            }
        }
    };
    xhr.open('GET', 'config.json', true);
    xhr.send();



}