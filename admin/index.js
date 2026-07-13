(function () {
  if (!requireAdmin()) return;

  qs("#logout-btn").addEventListener("click", () => {
    adminLogout();
    window.location.href = "./login.html";
  });

  const orders = getAllOrders();
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const inventory = getInventory();
  const soldOutCount = inventory.filter((inv) => inv.stock === 0).length;

  const stats = [
    { label: "총 매출", value: formatPrice(totalRevenue) },
    { label: "총 주문 수", value: `${orders.length}건` },
    { label: "등록 메뉴 수", value: `${getMenus().length}개` },
    { label: "품절 메뉴 수", value: `${soldOutCount}개` },
  ];

  qs("#stat-grid").innerHTML = stats
    .map(
      (stat) => `
      <div class="card stat-tile">
        <p class="stat-tile-label">${escapeHtml(stat.label)}</p>
        <p class="stat-tile-value">${escapeHtml(stat.value)}</p>
      </div>
    `
    )
    .join("");

  const recentOrders = orders.slice(0, 5);
  const tbody = qs("#recent-orders-tbody");

  if (recentOrders.length === 0) {
    qs("#orders-empty").classList.remove("hidden");
  } else {
    tbody.innerHTML = recentOrders
      .map(
        (order) => `
        <tr>
          <td><a href="./orders/detail.html?id=${order.id}">${escapeHtml(order.id)}</a></td>
          <td>${escapeHtml(order.userName)}</td>
          <td>${formatPrice(order.total)}</td>
          <td><span class="badge badge-success">${escapeHtml(order.status)}</span></td>
          <td>${formatDate(order.createdAt)}</td>
        </tr>
      `
      )
      .join("");
  }

  const menus = getMenus();
  const lowStockItems = inventory
    .filter((inv) => inv.stock <= 5)
    .map((inv) => ({ menu: menus.find((m) => m.id === inv.menuId), stock: inv.stock }))
    .filter((item) => item.menu)
    .sort((a, b) => a.stock - b.stock);

  const statGrid = qs("#inventory-stat-grid");
  if (lowStockItems.length === 0) {
    statGrid.innerHTML = `<div class="card store-stat-card text-muted">재고가 부족한 메뉴가 없습니다.</div>`;
  } else {
    statGrid.innerHTML = lowStockItems
      .map(
        (item) => `
        <div class="card store-stat-card">
          <div class="store-stat-row">
            <span>${escapeHtml(item.menu.name)}</span>
            <span class="badge ${item.stock === 0 ? "badge-danger" : "badge-warning"}">
              ${item.stock === 0 ? "품절" : `재고 ${item.stock}개`}
            </span>
          </div>
        </div>
      `
      )
      .join("");
  }
})();
