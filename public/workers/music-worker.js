function truncate(text, max) {
  if (!text) return "";
  return text.substring(0, max - 1).trim() + (text.length > max ? "…" : "");
}

async function checkImageExists(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function fetchSongData() {
  try {
    const res = await fetch(
      "https://api.rocksky.app/xrpc/app.rocksky.actor.getActorScrobbles?limit=1&offset=0&did=t1c.dev",
    );
    const resp = await res.json();

    const song = resp?.scrobbles[0];
    if (!song) {
      return { error: "No song playing" };
    }
    if (Date.now() - new Date(song.createdAt).getTime() > 10 * 60 * 1000) {
      return { error: "Last scrobble over 10 mins ago, ignoring" }
    }

    const songData = {
      title: truncate(song.title, 30),
      artist: truncate(song.artist, 40),
      albumArt: song.albumArt,
    };
    
    return songData;
  } catch (error) {
    return { error: error.message };
  }
}

self.addEventListener("message", async (event) => {
  if (event.data.type === "FETCH_SONG") {
    const songData = await fetchSongData();
    self.postMessage({
      type: "SONG_DATA",
      data: songData,
    });
  }
});

fetchSongData().then((songData) => {
  self.postMessage({
    type: "SONG_DATA",
    data: songData,
  });
});
