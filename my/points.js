(async function () {
  if (!(await requireAuth())) return;

  qs("#logout-btn").addEventListener("click", async () => {
    await logout();
    window.location.href = "../index.html";
  });

  qs("#points-balance-card").innerHTML = `
    <span class="points-balance-label">보유 포인트</span>
    <span class="points-balance-value">${getCurrentUserPoints().toLocaleString("ko-KR")}P</span>
  `;

  const TYPE_LABELS = { earn: "적립", use: "사용", adjust: "조정" };

  const history = await getPointsHistory();
  const listEl = qs("#points-list");
  const emptyState = qs("#empty-state");

  if (history.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    listEl.innerHTML = history
      .map(
        (entry) => `
        <div class="points-item card">
          <div class="points-item-info">
            <span class="badge ${entry.amount >= 0 ? "badge-success" : "badge-muted"}">${TYPE_LABELS[entry.type] || entry.type}</span>
            <span class="points-item-reason">${escapeHtml(entry.reason || "")}</span>
            <span class="points-item-date">${formatDate(entry.createdAt)}</span>
          </div>
          <span class="points-item-amount ${entry.amount >= 0 ? "positive" : "negative"}">
            ${entry.amount >= 0 ? "+" : ""}${entry.amount.toLocaleString("ko-KR")}P
          </span>
        </div>
      `
      )
      .join("");
  }
})();
