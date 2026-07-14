(async function () {
  await initAuth();
  if (getCurrentUser()) {
    window.location.href = getQueryParam("redirect") || "../index.html";
    return;
  }

  const form = qs("#login-form");
  const errorEl = qs("#login-error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.classList.add("hidden");

    const email = qs("#email").value.trim();
    const password = qs("#password").value;
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    const result = await login(email, password);
    if (!result.ok) {
      errorEl.textContent = result.error;
      errorEl.classList.remove("hidden");
      submitBtn.disabled = false;
      return;
    }

    showToast(`${result.user.name}님, 환영합니다!`);
    window.location.href = getQueryParam("redirect") || "../index.html";
  });
})();
