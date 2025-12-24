// Usuários do sistema
const USERS = [
  { username: "admin", senha: "1234", financeiro: true },   // acesso total
  { username: "lavagem", senha: "123", financeiro: false }  // só lavagem
];

document.getElementById("btnLogin").addEventListener("click", () => {
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const msgErro = document.getElementById("msgErro");

  const user = USERS.find(u => u.username === usuario && u.senha === senha);

  if (user) {
    // Salva login com info de financeiro e expiração
    const expiraEm = Date.now() + (24 * 60 * 60 * 1000); // 24h
    localStorage.setItem("loginData", JSON.stringify({ username: user.username, financeiro: user.financeiro, expiraEm }));

    // Redireciona
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 100);
  } else {
    msgErro.textContent = "Usuário ou senha incorretos!";
  }
});
