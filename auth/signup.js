(async function () {
  await initAuth();
  if (getCurrentUser()) {
    window.location.href = "../index.html";
    return;
  }

  const form = qs("#signup-form");
  const errorEl = qs("#signup-error");

  form.addEventListener("submit", async (e) => {
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

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    const result = await signup({ email, password, name });
    if (!result.ok) {
      errorEl.textContent = result.error;
      errorEl.classList.remove("hidden");
      submitBtn.disabled = false;
      return;
    }

    if (result.needsEmailConfirmation) {
      showToast("가입 확인 메일을 보냈습니다. 메일함을 확인해주세요.");
      window.location.href = "./login.html";
      return;
    }

    showToast(`${result.user.name}님, 환영합니다!`);
    window.location.href = "../index.html";
  });
})();
