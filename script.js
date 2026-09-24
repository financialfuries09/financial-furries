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
function openSearch(){overlay.classList.add("open");input.focus()}
searchBtn.onclick=openSearch;closeSearch.onclick=()=>overlay.classList.remove("open");
document.addEventListener("keydown",e=>{if(e.key==="Escape")overlay.classList.remove("open")});
input.addEventListener("input",()=>{
 const q=input.value.trim().toLowerCase();
 if(!q){results.innerHTML="";return}
 const matches=stories.filter(s=>(s[0]+" "+s[1]).toLowerCase().includes(q));
 results.innerHTML=matches.length?matches.map(s=>`<div class="result"><b>${s[0].toUpperCase()}</b><h3>${s[1]}</h3></div>`).join(""):"<p>No stories found. Try another search.</p>";
});
document.getElementById("newsletter").addEventListener("submit",e=>{
 e.preventDefault();document.getElementById("formMsg").textContent="You're on the list. (Demo form — connect an email service before launch.)";e.target.reset();
});
