/**
 * Zentraler Header für alle Thermokon IoT Seiten.
 *
 * Aufruf am Anfang von <body>:
 *
 *   renderHeader({
 *     title:    'Seitentitel',
 *     activeId: 'downlink-generator',  // ID aus NAV_APPS
 *     basePath: '../../',              // relativer Pfad von dieser Datei zur Root
 *   });
 *
 * Neue App eintragen: NAV_APPS Array erweitern – fertig.
 *
 * Sprachsystem:
 *   - currentLanguage  globale Variable, aus localStorage ('de' | 'en')
 *   - toggleLanguage() in header.js; Seiten definieren window.onLanguageChange = myUpdateFn
 *
 * Stellt global bereit: currentLanguage, toggleLanguage(), closeBurgerMenu()
 */

// ==== SPRACHE (global, persistent) ====
let currentLanguage = localStorage.getItem('iot-lang') || 'de';

function toggleLanguage() {
    currentLanguage = currentLanguage === 'de' ? 'en' : 'de';
    localStorage.setItem('iot-lang', currentLanguage);
    _updateLangFlags();
    if (typeof onLanguageChange === 'function') onLanguageChange();
}

function _updateLangFlags() {
    const de = document.getElementById('deFlag');
    const en = document.getElementById('enFlag');
    if (!de || !en) return;
    de.classList.toggle('active', currentLanguage === 'de');
    en.classList.toggle('active', currentLanguage === 'en');
}

// ==== ZENTRALE NAVIGATION ====
// Hier neue Apps eintragen. path ist relativ zur Root (index.html).
const NAV_APPS = [
    { id: 'dashboard',          label: '🏠 Dashboard',           path: 'index.html' },
    { id: 'downlink-generator', label: '⚙️ Downlink Generator',  path: 'iot-apps/downlink-generator/downlink-generator.html' },
    { id: 'lorawan-decoder',    label: '📡 LoRaWAN Decoder',     path: 'iot-apps/lorawan-decoder/lorawan-decoder.html' },
    { id: 'gemini-chat',        label: '🤖 KI-Assistent',        path: 'iot-apps/gemini-chat/gemini-chat.html' },
];

function renderHeader(config) {
    const { title, activeId, basePath } = config;
    const base = basePath || '';

    const homeBtn = (activeId === 'dashboard')
        ? `<a class="home-btn disabled" title="Dashboard">🏠</a>`
        : `<a href="${base}index.html" class="home-btn" title="Dashboard">🏠</a>`;

    const itemsHtml = NAV_APPS.map(app => {
        const isActive = app.id === activeId;
        return `<a href="${base}${app.path}" class="menu-item${isActive ? ' active' : ''}">${app.label}</a>`;
    }).join('\n            ');

    const deActive = currentLanguage === 'de' ? ' active' : '';
    const enActive = currentLanguage === 'en' ? ' active' : '';

    const html = `<div class="top-bar">
    ${homeBtn}
    <div class="burger-menu">
        <button class="burger-btn" onclick="toggleBurgerMenu()">
            <span></span><span></span><span></span>
        </button>
        <div class="burger-dropdown" id="burgerDropdown">
            ${itemsHtml}
        </div>
    </div>
    <h1 id="mainTitle">${title}</h1>
    <img src="https://www.thermokon.de/typo3conf/ext/tm_thermokon/Resources/Public/Img/thermokon_logo.svg" alt="Thermokon Logo" class="logo">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/LoRaWAN_Logo.svg/1280px-LoRaWAN_Logo.svg.png" alt="LoRaWAN Logo" class="logo-right">
    <div class="language-toggle">
        <button onclick="toggleLanguage()"><span id="langIcon">🌐</span> <span class="flag${deActive}" id="deFlag">🇩🇪</span><span class="flag${enActive}" id="enFlag">🇬🇧</span></button>
    </div>
</div>`;

    document.body.insertAdjacentHTML('afterbegin', html);
}

function toggleBurgerMenu() {
    const dropdown = document.getElementById('burgerDropdown');
    const btn = document.querySelector('.burger-btn');
    dropdown.classList.toggle('open');
    btn.classList.toggle('open');
}

function closeBurgerMenu() {
    const dropdown = document.getElementById('burgerDropdown');
    const btn = document.querySelector('.burger-btn');
    if (dropdown) dropdown.classList.remove('open');
    if (btn) btn.classList.remove('open');
}

document.addEventListener('click', function (e) {
    if (!e.target.closest('.burger-menu')) {
        closeBurgerMenu();
    }
});
