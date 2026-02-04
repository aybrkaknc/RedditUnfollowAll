# Reddit Unfollow All - Implementation Summary

Bu döküman, projenin teknik mimarisini ve uygulama kararlarını özetler.

## Teknik Mimari

### 1. State Management
Uygulama, tüm durumunu tek bir `State` objesi üzerinden yönetir.
- `isPaused`: Duraklatma kontrolü.
- `currentIndex`: İşlem sırası.
- `delay`: İstekler arası gecikme süresi.
- `buttons`: DOM üzerinde taranan aktif buton listesi.

### 2. UI Enjeksiyon Sistemi
`injectUI()` fonksiyonu, CSS'i bir `<style>` etiketi olarak kafaya (head) ekler ve ana panel yapısını gövdeye (body) enjekte eder.
- **Tasarım**: Modern blur efekti (backdrop-filter) ve yarı saydam arka planlar kullanılmıştır.
- **Responsive**: Panel, minimize edildiğinde dikeyde daralarak yer kaplamaz hale gelir.

### 3. Otomasyon Döngüsü (Throttling)
Recursion (özyineleme) bazlı bir döngü yapısı kullanılmıştır (`processNext`).
- Her işlemden sonra `State.delay` kadar beklenir.
- Butonun DOM'da gerçekten var ve görünüyor olduğu (`offsetParent`) tıklama öncesi doğrulanır.

### 4. Internationalization (i18n)
`I18N` objesi üzerinden tüm UI metinleri yönetilir. `navigator.language` üzerinden çalışma anında dil seçimi yapılır.

## Kullanılan Teknolojiler
- **Vanila JS (ES6+)**: Bağımlılıksız çalışma için.
- **SVG**: Vektörel ikon desteği için.
- **CSS3 Variables & Backdrop Filters**: Tasarım derinliği için.
