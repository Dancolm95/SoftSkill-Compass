const clientId = '78efcd81223145fa91347ff0ea67de4e';
const clientSecret = '5571aaeff47541ff85fbab6edfdf4ca8';

export async function obtenerTokenSpotify() {
  const base64 = btoa(`${clientId}:${clientSecret}`);

  const resp = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${base64}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const data = await resp.json();
  return data.access_token;
}

export async function buscarPlaylist(emocion, token) {
  const resp = await fetch(`https://api.spotify.com/v1/search?q=${emocion}&type=playlist&limit=20`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await resp.json();
  const playlists = data.playlists.items;

  if (playlists.length === 0) {
    throw new Error ('No se encuentra ninguna playlist');
  }

  const randomIndex = Math.floor(Math.random() * playlists.length);
  return playlists[randomIndex]
}

async function obtenerFrase() {
  const response = await fetch('https://api.quotable.io/random?tags=inspirational');
  const data = response.json();
  return data;
}
