// =======================================================
// app-especial.js
// FEITO ESPECÍFICO PARA SEU HTML E SEU BACKEND
// =======================================================

const API = "http://localhost:3000/api/lavagens-especiais";

// -----------------------
// 🔵 VALIDAÇÃO DE PLACA
// -----------------------
function validarPlaca(placaRaw) {
    if (!placaRaw) return false;

    const placa = placaRaw.toUpperCase().replace(/\s/g, "");

    const regexAntigo = /^[A-Z]{3}-?\d{4}$/;
    const regexMercosul = /^[A-Z]{3}\d[A-Z]\d{2}$/;

    return regexAntigo.test(placa) || regexMercosul.test(placa);
}

// -----------------------------
// 🔵 REGISTRAR LAVAGEM PMG
// -----------------------------
document.getElementById("form-especial-pmg").addEventListener("submit", async (e) => {
    e.preventDefault();

    const placa = document.getElementById("placaPMG").value.trim().toUpperCase();
    const categoria = document.getElementById("categoriaPMG").value;
    const msg = document.getElementById("msgPMG");

    if (!validarPlaca(placa)) {
        msg.textContent = "Placa inválida. Ex: ABC-1234 ou Mercosul.";
        msg.style.color = "crimson";
        return;
    }

    try {
        const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ placa, categoria })
        });

        const data = await res.json();

        if (!res.ok) {
            msg.textContent = data.error || "Erro ao registrar.";
            msg.style.color = "crimson";
            return;
        }

        msg.textContent = "Lavagem registrada!";
        msg.style.color = "green";

        document.getElementById("form-especial-pmg").reset();

        carregarLavagensPMG();

    } catch (err) {
        msg.textContent = "Erro ao conectar com o servidor.";
        msg.style.color = "crimson";
    }
});

// -----------------------------
// 🔵 LISTAR LAVAGENS + FILTRO
// -----------------------------
async function carregarLavagensPMG() {
    const params = new URLSearchParams();

    // --- Filtro de placa
    const placaFiltro = document.getElementById("filtro-placa-pmg").value.trim();
    if (placaFiltro) params.append("placa", placaFiltro);

    // --- Filtro de categoria
    const categoriaFiltro = document.getElementById("filtro-categoria-pmg").value;
    if (categoriaFiltro !== "todas") params.append("categoria", categoriaFiltro);

    // --- NOVO: FILTRO AUTOMÁTICO POR DIA ATUAL
    let dataFiltro = document.getElementById("filtro-data-pmg").value;

    if (!dataFiltro) {
        // gera data de hoje no formato YYYY-MM-DD
        const hoje = new Date();
        const y = hoje.getFullYear();
        const m = String(hoje.getMonth() + 1).padStart(2, "0");
        const d = String(hoje.getDate()).padStart(2, "0");
        dataFiltro = `${y}-${m}-${d}`;

        // joga a data de hoje no input
        document.getElementById("filtro-data-pmg").value = dataFiltro;
    }

    params.append("data", dataFiltro);

    try {
        const res = await fetch(`${API}?${params.toString()}`);
        const lista = await res.json();
        montarTabelaPMG(lista);

    } catch (err) {
        console.error(err);
        document.querySelector("#tabela-pmg tbody").innerHTML =
            `<tr><td colspan="4">Erro ao carregar</td></tr>`;
    }
}

// Carregar tudo
document.getElementById("btn-listar-tudo-pmg").addEventListener("click", () => {
    document.getElementById("filtro-placa-pmg").value = "";
    document.getElementById("filtro-data-pmg").value = "";
    document.getElementById("filtro-categoria-pmg").value = "todas";
    carregarLavagensPMG();
});

document.getElementById("btn-buscar-pmg").addEventListener("click", carregarLavagensPMG);

// -----------------------------
// 🔵 MONTAR TABELA
// -----------------------------
function montarTabelaPMG(lista) {
    const tbody = document.querySelector("#tabela-pmg tbody");

    

    if (!lista.length) {
        tbody.innerHTML = `<tr><td colspan="4">Nenhuma lavagem encontrada</td></tr>`;
        return;
    }

    tbody.innerHTML = lista.map(item => {
        const d = new Date(item.data_hora);
        const data = d.toLocaleDateString("pt-BR");
        const hora = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

        return `
            <tr>
                <td>${item.placa}</td>
                <td>${item.categoria}</td>
                <td>R$ ${item.valor}</td>
                <td>${data}</td>
                <td>${hora}</td>
            </tr>
        `;
    }).join("");
}

// -----------------------------
// 🔵 RELATÓRIO HOJE PMG
// -----------------------------
async function carregarResumoPMG() {

    // Diário
    const diaRes = await fetch("http://localhost:3000/api/relatorio/pmg/dia");
    const dia = await diaRes.json();

    document.getElementById("hoje-total-pmg").innerText = `Lavagens de hoje: ${dia.total}`;

    // Mensal
    const mesRes = await fetch("http://localhost:3000/api/relatorio/pmg/mensal");
    const mes = await mesRes.json();

    document.getElementById("mes-total-pmg").innerText = `Lavagens no mês: ${mes.total}`;
}

// -----------------------------
// 🔵 RELATÓRIO POR DATA PMG
// -----------------------------
async function buscarRelatorioPMGPorDia() {
    const data = document.getElementById("dataRelatorioPMG").value;

    if (!data) {
        alert("Selecione uma data!");
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/api/relatorio/pmg/por-dia?data=${data}`);
        const dados = await res.json();

        document.getElementById("resultadoDiaPMG").innerHTML = `
            <strong>Data:</strong> ${dados.data} <br>
            <strong>Total:</strong> ${dados.total} lavagens
        `;

    } catch (err) {
        document.getElementById("resultadoDiaPMG").innerHTML = "Erro ao buscar relatório.";
    }
}

// -----------------------------
// 🔵 SAIR
// -----------------------------
function sair() {
    localStorage.removeItem("loginData");
    window.location.href = "login.html";
}

// Se quiser, também pode adicionar via addEventListener, sem precisar do onclick no HTML:
document.addEventListener("DOMContentLoaded", () => {
    const btnSair = document.getElementById("btnSair");
    if (btnSair) {
        btnSair.addEventListener("click", sair);
    }
});

// -----------------------------
// 🔵 INICIAR AO CARREGAR
// -----------------------------
carregarLavagensPMG();
carregarResumoPMG();
