# Reddit Unfollow All - Roadmap

Projenin teknik gelişim süreci ve gelecek planlarını içeren yol haritasıdır.

## Phase 1: Core Automation (Completed)
- [x] Temel otomasyon mantığının (DOM manipülasyonu) kurulması.
- [x] Reddit hız limitlerini (rate-limit) aşmamak için statik gecikme eklenmesi.
- [x] "Old Reddit" seçicilerinin (selectors) tanımlanması.

## Phase 2: Modernization & UX (Completed)
- [x] ES6+ standartlarında modüler kod yapısına geçiş.
- [x] Glassmorphism bazlı modern bir UI katmanı entegre edilmesi.
- [x] Panel başlığından sürüklenebilirlik özelliği (Draggable UI).
- [x] Progress bar ve anlık durum sayaçlarının eklenmesi.
- [x] Hız seçimi için ön tanımlı butonların (Yavaş - Turbo) eklenmesi.

## Phase 3: Technical Reliability (Completed)
- [x] Pencere kontrolleri (Minimize, Close) entegrasyonu.
- [x] Çok dilli destek (i18n) - Otomatik dil algılama (TR/EN).
- [x] "Modern Reddit" seçici desteğinin güçlendirilmesi.
- [x] Fail-fast hata yönetimi ve görünürlük kontrolleri.

## Phase 4: Future & Optimization (Planned)
- [ ] **Custom Selector Engine**: Kullanıcının özel DOM seçicileri tanımlayabilmesi.
- [ ] **Local Storage Persistence**: Panel konumu ve son seçilen hız ayarının kaydedilmesi.
- [ ] **Statistics Dashboard**: İşlem sonunda detaylı başarı/hata istatistiklerinin gösterilmesi.
- [ ] **Export Feature**: Çıkılan subreddit isimlerinin CSV/JSON olarak dışa aktarılması.
