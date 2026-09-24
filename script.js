async function loadMediaNews(){

  try {
    const response = await fetch("media-news.json");
    const data = await response.json();

    const articles = data.articles || [];

    const section = document.createElement("section");
    section.id = "ff-media-news";
    section.className = "section";

    section.innerHTML = `
      <div class="section-head">
        <div>
          <span class="kicker">FINANCIAL MEDIA</span>
          <h2>📰 Live Media News</h2>
        </div>
        <span class="updated">Indian & Global</span>
      </div>

      <div class="ff-news-grid">
        ${articles.map(article => `
          <a
            class="ff-news-card"
            href="${article.link}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="ff-news-meta">
              ${article.region || "Finance"} · ${article.source || ""}
            </div>

            <h3>${article.title}</h3>

            <p>${article.description || "Read the latest financial news."}</p>

            <div class="ff-news-source">
              Read original article →
            </div>
          </a>
        `).join("")}
      </div>

      <div class="ff-news-note">
        Headlines and summaries are provided through news feeds.
        Click a story to read the original publisher's article.
      </div>
    `;

    const newsSection = document.getElementById("ff-news");

    if(newsSection){
      newsSection.insertAdjacentElement("afterend", section);
    }else{
      document.querySelector("main")?.appendChild(section);
    }

  } catch(error) {
    console.error("Media News could not be loaded:", error);
  }
}
document.addEventListener("DOMContentLoaded",()=>{
  loadMediaNews();
});
