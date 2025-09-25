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
      "https://api.listenbrainz.org/1/user/thatonecalculator/playing-now",
    );
    const resp = await res.json();

    const title = resp?.payload?.listens[0]?.track_metadata;
    if (!title) {
      return { error: "No song playing" };
    }

    const songData = {
      title: truncate(title.track_name, 30),
      artist: truncate(title.artist_name, 40),
      albumArt: "",
    };

    const metadataRes = await fetch(
      encodeURI(
        `https://musicbrainz.org/ws/2/release/?query=recording:'${title.track_name}' AND artist:'${title.artist_name}'&fmt=json`,
      ),
    );
    const metadata = await metadataRes.json();

    if (metadata?.releases[0]?.id) {
      const imageUrl = `https://coverartarchive.org/release/${metadata.releases[0].id}/front-250`;
      const imageExists = await checkImageExists(imageUrl);

      if (imageExists) {
        songData.albumArt = imageUrl;
        songData.hasAlbumArt = true;
      } else {
        songData.hasAlbumArt = false;
      }
    } else {
      songData.hasAlbumArt = false;
    }

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
