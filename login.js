const USER = "admin";     // coloque seu usuario
    const PASS = "1234";      // coloque sua senha

    document.getElementById("btnLogin").addEventListener("click", () => {
      const usuario = document.getElementById("usuario").value.trim();
      const senha = document.getElementById("senha").value.trim();
      const msgErro = document.getElementById("msgErro");

      if (usuario === USER && senha === PASS) {
        // Login válido → salva por 24 horas
        const expiraEm = Date.now() + (24 * 60 * 60 * 1000);

        localStorage.setItem("loginData", JSON.stringify({ expiraEm }));

        // Delay para evitar bug do loop infinito
        setTimeout(() => {
          window.location.href = "index.html";
        }, 100);

      } else {
        msgErro.textContent = "Usuário ou senha incorretos!";
      }
    });
