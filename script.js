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
/* ================================
   FINANCIAL FURRIES FURRY AI
   ================================ */

const aiButton = document.getElementById("ff-ai-button");
const aiChat = document.getElementById("ff-ai-chat");
const aiClose = document.getElementById("ff-ai-close");
const aiSend = document.getElementById("ff-ai-send");
const aiInput = document.getElementById("ff-ai-input");
const aiMessages = document.getElementById("ff-ai-messages");

if (aiButton && aiChat) {

  aiButton.addEventListener("click", () => {
    aiChat.classList.add("open");
    aiInput?.focus();
  });

  aiClose?.addEventListener("click", () => {
    aiChat.classList.remove("open");
  });

  function addAIMessage(text, type) {
    const message = document.createElement("div");
    message.className = `ff-ai-message ${type}`;
    message.textContent = text;
    aiMessages.appendChild(message);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  function getAIAnswer(question) {
    const q = question.toLowerCase();

    if (q.includes("stock") || q.includes("share")) {
      return "A stock represents a small ownership share in a company. Its price can rise or fall, so investing in stocks involves risk.";
    }

    if (q.includes("mutual fund")) {
      return "A mutual fund pools money from many investors and invests it in assets such as stocks or bonds. A fund manager usually manages the portfolio.";
    }

    if (q.includes("etf")) {
      return "An ETF, or exchange-traded fund, holds a collection of assets and trades on a stock exchange. ETFs can provide diversification, but they still carry investment risk.";
    }

    if (q.includes("tax") || q.includes("income tax")) {
      return "Taxes depend on your income, investments, transactions and applicable laws. For personal tax decisions, check current government guidance or speak with a qualified tax professional.";
    }

    if (
      q.includes("budget") ||
      q.includes("saving") ||
      q.includes("personal finance") ||
      q.includes("50/30/20")
    ) {
      return "A budget helps you plan where your money goes. A simple starting point is to track income, essential expenses, savings and discretionary spending.";
    }

    if (
      q.includes("currency") ||
      q.includes("exchange rate") ||
      q.includes("dollar") ||
      q.includes("rupee")
    ) {
      return "Currency rates show how much one currency is worth compared with another. Exchange rates can change frequently because of market conditions, interest rates, trade and other factors.";
    }

    if (q.includes("inflation")) {
      return "Inflation means the general level of prices is rising over time. When inflation rises, the purchasing power of the same amount of money generally falls.";
    }

    if (q.includes("risk")) {
      return "Financial risk means there is a possibility of losing money or receiving a different result than expected. Higher potential returns often come with higher risk.";
    }

    return "I'm Furry AI 🦊. I can explain stocks, shares, mutual funds, ETFs, taxes, budgeting, inflation and currency rates in simple language. Try asking me one of those!";
  }

  function sendAIMessage() {
    const question = aiInput.value.trim();

    if (!question) return;

    addAIMessage(question, "ff-ai-user");

    aiInput.value = "";

    setTimeout(() => {
      addAIMessage(getAIAnswer(question), "ff-ai-bot");
    }, 300);
  }

  aiSend?.addEventListener("click", sendAIMessage);

  aiInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendAIMessage();
    }
  });
}
