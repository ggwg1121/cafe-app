(async function () {
  if (!(await requireAdmin())) return;

  qs("#logout-btn").addEventListener("click", async () => {
    await adminLogout();
    window.location.href = "../login.html";
  });

  const tbody = qs("#order-tbody");
  const emptyState = qs("#empty-state");

  const orders = await getAllOrders();

  if (orders.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");

    tbody.innerHTML = orders
      .map((order) => {
        const itemSummary =
          order.items.length === 1 ? order.items[0].name : `${order.items[0].name} 외 ${order.items.length - 1}건`;

        return `
        <tr>
          <td><a href="./detail.html?id=${order.id}">${escapeHtml(order.id)}</a></td>
          <td>${escapeHtml(order.userName)}</td>
          <td>${escapeHtml(itemSummary)}</td>
          <td>${formatPrice(order.total)}</td>
          <td><span class="badge badge-success">${escapeHtml(order.status)}</span></td>
          <td>${formatDate(order.createdAt)}</td>
          <td><a href="./detail.html?id=${order.id}" class="btn btn-secondary">상세</a></td>
        </tr>
      `;
      })
      .join("");
  }
})();
