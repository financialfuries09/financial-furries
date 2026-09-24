const K = "financialFurriesArticles";
const FINANCIAL_DISCLAIMER = "Information published by Financial Furries is for educational and informational purposes only and is not financial, investment, tax, or legal advice. Financial markets involve risk, and past performance does not guarantee future results. Readers should consider their own circumstances, conduct their own research, and consider consulting a qualified professional.";

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

function esc(value){return String(value||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function getPublishedArticles(){try{const d=JSON.parse(localStorage.getItem(K)||"[]");return Array.isArray(d)?d:[]}catch(e){return[]}}

function addArticleStyles(){
  if(document.getElementById("ff-published-styles"))return;
  const s=document.createElement("style");s.id="ff-published-styles";
  s.textContent=`
  #ff-news,#ff-published{margin:40px 0}
  .ff-news-grid,.ff-published-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
  .ff-news-card{display:block;text-decoration:none;color:inherit;border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:19px;background:rgba(255,255,255,.035)}
  .ff-news-card:hover{transform:translateY(-2px)}
  .ff-news-meta,.ff-card-meta{font-size:11px;letter-spacing:.12em;font-weight:700;opacity:.65}
  .ff-news-card h3{margin:9px 0 8px;font-size:18px;line-height:1.3}
  .ff-news-card p{margin:0 0 12px;opacity:.7;font-size:14px;line-height:1.5}
  .ff-news-source{font-size:12px;opacity:.55}
  .ff-news-note{font-size:12px;opacity:.55;margin-top:14px}
  .ff-card{border:1px solid rgba(255,255,255,.1);border-radius:18px;overflow:hidden;background:rgba(255,255,255,.035);padding:0;cursor:pointer;text-align:left;color:inherit}
  .ff-card-body{padding:20px}.ff-card h3{margin:10px 0 8px;font-size:20px;line-height:1.2}.ff-card p{margin:0 0 14px;opacity:.72;line-height:1.5}.ff-card-date{font-size:12px;opacity:.55}
  #ff-reader{position:fixed;inset:0;z-index:9999;display:none;background:rgba(0,0,0,.78);padding:20px;overflow:auto}
  #ff-reader.open{display:block}.ff-reader-box{max-width:760px;margin:30px auto;background:#10131a;border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:28px;color:#fff}
  .ff-reader-close{float:right;border:0;background:transparent;color:#fff;font-size:30px;cursor:pointer}.ff-reader-content{white-space:pre-wrap;line-height:1.7;opacity:.9}
  .ff-reader-disclaimer{margin-top:28px;padding:16px;border-radius:14px;background:rgba(245,197,66,.07);border:1px solid rgba(245,197,66,.18);font-size:13px;line-height:1.55}
  @media(max-width:800px){.ff-news-grid,.ff-published-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(s);
}

async function renderDailyNews(){
  try{
    const r=await fetch("news.json?"+Date.now(),{cache:"no-store"});
    if(!r.ok)throw new Error("news.json unavailable");
    const data=await r.json(), items=Array.isArray(data.articles)?data.articles:[];
    if(!items.length)return;
    addArticleStyles();
    let section=document.getElementById("ff-news");
    if(!section){
      section=document.createElement("section");section.id="ff-news";section.className="section";
      const latest=document.getElementById("latest");
      if(latest)latest.insertAdjacentElement("beforebegin",section);
      else document.querySelector("main")?.prepend(section);
    }
    section.innerHTML=`
      <div class="section-head"><div><span class="kicker">DAILY FINANCIAL NEWS</span><h2>What’s happening in finance</h2></div><span class="updated">Updated daily</span></div>
      <div class="ff-news-grid">${items.slice(0,12).map(a=>`
        <a class="ff-news-card" href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">
          <div class="ff-news-meta">${esc(a.category||"NEWS")}</div>
          <h3>${esc(a.title)}</h3>
          ${a.summary?`<p>${esc(a.summary)}</p>`:""}
          <div class="ff-news-source">${esc(a.source||"Source")} · Read original →</div>
        </a>`).join("")}</div>
      <div class="ff-news-note">Headlines and links are provided for news discovery. Full articles remain with their original publishers.</div>`;
  }catch(e){console.log("Daily news unavailable",e)}
}

function renderPublishedArticles(){
  const articles=getPublishedArticles();if(!articles.length)return;addArticleStyles();
  let section=document.getElementById("ff-published");
  if(!section){section=document.createElement("section");section.id="ff-published";section.className="section";const latest=document.getElementById("latest");if(latest)latest.insertAdjacentElement("afterend",section);else document.querySelector("main")?.prepend(section)}
  section.innerHTML=`<div class="section-head"><div><span class="kicker">PUBLISHED BY YOU</span><h2>Latest articles</h2></div></div><div class="ff-published-grid">${articles.slice().reverse().map((a,i)=>`<button class="ff-card" type="button" data-ff-index="${i}"><div class="ff-card-body"><div class="ff-card-meta">${esc(a.category||"ARTICLE")}</div><h3>${esc(a.title)}</h3><p>${esc(a.excerpt||"")}</p><div class="ff-card-date">${esc(a.date||"")}${a.author?" · "+esc(a.author):""}</div></div></button>`).join("")}</div>`;
  section.querySelectorAll("[data-ff-index]").forEach(b=>b.addEventListener("click",()=>openReader(articles.slice().reverse()[Number(b.dataset.ffIndex)])));
}
function openReader(article){
  let reader=document.getElementById("ff-reader");
  if(!reader){reader=document.createElement("div");reader.id="ff-reader";reader.innerHTML=`<div class="ff-reader-box"><button class="ff-reader-close">×</button><div id="ff-reader-inner"></div></div>`;document.body.appendChild(reader);reader.querySelector(".ff-reader-close").onclick=()=>reader.classList.remove("open");reader.onclick=e=>{if(e.target===reader)reader.classList.remove("open")}}
  document.getElementById("ff-reader-inner").innerHTML=`<div class="ff-card-meta">${esc(article.category||"ARTICLE")}</div><h1>${esc(article.title)}</h1><div class="ff-card-date">${esc(article.date||"")}${article.author?" · "+esc(article.author):""}</div><p><strong>${esc(article.excerpt||"")}</strong></p><div class="ff-reader-content">${esc(article.content||"")}</div><div class="ff-reader-disclaimer"><strong>Financial Disclaimer:</strong> ${esc(FINANCIAL_DISCLAIMER)}</div>`;
  reader.classList.add("open");
}
function setupSearch(){
  if(!searchBtn||!overlay||!closeSearch||!input||!results)return;
  searchBtn.onclick=()=>{overlay.classList.add("open");input.focus()};closeSearch.onclick=()=>overlay.classList.remove("open");
  document.addEventListener("keydown",e=>{if(e.key==="Escape")overlay.classList.remove("open")});
  input.addEventListener("input",()=>{const q=input.value.trim().toLowerCase();if(!q){results.innerHTML="";return}const pub=getPublishedArticles().map(a=>[a.category||"Article",a.title||"",a.excerpt||""]);const matches=defaultStories.concat(pub).filter(s=>s.join(" ").toLowerCase().includes(q));results.innerHTML=matches.length?matches.map(s=>`<div class="result"><b>${esc(s[0].toUpperCase())}</b><h3>${esc(s[1])}</h3></div>`).join(""):"<p>No stories found. Try another search.</p>"});
}
function setupNewsletter(){const f=document.getElementById("newsletter"),m=document.getElementById("formMsg");if(!f||!m)return;f.addEventListener("submit",e=>{e.preventDefault();m.textContent="You're on the list. (Demo form — connect an email service before launch.)";f.reset()})}

document.addEventListener("DOMContentLoaded",()=>{renderDailyNews();renderPublishedArticles();setupSearch();setupNewsletter()});
