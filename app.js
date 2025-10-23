// 🌍 FindAllEasy Frontend - Connected to Live API

const API_URL = "https://api.findalleasy.com"; // ✅ Live backend URL

// Bölge ve dil tespiti
async function resolveCountry() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return {
      code: data.country_code || "TR",
      name: data.country_name || "Türkiye",
      lang: navigator.language.split("-")[0] || "tr"
    };
  } catch (e) {
    console.error("IP lookup failed, defaulting to TR");
    return { code: "TR", name: "Türkiye", lang: "tr" };
  }
}

// Arama isteği gönder
async function performSearch(query) {
  try {
    const url = `${API_URL}/search?q=${encodeURIComponent(query)}&lang=tr`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      renderResults(data.results);
    } else {
      document.getElementById("results").innerHTML = "<p>Sonuç bulunamadı.</p>";
    }
  } catch (err) {
    console.error("Search failed:", err);
    document.getElementById("results").innerHTML =
      "<p>Arama sırasında bir hata oluştu.</p>";
  }
}

// Arama sonuçlarını vitrine yaz
function renderResults(results) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  results.forEach(item => {
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <h3>${item.title || "Ürün"}</h3>
      <p>Fiyat: ${item.price_try_with_vat.toFixed(2)} ₺</p>
      <p>Site: ${item.site}</p>
      <a href="${item.product_url}" target="_blank">Ürünü Gör</a>
    `;
    container.appendChild(card);
  });
}

// Sayfa yüklendiğinde
window.addEventListener("DOMContentLoaded", async () => {
  const country = await resolveCountry();
  console.log("Detected country:", country);

  const searchBox = document.getElementById("searchInput");
  const button = document.getElementById("searchButton");

  button.addEventListener("click", () => {
    const query = searchBox.value.trim();
    if (query) performSearch(query);
  });
});
