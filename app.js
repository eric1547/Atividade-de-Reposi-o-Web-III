// ======================================================================
// AULA 02 - SPA COM JAVASCRIPT PURO
// ======================================================================

// Array com dados temporários. Eles existem apenas enquanto a página está aberta.
const chamados = [
    {
        id: 1,
        titulo: "Computador não liga",
        descricao: "O computador não apresenta sinal de energia.",
        prioridade: "Alta",
        status: "Aberto"
    },
    {
        id: 2,
        titulo: "Senha bloqueada",
        descricao: "Usuário não consegue acessar o sistema.",
        prioridade: "Média",
        status: "Em atendimento"
    },
    {
        id: 3,
        titulo: "notebook não liga",
        descricao: "O computador não apresenta sinal de energia.",
        prioridade: "Alta",
        status: "Encerrado",
        solucao: "Foi realizada a troca da fonte de alimentação."
    }
];

// As opções do formulário são mantidas em um único lugar e geradas dinamicamente.
const prioridades = ["Baixa", "Média", "Alta"];

const app = document.getElementById("app");

function escaparHtml(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}

function obterChamado(id) {
    return chamados.find(chamado => chamado.id === Number(id));
}

function classePrioridade(prioridade) {
    const classes = {
        Alta: "prioridade-alta",
        "Média": "prioridade-media",
        Baixa: "prioridade-baixa"
    };

    return classes[prioridade] || "prioridade-outra";
}

function badgePrioridade(prioridade) {
    return `<span class="badge ${classePrioridade(prioridade)}">${escaparHtml(prioridade)}</span>`;
}

function badgeStatus(status) {
    const classes = {
        Aberto: "text-bg-primary",
        "Em atendimento": "text-bg-warning",
        Encerrado: "text-bg-success"
    };

    return `<span class="badge ${classes[status] || "text-bg-secondary"}">${escaparHtml(status)}</span>`;
}

function mostrarDashboard() {
    const indicadores = [
        { titulo: "Total de chamados", quantidade: chamados.length, classe: "text-bg-primary" },
        {
            titulo: "Chamados abertos",
            quantidade: chamados.filter(chamado => chamado.status === "Aberto").length,
            classe: "text-bg-info"
        },
        {
            titulo: "Chamados em atendimento",
            quantidade: chamados.filter(chamado => chamado.status === "Em atendimento").length,
            classe: "text-bg-warning"
        },
        {
            titulo: "Chamados encerrados",
            quantidade: chamados.filter(chamado => chamado.status === "Encerrado").length,
            classe: "text-bg-success"
        },
        {
            titulo: "Chamados de prioridade Alta",
            quantidade: chamados.filter(chamado => chamado.prioridade === "Alta").length,
            classe: "text-bg-danger"
        }
    ];

    app.innerHTML = `
        <section class="card shadow-sm">
            <div class="card-body">
                <h1 class="card-title mb-4">Dashboard</h1>

                <div class="row g-3">
                    ${indicadores.map(indicador => `
                        <div class="col-sm-6 col-lg-4">
                            <section class="card h-100">
                                <div class="card-body">
                                    <h2 class="h5">${indicador.titulo}</h2>
                                    <p class="display-6 mb-0">
                                        <span class="badge ${indicador.classe}">${indicador.quantidade}</span>
                                    </p>
                                </div>
                            </section>
                        </div>
                    `).join("")}
                </div>
            </div>
        </section>
    `;
}

function mostrarChamados() {
    app.innerHTML = `
        <section class="card shadow-sm">
            <div class="card-body">
                <h1 class="card-title mb-4">Chamados</h1>

                <div class="table-responsive">
                    <table class="table table-striped align-middle mb-0">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Título</th>
                                <th scope="col">Prioridade</th>
                                <th scope="col">Status</th>
                                <th scope="col">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${chamados.map(chamado => `
                                <tr>
                                    <td>${chamado.id}</td>
                                    <td>${escaparHtml(chamado.titulo)}</td>
                                    <td>${badgePrioridade(chamado.prioridade)}</td>
                                    <td>${badgeStatus(chamado.status)}</td>
                                    <td>
                                        <div class="d-flex flex-wrap gap-2">
                                            <button
                                                class="btn btn-sm btn-outline-primary"
                                                type="button"
                                                data-action="visualizar"
                                                data-id="${chamado.id}">
                                                Visualizar
                                            </button>
                                            ${chamado.status !== "Encerrado" ? `
                                        <button
                                            class="btn btn-sm btn-outline-success"
                                            type="button"
                                            data-action="encerrar"
                                            data-id="${chamado.id}">
                                            Encerrar chamado
                                        </button>
                                    ` : ""}
                                        </div>
                                    </td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    `;
}

function mostrarNovoChamado() {
    app.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <section class="card shadow-sm">
                    <div class="card-body">
                        <h1 class="card-title mb-4">Novo chamado</h1>

                        <form id="formChamado">
                            <div class="mb-3">
                                <label class="form-label" for="titulo">Título</label>
                                <input class="form-control" id="titulo" name="titulo" required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label" for="descricao">Descrição</label>
                                <textarea class="form-control" id="descricao" name="descricao" rows="4"></textarea>
                            </div>

                            <div class="mb-3">
                                <label class="form-label" for="prioridade">Prioridade</label>
                                <select class="form-select" id="prioridade" name="prioridade" required>
                                    <option value="">Selecione</option>
                                    ${prioridades.map(prioridade => `
                                        <option value="${escaparHtml(prioridade)}">${escaparHtml(prioridade)}</option>
                                    `).join("")}
                                </select>
                            </div>

                            <button class="btn btn-success" type="submit">Cadastrar</button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    `;
}

function mostrarDetalhes(id) {
    const chamado = obterChamado(id);
    if (!chamado) {
        mostrarChamados();
        return;
    }

    app.innerHTML = `
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
            <h1 class="mb-0">Detalhes do chamado #${chamado.id}</h1>
            <button class="btn btn-outline-secondary" type="button" data-action="voltar">
                Voltar para chamados
            </button>
        </div>

        <section class="card">
            <div class="card-body">
                <dl class="row mb-0">
                    <dt class="col-sm-3">Número</dt>
                    <dd class="col-sm-9">#${chamado.id}</dd>

                    <dt class="col-sm-3">Título</dt>
                    <dd class="col-sm-9">${escaparHtml(chamado.titulo)}</dd>

                    <dt class="col-sm-3">Descrição</dt>
                    <dd class="col-sm-9">${escaparHtml(chamado.descricao) || "Não informada"}</dd>

                    <dt class="col-sm-3">Prioridade</dt>
                    <dd class="col-sm-9">${badgePrioridade(chamado.prioridade)}</dd>

                    <dt class="col-sm-3">Status</dt>
                    <dd class="col-sm-9">${badgeStatus(chamado.status)}</dd>

                    ${chamado.status === "Encerrado" ? `
                        <dt class="col-sm-3">Solução realizada</dt>
                        <dd class="col-sm-9">${escaparHtml(chamado.solucao) || "Não informada"}</dd>
                    ` : ""}
                </dl>
            </div>
        </section>
    `;
}

function mostrarEncerramento(id) {
    const chamado = obterChamado(id);
    if (!chamado || chamado.status === "Encerrado") {
        mostrarChamados();
        return;
    }

    app.innerHTML = `
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
            <h1 class="mb-0">Encerrar chamado #${chamado.id}</h1>
            <button class="btn btn-outline-secondary" type="button" data-action="voltar">
                Voltar para chamados
            </button>
        </div>

        <section class="card mb-4">
            <div class="card-body">
                <dl class="row mb-0">
                    <dt class="col-sm-3">Número</dt>
                    <dd class="col-sm-9">#${chamado.id}</dd>

                    <dt class="col-sm-3">Título</dt>
                    <dd class="col-sm-9">${escaparHtml(chamado.titulo)}</dd>

                    <dt class="col-sm-3">Descrição</dt>
                    <dd class="col-sm-9">${escaparHtml(chamado.descricao) || "Não informada"}</dd>

                    <dt class="col-sm-3">Prioridade</dt>
                    <dd class="col-sm-9">${badgePrioridade(chamado.prioridade)}</dd>

                    <dt class="col-sm-3">Status atual</dt>
                    <dd class="col-sm-9">${badgeStatus(chamado.status)}</dd>
                </dl>
            </div>
        </section>

        <form id="formEncerramento" data-id="${chamado.id}" novalidate>
            <div class="mb-3">
                <label class="form-label" for="solucao">Solução realizada</label>
                <textarea
                    class="form-control"
                    id="solucao"
                    name="solucao"
                    rows="4"
                    aria-describedby="erroSolucao"
                    required></textarea>
                <div class="invalid-feedback" id="erroSolucao" role="alert">
                    O preenchimento da solução realizada é obrigatório.
                </div>
            </div>
            <button class="btn btn-success" type="submit">Confirmar encerramento</button>
        </form>
    `;
}

function cadastrarChamado(evento) {
    evento.preventDefault();

    const formulario = evento.target;
    if (!formulario.reportValidity()) {
        return;
    }

    const proximoId = chamados.reduce((maiorId, chamado) => Math.max(maiorId, chamado.id), 0) + 1;
    chamados.push({
        id: proximoId,
        titulo: document.getElementById("titulo").value.trim(),
        descricao: document.getElementById("descricao").value.trim(),
        prioridade: document.getElementById("prioridade").value,
        status: "Aberto"
    });

    mostrarChamados();
}

function encerrarChamado(evento) {
    evento.preventDefault();

    const formulario = evento.target;
    const campoSolucao = formulario.elements.solucao;
    const solucao = campoSolucao.value.trim();

    campoSolucao.classList.toggle("is-invalid", solucao.length === 0);
    if (!solucao) {
        campoSolucao.focus();
        return;
    }

    const chamado = obterChamado(formulario.dataset.id);
    if (!chamado || chamado.status === "Encerrado") {
        mostrarChamados();
        return;
    }

    chamado.solucao = solucao;
    chamado.status = "Encerrado";
    mostrarDetalhes(chamado.id);
}

function mostrarTela(view) {
    if (view === "dashboard") {
        mostrarDashboard();
    } else if (view === "chamados") {
        mostrarChamados();
    } else if (view === "novo") {
        mostrarNovoChamado();
    }
}

document.querySelectorAll("[data-view]").forEach(link => {
    link.addEventListener("click", evento => {
        evento.preventDefault();
        mostrarTela(link.dataset.view);
    });
});

app.addEventListener("click", evento => {
    const botao = evento.target.closest("[data-action]");
    if (!botao || !app.contains(botao)) {
        return;
    }

    if (botao.dataset.action === "visualizar") {
        mostrarDetalhes(botao.dataset.id);
    } else if (botao.dataset.action === "encerrar") {
        mostrarEncerramento(botao.dataset.id);
    } else if (botao.dataset.action === "voltar") {
        mostrarChamados();
    }
});

app.addEventListener("submit", evento => {
    if (evento.target.id === "formChamado") {
        cadastrarChamado(evento);
    } else if (evento.target.id === "formEncerramento") {
        encerrarChamado(evento);
    }
});

mostrarDashboard();