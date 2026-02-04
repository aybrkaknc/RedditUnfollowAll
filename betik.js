// ==UserScript==
// @name         Reddit Toplu Abonelikten Çıkma (Premium UI)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Reddit'teki tüm subreddit aboneliklerinden şık bir arayüz ile toplu olarak çıkar.
// @author       Antigravity (by Ayberk)
// @match        https://www.reddit.com/subreddits/*
// @match        https://old.reddit.com/subreddits/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Tasarım Sabitleri (Glassmorphism)
    const THEME = {
        bg: 'rgba(20, 20, 20, 0.85)',
        glass: 'rgba(255, 255, 255, 0.1)',
        primary: '#FF4500', // Reddit Orange
        text: '#FFFFFF',
        textDim: '#B3B3B3',
        error: '#FF3333',
        success: '#4BB543',
        blur: '12px'
    };

    // Dil Çevirileri (i18n)
    const I18N = {
        tr: {
            title: "Reddit Unfollow All",
            total: "TOPLAM",
            done: "ÇIKILDI",
            start: "BAŞLAT",
            pause: "DURAKLAT",
            resume: "DEVAM ET",
            speed: "Hız Seçimi",
            slow: "Yavaş",
            normal: "Normal",
            fast: "Hızlı",
            turbo: "Turbo",
            ready: "Sistem hazır. Butonlar aranıyor...",
            found: "Sistem: {n} adet abonelik bulundu.",
            notFound: "Hata: Temizlenecek abonelik bulunamadı.",
            started: "İşlem başlatıldı...",
            paused: "İşlem duraklatıldı.",
            resumed: "İşlem devam ediyor...",
            success: "Başarılı: {s} listeden çıkarıldı.",
            error: "Hata: Bir butona tıklanamadı, atlanıyor.",
            skipped: "Atlandı: Buton görünür değil.",
            completed: "✅ İşlem tamamlandı!",
            reloadConfirm: "Tüm işlemler bitti. Sayfayı yenileyerek kontrol etmek ister misiniz?",
            noButtons: "Abonelik bulunamadı veya sayfa henüz yüklenmedi.",
            minimize: "Küçült",
            close: "Kapat",
            move: "Taşı"
        },
        en: {
            title: "Reddit Unfollow All",
            total: "TOTAL",
            done: "DONE",
            start: "START",
            pause: "PAUSE",
            resume: "RESUME",
            speed: "Speed Select",
            slow: "Slow",
            normal: "Normal",
            fast: "Fast",
            turbo: "Turbo",
            ready: "System ready. Scanning buttons...",
            found: "System: {n} subscriptions found.",
            notFound: "Error: No subscriptions found to clear.",
            started: "Process started...",
            paused: "Process paused.",
            resumed: "Process resumed...",
            success: "Success: {s} unsubscribed.",
            error: "Error: Could not click button, skipping.",
            skipped: "Skipped: Button not visible.",
            completed: "✅ Process completed!",
            reloadConfirm: "All processes finished. Would you like to reload the page to check?",
            noButtons: "No subscriptions found or page not loaded yet.",
            minimize: "Minimize",
            close: "Close",
            move: "Move"
        }
    };

    // Tarayıcı dilini algıla (Varsayılan: en)
    const userLang = navigator.language.startsWith('tr') ? 'tr' : 'en';
    const t = I18N[userLang];

    // Uygulama Durumu
    const State = {
        isPaused: true,
        isMinimized: false,
        currentIndex: 0,
        unsubscribedCount: 0,
        totalActions: 0,
        delay: 800, // Varsayılan: Normal
        buttons: []
    };

    /**
     * Modern UI Panelini Oluşturur ve Sayfaya Enjekte Eder
     */
    function injectUI() {
        const style = document.createElement('style');
        style.innerHTML = `
            #reddit-unfollow-panel {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 320px;
                background: ${THEME.bg};
                backdrop-filter: blur(${THEME.blur});
                -webkit-backdrop-filter: blur(${THEME.blur});
                border: 1px solid ${THEME.glass};
                border-radius: 16px;
                padding: 20px;
                color: ${THEME.text};
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                z-index: 999999;
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                user-select: none;
                transition: opacity 0.3s ease, height 0.3s ease, padding 0.3s ease;
                overflow: hidden;
            }

            #reddit-unfollow-panel.minimized {
                height: 24px;
                padding: 12px 20px;
                width: 300px;
            }

            .panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                cursor: move;
                height: 24px;
            }

            #reddit-unfollow-panel.minimized .panel-header {
                margin-bottom: 0;
            }

            .panel-header h2 {
                margin: 0;
                font-size: 16px;
                font-weight: 700;
                color: ${THEME.primary};
                display: flex;
                align-items: center;
                gap: 8px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding-right: 10px;
            }

            .window-controls {
                display: flex;
                gap: 8px;
                align-items: center;
                flex-shrink: 0;
            }

            .ctrl-btn {
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                color: ${THEME.textDim};
                transition: all 0.2s;
            }

            .ctrl-btn:hover {
                background: ${THEME.glass};
                color: ${THEME.text};
            }

            .ctrl-btn.close-btn:hover {
                background: ${THEME.error};
                color: white;
            }

            .move-icon {
                cursor: move;
                font-size: 16px;
            }

            .panel-content {
                transition: opacity 0.3s ease;
            }

            #reddit-unfollow-panel.minimized .panel-content {
                opacity: 0;
                pointer-events: none;
            }

            .stat-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-bottom: 20px;
            }

            .stat-card {
                background: ${THEME.glass};
                padding: 10px;
                border-radius: 10px;
                text-align: center;
            }

            .stat-label {
                font-size: 10px;
                text-transform: uppercase;
                color: ${THEME.textDim};
                margin-bottom: 4px;
            }

            .stat-value {
                font-size: 20px;
                font-weight: 700;
            }

            .progress-container {
                height: 6px;
                background: ${THEME.glass};
                border-radius: 3px;
                margin-bottom: 20px;
                overflow: hidden;
            }

            #progress-bar {
                width: 0%;
                height: 100%;
                background: linear-gradient(90deg, ${THEME.primary}, #FF8C00);
                transition: width 0.3s ease;
            }

            .controls {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            }

            .btn {
                flex: 1;
                padding: 10px;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.1s, opacity 0.2s, background 0.3s;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 6px;
            }

            .btn:active { transform: scale(0.95); }
            .btn:disabled { opacity: 0.5; cursor: not-allowed; }

            .btn-primary { background: ${THEME.primary}; color: white; }
            .btn-secondary { background: ${THEME.glass}; color: white; }

            .speed-group {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 5px;
                margin-top: 10px;
            }

            .btn-speed {
                padding: 6px 2px;
                font-size: 10px;
                background: ${THEME.glass};
                color: ${THEME.textDim};
                border-radius: 6px;
            }

            .btn-speed.active {
                background: ${THEME.primary};
                color: white;
                box-shadow: 0 0 10px ${THEME.primary}44;
            }

            .settings {
                font-size: 12px;
                color: ${THEME.textDim};
                margin-top: 5px;
            }

            .log-area {
                margin-top: 15px;
                font-size: 11px;
                max-height: 60px;
                overflow-y: auto;
                color: ${THEME.textDim};
                border-top: 1px solid ${THEME.glass};
                padding-top: 10px;
            }
        `;
        document.head.appendChild(style);

        const panel = document.createElement('div');
        panel.id = 'reddit-unfollow-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h2><svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style="color: #FF4500;"><path d="M16.67 10c0-1.1-.9-2-2-2-.25 0-.48.05-.7.13a7.43 7.43 0 0 0-3.97-1.25l.68-3.04 2.21.47c.05.61.56 1.1 1.18 1.1 1.1 0 2-.9 2-2s-.9-2-2-2c-.88 0-1.61.57-1.89 1.34L9.84 2.1c-.13-.03-.27 0-.38.08-.1.08-.15.21-.13.34l-.79 3.55a7.43 7.43 0 0 0-4.04 1.25c-.22-.08-.45-.13-.7-.13-1.1 0-2 .9-2 2 0 .73.4 1.37 1 1.71v.04c0 2.65 3.36 4.8 7.5 4.8s7.5-2.15 7.5-4.8v-.04c.6-.34 1-.98 1-1.71zM6.5 10.5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6.33 3.65c-.56.56-1.54.85-2.83.85s-2.27-.29-2.83-.85a.34.34 0 0 1 0-.48c.13-.13.35-.13.48 0 .44.44 1.27.66 2.35.66s1.91-.22 2.35-.66a.34.34 0 0 1 .48 0c.13.13.13.35 0 .48zm-.83-1.65c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg> ${t.title}</h2>
                <div class="window-controls">
                    <span class="ctrl-btn move-icon" title="${t.move}">✥</span>
                    <span id="btn-minimize" class="ctrl-btn" title="${t.minimize}">−</span>
                    <span id="btn-close" class="ctrl-btn close-btn" title="${t.close}">×</span>
                </div>
            </div>
            
            <div class="panel-content">
                <div class="stat-grid">
                    <div class="stat-card">
                        <div class="stat-label">${t.total}</div>
                        <div id="stat-total" class="stat-value">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">${t.done}</div>
                        <div id="stat-done" class="stat-value">0</div>
                    </div>
                </div>

                <div class="progress-container">
                    <div id="progress-bar"></div>
                </div>

                <div class="controls">
                    <button id="btn-start" class="btn btn-primary">${t.start}</button>
                    <button id="btn-pause" class="btn btn-secondary" disabled>${t.pause}</button>
                </div>

                <div class="settings">
                    <div style="font-size: 11px; margin-bottom: 5px;">${t.speed}</div>
                    <div class="speed-group">
                        <button class="btn btn-speed" data-speed="1500">${t.slow}</button>
                        <button class="btn btn-speed active" data-speed="800">${t.normal}</button>
                        <button class="btn btn-speed" data-speed="400">${t.fast}</button>
                        <button class="btn btn-speed" data-speed="200">${t.turbo}</button>
                    </div>
                </div>

                <div id="log-area" class="log-area">${t.ready}</div>
            </div>
        `;
        document.body.appendChild(panel);

        // Event Listeners
        document.getElementById('btn-start').addEventListener('click', startUnfollowing);
        document.getElementById('btn-pause').addEventListener('click', togglePause);
        document.getElementById('btn-close').addEventListener('click', () => panel.remove());
        document.getElementById('btn-minimize').addEventListener('click', toggleMinimize);

        // Hız Butonları Event Listeners
        const speedBtns = panel.querySelectorAll('.btn-speed');
        speedBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                speedBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                State.delay = parseInt(btn.getAttribute('data-speed'));
                log(`Hız: ${State.delay}ms`);
            });
        });

        // Sürüklenebilirlik ekle
        makeDraggable(panel);
    }

    /**
     * Paneli küçültür veya büyütür
     */
    function toggleMinimize() {
        State.isMinimized = !State.isMinimized;
        const panel = document.getElementById('reddit-unfollow-panel');
        const btn = document.getElementById('btn-minimize');

        if (State.isMinimized) {
            panel.classList.add('minimized');
            btn.innerText = '+';
        } else {
            panel.classList.remove('minimized');
            btn.innerText = '−';
        }
    }

    /**
     * Paneli sürüklenebilir hale getirir
     */
    function makeDraggable(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = el.querySelector('.panel-header');

        if (header) {
            header.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            // Butonlara tıklandığında sürükleme başlasın istemiyoruz
            if (e.target.classList.contains('ctrl-btn')) return;

            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            el.style.transition = 'none'; // Sürüklerken animasyonu kapat
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
            // bottom ve right değerlerini temizle ki serbestçe sürüklenebilsin
            el.style.bottom = 'auto';
            el.style.right = 'auto';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            el.style.transition = 'opacity 0.3s ease, height 0.3s ease, padding 0.3s ease';
        }
    }

    /**
     * Sayfadaki abonelikten çıkma butonlarını tarar
     */
    function scanButtons() {
        // Old Reddit: a.option.remove
        // New Reddit: button[aria-label^="Leave"] (Deneysel)
        const selectors = ['a.option.remove', 'button[aria-label^="Leave"]', 'button._2iu_pSqvOfvPoSj_SIs4S'];
        let found = [];

        selectors.forEach(selector => {
            const btns = Array.from(document.querySelectorAll(selector));
            found = [...found, ...btns];
        });

        // Duplicate'leri temizle (eğer bir buton birden fazla seçiciye takılırsa)
        State.buttons = Array.from(new Set(found));
        State.totalActions = State.buttons.length;

        updateUI();
        log(t.found.replace('{n}', State.totalActions));

        if (State.totalActions === 0) {
            log(t.notFound);
        }
    }

    /**
     * Arayüz Değerlerini Günceller
     */
    function updateUI() {
        document.getElementById('stat-total').innerText = State.totalActions;
        document.getElementById('stat-done').innerText = State.unsubscribedCount;

        const progress = State.totalActions > 0 ? (State.unsubscribedCount / State.totalActions) * 100 : 0;
        document.getElementById('progress-bar').style.width = `${progress}%`;
    }

    /**
     * Log Alanına Mesaj Yazdırır
     */
    function log(message) {
        const logArea = document.getElementById('log-area');
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        logArea.innerHTML = `[${time}] ${message}<br>` + logArea.innerHTML;
    }

    /**
     * İşlemi Başlatır
     */
    function startUnfollowing() {
        if (State.totalActions === 0) {
            alert(t.noButtons);
            return;
        }

        State.isPaused = false;
        document.getElementById('btn-start').disabled = true;
        document.getElementById('btn-pause').disabled = false;
        document.getElementById('btn-pause').innerText = t.pause;

        log(t.started);
        processNext();
    }

    /**
     * Duraklatma/Devam ettirme mantığı
     */
    function togglePause() {
        State.isPaused = !State.isPaused;
        const btn = document.getElementById('btn-pause');

        if (State.isPaused) {
            btn.innerText = t.resume;
            log(t.paused);
        } else {
            btn.innerText = t.pause;
            log(t.resumed);
            processNext();
        }
    }

    /**
     * Bir sonraki butona tıklar (Recursion)
     */
    async function processNext() {
        if (State.isPaused) return;

        if (State.currentIndex < State.totalActions) {
            const button = State.buttons[State.currentIndex];

            if (button && button.offsetParent !== null) {
                try {
                    button.click();
                    State.unsubscribedCount++;
                    log(t.success.replace('{s}', button.innerText || 'Subreddit'));
                } catch (e) {
                    log(t.error);
                }
            } else {
                log(t.skipped);
            }

            State.currentIndex++;
            updateUI();

            // Gecikme
            setTimeout(processNext, State.delay);
        } else {
            complete();
        }
    }

    /**
     * İşlem bittiğinde çağrılır
     */
    function complete() {
        log(t.completed);
        document.getElementById('btn-pause').disabled = true;

        setTimeout(() => {
            if (confirm(t.reloadConfirm)) {
                window.location.reload();
            }
        }, 1500);
    }

    // İlk Çalıştırma
    injectUI();
    // Sayfanın tamamen yüklenmesi için kısa bir bekleme
    setTimeout(scanButtons, 1000);

})();
