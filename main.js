const CLIENT_ID = '${{ secrets.SPOTIFY_API_CLIENT }}';
const CLIENT_SECRET = '${{ secrets.SPOTIFY_API_SECRET }}';


async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
        },
        body: 'grant_type=client_credentials',
    });
    const data = await response.json();
    return data.access_token;
}


function addPreferenceInput() {
    const container = document.getElementById('preferences-container');
    const newInput = document.createElement('div');
    newInput.innerHTML = `
  <input type="text" class="preference-input">
`;
    let removeInput = false;

    newInput.querySelector('.preference-input').addEventListener('click', (event) => {
        if (!removeInput) {
            event.stopPropagation();
            removeInput = true;
        } else {
            newInput.remove();
            updateRemovePreferenceButtonStates();
        }
    });


    document.addEventListener('click', () => {
        removeInput = false;
    });
    container.insertBefore(newInput, document.getElementById('add-preference-button'));
    updateRemovePreferenceButtonStates();
}


function updateRemovePreferenceButtonStates() {
    const buttons = document.querySelectorAll('.remove-preference-button');
    buttons.forEach((button, index) => {
        button.disabled = index === 0 && buttons.length === 1;
    });
}


var songs = "";
async function getSimilarSongs() {
    document.getElementById("playlist-art").style.visibility = "visible";
    document.getElementById("playlist-art").src = "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif";
    const inputs = document.querySelectorAll('.preference-input');
    const preferences = Array.from(inputs).map(input => input.value.trim()).filter(preference => preference !== '');
    const accessToken = await getAccessToken();


    const similarSongs = [];
    for (const preference of preferences) {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(preference)}&type=track&limit=1`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },
        });
        const data = await response.json();
        if (data.tracks.items.length > 0) {
            const trackId = data.tracks.items[0].id;
            const response2 = await fetch(`https://api.spotify.com/v1/recommendations?limit=20&seed_tracks=${trackId}`, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                },
            });
            const data2 = await response2.json();
            similarSongs.push(...data2.tracks.map(track => {
                return {
                    name: track.name,
                    artist: track.artists[0].name,
                    image: track.album.images[0].url,
                    uri: track.uri,
                };
            }));
        }
    }

    // Shuffle the similar songs
    for (let i = similarSongs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [similarSongs[i], similarSongs[j]] = [similarSongs[j], similarSongs[i]];
    }

    // Display the similar songs
    const playlist = document.getElementById('playlist');
    playlist.innerHTML = '';
    if (similarSongs.length > 0) {
        const list = document.createElement('ol');
        similarSongs.forEach(song => {
            const item = document.createElement('li');
            item.innerHTML = `
  <img onclick="window.open('${song.uri}');" src="${song.image}" alt="${song.name} image">
  <div onclick="window.open('spotify:track:${song.uri}');" class="song-desc">
  <br><br>
    <div>${song.name}</div>
    <div style="color: #a6a6a6;">${song.artist}</div>

  </div>
`;
            list.appendChild(item);
        });
        playlist.appendChild(list);
    } else {
        playlist.innerHTML = 'No similar songs found.';
    }
    console.log(songs);
    await generateResponse("Make a DALL E prompt for a playlist artwork for the following songs: " + songs);
    generateArt(playlistPrompt);
}



// Add event listeners to the buttons
document.getElementById('add-preference-button').addEventListener('click', addPreferenceInput);
document.getElementById('get-similar-songs-button').addEventListener('click', getSimilarSongs);



