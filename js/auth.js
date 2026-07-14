// 로그인 세션 관리 (Supabase Auth 기반)
// 의존: js/supabaseClient.js(sb)
//
// Supabase 세션 조회는 비동기이므로, 페이지 스크립트는 getCurrentUser() 등을
// 사용하기 전에 반드시 initAuth()(또는 requireAuth/requireAdmin)를 await 해야 한다.

let _authState = { user: null, profile: null };
let _authReady = refreshAuthState();

sb.auth.onAuthStateChange(() => {
  _authReady = refreshAuthState();
});

async function fetchProfile(userId) {
  const { data } = await sb.from("profiles").select("*").eq("id", userId).single();
  return data || null;
}

async function refreshAuthState() {
  const {
    data: { session },
  } = await sb.auth.getSession();

  if (!session?.user) {
    _authState = { user: null, profile: null };
    return;
  }

  const profile = await fetchProfile(session.user.id);
  _authState = { user: session.user, profile };
}

async function initAuth() {
  await _authReady;
  return _authState;
}

function getCurrentUser() {
  if (!_authState.profile) return null;
  return { id: _authState.profile.id, email: _authState.profile.email, name: _authState.profile.name };
}

function getCurrentUserPoints() {
  return _authState.profile ? _authState.profile.points_balance : 0;
}

function translateAuthError(error) {
  if (error.message === "Invalid login credentials") return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (error.message?.includes("already registered")) return "이미 가입된 이메일입니다.";
  if (error.message?.includes("Password should be at least")) return "비밀번호는 8자 이상이어야 합니다.";
  return error.message || "요청을 처리할 수 없습니다.";
}

async function signup({ email, password, name }) {
  const { data, error } = await sb.auth.signUp({ email, password, options: { data: { name } } });
  if (error) {
    return { ok: false, error: translateAuthError(error) };
  }

  if (!data.session) {
    // 프로젝트의 이메일 확인(Confirm email)이 켜져 있으면 세션 없이 user만 반환된다
    return { ok: true, needsEmailConfirmation: true, user: data.user };
  }

  await refreshAuthState();
  return { ok: true, needsEmailConfirmation: false, user: getCurrentUser() };
}

async function signInRaw(email, password) {
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    return { ok: false, error: translateAuthError(error) };
  }
  await refreshAuthState();
  return { ok: true };
}

async function login(email, password) {
  const result = await signInRaw(email, password);
  if (!result.ok) return result;

  if (_authState.profile?.role === "admin") {
    await logout();
    return { ok: false, error: "관리자 계정은 관리자 로그인 페이지에서 로그인해주세요." };
  }

  return { ok: true, user: getCurrentUser() };
}

async function logout() {
  await sb.auth.signOut();
  _authState = { user: null, profile: null };
}

// 로그인이 필요한 페이지 상단에서 호출. 세션 없으면 로그인 페이지로 이동시키고 false 반환
async function requireAuth() {
  await initAuth();
  if (!getCurrentUser()) {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/auth/login.html?redirect=${redirect}`;
    return false;
  }
  return true;
}

async function adminLogin(email, password) {
  const result = await signInRaw(email, password);
  if (!result.ok) return result;

  if (_authState.profile?.role !== "admin") {
    await logout();
    return { ok: false, error: "관리자 권한이 없는 계정입니다." };
  }

  return { ok: true, admin: getCurrentUser() };
}

async function adminLogout() {
  await logout();
}

function getCurrentAdmin() {
  const user = getCurrentUser();
  if (!user || _authState.profile?.role !== "admin") return null;
  return user;
}

async function requireAdmin() {
  await initAuth();
  if (!getCurrentAdmin()) {
    window.location.href = "/admin/login.html";
    return false;
  }
  return true;
}

window.initAuth = initAuth;
window.signup = signup;
window.login = login;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.getCurrentUserPoints = getCurrentUserPoints;
window.requireAuth = requireAuth;
window.adminLogin = adminLogin;
window.adminLogout = adminLogout;
window.getCurrentAdmin = getCurrentAdmin;
window.requireAdmin = requireAdmin;
