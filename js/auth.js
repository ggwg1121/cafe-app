// 로그인 세션 관리 (localStorage 기반 목업 인증)
// 의존: js/data.js(USERS, ADMINS), js/utils.js(readJSON, writeJSON, generateId)

const AUTH_USERS_KEY = "cafe_users";
const AUTH_SESSION_KEY = "cafe_session_user";
const AUTH_ADMIN_SESSION_KEY = "cafe_session_admin";

function getRegisteredUsers() {
  return readJSON(AUTH_USERS_KEY, window.USERS);
}

function saveRegisteredUsers(users) {
  writeJSON(AUTH_USERS_KEY, users);
}

function signup({ email, password, name }) {
  const users = getRegisteredUsers();
  if (users.some((u) => u.email === email)) {
    return { ok: false, error: "이미 가입된 이메일입니다." };
  }
  const newUser = { id: generateId("u"), email, password, name };
  users.push(newUser);
  saveRegisteredUsers(users);
  return { ok: true, user: newUser };
}

function login(email, password) {
  const user = getRegisteredUsers().find((u) => u.email === email && u.password === password);
  if (!user) {
    return { ok: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }
  writeJSON(AUTH_SESSION_KEY, { id: user.id, email: user.email, name: user.name });
  return { ok: true, user };
}

function logout() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

function getCurrentUser() {
  return readJSON(AUTH_SESSION_KEY, null);
}

// 로그인이 필요한 페이지 상단에서 호출. 세션 없으면 로그인 페이지로 이동시키고 false 반환
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/auth/login.html?redirect=${redirect}`;
    return false;
  }
  return true;
}

function adminLogin(email, password) {
  const admin = window.ADMINS.find((a) => a.email === email && a.password === password);
  if (!admin) {
    return { ok: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }
  writeJSON(AUTH_ADMIN_SESSION_KEY, { id: admin.id, email: admin.email, name: admin.name });
  return { ok: true, admin };
}

function adminLogout() {
  localStorage.removeItem(AUTH_ADMIN_SESSION_KEY);
}

function getCurrentAdmin() {
  return readJSON(AUTH_ADMIN_SESSION_KEY, null);
}

function requireAdmin() {
  const admin = getCurrentAdmin();
  if (!admin) {
    window.location.href = "/admin/login.html";
    return false;
  }
  return true;
}

window.signup = signup;
window.login = login;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.requireAuth = requireAuth;
window.adminLogin = adminLogin;
window.adminLogout = adminLogout;
window.getCurrentAdmin = getCurrentAdmin;
window.requireAdmin = requireAdmin;
