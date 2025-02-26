const playlists = [
    '<iframe width="560" height="315" src="https://www.youtube.com/embed/xIm_RclSK-Q?si=hrCnYYUY9ITPJiSw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    '<iframe width="560" height="315" src="https://www.youtube.com/embed/QKha6J26k_4?si=tSWPkix-YocFXRMX" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    '<iframe width="560" height="315" src="https://www.youtube.com/embed/-0IETB8-uv4?si=GM-va240i1Wtw6My" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    '<iframe width="560" height="315" src="https://www.youtube.com/embed/SlHRk7RTO1s?si=8MuAYlCRi9a_3JrF" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    '<iframe width="560" height="315" src="https://www.youtube.com/embed/ZaZTpDCBWK8?si=GUPgxCoWmDVwxMII" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    '<iframe width="560" height="315" src="https://www.youtube.com/embed/hsxR8DkOIB4?si=lsZpEDmco9OAdwD9" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
];

if (playlists.length < 2) {
    console.error("Error: Need at least 2 playlists in the array.");
  } else {
    // Generate unique random indices
    const uniqueRandomIndices = () => {
      const set = new Set();
      while (set.size < 2) { 
        set.add(Math.floor(Math.random() * playlists.length));
      }
      return Array.from(set); 
    };

    const indices = uniqueRandomIndices(); 

    // Display playlists (with error handling)
    for (let i = 0; i < 2; i++) {
      const index = indices[i]; 
      if (index >= 0 && index < playlists.length) { 
        document.getElementById(`playlist${i+1}`).innerHTML = playlists[index]; 
      } else {
        console.error(`Invalid index: ${index}`);
        document.getElementById(`playlist${i+1}`).innerHTML = "Error: Invalid index."; 
      }
    }
  }
