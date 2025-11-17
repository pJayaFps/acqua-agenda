// Usuário e senha “pré-definidos” (JSON local)
const credenciais = {
  usuario: "admin",
  senha: "1234"
};

const btnLogin = document.getElementById("btnLogin");
const msgErro = document.getElementById("msgErro");

btnLogin.addEventListener("click", () => {
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (usuario === credenciais.usuario && senha === credenciais.senha) {
    // login ok → salvar no sessionStorage e redirecionar
    sessionStorage.setItem("logado", "true");
    window.location.href = "index.html"; // aqui vai a página principal do sistema
  } else {
    msgErro.textContent = "Usuário ou senha incorretos!";
  }
});

// Bloquear acesso se não logado
window.addEventListener("load", () => {
  if (window.location.pathname.endsWith("index.html")) {
    const logado = sessionStorage.getItem("logado");
    if (!logado) {
      window.location.href = "login.html";
    }
  }
});
