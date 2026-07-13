(function () {
  if (getCurrentAdmin()) {
    window.location.href = "./index.html";
    return;
  }

  const form = qs("#login-form");
  const errorEl = qs("#login-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorEl.classList.add("hidden");

    const email = qs("#email").value.trim();
    const password = qs("#password").value;

    const result = adminLogin(email, password);
    if (!result.ok) {
      errorEl.textContent = result.error;
      errorEl.classList.remove("hidden");
      return;
    }

    showToast(`${result.admin.name}님, 환영합니다!`);
    window.location.href = "./index.html";
  });
})();
