(function () {
  if (!requireAuth()) return;

  qs("#logout-btn").addEventListener("click", () => {
    logout();
    window.location.href = "../index.html";
  });

  const user = getCurrentUser();

  qs("#profile-card").innerHTML = `
    <p class="profile-name">${escapeHtml(user.name)}님</p>
    <p class="profile-email">${escapeHtml(user.email)}</p>
  `;

  qs("#order-count").textContent = `${getOrders().length}건`;
  qs("#review-count").textContent = `${getReviews().filter((r) => r.userId === user.id).length}건`;
  qs("#basket-count").textContent = `${getCartCount()}개`;
})();
