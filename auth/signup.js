(function () {
  if (getCurrentUser()) {
    window.location.href = "../index.html";
    return;
  }

  const form = qs("#signup-form");
  const errorEl = qs("#signup-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorEl.classList.add("hidden");

    const name = qs("#name").value.trim();
    const email = qs("#email").value.trim();
    const password = qs("#password").value;
    const passwordConfirm = qs("#password-confirm").value;

    if (password !== passwordConfirm) {
      errorEl.textContent = "비밀번호가 일치하지 않습니다.";
      errorEl.classList.remove("hidden");
      return;
    }

    const result = signup({ email, password, name });
    if (!result.ok) {
      errorEl.textContent = result.error;
      errorEl.classList.remove("hidden");
      return;
    }

    showToast("가입이 완료되었습니다. 로그인해주세요.");
    window.location.href = "./login.html";
  });
})();
