const API_BASE_URL = "https://api.findalleasy.com";
// API helpers kept in app.js for now.
fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`)
  .then(response => response.json())
  .then(data => {
    // gelen veriyi vitrinde göster
    updateResults(data);
  })
  .catch(err => console.error("API bağlantı hatası:", err));
