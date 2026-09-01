# Reverse Solver

Bir yapbozu **sökme** oyunu. Tahta yapboz karolarıyla dolu; her parçayı doğru
yönde sürükleyip çıkararak tahtayı boşaltıyorsun.

**Oyna:** https://zeydusht.github.io/reverse-solver/

Tek HTML dosyası. Derleme adımı, bağımlılık, dış istek yok. Telefonda anında açılır.

---

## Kural

Her parça gerçek bir yapboz karosu: dört kenarında ya **çıkıntı**, ya
**girinti**, ya da **düz** bir kenar var.

Bir parça, şu iki koşul birlikte sağlanırsa o yöne sürüklenip çıkarılabilir:

1. Gittiği yöndeki hücreler boş, **ve**
2. Yol boyunca hiçbir noktada, gidiş eksenine **dik** kenarlarında bir şeye
   takılmıyor.

İki kenar birbirine takar — ancak ikisi de düz veya girintili değilse.
Çıkıntı her zaman takar.

Bu yüzden şekil kuralı kendi anlatıyor: **tokmak görüyorsan o çift kilitli,
düz dikiş görüyorsan sıyrılıp geçer.**

## Engeller

| Engel | Ne yapar |
|---|---|
| **Sayılı çivi** | Parça çakılı. Her hamlede sayaç bir azalır, sıfırda serbest kalır |
| **Zincirli çift** | Tahtanın iki ucundaki iki parça tek gövde. İkisinin de aynı anda aynı yöne yolu açık olmalı |
| **Bombalı parça** | Fitil her hamlede azalır. Sıfırda bölüm biter |
| **Mühürlü kenar** | Kenardaki kırmızı şerit duvardır, o hizadaki parçalar o yönden çıkamaz |

Dört booster bunlara doğrudan karşılık gelir: makas bir eklemi keserek düz
yapar, değnek çıkıntıların hangi tarafta olduğunu yeniden karar, çekiç bir
parçayı kilitlerine bakmadan söker, saat geri sayıma 20 saniye ekler.

---

## Zorluk nasıl kontrol ediliyor

Bu reponun asıl içeriği level listesi değil, **ölçülebilir bir zorluk
sistemi.**

Kural monoton: bir parçayı çıkarmak asla başka bir parçayı kilitlemez, tahta
yalnızca boşalır. Yani yanlış sıra diye bir şey yok. Zorluk planlamadan değil
**aramadan** geliyor: şu an çıkabilen parçayı bulana kadar kaç parça okumam
gerekiyor?

Ölçüm buradan çıkıyor:

```
okuma yükü  = Σ (kalan parça + 1) / (oynanabilir parça + 1)
tahmini süre = yük / 1.4 + gövde sayısı × 0.8
süre limiti  = tahmini süre × pay
```

40 levelin her biri bir hedef yük değerine göre üretildi: üreteç 19 farklı
ayar × birkaç tohum deneyip hedefe en yakınını seçiyor. Hepsi hedefine ±3
içinde oturuyor.

**İki bağımsız kol var** ve bunları ayrı tutmak, geri bildirimde hangisinin
suçlu olduğunu ayırt etmek için şart:

- **Yük** — bulmacanın kendi zorluğu
- **Pay** — saatin cömertliği (`süre / tahmini süre`). 2.10 rahat, 1.12 nefes aldırmaz

### Ölçülmüş kollar

6×6 tahtada, engelsiz temel duruma göre:

| Kol | Aralık | Yüke etkisi |
|---|---|---|
| Açık eklem oranı | %80 → %0 | 56 → 116 |
| Tahta boyutu | 4×4 → 8×8 | 28 → 229 |
| Mühürlü kenar | 0 → 2 | 88 → 113 |
| Uzak zincir | 0 → 2 | 87 → 99 |
| Sayılı çivi | 0 → 3 | 88 → 93 |
| ~~Sabit çivi~~ | 0 → 6 | 88 → **68** |
| ~~Komşu zincir~~ | 0 → 3 | 87 → **75** |

Son iki satır ölçümden çıkan sürprizdi ve tasarımı değiştirdi.

**Sabit çivi ve yan yana zincir oyunu kolaylaştırıyor**, çünkü oynanabilir
parça sayısını düşürüyorlar. Zinciri komşu iki parçaya değil **tahtanın iki
ucundaki** parçalara takınca işaret tersine döndü: ikisinin de aynı anda aynı
yöne koridoru açık olmak zorunda kaldığı için yük %14 arttı. Oyunda uzak
zincir kullanılıyor, komşu zincir kullanılmıyor.

**Tahta boyutu zorlaştırmıyor, uzatıyor.** 7×7 ve 8×8 denemelerinde tahmini
süreler 7 dakikaya dayandı; karar başına zorluk aynıydı, sadece daha çok
tekrar vardı. Casual bir oyunda 7 dakikalık level, kaybetme maliyetini
katlanılmaz yapıyor. Tahta 6×7 ile sınırlandı ve zorluk sıkılıktan alınıyor.

### Çivi sayacının güvenli sınırı

Sayaç hamleyle azalıyor. Geriye kalan her parça çiviliyse oyuncu hamle
yapamaz, hamle yapamayınca sayaç inmez ve tahta donar. Üç tahta boyutunda
tarandı:

| Sayaç / parça oranı | Donma |
|---|---|
| %20–40 | %0 |
| %50 | %0–2 |
| %60 | %2–7 |

Sınır **%40**. Üstüne bir emniyet supabı var: oynanabilir hiçbir parça
kalmazsa en uzun bekleyen çivi kendiliğinden sökülür. Sınır içinde hiç
çalışmıyor, sadece ağ görevi görüyor.

### Bomba fitili

Fitil oyuncunun gördüğü sayı, ve **15 civarında sabit**. Bomba, ona doğrudan
gitmenin 6–11 hamle sürdüğü bir parçaya konuyor.

İlk denemede fitil, hedef parçaya ulaşma süresinin katı olarak
hesaplanıyordu ve 30–60 arası çıkıyordu. 36 parçalık bir tahtada 30 hamlelik
fitil baskı değildir: normal oynayışta bombaya zaten varılır. Şimdi ulaşılamaz
bir bombaya denk gelirse fitil uzatılmıyor, **daha ulaşılabilir bir parça
seçiliyor.**

---

## Bölümler

| Bölüm | Leveller | Yeni engel | Yük aralığı |
|---|---|---|---|
| 1 | 1–10 | Sayılı çivi (5) | 26 → 100 |
| 2 | 11–20 | Uzak zincir (11) | 55 → 152 |
| 3 | 21–30 | Bomba (21) | 65 → 170 |
| 4 | 31–40 | Mühürlü kenar (31) | 75 → 235 |

Her bölüm beşerli iki yay halinde tırmanıyor. Tanıtım levelleri (5, 11, 21,
31) yeni engeli tek başına, bol açık eklemle ve iki kattan fazla süre payıyla
veriyor. Nefes levelleri (18, 25, 36) çok zor levellerin hemen ardında,
bırakma riskini düşürmek için.

## Üretim garantileri

Hiçbir level elle yapılmadı ve hiçbiri doğrulanmadan yayına girmedi.

Leveller dolu tahtayı **soyarak** üretiliyor: koridoru boş bir gövde seçiliyor,
hamle kaydediliyor, sadece o hamlenin sıyırmak zorunda olduğu eklemler
açılıyor. Gerisi kilitli kalıyor. Sonuç yapı gereği çözülebilir oluyor.

Her level, yayına girmeden önce oyunun kendi kuralıyla baştan sona oynatılıyor:

- Kayıtlı çözüm tahtayı boşaltıyor: 40/40
- Çivi, zincir, bomba ve mühürle birlikte oynanabiliyor: 40/40
- Patlayan bomba: 0
- Donma: 0, emniyet supabı hiç tetiklenmedi

## Playtest verisi

Oyun her denemeyi kaydediyor: hangi level, kaçıncı deneme, süre, sonuç
(kazandı / süre doldu / bomba patladı / bıraktı), kalan süre, kaç kez takıldı,
hangi booster kaç kez kullanıldı.

`index.html` içindeki `SUPABASE_URL` ve `SUPABASE_KEY` doldurulunca sonuçlar
otomatik gönderiliyor. Gönderilemeyen satır cihazda kuyruğa alınıp bir sonraki
denemede veya oyun tekrar açıldığında yollanıyor, yani bağlantı koptuğunda
playtest kaybolmuyor.

`panel.html` bu veriyi level bazında özetliyor: geçme oranı, oyuncu başına
deneme sayısı, medyan süre, saatte kalan süre, takılma sayısı, başarısızlık
sebebi dağılımı ve booster kullanımı. Geçme oranı %50 altındaki ya da 2.5'tan
fazla deneme isteyen leveller kırmızı işaretleniyor.

Panelin asıl grafiği şu: **üretecin öngördüğü okuma yükü, oyuncuların gerçek
süresiyle uyuşuyor mu.** Noktalar bir doğruya yaklaşıyorsa formül tutuyor
demektir; dağılıyorsa model yanlıştır. Doğrunun eğimi doğrudan "oyuncu
saniyede kaç parça okuyor" sayısını veriyor — tabloda varsayılan 1.4 idi ve
gerçek veriyle değiştirilecek. Aynı şey sürükleme maliyeti için de geçerli.

Kısacası toplanan veri, 40 levelin süre limitlerini üreten formülü tahminden
ölçüme çevirmek için.
