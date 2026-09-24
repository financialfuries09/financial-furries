const searchBtn=document.getElementById("searchBtn"),overlay=document.getElementById("searchOverlay"),closeSearch=document.getElementById("closeSearch"),input=document.getElementById("searchInput"),results=document.getElementById("searchResults");

const stories=[
 ["Markets","When markets move fast, the headline is only the beginning"],
 ["Money","Emergency funds: the boring money decision that matters"],
 ["Business","How to read a company's earnings without getting lost"],
 ["Learn","Market cap, revenue and profit: three numbers to know"],
 ["Personal Finance","Budgeting isn't restriction. It's knowing where your money goes."],
 ["Investing","Risk isn't the same thing as volatility."],
 ["Economy","Inflation: what it actually changes in your daily life."]
];

function openSearch(){if(overlay){overlay.classList.add("open");input&&input.focus()}}
if(searchBtn) searchBtn.onclick=openSearch;
if(closeSearch) closeSearch.onclick=()=>overlay.classList.remove("open");
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&overlay)overlay.classList.remove("open")});
if(input) input.addEventListener("input",()=>{
 const q=input.value.trim().toLowerCase();
 if(!q){results.innerHTML="";return}
 const matches=stories.filter(s=>(s[0]+" "+s[1]).toLowerCase().includes(q));
 results.innerHTML=matches.length?matches.map(s=>`<div class="result"><b>${s[0].toUpperCase()}</b><h3>${s[1]}</h3></div>`).join(""):"<p>No stories found. Try another search.</p>";
});
const newsletter=document.getElementById("newsletter");
if(newsletter) newsletter.addEventListener("submit",e=>{
 e.preventDefault();
 const msg=document.getElementById("formMsg");
 if(msg)msg.textContent="You're on the list. (Demo form — connect an email service before launch.)";
 newsletter.reset();
});

/* Published articles from Article Admin */
const ARTICLE_KEY="financialFurriesArticles";
function escapeHTML(value){
 return String(value||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
function getPublishedArticles(){
 try{
   const a=JSON.parse(localStorage.getItem(ARTICLE_KEY)||"[]");
   return Array.isArray(a)?a.filter(x=>x&&x.title&&x.content):[];
 }catch(e){return []}
}
function addArticleStyles(){
 if(document.getElementById("publishedArticleStyles"))return;
 const style=document.createElement("style");
 style.id="publishedArticleStyles";
 style.textContent=`
 .published-section{margin-top:0}
 .published-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
 .published-card{background:#11141a;border:1px solid rgba(255,255,255,.08);border-radius:18px;overflow:hidden;min-width:0}
 .published-card img{display:block;width:100%;height:190px;object-fit:cover}
 .published-art{height:190px;display:grid;place-items:center;font-size:58px;background:#171b22}
 .published-body{padding:20px}
 .published-body .published-cat{font-size:11px;letter-spacing:.14em;color:#f5b900;font-weight:800;text-transform:uppercase}
 .published-body h3{margin:8px 0;font-size:22px;line-height:1.15}
 .published-body p{color:#a7aab0;margin:0 0 15px}
 .published-body button{border:0;background:none;color:#f5b900;font-weight:800;padding:0;cursor:pointer}
 .published-date{display:block;color:#777;font-size:12px;margin-top:8px}
 .article-reader{position:fixed;inset:0;z-index:10000;background:rgba(5,6,9,.9);display:none;place-items:center;padding:18px}
 .article-reader.open{display:grid}
 .article-reader-box{width:min(850px,100%);max-height:90vh;overflow:auto;background:#12151b;border:1px solid #363b45;border-radius:20px;padding:28px;position:relative}
 .article-reader-close{position:absolute;right:14px;top:8px;border:0;background:none;color:#fff;font-size:32px;cursor:pointer}
 .article-reader-box h2{font-size:clamp(30px,5vw,52px);line-height:1.05;margin:8px 0 12px}
 .article-reader-box .reader-meta{color:#999;margin-bottom:18px}
 .article-reader-box img{width:100%;max-height:420px;object-fit:cover;border-radius:14px;margin:10px 0 20px}
 .article-reader-box .reader-copy{font-size:18px;line-height:1.8;color:#ddd;white-space:pre-wrap}
 @media(max-width:800px){.published-grid{grid-template-columns:1fr}}
 `;
 document.head.appendChild(style);
}
function openPublishedArticle(article){
 addArticleStyles();
 let reader=document.getElementById("articleReader");
 if(!reader){
   reader=document.createElement("div");
   reader.id="articleReader";
   reader.className="article-reader";
   document.body.appendChild(reader);
 }
 reader.innerHTML=`
   <div class="article-reader-box">
    <button class="article-reader-close" aria-label="Close article">×</button>
    <div class="published-body">
      <span class="published-cat">${escapeHTML(article.category||"News")}</span>
      <h2>${escapeHTML(article.title)}</h2>
      <div class="reader-meta">${escapeHTML(article.author||"Financial Furries")} · ${escapeHTML(article.date||"")}</div>
      ${article.image?`<img src="${escapeHTML(article.image)}" alt="">`:""}
      <div class="reader-copy">${escapeHTML(article.content)}</div>
    </div>
   </div>`;
 reader.classList.add("open");
 reader.querySelector(".article-reader-close").onclick=()=>reader.classList.remove("open");
 reader.onclick=e=>{if(e.target===reader)reader.classList.remove("open")};
}
function renderPublishedArticles(){
 const articles=getPublishedArticles();
 if(!articles.length)return;
 addArticleStyles();
 let section=document.getElementById("publishedArticles");
 if(section)section.remove();
 section=document.createElement("section");
 section.id="publishedArticles";
 section.className="section published-section";
 const grid=document.createElement("div");
 grid.className="published-grid";
 articles.slice().reverse().forEach(article=>{
   const card=document.createElement("article");
   card.className="published-card";
   card.innerHTML=`
     ${article.image?`<img src="${escapeHTML(article.image)}" alt="" loading="lazy">`:`<div class="published-art">📰</div>`}
     <div class="published-body">
       <span class="published-cat">${escapeHTML(article.category||"News")}</span>
       <h3>${escapeHTML(article.title)}</h3>
       <p>${escapeHTML(article.excerpt||String(article.content).slice(0,150))}</p>
       <button type="button">Read article →</button>
       <span class="published-date">${escapeHTML(article.date||"")}${article.author?" · By "+escapeHTML(article.author):""}</span>
     </div>`;
   card.querySelector("button").onclick=()=>openPublishedArticle(article);
   grid.appendChild(card);
 });
 section.innerHTML=`<div class="section-head"><div><span class="kicker">PUBLISHED BY YOU</span><h2>Latest articles</h2></div><a href="admin.html" class="filter">✦ Write an article</a></div>`;
 section.appendChild(grid);
 const featured=document.getElementById("latest");
 if(featured) featured.insertAdjacentElement("afterend",section);
 else document.querySelector("main")?.prepend(section);
}
document.addEventListener("DOMContentLoaded",renderPublishedArticles);
