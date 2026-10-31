// Loom - rede social escolar do Colégio AGV
// Todos os dados ficam no navegador (localStorage) até existir um servidor.

// ==================== Dados iniciais (turmas, cores e perfis de exemplo) ====================

const TURMAS = [["DS", "Sistemas"], ["ADM", "Administração"], ["PRT", "Portos"], ["BIO", "Bioeconomia"]];
const PAL = {
    rosa: ["#e0556b", "Rosa", "#ffd6d6"],
    azul: ["#2f7ac2", "Azul", "#b1d6fa"],
    amarelo: ["#a67700", "Amarelo", "#fae8a6"],
    lilas: ["#7456d6", "Lilás", "#d9d1fd"],
    verde: ["#3f7d5c", "Verde", "#b2ccbb"]
};
const K = "loom:v2";
let S;
const seed = () => ({
    me: null,
    pal: "rosa",
    follow: [],
    saved: [],
    users: [
        {
            id: "u1",
            name: "Andriellyn",
            user: "andriellyn",
            ano: 2,
            turma: "DS",
            bio: "Criadora do Loom.",
            links: [],
            f: 12,
            v: 40,
            ok: 1
        },
        {
            id: "u2",
            name: "Marcos Lima",
            user: "marcosl",
            ano: 1,
            turma: "PRT",
            bio: "Curioso por logística e fotografia.",
            links: [],
            f: 5,
            v: 18
        },
        {
            id: "u3",
            name: "Beatriz Souza",
            user: "bia.s",
            ano: 3,
            turma: "BIO",
            bio: "Projeto de pesquisa em bioeconomia.",
            links: [],
            f: 9,
            v: 27
        },
        {
            id: "u4",
            name: "Rafael Torres",
            user: "rafatorres",
            ano: 2,
            turma: "ADM",
            bio: "Empreendedorismo e design.",
            links: [],
            f: 7,
            v: 22
        }
    ],
    posts: [{
            id: "p1",
            uid: "u1",
            t: "Bem-vindos ao Loom! Esse espaço foi criado para compartilhar ideias, novidades e conectar alunos da escola.",
            img: "",
            ts: Date.now() - 72e5,
            likes: [],
            cm: []
        }, {
            id: "p2",
            uid: "u3",
            t: "Nosso grupo apresenta o projeto de biomateriais na feira. Passem no estande!",
            img: "",
            ts: Date.now() - 36e5,
            likes: [],
            cm: [{ u: "Rafael Torres", t: "Vou passar lá!" }]
        }]
});

try {
    S = JSON.parse(localStorage.getItem(K));
}
catch (e) {
}
if (!S || !S.users)
    S = seed();

// ==================== Armazenamento e utilidades ====================

const save = () => {
    try {
        localStorage.setItem(K, JSON.stringify(S));
    }
    catch (e) {
        toast("Sem espaço para salvar: use imagens menores");
    }
};
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
}[c]));
const me = () => S.users.find(u => u.id === S.me);
const uOf = id => S.users.find(u => u.id === id) || { name: "Aluno", ano: "", turma: "" };
const tn = c => (TURMAS.find(t => t[0] === c) || [0, c])[1];
const av = u => u.pic ? `<img src="${u.pic}" alt="">` : esc((u.name || "?")[0].toUpperCase());
const ago = t => {
    const m = Math.floor((Date.now() - t) / 6e4);
    return m < 1 ? "agora" : m < 60 ? `há ${m} min` : m < 1440 ? `há ${Math.floor(m / 60)} h` : `há ${Math.floor(m / 1440)} d`;
};
const s = (p, w = 22, f = "none") => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="${f}" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

// ==================== Ícones ====================

const I = {
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    bell: '<path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    img: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 9"/>',
    flame: '<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>',
    dots: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    pin: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
    cmt: '<path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12z"/>',
    share: '<path d="M14 4l6 6-6 6v-4c-5 0-8 2-10 6 0-6 3-11 10-11z"/>',
    bm: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-4 3-6 7-6s7 2 7 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c3 0 5 2 5 5"/>',
    sq: '<rect x="4" y="4" width="16" height="16" rx="5"/><path d="M12 9v6M9 12h6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    chk: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'
};
const OK = '<svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#22c55e"/><path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
let view = "feed";
let filter = "ALL";
let q = "";
let ft = "";
let fy = "";
let vu = null;
let tab = "posts";
let open = {};
let mc = false;
let pend = "";
let draft = "";

function toast(m) {
    const t = $("#toast");
    t.textContent = m;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2400);
}

function shrink(f, cb, w = 900) {
    const r = new FileReader();
    r.onload = () => {
        const i = new Image();
        i.onload = () => {
            const k = Math.min(1, w / i.width);
            const c = document.createElement("canvas");
            c.width = i.width * k;
            c.height = i.height * k;
            c.getContext("2d").drawImage(i, 0, 0, c.width, c.height);
            cb(c.toDataURL("image/jpeg", .78));
        };
        i.src = r.result;
    };
    r.readAsDataURL(f);
}

function applyTheme() {
    const r = document.documentElement;
    const P = PAL[S.pal] || PAL.rosa;
    r.style.setProperty("--ac", P[0]);
    r.style.setProperty("--pst", P[2]);
    r.setAttribute("data-t", isDark() ? "dark" : "light");
}
const mine = id => S.posts.filter(p => p.uid === id);

// ==================== Telas (cada função devolve o HTML de uma tela) ====================

function hd() {
    const m = `<button class="ic" data-a="go" data-v="${view === "config" ? "feed" : "config"}" aria-label="${view === "config" ? "Voltar" : "Menu"}">${s(view === "config" ? I.back : I.menu, 26)}</button>`;
    if (view === "feed")
        return `<div class="hd">${m}<span class="logo">
        </span>
        <button class="ic plus" data-a="compose" aria-label="Nova postagem">${s(I.plus, 18)}</button>
        <button class="ic" data-a="go" data-v="explorar" aria-label="Buscar">${s(I.search, 24)}</button>
        <button class="ic" data-a="bell" aria-label="Notificações">${s(I.bell, 24)}</button>${TG()}</div>`;
    const own = view === "perfil" && !vu;
    const t = {
        explorar: "Explorar",
        config: "Configurações",
        avisos: "Avisos e eventos",
        verificar: "Verificar conta",
        perfil: own ? "Meu perfil" : "Perfil"
    }[view];
    return `<div class="hd">${m}<h2>${t}</h2>${own ? `<button class="cr" data-a="compose">${s(I.plus, 16)}Criar post</button>` : ""}${TG()}</div>`;
}

function post(p) {
    const u = uOf(p.uid);
    const l = p.likes.includes(S.me);
    const b = S.saved.includes(p.id);
    const o = p.uid === S.me;
    return `<article class="card">
        <div class="ph">
        <span class="av" data-a="user" data-id="${u.id}">${av(u)}</span>
        <div class="sp">
        <div class="nm">${esc(u.name)}${u.ok ? OK : ""}</div>
        <small>${ago(p.ts)}</small>
        </div>
        <span class="pop">${s(I.flame, 16)}${p.likes.length}</span>
        <div style="position:relative">
        <button class="dot" data-a="menu" data-id="p:${p.id}" aria-label="Mais opções">${s(I.dots, 18, "currentColor")}</button>${mn === "p:" + p.id ? mnu(o ? "del" : "rep", "p", p.id) : ""}</div>
        </div>
 <div class="pt">${esc(p.t)}</div>${p.img ? `<img class="pim" src="${p.img}" alt="Imagem da publicação">` : ""}
 <div class="mt">
        <span>${s(I.pin, 16)}${tn(u.turma)}, Colégio AGV</span>
        </div>
 <div class="mt">
        <span style="color:var(--ac)">${s(I.heart, 18, "currentColor")}<span style="color:var(--tx)">${p.likes.length}</span>
        </span>
        <div>${p.cm.length} Comentários<button data-a="save" data-id="${p.id}" aria-label="Salvar" style="color:${b ? "var(--ac)" : "var(--tx)"}">${s(I.bm, 20, b ? "currentColor" : "none")}</button>
        </div>
        </div>
 <div class="act">
        <button class="${l ? "on" : ""}" data-a="like" data-id="${p.id}">${s(I.heart, 20, l ? "currentColor" : "none")}Curtir</button>
        <button data-a="cm" data-id="${p.id}">${s(I.cmt, 20)}Comentar</button>
        <button data-a="share">${s(I.share, 20)}Compartilhar</button>
        </div>
 ${open[p.id] ? p.cm.map((c, i) => {
        const k = p.id + "|" + i;
        const co = c.uid ? c.uid === S.me : c.u === me().name;
        return `<div class="cm" style="display:flex;gap:8px;align-items:flex-start;margin-left:${Math.min(c.lv || 0, 3) * 18}px">
        <div style="flex:1;min-width:0;word-break:break-word">
        <b>${esc(c.u)}</b> ${c.to ? `<span style="color:var(--ac)">@${esc(c.to)}</span> ` : ""}${esc(c.t)}<div>
        <button class="rb" data-a="reply" data-id="${k}">Responder</button>
        </div>
        </div>
        <div style="position:relative">
        <button class="dot" style="width:28px;height:28px" data-a="menu" data-id="c:${k}" aria-label="Mais opções do comentário">${s(I.dots, 16, "currentColor")}</button>${mn === "c:" + k ? mnu(co ? "del" : "rep", "c", k) : ""}</div>
        </div>`;
    }).join("") + `${rt && rt.p === p.id ? `<div style="font-size:12.5px;color:var(--mut);margin-top:10px">Respondendo a <b>${esc(rt.n)}</b> <button class="rb" data-a="rcancel">Cancelar</button>
        </div>` : ""}<div class="ci">
        <input id="ci${p.id}" placeholder="${rt && rt.p === p.id ? "Escreva sua resposta" : "Escreva um comentário"}">
        <button class="bt sm" data-a="send" data-id="${p.id}">Enviar</button>
        </div>` : ""}</article>`;
}
const posts = l => l.length ? l.slice().sort((a, b) => b.ts - a.ts).map(post).join("") : `<div class="empty">Nenhuma publicação por aqui ainda.</div>`;

function feed() {
    const m = me();
    const l = filter === "ALL" ? S.posts : S.posts.filter(p => uOf(p.uid).turma === filter);
    return `${m.ver ? "" : `<div class="card" style="display:flex;gap:12px;align-items:center">
        <div class="sp">
        <b>Conta não verificada</b>
        <br>
        <small style="color:var(--mut)">Digite o código para publicar e interagir.</small>
        </div>
        <button class="bt sm" data-a="go" data-v="verificar">Verificar</button>
        </div>`}<div class="card cmp" data-a="compose">
        <span class="av s">${av(m)}</span>
        <span style="flex:1">Postar algo...</span>
        <span style="color:var(--ac)">${s(I.img, 26)}</span>
        </div>
 <div class="tabs">
        <button class="pl ${filter === "ALL" ? "on" : ""}" data-a="flt" data-id="ALL">Todas</button>${TURMAS.map(t => `<button class="pl ${filter === t[0] ? "on" : ""}" data-a="flt" data-id="${t[0]}">${t[1]}</button>`).join("")}</div>${posts(l)}`;
}

function explorar() {
    const r = S.users.filter(u => u.id !== S.me && (!q || (u.name + " " + u.user).toLowerCase().includes(q.toLowerCase())) && (!ft || u.turma === ft) && (!fy || u.ano == fy));
    return `<div class="card">
        <input id="eq" data-i="q" placeholder="Buscar por nome ou usuário" value="${esc(q)}">
        <div class="row" style="margin-top:10px">
        <select data-i="ft">
        <option value="">Todas as turmas</option>${TURMAS.map(t => `<option value="${t[0]}" ${ft === t[0] ? "selected" : ""}>${t[1]}</option>`).join("")}</select>
        <select data-i="fy">
        <option value="">Todos os anos</option>${[1, 2, 3].map(y => `<option value="${y}" ${fy == y ? "selected" : ""}>${y}º ano</option>`).join("")}</select>
        </div>
        </div>
 ${r.map(u => {
        const f = S.follow.includes(u.id);
        return `<div class="card ur">
        <span class="av" data-a="user" data-id="${u.id}">${av(u)}</span>
        <div class="sp">
        <div class="nm">${esc(u.name)}${u.ok ? OK : ""}</div>
        <small>@${esc(u.user)} • ${u.ano}º Ano • ${u.turma}</small>
        </div>
        <button class="bt sm ${f ? "g" : ""}" data-a="fw" data-id="${u.id}">${f ? "Seguindo" : "Seguir"}</button>
        </div>`;
    }).join("") || `<div class="empty">Nenhum aluno encontrado.</div>`}`;
}

function perfil() {
    const m = me();
    const u = vu ? uOf(vu) : m;
    const own = u.id === m.id;
    const pp = mine(u.id);
    const lk = pp.reduce((a, p) => a + p.likes.length, 0);
    const cc = pp.reduce((a, p) => a + p.cm.length, 0);
    const tabs = [["sobre", "Sobre"], ["posts", "Posts"]].concat(own ? [["salvos", "Salvos"]] : []);
    let body;
    if (tab === "sobre")
        body = `<div class="card">
        <p style="margin:0 0 8px">${esc(u.bio || "Sem bio ainda.")}</p>
        <div class="pills">${(u.links || []).map(l => `<a class="tg r" style="text-decoration:none" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.n)}</a>`).join("")}</div>
 ${own ? `<label>Nome</label>
        <input id="en" value="${esc(u.name)}">
        <label>Bio</label>
        <textarea id="eb" style="min-height:70px">${esc(u.bio || "")}</textarea>
        <label>Foto de perfil</label>
        <input type="file" id="ep" accept="image/*">
        <label>Banner do perfil</label>
        <input type="file" id="pb" accept="image/*">${u.banner ? `<button class="bt g sm" style="margin-top:8px" data-a="rmb">Remover banner</button>` : ""}<label>Adicionar rede social</label>
        <div class="row">
        <input id="ln" placeholder="Ex.: Instagram">
        <input id="lu" placeholder="https://...">
        </div>
        <button class="bt" style="margin-top:14px" data-a="edit">Salvar</button>` : ""}</div>`;
    else {
        const l = tab === "salvos" ? S.posts.filter(p => S.saved.includes(p.id)) : pp;
        body = l.length ? `<div class="pg">${l.slice().sort((a, b) => b.ts - a.ts).map(p => `<div data-a="go" data-v="feed">${p.img ? `<img src="${p.img}" alt="">` : `<em>${esc(p.t.slice(0, 70))}</em>`}<span>${s(I.heart, 14, "currentColor")}${p.likes.length}</span>
        </div>`).join("")}</div>` : `<div class="empty">Nada por aqui ainda.</div>`;
    }
    return `<div class="card" style="padding:0;overflow:hidden">
        <div class="bn" style="${u.banner ? `background-image:url(${u.banner})` : ""}">${own ? `<button class="bt sm" style="position:absolute;right:10px;bottom:10px;background:rgba(0,0,0,.55);display:flex;gap:6px;align-items:center" data-a="pickb">${s(I.img, 14)}Alterar banner</button>
        <input type="file" id="qb" accept="image/*" hidden>
        <input type="file" id="qp" accept="image/*" hidden>` : ""}</div>
        <div style="padding:0 14px 14px">
        <div class="pf" style="align-items:flex-start;margin-top:-44px">
        <div class="ring" ${own ? `data-a="pickp" style="cursor:pointer;position:relative" title="Alterar foto"` : ""}>
        <div class="av">${av(u)}</div>${own ? `<span class="cam">${s(I.img, 14)}</span>` : ""}</div>
        <div class="sp" style="padding-top:50px">
        <div class="nm" style="font-size:16px">${esc(u.name)}${u.ok ? OK : ""}</div>
        <small style="color:var(--mut)">@${esc(u.user)}</small>
        <div class="pills">
        <span class="tg r">${u.ano}º Ano</span>
        <span class="tg">${tn(u.turma)}</span>
        </div>
        </div>
        </div>
 <div class="st3">
        <div>
        <b>${pp.length}</b>
        <span>Posts</span>
        </div>
        <div data-a="flist" data-id="${u.id}:fers" style="cursor:pointer">
        <b>${fers(u).length}</b>
        <span>Seguidores</span>
        </div>
        <div data-a="flist" data-id="${u.id}:fing" style="cursor:pointer">
        <b>${fing(u).length}</b>
        <span>Seguindo</span>
        </div>
        </div>
 ${own ? "" : `<button class="bt" style="width:100%;margin-top:14px" data-a="fw" data-id="${u.id}">${S.follow.includes(u.id) ? "Seguindo" : "Seguir"}</button>`}</div>
        </div>
 <div class="mini">
        <div class="card">
        <span class="mi">${s(I.heart, 16)}</span>
        <b>${lk}</b>
        <span>Curtidas</span>
        </div>
        <div class="card">
        <span class="mi">${s(I.flame, 16)}</span>
        <b>${u.v || 0}</b>
        <span>Visitas</span>
        </div>
        <div class="card">
        <span class="mi">${s(I.cmt, 16)}</span>
        <b>${cc}</b>
        <span>Comentários</span>
        </div>
        </div>
 <div class="tabs">${tabs.map(t => `<button class="pl ${tab === t[0] ? "on" : ""}" data-a="tab" data-id="${t[0]}">${t[1]}</button>`).join("")}</div>${body}`;
}

function config() {
    return `<div class="card">
        <b>Cor do site</b>
        <p style="color:var(--mut);margin:4px 0 14px;font-size:13px">A cor escolhida muda o fundo, os destaques e a logo do Loom.</p>
        <div class="sw">${Object.entries(PAL).map(([k, v]) => `<button title="${v[1]}" data-a="pal" data-id="${k}" class="${S.pal === k ? "on" : ""}" style="background:${v[2]}">
        </button>`).join("")}</div>
        </div>
        <div class="card">
        <b>Conta</b>
        <label>Nome de usuário</label>
        <div class="row">
        <input id="cu" maxlength="20" value="${esc(me().user)}">
        <button class="bt sm" data-a="uname">Salvar</button>
        </div>${me().pw ? `<label>Senha atual</label>
        <input id="cp0" type="password">` : ""}<label>${me().pw ? "Nova senha" : "Criar senha"}</label>
        <div class="row">
        <input id="cp" type="password" placeholder="Mínimo 4 caracteres">
        <button class="bt sm" data-a="pw">Salvar</button>
        </div>
        </div>
        <div class="card">
        <b>Notificações</b>${[["fw", "Novos seguidores"], ["likes", "Curtidas nas suas publicações"], ["cm", "Comentários nas suas publicações"]].map(x => `<div class="opt">
        <span>${x[1]}</span>
        <button class="tg2 ${nt()[x[0]] ? "on" : ""}" data-a="nt" data-id="${x[0]}" aria-label="${x[1]}">
        </button>
        </div>`).join("")}<p style="color:var(--mut);font-size:12px;margin:8px 0 0">Os avisos em tempo real chegam quando o Loom estiver ligado ao servidor.</p>
        </div>
        <div class="card" style="display:flex;align-items:center;gap:12px">
        <div class="sp">
        <b>Verificação da conta</b>
        <br>
        <small style="color:var(--mut)">${me().ver ? "Conta verificada" : "Não verificada"}</small>
        </div>${me().ver ? "" : `<button class="bt sm" data-a="go" data-v="verificar">Verificar</button>`}</div>
        <div class="card">
        <button class="bt g" style="width:100%" data-a="out">Sair da conta</button>
        </div>`;
}

// ==================== Barra inferior, janela de nova postagem e renderização ====================

function nav() {
    const m = me();
    const it = [["feed", "home"], ["explorar", "users"], ["compose", "sq"], ["avisos", "cal"], ["perfil", "me"]];
    return `<nav class="nv">${it.map(x => {
        const on = x[0] === view && !(x[0] === "perfil" && vu);
        return `<button class="${on ? "on" : ""}" data-a="${x[0] === "compose" ? "compose" : "go"}" data-v="${x[0]}" aria-label="${x[0]}">${x[1] === "me" ? `<span class="av">${av(m)}</span>` : s(I[x[1]], 26)}</button>`;
    }).join("")}</nav>`;
}

function modal() {
    return `<div class="md" data-a="close">
        <div class="sh">
        <b style="font-size:17px">Nova postagem</b>
        <textarea id="pt" placeholder="No que você está pensando?" style="margin-top:12px">${esc(draft)}</textarea>${pend ? `<img src="${pend}" alt="Prévia" style="width:100%;max-height:220px;object-fit:cover;border-radius:14px;margin-top:10px">` : ""}<input type="file" id="pf" accept="image/*" style="margin-top:10px">
        <div class="row" style="margin-top:12px;justify-content:flex-end">
        <button class="bt g" data-a="close">Cancelar</button>
        <button class="bt" data-a="pub">Publicar</button>
        </div>
        </div>
        </div>`;
}

function render() {
    const t = $("#pt");
    if (t)
        draft = t.value;
    const fo = document.activeElement && document.activeElement.id === "eq";
    const p = fo ? document.activeElement.selectionStart : 0;
    const v = {
        feed, explorar, perfil, config, avisos, verificar
    }[view]();
    $("#app").innerHTML = hd() + `<main>${v}</main>` + nav() + (mc ? modal() : "") + (mm === "denuncia" ? repModal() : mm === "lista" ? listModal() : mm ? mmodal() : "");
    if (fo) {
        const e = $("#eq");
        e.focus();
        e.setSelectionRange(p, p);
    }
}

function go(v, u) {
    view = v;
    vu = u || null;
    tab = v === "perfil" && u ? "posts" : "posts";
    render();
    scrollTo(0, 0);
}

function gate() {
    applyTheme();
    $("#gt").innerHTML = TURMAS.map(t => `<option value="${t[0]}">${t[0]} - ${t[1]}</option>`).join("");
    if (!me()) {
        $("#gate").classList.remove("hide");
        $("#app").classList.add("hide");
    }
    else {
        $("#gate").classList.add("hide");
        $("#app").classList.remove("hide");
        render();
    }
}

$("#gok").onclick = () => {
    const n = $("#gn").value.trim();
    const u = $("#gu").value.trim().replace(/^@/, "").toLowerCase();
    if (n.length < 2 || u.length < 3) {
        $("#ge").textContent = "Informe seu nome e um usuário com ao menos 3 caracteres.";
        return;
    }
    if (S.users.some(x => x.user === u)) {
        $("#ge").textContent = "Esse usuário já existe.";
        return;
    }
    const id = "u" + Date.now();
    S.users.push({
        id,
        name: n,
        user: u,
        ano: +$("#gy").value,
        turma: $("#gt").value,
        bio: $("#gb").value.trim(),
        links: [],
        f: 0,
        v: 0
    });
    S.me = id;
    save();
    view = "feed";
    gate();
};

// ==================== Eventos: cliques, digitação e formulários ====================

document.addEventListener("click", e => {
    const t = e.target.closest("[data-a]");
    if (!t || !$("#app").contains(t)) {
        if (mn && !e.target.closest(".mnu")) {
            mn = null;
            render();
        }
        return;
    }
    const a = t.dataset.a;
    const id = t.dataset.id;
    const m = me();
    if (a !== "menu")
        mn = null;
    if (NEED.includes(a) && !m.ver) {
        toast("Verifique sua conta para publicar e interagir");
        go("verificar");
        return;
    }
    if (a === "go")
        go(t.dataset.v);
    else if (a === "user") {
        mm = null;
        const u = uOf(id);
        if (u.id === S.me)
            go("perfil");
        else {
            u.v = (u.v || 0) + 1;
            save();
            go("perfil", u.id);
        }
    }
    else if (a === "compose") {
        mc = true;
        render();
        setTimeout(() => {
            const x = $("#pt");
            x && x.focus();
        }, 50);
    }
    else if (a === "close") {
        if (e.target.closest(".sh") && !t.classList.contains("bt"))
            return;
        mc = false;
        render();
    }
    else if (a === "pub") {
        const x = $("#pt").value.trim();
        if (!x && !pend)
            return;
        S.posts.push({
            id: "p" + Date.now(),
            uid: S.me,
            t: x,
            img: pend,
            ts: Date.now(),
            likes: [],
            cm: []
        });
        pend = "";
        draft = "";
        mc = false;
        save();
        view = "feed";
        vu = null;
        render();
        scrollTo(0, 0);
    }
    else if (a === "like") {
        const p = S.posts.find(x => x.id === id);
        const i = p.likes.indexOf(S.me);
        i < 0 ? p.likes.push(S.me) : p.likes.splice(i, 1);
        save();
        render();
    }
    else if (a === "cm") {
        open[id] = !open[id];
        render();
    }
    else if (a === "send") {
        const v = $("#ci" + id).value.trim();
        if (!v)
            return;
        const cm = S.posts.find(x => x.id === id).cm;
        const n = { u: m.name, uid: S.me, t: v };
        if (rt && rt.p === id && cm[rt.i]) {
            const par = cm[rt.i];
            n.to = par.u;
            n.lv = Math.min((par.lv || 0) + 1, 3);
            let j = rt.i + 1;
            while (j < cm.length && (cm[j].lv || 0) > (par.lv || 0))
                j++;
            cm.splice(j, 0, n);
        }
        else
            cm.push(n);
        rt = null;
        save();
        render();
    }
    else if (a === "del") {
        if (confirm("Excluir esta publicação?")) {
            S.posts = S.posts.filter(x => x.id !== id || x.uid !== S.me);
            save();
            render();
        }
    }
    else if (a === "save") {
        const i = S.saved.indexOf(id);
        i < 0 ? S.saved.push(id) : S.saved.splice(i, 1);
        save();
        render();
    }
    else if (a === "share") {
        try {
            navigator.clipboard.writeText(location.href);
            toast("Link copiado");
        }
        catch (x) {
            toast("Não foi possível copiar o link");
        }
    }
    else if (a === "flt") {
        filter = id;
        render();
    }
    else if (a === "fw") {
        const i = S.follow.indexOf(id);
        i < 0 ? S.follow.push(id) : S.follow.splice(i, 1);
        save();
        render();
    }
    else if (a === "tab") {
        tab = id;
        render();
    }
    else if (a === "pal") {
        S.pal = id;
        save();
        applyTheme();
        render();
    }
    else if (a === "bell") {
        const n = nt();
        const p = mine(S.me);
        const r = [];
        if (n.fw)
            r.push(`${fers(m).length} seguidores`);
        if (n.likes)
            r.push(`${p.reduce((x, y) => x + y.likes.length, 0)} curtidas`);
        if (n.cm)
            r.push(`${p.reduce((x, y) => x + y.cm.length, 0)} comentários`);
        toast(r.length ? r.join(", ") + " no total" : "Notificações desativadas em Configurações");
    }
    else if (a === "dark") {
        S.dark = !isDark();
        save();
        applyTheme();
        render();
    }
    else if (a === "reply") {
        const [pid, i] = id.split("|");
        const c = S.posts.find(x => x.id === pid).cm[+i];
        if (!c)
            return;
        rt = { p: pid, i: +i, n: c.u };
        render();
        setTimeout(() => {
            const e = $("#ci" + pid);
            e && e.focus();
        }, 40);
    }
    else if (a === "rcancel") {
        rt = null;
        render();
    }
    else if (a === "flist") {
        const [uid, k] = id.split(":");
        fl = { u: uid, k };
        mm = "lista";
        render();
    }
    else if (a === "vsend") {
        (async () => {
            const x = $("#vc").value.trim().toUpperCase();
            if (!x)
                return;
            if (CODES.includes(await hash(x))) {
                m.ver = true;
                m.ok = 1;
                save();
                render();
                toast("Conta verificada!");
            }
            else
                toast("Código inválido");
        })();
    }
    else if (a === "menu") {
        mn = mn === id ? null : id;
        render();
    }
    else if (a === "delc") {
        const [pid, i] = id.split("|");
        const p = S.posts.find(x => x.id === pid);
        const c = p && p.cm[+i];
        if (c && (c.uid ? c.uid === S.me : c.u === m.name) && confirm("Excluir este comentário?")) {
            const lv = c.lv || 0;
            let j = +i + 1;
            while (j < p.cm.length && (p.cm[j].lv || 0) > lv)
                j++;
            p.cm.splice(+i, j - +i);
            rt = null;
            save();
            render();
        }
    }
    else if (a === "rep") {
        rp = id;
        mm = "denuncia";
        render();
    }
    else if (a === "rsend") {
        const r = document.querySelector("input[name=rr]:checked");
        const k = rp[0];
        const ref = rp.slice(2);
        if (!S.reports)
            S.reports = [];
        if (S.reports.some(x => x.by === S.me && x.ref === ref && x.k === k))
            toast("Você já denunciou isso");
        else {
            S.reports.push({
                k, ref,
                reason: r ? r.value : "Outro motivo",
                by: S.me,
                ts: Date.now()
            });
            toast("Denúncia enviada. A coordenação vai analisar.");
        }
        mm = null;
        save();
        render();
    }
    else if (a === "pickb") {
        $("#qb").click();
    }
    else if (a === "pickp") {
        $("#qp").click();
    }
    else if (a === "out") {
        S.me = null;
        save();
        gate();
    }
    else if (a === "nt") {
        nt()[id] = !nt()[id];
        save();
        render();
    }
    else if (a === "rmb") {
        delete m.banner;
        save();
        render();
    }
    else if (a === "uname") {
        const v = $("#cu").value.trim().replace(/^@/, "").toLowerCase();
        if (!/^[a-z0-9._]{3,20}$/.test(v))
            return toast("Use de 3 a 20 letras, números, ponto ou _");
        if (S.users.some(x => x.user === v && x.id !== m.id))
            return toast("Esse usuário já existe");
        m.user = v;
        save();
        render();
        toast("Usuário alterado");
    }
    else if (a === "pw") {
        (async () => {
            const n = $("#cp").value;
            if (n.length < 4)
                return toast("A senha precisa ter ao menos 4 caracteres");
            if (m.pw && m.pw !== await hash($("#cp0").value))
                return toast("Senha atual incorreta");
            m.pw = await hash(n);
            save();
            render();
            toast("Senha salva");
        })();
    }
    else if (a === "addav") {
        mm = "aviso";
        render();
    }
    else if (a === "addev") {
        mm = "evento";
        render();
    }
    else if (a === "mclose") {
        if (e.target.closest(".sh") && !t.classList.contains("bt"))
            return;
        mm = null;
        render();
    }
    else if (a === "mpub") {
        const x = $("#mt").value.trim();
        if (!x)
            return;
        if (mm === "aviso")
            AVS().push({
                id: "a" + Date.now(),
                t: x,
                d: $("#mb").value.trim(),
                ts: Date.now(),
                uid: S.me
            });
        else {
            const d = $("#md").value;
            if (!d)
                return toast("Informe a data");
            EVS().push({
                id: "e" + Date.now(),
                t: x,
                d,
                h: $("#mh").value,
                l: $("#ml").value.trim(),
                uid: S.me,
                go: []
            });
        }
        mm = null;
        save();
        render();
    }
    else if (a === "atab") {
        at = id;
        render();
    }
    else if (a === "dela") {
        S.avisos = AVS().filter(x => x.id !== id);
        save();
        render();
    }
    else if (a === "delev") {
        S.eventos = EVS().filter(x => x.id !== id);
        save();
        render();
    }
    else if (a === "goev") {
        const ev = EVS().find(x => x.id === id);
        const i = ev.go.indexOf(S.me);
        i < 0 ? ev.go.push(S.me) : ev.go.splice(i, 1);
        save();
        render();
    }
    else if (a === "edit") {
        m.name = $("#en").value.trim() || m.name;
        m.bio = $("#eb").value.trim();
        const n = $("#ln").value.trim();
        const u = $("#lu").value.trim();
        if (n && /^https?:\/\//i.test(u))
            m.links = (m.links || []).concat({ n, url: u });
        const d = () => {
            save();
            render();
            toast("Perfil salvo");
        };
        const rd = f => new Promise(r => f ? shrink(f, r) : r(null));
        Promise.all([rd($("#ep").files[0]), rd($("#pb").files[0])]).then(([a, b]) => {
            if (a)
                m.pic = a;
            if (b)
                m.banner = b;
            d();
        });
    }
});

document.addEventListener("input", e => {
    if (e.target.dataset.i === "q") {
        q = e.target.value;
        render();
    }
});

document.addEventListener("change", e => {
    const t = e.target;
    if (t.dataset.i === "ft") {
        ft = t.value;
        render();
    }
    else if (t.dataset.i === "fy") {
        fy = t.value;
        render();
    }
    else if (t.id === "pf" && t.files[0])
        shrink(t.files[0], d => {
            pend = d;
            render();
        });
    else if ((t.id === "qb" || t.id === "qp") && t.files[0]) {
        const b = t.id === "qb";
        shrink(t.files[0], d => {
            const m = me();
            if (b)
                m.banner = d;
            else
                m.pic = d;
            save();
            render();
            toast(b ? "Banner atualizado" : "Foto atualizada");
        }, b ? 1000 : 400);
    }
});

// ==================== Avisos, eventos, verificação de conta, denúncias e login ====================

let mm = null;
let at = "avisos";
let lm = false;
let mn = null;
let rp = "";
let rt = null;
let fl = null;
const SEG0 = {
    u1: ["u3", "u4"],
    u2: ["u1", "u3"],
    u3: ["u1", "u2", "u4"],
    u4: ["u1"]
};
const fing = u => u.id === S.me ? S.follow : (u.seg || SEG0[u.id] || []);
const fers = u => S.users.filter(x => fing(x).includes(u.id));

function listModal() {
    const u = uOf(fl.u);
    const l = fl.k === "fers" ? fers(u) : fing(u).map(uOf);
    return `<div class="md" data-a="mclose">
        <div class="sh">
        <b style="font-size:17px">${fl.k === "fers" ? "Seguidores" : "Seguindo"}</b>
        <small style="display:block;color:var(--mut)">${esc(u.name)}</small>
        <div style="max-height:55vh;overflow:auto;margin-top:8px">${l.length ? l.map(x => `<div class="ur" style="padding:8px 0;border-top:1px solid var(--bd)">
        <span class="av" data-a="user" data-id="${x.id}">${av(x)}</span>
        <div class="sp" data-a="user" data-id="${x.id}" style="cursor:pointer">
        <div class="nm">${esc(x.name)}${x.ok ? OK : ""}</div>
        <small>@${esc(x.user)}</small>
        </div>
        </div>`).join("") : `<div class="empty">Ninguém por aqui ainda.</div>`}</div>
        <div class="row" style="margin-top:12px;justify-content:flex-end">
        <button class="bt g" data-a="mclose">Fechar</button>
        </div>
        </div>
        </div>`;
}
const CODES = ["9b3607c3fd81ec869deea90bd16376ad8b00369998f9739598c84f30418f12f1"];
const NEED = ["compose", "pub", "like", "send", "reply", "save", "fw", "addav", "addev", "mpub", "goev"];

function verificar() {
    const m = me();
    return m.ver ? `<div class="card" style="text-align:center">
        <span class="mi" style="margin:0 auto 8px;background:#d6f5e0;color:#22a559">${s(I.chk, 18)}</span>
        <b>Conta verificada</b>
        <p style="color:var(--mut);margin:6px 0 0">Você pode publicar e interagir normalmente.</p>
        </div>` : `<div class="card">
        <b>Digite o código de verificação</b>
        <p style="color:var(--mut);margin:6px 0 12px;font-size:13px">Peça o código à coordenação do Colégio AGV. Sem ele, você só consegue ver o conteúdo: não publica nem interage.</p>
        <input id="vc" placeholder="Código" autocapitalize="characters" maxlength="30">
        <button class="bt" style="width:100%;margin-top:12px" data-a="vsend">Verificar</button>
        </div>`;
}
const mnu = (k, t, id) => `<div class="mnu">${k === "del" ? `<button class="rd" data-a="${t === "p" ? "del" : "delc"}" data-id="${id}">Excluir</button>` : `<button data-a="rep" data-id="${t}:${id}">Denunciar</button>`}</div>`;
const REAS = ["Conteúdo ofensivo ou bullying", "Spam ou propaganda", "Informação falsa", "Conteúdo impróprio", "Outro motivo"];

function repModal() {
    return `<div class="md" data-a="mclose">
        <div class="sh">
        <b style="font-size:17px">Denunciar</b>
        <p style="color:var(--mut);margin:6px 0 0;font-size:13px">Por que você está denunciando?</p>${REAS.map((x, i) => `<label class="opt" style="cursor:pointer;margin:0;color:var(--tx);font-size:14px">
        <span>${x}</span>
        <input type="radio" name="rr" value="${x}" style="width:auto" ${i ? "" : "checked"}>
        </label>`).join("")}<div class="row" style="margin-top:14px;justify-content:flex-end">
        <button class="bt g" data-a="mclose">Cancelar</button>
        <button class="bt" data-a="rsend">Enviar denúncia</button>
        </div>
        </div>
        </div>`;
}
const isDark = () => S.dark === undefined ? matchMedia("(prefers-color-scheme: dark)").matches : S.dark;
const TG = () => `<button class="ic" data-a="dark" aria-label="Alternar tema escuro">${s(isDark() ? I.moon : I.sun, 24)}</button>`;
const nt = () => S.notif || (S.notif = { fw: true, likes: true, cm: true });
const hash = async (x) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode("loom:" + x)))].map(b => b.toString(16).padStart(2, "0")).join("");
const iso = n => {
    const d = new Date(Date.now() + n * 864e5);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const AVS = () => S.avisos || (S.avisos = [{
        id: "a1",
        t: "Abertura da Feira de Cursos",
        d: "Preparem os projetos e cheguem com 30 minutos de antecedência.",
        ts: Date.now() - 864e5,
        uid: "u1"
    }, {
        id: "a2",
        t: "Atualização de cadastro",
        d: "Conferam os dados do perfil no Loom antes da feira.",
        ts: Date.now() - 2 * 864e5,
        uid: "u1"
    }]);
const EVS = () => S.eventos || (S.eventos = [{
        id: "e1",
        t: "Feira de Cursos",
        d: iso(7),
        h: "08:00",
        l: "Pátio do colégio",
        uid: "u1",
        go: []
    }, {
        id: "e2",
        t: "Reunião do grêmio",
        d: iso(3),
        h: "13:30",
        l: "Auditório",
        uid: "u1",
        go: []
    }]);

function avisos() {
    const m = me();
    let l;
    if (at === "avisos")
        l = AVS().slice().sort((a, b) => b.ts - a.ts).map(a => `<div class="card">
        <div class="ph">
        <span class="mi">${s(I.bell, 16)}</span>
        <div class="sp">
        <div class="nm">${esc(a.t)}</div>
        <small>${esc(uOf(a.uid).name)} • ${ago(a.ts)}</small>
        </div>${a.uid === m.id ? `<button class="dot" data-a="dela" data-id="${a.id}" aria-label="Excluir">${s(I.dots, 18, "currentColor")}</button>` : ""}</div>${a.d ? `<div class="pt" style="margin-bottom:0">${esc(a.d)}</div>` : ""}</div>`).join("");
    else
        l = EVS().filter(e => e.d >= iso(0)).sort((a, b) => (a.d + a.h).localeCompare(b.d + b.h)).map(e => {
            const d = new Date(e.d + "T12:00:00");
            const g = e.go.includes(m.id);
            return `<div class="card ur">
        <div class="dt">
        <b>${d.getDate()}</b>
        <span>${d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</span>
        </div>
        <div class="sp">
        <div class="nm">${esc(e.t)}</div>
        <small>${e.h ? esc(e.h) + " • " : ""}${esc(e.l || "Colégio AGV")}</small>
        <br>
        <small>${e.go.length} confirmados</small>
        </div>
        <button class="bt sm ${g ? "g" : ""}" data-a="goev" data-id="${e.id}">${g ? "Confirmado" : "Eu vou"}</button>${e.uid === m.id ? `<button class="dot" data-a="delev" data-id="${e.id}" aria-label="Excluir">${s(I.dots, 18, "currentColor")}</button>` : ""}</div>`;
        }).join("");
    return `<div class="row" style="margin-bottom:14px">
        <div class="tabs" style="padding:0">${[["avisos", "Avisos"], ["eventos", "Próximos eventos"]].map(t => `<button class="pl ${at === t[0] ? "on" : ""}" data-a="atab" data-id="${t[0]}">${t[1]}</button>`).join("")}</div>
        <button class="cr" style="flex:none" data-a="${at === "avisos" ? "addav" : "addev"}">${s(I.plus, 16)}Novo</button>
        </div>${l || `<div class="empty">Nada por aqui ainda.</div>`}`;
}

function mmodal() {
    const ev = mm === "evento";
    return `<div class="md" data-a="mclose">
        <div class="sh">
        <b style="font-size:17px">${ev ? "Novo evento" : "Novo aviso"}</b>
        <label>Título</label>
        <input id="mt" maxlength="70">${ev ? `<div class="row">
        <div>
        <label>Data</label>
        <input id="md" type="date">
        </div>
        <div>
        <label>Horário</label>
        <input id="mh" type="time">
        </div>
        </div>
        <label>Local</label>
        <input id="ml" maxlength="60">` : `<label>Mensagem</label>
        <textarea id="mb" maxlength="400">
        </textarea>`}<div class="row" style="margin-top:12px;justify-content:flex-end">
        <button class="bt g" data-a="mclose">Cancelar</button>
        <button class="bt" data-a="mpub">Publicar</button>
        </div>
        </div>
        </div>`;
}

$("#gsw").onclick = () => {
    lm = !lm;
    $("#gx1").classList.toggle("hide", lm);
    $("#gx2").classList.toggle("hide", lm);
    $("#gok").textContent = lm ? "Entrar" : "Criar meu perfil";
    $("#gsw").textContent = lm ? "Criar um novo perfil" : "Já tenho conta";
    $("#ge").textContent = "";
};

$("#gok").onclick = async () => {
    const e = $("#ge");
    const n = $("#gn").value.trim();
    const u = $("#gu").value.trim().replace(/^@/, "").toLowerCase();
    const p = $("#gp").value;
    if (lm) {
        const x = S.users.find(y => y.user === u && !/^u[1-4]$/.test(y.id));
        if (!x) {
            e.textContent = "Usuário não encontrado.";
            return;
        }
        if (x.pw && x.pw !== await hash(p)) {
            e.textContent = "Senha incorreta.";
            return;
        }
        S.me = x.id;
        save();
        view = "feed";
        gate();
        return;
    }
    if (n.length < 2 || u.length < 3) {
        e.textContent = "Informe seu nome e um usuário com ao menos 3 caracteres.";
        return;
    }
    if (p.length < 4) {
        e.textContent = "A senha precisa ter ao menos 4 caracteres.";
        return;
    }
    if (S.users.some(x => x.user === u)) {
        e.textContent = "Esse usuário já existe.";
        return;
    }
    const id = "u" + Date.now();
    S.users.push({
        id,
        name: n,
        user: u,
        ano: +$("#gy").value,
        turma: $("#gt").value,
        bio: $("#gb").value.trim(),
        links: [],
        f: 0,
        v: 0,
        pw: await hash(p)
    });
    S.me = id;
    save();
    view = "feed";
    $("#gp").value = "";
    gate();
};

gate();
