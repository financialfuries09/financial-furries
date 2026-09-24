(() => {
const esc=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const disclaimer="Information published by Financial Furries is for educational and informational purposes only and is not financial, investment, tax, or legal advice. Financial markets involve risk, and past performance does not guarantee future results.";
function render(articles){
 if(!articles.length)return;
 let main=document.querySelector("main"),sec=document.getElementById("sharedArticles")||document.createElement("section");sec.id="sharedArticles";sec.className="latest";
 sec.innerHTML=`<div class="section-head"><div><span class="eyebrow">PUBLISHED BY FINANCIAL FURRIES</span><h2>Latest articles</h2></div></div><div class="stories-grid">${articles.slice().reverse().map(a=>`<article class="story-card"><div class="story-body"><span class="tag">${esc(a.category||"News")}</span><h3>${esc(a.title)}</h3><p>${esc(a.excerpt||"")}</p><small>${esc(a.date||"")}${a.author?" · "+esc(a.author):""}</small><button class="readArticle" data-id="${esc(a.id)}">Read article →</button></div></article>`).join("")}</div>`;
 if(!sec.parentNode)main.appendChild(sec);
 sec.querySelectorAll(".readArticle").forEach(b=>b.onclick=()=>open(articles.find(a=>a.id===b.dataset.id)));
}
function open(a){let m=document.getElementById("articleReader");if(!m){m=document.createElement("div");m.id="articleReader";m.style="position:fixed;inset:0;background:#000d;z-index:9999;overflow:auto;padding:25px";m.innerHTML='<div style="max-width:760px;margin:auto;background:#191919;color:#f5f1e8;padding:25px;border-radius:18px"><button id="close">✕</button><div id="reader"></div></div>';document.body.appendChild(m);m.querySelector("#close").onclick=()=>m.remove()}m.querySelector("#reader").innerHTML=`<h1>${esc(a.title)}</h1><p>${esc(a.date||"")}${a.author?" · "+esc(a.author):""}</p>${a.image?`<img src="${esc(a.image)}" style="max-width:100%;border-radius:12px">`:""}<div style="white-space:pre-wrap;line-height:1.8">${esc(a.content||"")}</div><hr><p style="font-size:13px;color:#aaa">${disclaimer}</p>`}
fetch("articles.json?t="+Date.now()).then(r=>r.ok?r.json():null).then(d=>{if(d&&Array.isArray(d.articles))render(d.articles)}).catch(()=>{});
})();