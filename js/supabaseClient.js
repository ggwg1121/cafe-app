// Supabase 클라이언트 초기화
// 의존: Supabase JS CDN UMD 빌드(window.supabase)가 이 스크립트보다 먼저 로드되어야 함

const SUPABASE_URL = "https://xltukcqoelxrpvtghsam.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHVrY3FvZWx4cnB2dGdoc2FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MTQ4NTcsImV4cCI6MjA5OTQ5MDg1N30.tyH6r7X_I_RkHCnicMLfHqK8El-fFO2cvdPSVYahdHQ";

window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
