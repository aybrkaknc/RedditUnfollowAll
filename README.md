https://github.com/aybrkaknc/RedditUnfollowAllhttps://github.com/aybrkaknc/RedditUnfollowAll# Reddit Unfollow All

[English](#english) | [Türkçe](#türkçe)

---

## English

A JavaScript userscript that automates the unsubscription process from Reddit subreddits. It provides a non-intrusive UI overlay to manage mass actions while respecting platform rate limits.

### Technical Features

- **UI Overlay**: Draggable interface with window controls (Minimize, Close) for custom positioning.
- **Throttling Control**: Preset execution intervals (200ms to 1500ms) to prevent API rate-limiting.
- **State Management**: Displays total/remaining counts and an execution log within the overlay.
- **I18n Engine**: Automatic browser language detection (supports EN and TR).
- **Selector Engine**: Compatible with both legacy (`old.reddit.com`) and modern Reddit DOM structures.

### Installation & Usage

1. **Userscript Manager**: Ensure a manager like [Tampermonkey](https://www.tampermonkey.net/) is installed in your browser.
2. **Setup**: Create a new script in your manager and paste the contents of `betik.js`.
3. **Execution**: Navigate to [https://www.reddit.com/subreddits/](https://www.reddit.com/subreddits/).
4. **Operation**: Use the "START" button on the UI panel to initiate the process. The panel can be repositioned via dragging the header.

### Technical Notes

This script performs batch DOM interactions. It is recommended to use "Normal" or "Slow" presets for large subscription lists to ensure request stability.

---

## Türkçe

Reddit üzerindeki alt dizin (subreddit) aboneliklerinden çıkma işlemini otomatize eden bir JavaScript kullanıcı betiğidir. Platformun hız limitlerini (rate-limit) gözeterek çalışan ve süreci takip etmeyi kolaylaştıran bir arayüz sunar.

### Teknik Özellikler

- **UI Katmanı**: Sürüklenebilir ve pencere kontrollerine (Küçült, Kapat) sahip kontrol paneli.
- **Throttling (Hız Sınırı)**: API limitlerine takılmamak için ön tanımlı gecikme süreleri (200ms - 1500ms).
- **Durum Takibi**: Panel üzerinden toplam/kalan işlem sayısı ve anlık log kaydı.
- **Dil Desteği (i18n)**: Tarayıcı dilini otomatik algılama (TR ve EN).
- **DOM Uyumluluğu**: Eski (`old.reddit.com`) ve modern Reddit arayüzleri için seçici desteği.

### Kurulum ve Kullanım

1. **Script Yöneticisi**: Tarayıcınızda [Tampermonkey](https://www.tampermonkey.net/) benzeri bir eklenti kurulu olduğundan emin olun.
2. **Kurulum**: Yeni bir betik oluşturun ve `betik.js` içeriğini yapıştırın.
3. **Çalıştırma**: [https://www.reddit.com/subreddits/](https://www.reddit.com/subreddits/) sayfasına gidin.
4. **Yönetim**: Panel üzerindeki "BAŞLAT" butonu ile süreci başlatın. Panel başlığından tutularak ekranın herhangi bir yerine sürüklenebilir.

### Önemli Notlar

Betik, toplu DOM etkileşimi üzerinden çalışmaktadır. Büyük listelerde stabiliteyi korumak amacıyla "Normal" veya "Yavaş" hız seçeneklerinin kullanılması önerilir.
