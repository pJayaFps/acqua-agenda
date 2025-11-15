// app.js - frontend em JS puro (em português)
const API_BASE = 'https://acqua-agenda-back.onrender.com/api';

const form = document.getElementById('form-registrar');
const placaInput = document.getElementById('placa');
const tipoSelect = document.getElementById('tipo_lavagem');
const msgEl = document.getElementById('msg');

const tabelaBody = document.querySelector('#tabela-lavagens tbody');
const filtroPlaca = document.getElementById('filtro-placa');
const filtroData = document.getElementById('filtro-data');
const filtroTipo = document.getElementById('filtro-tipo');
const btnBuscar = document.getElementById('btn-buscar');
const btnListarTudo = document.getElementById('btn-listar-tudo');

// Validação de placa (mesma lógica do backend)
function validarPlacaFrontend(placaRaw) {
  if (!placaRaw) return false;
  const placa = placaRaw.toUpperCase().replace(/\s/g,'');
  const regexAntigo = /^[A-Z]{3}-?\d{4}$/;
  const regexMercosul = /^[A-Z]{3}\d[A-Z]\d{2}$/;
  return regexAntigo.test(placa) || regexMercosul.test(placa);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const placa = placaInput.value.trim().toUpperCase();
  const tipo_lavagem = tipoSelect.value;

  if (!validarPlacaFrontend(placa)) {
    msgEl.textContent = 'Placa inválida. Use formato ABC-1234 ou Mercosul.';
    msgEl.style.color = 'crimson';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/lavagens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placa, tipo_lavagem })
    });
    const data = await res.json();
    if (!res.ok) {
      msgEl.textContent = data.erro || 'Erro ao registrar';
      msgEl.style.color = 'crimson';
      return;
    }
    msgEl.textContent = 'Lavagem registrada com sucesso!';
    msgEl.style.color = '#16a34a';
    form.reset();
    carregarLavagens(); // atualiza lista
  } catch (err) {
    console.error(err);
    msgEl.textContent = 'Erro de conexão com o servidor';
    msgEl.style.color = 'crimson';
  }
});

btnBuscar.addEventListener('click', () => carregarLavagens());
btnListarTudo.addEventListener('click', () => {
  filtroPlaca.value = ''; filtroData.value = ''; filtroTipo.value = 'todas';
  carregarLavagens();
});

async function carregarLavagens() {
  const placa = filtroPlaca.value.trim();
  const data = filtroData.value;
  const tipo = filtroTipo.value;

  const params = new URLSearchParams();
  if (placa) params.append('placa', placa);
  if (data) params.append('data', data);
  if (tipo && tipo !== 'todas') params.append('tipo', tipo);

  try {
    const res = await fetch(`${API_BASE}/lavagens?${params.toString()}`);
    const lista = await res.json();
    if (!res.ok) throw new Error('Erro ao buscar lavagens');
    montarTabela(lista);
  } catch (err) {
    console.error(err);
    tabelaBody.innerHTML = '<tr><td colspan="5">Erro ao carregar</td></tr>';
  }
}

async function carregarRelatorios() {
    // Diário
    const diaRes = await fetch("https://acqua-agenda-back.onrender.com/api/relatorio/dia");
    const dia = await diaRes.json();

    document.getElementById("hoje-total").innerText = `Total: ${dia.total}`;
    document.getElementById("hoje-simples").innerText = `Simples: ${dia.simples}`;
    document.getElementById("hoje-especial").innerText = `Especial: ${dia.especial}`;

    // Mensal
    const mesRes = await fetch("https://acqua-agenda-back.onrender.com/api/relatorio/mensal");
    const mes = await mesRes.json();

    document.getElementById("mes-total").innerText = `Total: ${mes.total}`;
    document.getElementById("mes-simples").innerText = `Simples: ${mes.simples}`;
    document.getElementById("mes-especial").innerText = `Especial: ${mes.especial}`;
}

// Chama ao iniciar
carregarRelatorios();

async function buscarRelatorioPorDia() {
    const data = document.getElementById("dataRelatorio").value;

    if (!data) {
        alert("Selecione uma data!");
        return;
    }

    try {
        const resposta = await fetch(`https://acqua-agenda-back.onrender.com/api/relatorio/por-dia?data=${data}`);

        if (!resposta.ok) {
            document.getElementById("resultadoDia").innerHTML = "Erro ao buscar relatório.";
            return;
        }

        const dados = await resposta.json();

        document.getElementById("resultadoDia").innerHTML = `
            <strong>Data:</strong> ${dados.data} <br>
            <strong>Total Lavado:</strong> ${dados.total} carros <br>
            <strong>Simples:</strong> ${dados.simples} <br>
            <strong>Especial:</strong> ${dados.especial}
        `;
    } catch (erro) {
        document.getElementById("resultadoDia").innerHTML = "Erro ao conectar com o servidor.";
    }
}



function montarTabela(lista) {
  if (!Array.isArray(lista) || lista.length === 0) {
    tabelaBody.innerHTML = '<tr><td colspan="5">Nenhuma lavagem encontrada</td></tr>';
    return;
  }
  tabelaBody.innerHTML = lista.map(item => {
    const d = new Date(item.data_hora);
    const data = d.toLocaleDateString('pt-BR');
    const hora = d.toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'});
    const estrela = item.especial ? '<span class="estrela">⭐</span>' : '';
    return `<tr>
      <td>${item.placa}</td>
      <td>${item.tipo_lavagem}</td>
      <td>${estrela}</td>
      <td>${data}</td>
      <td>${hora}</td>
    </tr>`;
  }).join('');
}

// Carrega ao abrir
carregarLavagens();
