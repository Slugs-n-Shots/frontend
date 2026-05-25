# Backend URL integrációs terv

Frissítve: 2026-05-23

Források:
- Backend fejlesztési lista: `backend/.vscode/frontend-TODO.md`
- Backend route ellenőrzés: `backend/routes/guest.php`, `backend/routes/staff.php`
- Frontend stack: React, JavaScript, Vite, npm

## Cél

Az új és megváltozott backend API felületet kis, tesztelhető szeletekben kell hozzáadni a frontendhez.

A frontend már most realm alapján választ API base URL-t a `ConfigContext`-ben:
- public/guest oldalak: `/api/guest/`
- admin/staff oldalak: `/api/staff/`

A legtöbb komponens relatív endpointokat hív az `ApiContext`-en keresztül, például `get("me")` vagy `post("/orders", ...)`. Az integrációnál ezt a mintát érdemes megtartani, de az új endpoint neveket annyira központosítani kell, hogy a backend URL változások könnyebben követhetők legyenek.

## Jelenlegi frontend szerkezet

Fontos meglévő fájlok:
- `src/contexts/ApiContext.jsx`: axios wrapper, token hozzáadása, refresh kezelés
- `src/contexts/ConfigContext.jsx`: realm és base URL választás
- `src/contexts/UserContext.jsx`: login/logout állapot realmenként
- `src/contexts/CartContext.jsx`: menü betöltése és guest rendelésleadás
- `src/components/common/Profile.jsx`: jelenlegi guest/staff profilnézet
- `src/components/public/ShoppingCart.jsx`: rendelésleadási belépési pont
- `src/components/public/Orders.jsx`: jelenlegi guest rendeléslista
- `src/routes/publicRoutes.js`: guest útvonalak
- `src/routes/adminRoutes.js`: staff/admin útvonalak

## Javasolt integrációs sorrend

### 1. fázis: API inventory és endpoint konstansok

Feature UI munka előtt készüljön egy kicsi API endpoint inventory.

Javasolt fájlok:
- `src/api/guestEndpoints.js`
- `src/api/staffEndpoints.js`
- `src/api/index.js`

Maradjon egyszerű JavaScript:

```js
export const guestEndpoints = {
  me: "me",
  profilePicture: "me/picture",
  anonymizeCheck: "me/anonymize/check",
  anonymize: "me/anonymize",
  dataExport: "me/export",
  orders: "orders",
  activeOrders: "orders/active",
  availableTables: "tables/available",
  currentTable: "tables/current",
  currentTableStats: "tables/current/stats",
  tableSpendingLimit: "tables/current/spending-limit",
  closeCurrentTable: "tables/current/close",
  joinTable: "tables/join",
  tableMembers: "tables/current/members",
  ownPayment: "payments",
  tablePayment: "tables/current/payments",
  closingPayment: "tables/current/closing-payment",
  receipt: (receipt) => `receipts/${receipt}`,
};
```

A staff endpointokat külön staff inventory fájlba érdemes felvenni, amikor a staff szelet elkezdődik.

Miért:
- kevesebb szétszórt string változás
- megtartja a meglévő `ApiContext` és realm működést
- nem hoz be generált klienst vagy új függőséget

Ellenőrzés:
- csak akkor kell külön endpoint unit teszt, ha a helper függvények nem triviálisak
- egyébként feature teszteken keresztül érdemes ellenőrizni

### 2. fázis: Profil, compliance, GDPR

Hatókör:
- guest profiladatok megjelenítésének frissítése
- profilkép feltöltés/törlés
- GDPR anonimizálási előellenőrzés és anonimizálási folyamat
- saját adat export
- 18+ regisztrációs követelmény

Backend endpointok:
- `GET me`
- `POST me`
- `POST me/picture`
- `DELETE me/picture`
- `GET me/anonymize/check`
- `POST me/anonymize`
- `GET me/export`

Érintett frontend területek:
- `src/components/common/Profile.jsx`
- `src/components/public/Register.jsx`
- `src/contexts/UserContext.jsx`
- opcionálisan `src/contexts/ProfileContext.jsx`, vagy használaton kívüliség ellenőrzése után cserélni/törölni
- `src/lang/hu.js` az új UI címkékhez

Implementációs jegyzetek:
- A profiloldal maradjon használható guest és staff módban is, amíg nincs szándékosan szétválasztva.
- Guest-only GDPR UI ne jelenjen meg staff profil módban.
- Multipart form data csak a `me/picture` híváshoz kell; a profilmezők maradjanak normál JSON hívások.
- Sikeres anonimizálás után törölni kell a guest auth/user állapotot, és biztonságos publikus route-ra kell irányítani.
- Adat exportnál böngészős JSON blob letöltést érdemes készíteni.

Edge case-ek:
- `can_anonymize = false`: jelenjenek meg a tiltó okok, és a végleges destruktív művelet ne legyen aktív.
- anonimizált felhasználóknál PII mezők üresek lehetnek.
- az export tartalmazhat számviteli megőrzés alá eső adatokat, ezért nem szabad console-ba/logba írni.

Hasznos tesztek:
- a profil megjeleníti az új compliance mezőket
- anonimizálási check tiltja/engedi a destruktív akciót
- sikeres anonimizálás logout/cleanup műveletet hív
- export letölthető JSON blobot hoz létre
- regisztrációhoz kötelező az `is_over_18`

### 3. fázis: Rendelésleadási fizetési mód

Hatókör:
- rendelésleadási mód hozzáadása a kosárhoz
- személyenkénti fogyasztási limit konfliktus kezelése
- pay-now út előkészítése anélkül, hogy nem megerősített backend működést találnánk ki

Backend endpoint:
- `POST orders`

Elvárt viselkedés:
- az alapértelmezett flow tartsa meg a jelenlegi rendelésleadást, hacsak a backend szerződés nem ír elő új defaultot
- UI választó csak akkor kerüljön be, ha a backend megerősíti a request mező nevét, értékeit és hibaeseteit
- ha a `409` válaszban `code=per_guest_spending_limit_exceeded` és `recommended_action=pay_now` jön, a UI mutasson világos folytatási lehetőséget

Érintett frontend területek:
- `src/contexts/CartContext.jsx`
- `src/components/public/ShoppingCart.jsx`
- esetleg új kicsi payment mode komponens `src/components/public/orders/` alatt

Nyitott backend szerződés kérdések:
- pontos request mező: `payment_mode` vagy más
- megengedett értékek: `add_to_table`, `pay_now`
- sikertelen pay-now esetén létrejön-e order, payment attempt, mindkettő vagy egyik sem
- payment attempt response shape

Hasznos tesztek:
- a kosár default esetben a meglévő payloadot küldi
- választott fizetési módnál bekerül a payment mode mező
- `409` recommended pay-now válasz láthatóvá válik, és nem üríti a kosarat

### 4. fázis: Guest asztalélmény

Hatókör:
- szabad asztalok listája
- asztal foglalása vagy csatlakozás GUID/QR érték alapján
- aktuális asztal nézet
- tulajdonosi tagkezelés
- tulajdonosi fogyasztási limit
- asztalzárás

Backend endpointok:
- `GET tables/available`
- `POST tables/claim`
- `POST tables/join`
- `GET tables/current`
- `GET tables/current/stats`
- `GET tables/current/members`
- `POST tables/current/spending-limit`
- `POST tables/current/close`
- `POST tables/members/{member}/approve`
- `POST tables/members/{member}/reject`
- `POST tables/members/{member}/toggle-ordering`
- `DELETE tables/members/{member}`

Javasolt route-ok:
- `/tables`
- `/tables/current`
- `/tables/join/:guid?`

Érintett frontend területek:
- `src/routes/publicRoutes.js`
- új komponensek `src/components/public/tables/` alatt
- kicsi `TableContext` csak akkor, ha több asztalos képernyő közös állapotot igényel

Implementációs jegyzetek:
- Tulajdonosi akciók legyenek elrejtve vagy tiltva, ha az aktuális user nem asztalfelelős.
- Az effektív limit külön jelenjen meg az owner limittől és staff override-tól.
- Legyen tiszta állapotkezelés: nincs asztal, pending tagság, aktív tag, owner, lezárt asztal.

Edge case-ek:
- foglalt asztal claim conflictet adhat
- asztalzárás 409-et adhat, ha maradt fizetetlen tétel
- tag toggle után a látható állapot maradjon konzisztens

Hasznos tesztek:
- nincs aktuális asztal állapot
- aktuális asztal owner állapot
- 409 close conflict fizetetlen tételeket jelez
- owner spending-limit form helyesen küld `null` és nemnegatív egész értékeket

### 5. fázis: Guest fizetések és nyugták

Hatókör:
- saját pending order detail kiválasztás
- asztal pending detail kiválasztás
- záró fizetés minden fennmaradó tételre
- payer/számviteli adat űrlap
- nyugta részletező nézet

Backend endpointok:
- `POST payments`
- `POST tables/current/payments`
- `POST tables/current/closing-payment`
- `GET receipts/{receipt}`

Javasolt route-ok:
- `/payments/new`
- `/tables/current/payment`
- `/tables/current/closing-payment`
- `/receipts/:receipt`

Érintett frontend területek:
- `src/components/public/Orders.jsx`
- új komponensek `src/components/public/payments/` alatt
- új komponensek `src/components/public/receipts/` alatt
- `src/routes/publicRoutes.js`

Implementációs jegyzetek:
- A UI ne jelöljön tételt fizetettnek, mielőtt a backend sikerrel visszaigazolja.
- Sikertelen vagy félbehagyott fizetés után a tételek maradjanak pending állapotban.
- A nyugta számviteli snapshot GDPR anonimizálás után is megmaradhat; ezt nyugta/vevő adatként kell címkézni, nem szerkeszthető profiladatként.
- PDF/e-mail nyugta UI csak akkor kerüljön be, ha a backend endpointok léteznek.

Hasznos tesztek:
- saját fizetés payload tartalmazza a kiválasztott order detail ID-ket
- záró fizetés minden jogosult fennmaradó tételt kiválaszt
- payer form megőrzi az opcionális mezőket
- nyugta route megjeleníti a számviteli snapshot mezőket

### 6. fázis: Staff/admin asztalok, rendelések, fizetettnek jelölés

Hatókör:
- admin asztal CRUD
- GUID regenerálás
- staff fogyasztási limit override
- staff rendelésrögzítés guest/table session részére
- staff mark-paid workflow
- meglévő rendelés státusz képernyők összevetése a backend szerződéssel

Backend endpointok:
- `GET/POST/PUT/PATCH/DELETE tables`
- `POST tables/{table}/regenerate-guid`
- `POST table-sessions/{tableSession}/spending-limit`
- `POST orders`
- `POST order-details/mark-paid`
- meglévő staff rendelés endpointok: `orders/active`, `orders/waiting`, `orders/my-tasks`, assign/done endpointok

Érintett frontend területek:
- `src/components/admin/masters/*`
- `src/components/admin/WaitingOrders.jsx`
- `src/components/admin/MyTasks.jsx`
- `src/routes/adminRoutes.js`
- új admin table/session képernyők, ha a generikus master table nem elég

Implementációs jegyzetek:
- A mark-paid magas kockázatú pénzügyi/számviteli UI.
- Ha a UI-ból megállapítható, submit előtt ellenőrizze, hogy a kiválasztott order detail sorok egy vendéghez tartoznak-e.
- Backend `409`/`403` üzenetek jelenjenek meg, audit szempontból fontos hibákat ne nyeljen el a UI.
- Generikus CRUD képernyő ne legyen az egyetlen felület üzleti workflow-khoz, például mark-paid művelethez.

Hasznos tesztek:
- GUID regenerálás tiltott vagy conflict-kezelt foglalt asztalnál
- staff limit override megjeleníti az owner, staff és effektív értékeket
- mark-paid elküldi a kiválasztott detail ID-ket és a szükséges payer/payment metaadatokat

### 7. fázis: Riportok

Hatókör:
- riportlista
- szűrők
- queue státusz megjelenítés
- CSV letöltés

Backend állapot:
- későbbi backend fejlesztési kör

Implementációs jegyzetek:
- UI csak akkor készüljön, ha az endpoint nevek és response shape-ek megerősítettek.
- Route placeholder csak akkor kerüljön be, ha a termék navigációja igényli.

## Keresztmetszeti API kezelés

Minden szeletnél ezeket kell hozzáadni vagy megőrizni:

- `useEffect` adatbetöltéseknél `AbortController` használata.
- Meglévő `ApiContext` hibakezelési és message minták megőrzése.
- `401` refresh viselkedés maradjon realm-aware.
- `409` konfliktusok explicit kezelése table/payment/GDPR flow-kban.
- Sikertelen order/payment hívás után ne ürüljön a kosár vagy lokális állapot.
- PII, token, fizetési adat, payer adat vagy teljes export payload ne kerüljön logba.

## Javasolt dokumentációs bontás

Ez a dokumentum maradhat áttekintő terv. Amikor egy-egy munka elkezdődik, készüljön fókuszáltabb terv:

- `frontend/docs/01-api-endpoint-inventory-plan.md`
- `frontend/docs/02-profile-gdpr-plan.md`
- `frontend/docs/04-table-flow-plan.md`
- `frontend/docs/05-payment-receipt-plan.md`
- `frontend/docs/06-staff-admin-workflow-plan.md`

Minden fókuszált dokumentum tartalmazza:
- használt backend endpointok
- request/response feltételezések
- érintett frontend fájlok
- hozzáadandó vagy módosítandó route-ok
- UX állapotok
- ellenőrzési lista

## Javasolt első szelet

Kezdés: 1. és 2. fázis.

1. `src/api/guestEndpoints.js`, `src/api/staffEndpoints.js` és `src/api/index.js` hozzáadása a guest profil/GDPR endpointokhoz.
2. `Profile.jsx` frissítése a backend compliance mezők megjelenítésére.
3. Profilkép feltöltés/törlés hozzáadása.
4. Anonimizálási check és megerősített anonimizálás hozzáadása.
5. Adat export hozzáadása.
6. Fókuszált tesztek a profil/GDPR viselkedésekre.

Ez a szelet önmagában is értékes, nem igényel fizetési UI döntéseket, és korlátozott hatókörrel használja az új vagy megváltozott guest URL-eket.

## Ellenőrzési parancsok

Repo rootból a Docker használata javasolt:

```bash
docker compose exec -T node npm run test -- src/path/file.test.jsx
docker compose exec -T node npm run test
docker compose exec -T node npm run build
```

Nagyobb route, API vagy context változtatások merge előtt fusson production build ellenőrzés.
