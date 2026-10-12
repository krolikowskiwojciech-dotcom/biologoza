// Drobne pomocniki DOM, ikony (interfejs i biologiczne do bąbli na kartach) i własne okienka zamiast alert/confirm.

export function h(tag, attrs = {}, ...dzieci) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const d of dzieci.flat(Infinity)) if (d != null && d !== false) el.append(d instanceof Node ? d : String(d));
  return el;
}

// kolory kart jak w Lingozie (pastelowe, z ciemniejszym „brzegiem” 3D)
export const KOLORY = ['kolor-mietowy', 'kolor-lila', 'kolor-zolty', 'kolor-brzoskwinia', 'kolor-niebieski', 'kolor-rozowy'];
export const kolor = (i) => KOLORY[((i % KOLORY.length) + KOLORY.length) % KOLORY.length];

// ikony — ten sam rysunek co w Lingozie (jedna kreska 2.1, zaokrąglone końce)
const S = (w) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${w}</svg>`;
const IKONY = {
  wstecz: S('<path d="M15 5l-7 7 7 7"/>'),
  zamknij: S('<path d="M6 6l12 12M18 6 6 18"/>'),
  zebatka: S('<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/>'),
  ptaszek: S('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  dalej: S('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  wyslij: S('<path d="M21 3 10 14"/><path d="M21 3l-7 18-4-7-7-4z"/>'),
  powtorz: S('<path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/>'),
  sluchawki: S('<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.5" height="6.5" rx="2"/><rect x="16.5" y="14" width="4.5" height="6.5" rx="2"/>'),
  graj: S('<path d="M8 5.5v13l10.5-6.5z"/>'),
  pauza: S('<path d="M9 5.5v13M15 5.5v13"/>'),
  ksiazka: S('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>'),
  sciaga: S('<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 12h6M10 16h6"/>'),
  klodka: S('<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"/>'),
  cofnij15: S('<path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5"/><path d="M4 4v4.5h4.5"/>'),
  // biologia — do bąbli na kartach zestawów (pole „ikona” w zestawie)
  lisc: S('<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14z"/><path d="M5 19 14 10"/>'),
  komorka: S('<ellipse cx="12" cy="12" rx="9" ry="7.5"/><circle cx="13.5" cy="11" r="2.6"/><path d="M6.5 14.5h1.5M8.5 8.5h.5M16 16h1"/>'),
  mikroskop: S('<path d="M9 4.5l4 2-3 6-4-2z"/><path d="M11.5 9.5a5 5 0 0 1 3.5 8.5"/><path d="M5 20.5h14M8 17.5h6"/>'),
  dna: S('<path d="M7 3c0 6 10 6 10 12 0 3-2 5-2 6M17 3c0 6-10 6-10 12 0 3 2 5 2 6"/><path d="M8.6 6.5h6.8M8.6 17.5h6.8"/>'),
  ryba: S('<path d="M3 12c3-4.5 9-6 14-1.5L21 7v10l-4-3.5C12 18 6 16.5 3 12z"/><circle cx="8" cy="11" r=".7" fill="currentColor"/>'),
  ptak: S('<path d="M4 15c4 0 6-2 7-6 1-3 4-4 6-3l3 1-3 1c0 6-4 10-10 10H4z"/><path d="M9 14l3-1"/>'),
  owad: S('<ellipse cx="12" cy="14.5" rx="3" ry="5"/><circle cx="12" cy="7" r="2"/><path d="M10.5 5.5 8 3M13.5 5.5 16 3M9 12.5H5M9 15.5l-4 1.5M15 12.5h4M15 15.5l4 1.5"/>'),
  slimak: S('<path d="M3 18h13a5 5 0 0 0 5-5V9"/><circle cx="11" cy="12.5" r="5.5"/><path d="M11 12.5a2 2 0 1 0 2-2"/><path d="M19 9l-1.5-3.5M21 9l1-3.5"/>'),
  zaba: S('<path d="M4 15c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5c0 2.5-3.5 4-8 4s-8-1.5-8-4z"/><circle cx="8.5" cy="7.5" r="2"/><circle cx="15.5" cy="7.5" r="2"/><path d="M9 15.5c2 1 4 1 6 0"/>'),
  serce: S('<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>'),
  kosc: S('<path d="M8.5 15.5l7-7"/><path d="M8.5 15.5a2.6 2.6 0 1 1-3.4 3.4 2.6 2.6 0 1 1-1-4.4 2.6 2.6 0 1 1 4.4 1z"/><path d="M15.5 8.5a2.6 2.6 0 1 1 3.4-3.4 2.6 2.6 0 1 1 1 4.4 2.6 2.6 0 1 1-4.4-1z"/>'),
  grzyb: S('<path d="M3.5 11a8.5 6.5 0 0 1 17 0z"/><path d="M9.5 11v6.5a2.5 2.5 0 0 0 5 0V11"/>'),
};
export const ik = (nazwa, klasa = '') => h('span', { class: `ik ik-${nazwa} ${klasa}`, html: IKONY[nazwa] || IKONY.lisc });
export const IKONY_BIO = ['lisc', 'komorka', 'mikroskop', 'dna', 'ryba', 'ptak', 'owad', 'slimak', 'zaba', 'serce', 'kosc', 'grzyb'];

// maskotka 3D (obrazy/maskotka-<poza>.png); dopóki pliku nie ma, element po prostu znika
export const maskotka = (poza, klasa = '') => h('img', { class: 'maskotka ' + klasa, src: `obrazy/maskotka-${poza}.png`, alt: '', onerror: (e) => e.target.remove() });

// własne okienko (wysuwane od dołu): okno({ tytul, tresc, przyciski: [{ tekst, wartosc, klasa }] }) → Promise<wartosc>
export function okno({ tytul, tresc, poza = 'mysli', przyciski = [{ tekst: 'Jasne', wartosc: true, klasa: 'glowny' }] }) {
  return new Promise((ok) => {
    const tlo = h('div', { class: 'okno-tlo', onclick: () => zamknij(null) });
    const pudlo = h('div', { class: 'okno', role: 'dialog', 'aria-modal': 'true', 'aria-label': tytul },
      maskotka(poza, 'okno-maskotka'),
      h('div', { class: 'okno-tytul serif' }, tytul),
      typeof tresc === 'string' ? h('p', { class: 'okno-tekst' }, tresc) : tresc,
      h('div', { class: 'okno-przyciski' }, przyciski.map((p) => h('button', { class: 'btn ' + (p.klasa || 'jasny'), type: 'button', onclick: () => zamknij(p.wartosc) }, p.tekst))));
    const klaw = (e) => { if (e.key === 'Escape') zamknij(null); };
    function zamknij(w) {
      tlo.classList.remove('wid'); pudlo.classList.remove('wid');
      document.removeEventListener('keydown', klaw);
      setTimeout(() => { tlo.remove(); pudlo.remove(); }, 250);
      ok(w);
    }
    document.body.append(tlo, pudlo);
    document.addEventListener('keydown', klaw);
    requestAnimationFrame(() => { tlo.classList.add('wid'); pudlo.classList.add('wid'); });
    pudlo.querySelector('.okno-przyciski button:last-child')?.focus({ preventScroll: true });
  });
}

export const odm = (n, a, b, c) => {
  const j = n % 10, d = n % 100;
  return n === 1 ? a : j >= 2 && j <= 4 && (d < 12 || d > 14) ? b : c;
};

// losowanie
export const los = {
  int: (a, b) => a + Math.floor(Math.random() * (b - a + 1)),
  wybierz: (t) => t[Math.floor(Math.random() * t.length)],
  tasuj: (t) => { const a = [...t]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
};
