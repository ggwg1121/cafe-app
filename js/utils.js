// 공통 유틸리티

function qs(selector, scope) {
  return (scope || document).querySelector(selector);
}

function qsa(selector, scope) {
  return Array.from((scope || document).querySelectorAll(selector));
}

function formatPrice(amount) {
  return amount.toLocaleString("ko-KR") + "원";
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

function generateId(prefix) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str ?? "");
  return div.innerHTML;
}

function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function showToast(message, duration = 2000) {
  let toast = qs("#toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), duration);
}

window.qs = qs;
window.qsa = qsa;
window.formatPrice = formatPrice;
window.formatDate = formatDate;
window.generateId = generateId;
window.escapeHtml = escapeHtml;
window.debounce = debounce;
window.getQueryParam = getQueryParam;
window.readJSON = readJSON;
window.writeJSON = writeJSON;
window.showToast = showToast;
