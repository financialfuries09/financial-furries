const K = "financialFurriesArticles";
const FINANCIAL_DISCLAIMER = "Information published by Financial Furries is for educational and informational purposes only and is not financial, investment, tax, or legal advice. Financial markets involve risk, and past performance does not guarantee future results.";

const searchBtn = document.getElementById("searchBtn");
const overlay = document.getElementById("searchOverlay");
const closeSearch = document.getElementById("closeSearch");
const input = document.getElementById("searchInput");
const results = document.getElementById("searchResults");

const defaultStories = [
  ["Markets","When markets move fast, the headline is only the beginning"],
  ["Money","Emergency funds: the boring money decision that matters"],
  ["Business","How to read a company's earnings without getting lost"],
  ["Learn","Market cap, revenue and profit: three numbers to know"],
  ["Personal Finance","Budgeting isn't restriction. It's knowing where your money goes."],
  ["Investing","Risk isn't the same thing as volatility."],
  ["Economy","Inflation: what it actually changes in your daily life."]
];

function esc(value) {
  return String(value || "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function getPublishedArticles() {
  try {
    const data = JSON.parse(localStorage.getItem(K) || "[]");
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function addArticleStyles() {
  if (document.getElementById("ff-published-styles")) return;
  const style = document.createElement("style");
  style.id = "ff-published-styles";
  style.textContent = `
    #ff-published { margin: 40px 0; }
    #ff-published .ff-published-head {
      display:flex; justify-content:space-between; align-items:end;
      gap:20px; margin-bottom:22px;
    }
    #ff-published .ff-kicker {
      display:block; font-size:12px; font-weight:700;
      letter-spacing:.16em; margin-bottom:8px; opacity:.7;
    }
    #ff-published h2 { margin:0; }
    .ff-published-grid {
      display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:20px;
    }
    .ff-card {
      border:1px solid rgba(255,255,255,.10); border-radius:18px;
      overflow:hidden; background:rgba(255,255,255,.035);
      padding:0; cursor:pointer; text-align:left; color:inherit;
    }
    .ff-card:hover { transform:translateY(-2px); }
    .ff-card-img { width:100%; height:170px; object-fit:cover; display:block; background:#171a22; }
    .ff-card-body { padding:20px; }
    .ff-card-meta { font-size:11px; letter-spacing:.12em; font-weight:700; opacity:.65; }
    .ff-card h3 { margin:10px 0 8px; font-size:20px; line-height:1.2; }
    .ff-card p { margin:0 0 14px; opacity:.72; line-height:1.5; }
    .ff-card-date { font-size:12px; opacity:.55; }
    #ff-reader {
      position:fixed; inset:0; z-index:9999; display:none;
      background:rgba(0,0,0,.78); padding:20px; overflow:auto;
    }
    #ff-reader.open { display:block; }
    .ff-reader-box {
      max-width:760px; margin:30px auto; background:#10131a;
      border:1px solid rgba(255,255,255,.12); border-radius:20px;
      padding:28px; color:#fff;
    }
    .ff-reader-close {
      float:right; border:0; background:transparent; color:#fff;
      font-size:30px; cursor:pointer;
    }
    .ff-reader-box img { max-width:100%; border-radius:14px; margin:15px 0; }
    .ff-reader-content { white-space:pre-wrap; line-height:1.7; opacity:.9; }
    .ff-reader-disclaimer{margin-top:28px;padding:16px;border-radius:14px;background:rgba(245,197,66,.07);border:1px solid rgba(245,197,66,.18);font-size:13px;line-height:1.55;}
    @media (max-width: 800px) {
      .ff-published-grid { grid-template-columns:1fr; }
      #ff-published .ff-published-head { display:block; }
      .ff-reader-box { margin:10px auto; padding:20px; }
    }
  `;
  document.head.appendChild(style);
}

function renderPublishedArticles() {
  const articles = getPublishedArticles();
  if (!articles.length) return;

  addArticleStyles();

  let section = document.getElementById("ff-published");
  if (!section) {
    section = document.createElement("section");
    section.id = "ff-published";
    section.className = "section";
    const latest = document.getElementById("latest");
    if (latest) latest.insertAdjacentElement("afterend", section);
    else document.querySelector("main")?.prepend(section);
  }

  section.innerHTML = `
    <div class="ff-published-head">
      <div>
        <span class="ff-kicker">PUBLISHED BY YOU</span>
        <h2>Latest articles</h2>
      </div>
    </div>
    <div class="ff-published-grid">
      ${articles.slice().reverse().map((a, i) => `
        <button class="ff-card" type="button" data-ff-index="${i}">
          ${a.image ? `<img class="ff-card-img" src="${esc(a.image)}" alt="">` : ""}
          <div class="ff-card-body">
            <div class="ff-card-meta">${esc(a.category || "ARTICLE")}</div>
            <h3>${esc(a.title)}</h3>
            <p>${esc(a.excerpt || "")}</p>
            <div class="ff-card-date">${esc(a.date || "")}${a.author ? " · " + esc(a.author) : ""}</div>
          </div>
        </button>
      `).join("")}
    </div>
  `;

  section.querySelectorAll("[data-ff-index]").forEach(btn => {
    btn.addEventListener("click", () => openReader(articles.slice().reverse()[Number(btn.dataset.ffIndex)]));
  });
}

function openReader(article) {
  let reader = document.getElementById("ff-reader");
  if (!reader) {
    reader = document.createElement("div");
    reader.id = "ff-reader";
    reader.innerHTML = `<div class="ff-reader-box"><button class="ff-reader-close" aria-label="Close">×</button><div id="ff-reader-inner"></div></div>`;
    document.body.appendChild(reader);
    reader.querySelector(".ff-reader-close").onclick = () => reader.classList.remove("open");
    reader.addEventListener("click", e => {
      if (e.target === reader) reader.classList.remove("open");
    });
  }

  document.getElementById("ff-reader-inner").innerHTML = `
    <div class="ff-card-meta">${esc(article.category || "ARTICLE")}</div>
    <h1>${esc(article.title)}</h1>
    <div class="ff-card-date">${esc(article.date || "")}${article.author ? " · " + esc(article.author) : ""}</div>
    ${article.image ? `<img src="${esc(article.image)}" alt="">` : ""}
    ${article.excerpt ? `<p><strong>${esc(article.excerpt)}</strong></p>` : ""}
    <div class="ff-reader-content">${esc(article.content || "")}</div>
    <div class="ff-reader-disclaimer"><strong>Financial Disclaimer:</strong> ${esc(FINANCIAL_DISCLAIMER)}</div>
  `;
  reader.classList.add("open");
}

function setupSearch() {
  if (!searchBtn || !overlay || !closeSearch || !input || !results) return;
  searchBtn.onclick = () => { overlay.classList.add("open"); input.focus(); };
  closeSearch.onclick = () => overlay.classList.remove("open");
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") overlay.classList.remove("open");
  });
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = ""; return; }

    const published = getPublishedArticles().map(a => [
      a.category || "Article",
      a.title || "",
      a.excerpt || ""
    ]);
    const all = defaultStories.concat(published);
    const matches = all.filter(s => s.join(" ").toLowerCase().includes(q));

    results.innerHTML = matches.length
      ? matches.map(s => `<div class="result"><b>${esc(s[0].toUpperCase())}</b><h3>${esc(s[1])}</h3></div>`).join("")
      : "<p>No stories found. Try another search.</p>";
  });
}

function setupNewsletter() {
  const form = document.getElementById("newsletter");
  const msg = document.getElementById("formMsg");
  if (!form || !msg) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    msg.textContent = "You're on the list. (Demo form — connect an email service before launch.)";
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderPublishedArticles();
  setupSearch();
  setupNewsletter();
});
