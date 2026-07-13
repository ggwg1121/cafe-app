(function () {
  if (!requireAdmin()) return;

  qs("#logout-btn").addEventListener("click", () => {
    adminLogout();
    window.location.href = "../login.html";
  });

  const tbody = qs("#order-tbody");
  const emptyState = qs("#empty-state");
  const statusSelect = qs("#status-select");

  window.ORDER_STATUSES.forEach((status) => {
    const opt = document.createElement("option");
    opt.value = status;
    opt.textContent = status;
    statusSelect.appendChild(opt);
  });

  function render() {
    const filterStatus = statusSelect.value;
    const orders = getAllOrders().filter((order) => !filterStatus || order.status === filterStatus);

    if (orders.length === 0) {
      tbody.innerHTML = "";
      emptyState.classList.remove("hidden");
      return;
    }

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
          <td>
            <select class="status-select-inline" data-status="${order.id}">
              ${window.ORDER_STATUSES.map(
                (status) => `<option value="${status}" ${status === order.status ? "selected" : ""}>${status}</option>`
              ).join("")}
            </select>
          </td>
          <td>${formatDate(order.createdAt)}</td>
          <td><a href="./detail.html?id=${order.id}" class="btn btn-secondary">상세</a></td>
        </tr>
      `;
      })
      .join("");

    qsa("[data-status]", tbody).forEach((select) => {
      select.addEventListener("change", () => {
        updateOrderStatus(select.dataset.status, select.value);
        showToast("주문 상태가 변경되었습니다.");
        render();
      });
    });
  }

  statusSelect.addEventListener("change", render);

  render();
})();
