# 02. fázis: Profil, compliance és GDPR frontend terv

Frissítve: 2026-05-25

Kapcsolódó áttekintő terv:
- `frontend/docs/backend-url-integration-plan.md`

Risk tier:
- Tier 2, mert auth állapotot, személyes adatokat, GDPR exportot/anonimizálást és fájlfeltöltést érint.

## Cél

A 2. fázis célja, hogy a guest profil és regisztráció kezelje a backend új compliance/GDPR mezőit és endpointjait:

- compliance mezők megjelenítése a profilban
- 18+ elfogadás a regisztrációban
- opcionális telefon/cím/születési dátum regisztrációkor
- profilkép feltöltés/törlés
- anonimizálási előellenőrzés
- megerősített anonimizálás és kijelentkeztetés
- saját adat export JSON letöltésként

Nem cél ebben a szeletben:
- fizetés, nyugta, asztal és order workflow UI
- staff guest delete/anonymize UI
- privacy policy teljes szövegének kidolgozása
- backend módosítás

## Backend szerződés

Guest profil:
- `GET me`
- `POST me`
- `POST me/picture`
- `DELETE me/picture`

GDPR:
- `GET me/anonymize/check`
- `POST me/anonymize`
- `GET me/export`

Regisztráció:
- `POST register`

Fontos mezők:
- `is_over_18`
- `age_verified_at`
- `birth_date`
- `phone`
- `address`
- `anonymized_at`
- `picture`

Regisztrációs backend validáció:
- `first_name`: required string max 255
- `middle_name`: optional string max 255
- `last_name`: required string max 255
- `email`: required lowercase email max 255 unique
- `password`: required, backend default password rule
- `is_over_18`: required accepted
- `phone`: nullable string max 32
- `address`: nullable string max 255
- `birth_date`: nullable date, today vagy korábbi

Profilfrissítés backend validáció:
- `first_name`, `middle_name`, `last_name`, `picture`
- `email`, `active`, `password` prohibited
- jelenlegi backend alapján `phone`, `address`, `birth_date`, `is_over_18` nem frissíthető `POST me` hívással

Profilkép feltöltés:
- multipart `picture`
- elfogadott típusok: `jpg`, `jpeg`, `png`, `webp`
- méret: backend config szerint alapértelmezetten 2048 KB
- válasz: frissített `Guest`

Anonimizálási check válasz:

```json
{
  "can_anonymize": false,
  "blocking_reasons": [
    {
      "code": "pending_payment",
      "message": "You have order items waiting for payment."
    }
  ]
}
```

Anonimizálási kérés:

```json
{
  "confirm": true
}
```

Sikeres anonimizálás:
- backend kijelentkezteti/invalidate-eli a tokent
- válasz: `{ "message": "The account has been anonymized." }`
- frontend oldalon törölni kell a guest realm local state-et

Adat export:
- `GET me/export`
- JSON válasz: `exported_at`, `guest`, `orders`, `receipts`, `payment_attempts`, `recent_drinks`, `gdpr_audit_events`
- a payload érzékeny adatokat tartalmazhat, ezért nem kerülhet logba

## Érintett frontend fájlok

Várhatóan módosul:
- `src/api/guestEndpoints.js`
- `src/api/staffEndpoints.js`
- `src/api/index.js`
- `src/components/common/Profile.jsx`
- `src/components/public/Register.jsx`
- `src/lang/hu.js`

Lehetséges módosítás:
- `src/contexts/UserContext.jsx`
- `src/contexts/ProfileContext.jsx`
- `src/components/common/Profile.test.jsx` új fájl
- `src/components/public/Register.test.jsx` új fájl

Meglévő kontextus:
- `ApiContext` adja a relatív API hívásokat
- `ConfigContext` kezeli a guest/staff realmet és `cleanupConfig()` műveletet
- `UserContext.logout()` már `cleanupConfig()`-ot hív

## Javasolt implementációs sorrend

### 1. Endpoint inventory

Hozzunk létre egy egyszerű endpoint konstans fájlt:

```js
export const guestEndpoints = {
  me: "me",
  profilePicture: "me/picture",
  anonymizeCheck: "me/anonymize/check",
  anonymize: "me/anonymize",
  dataExport: "me/export",
  register: "register",
};
```

Az 1. fázis endpoint inventoryja már elkészült; ebben a fázisban az új hívások is azon keresztül menjenek.

### 2. Profil adatmegjelenítés

`Profile.jsx` jelenleg a `user` contextből indul, és több új mezőt nem jelenít meg.

Javasolt viselkedés:
- mountkor `GET me`
- loading állapot
- sikertelen betöltésnél meglévő message pattern
- guest profilnál jelenjen meg:
  - név
  - email
  - telefon
  - cím
  - születési dátum
  - 18+ állapot
  - életkor ellenőrzés ideje
  - anonimizálás ideje, ha van
  - profilkép állapot
- staff profilnál ne jelenjen meg guest-only GDPR blokk

Fontos javítás:
- a jelenlegi kódban `displayUser.adress` szerepel; backend mező `address`.

### 3. Profilkép feltöltés/törlés

Javasolt UI:
- file input `image/jpeg`, `image/png`, `image/webp`
- feltöltés gomb vagy automatikus feltöltés kiválasztás után
- törlés gomb csak akkor, ha van `picture`
- feltöltés alatt disabled állapot
- siker után `displayUser` frissítése a backend válaszból

API:
- `POST me/picture` multipart `FormData`
- `DELETE me/picture`

Frontend validáció:
- fájl kiválasztása kötelező
- kliens oldali méretkorlát 2 MB körül, a backend alapértelmezéshez igazítva
- MIME típus előszűrés csak UX segítség, a backend validáció marad authoritative

### 4. GDPR anonimizálási blokk

Javasolt UI állapotok:
- check betöltése
- anonimizálható
- blokkolt, blocking reason lista
- megerősítés szükséges
- folyamatban
- sikeres anonimizálás
- hiba

Viselkedés:
- `GET me/anonymize/check` a GDPR blokk megnyitásakor vagy profil betöltés után
- ha `can_anonymize = false`, a végleges gomb disabled
- ha `can_anonymize = true`, a usernek külön meg kell erősítenie a visszafordíthatatlan műveletet
- `POST me/anonymize` csak `{ confirm: true }` payloaddal
- siker után:
  - message megjelenítése
  - `logout()` vagy `cleanupConfig()` meghívása
  - navigáció `/login` vagy `/` route-ra

Nem szabad:
- anonimizálási payloadot vagy export payloadot console-ba írni
- automatikusan anonimizálni egyetlen kattintásra megerősítés nélkül

### 5. Saját adat export

Javasolt UI:
- "Saját adatok exportálása" gomb
- letöltési folyamat alatt disabled állapot
- siker/hiba message

Viselkedés:
- `GET me/export`
- a kapott JSON-ból Blob letöltés
- javasolt fájlnév: `slugs-n-shots-data-export-YYYY-MM-DD.json`
- ne legyen előnézet és ne kerüljön console logba

### 6. Regisztráció compliance mezők

`Register.jsx` jelenleg nem küld `is_over_18` mezőt.

Javasolt új mezők:
- kötelező checkbox: `is_over_18`
- opcionális `birth_date`
- opcionális `phone`
- opcionális `address`

Payload:

```js
{
  first_name,
  last_name,
  email,
  password,
  is_over_18: true,
  birth_date,
  phone,
  address,
}
```

Megjegyzés:
- `middle_name` frontend jelenleg nincs a formban, nem kötelező az 1. szelethez.
- üres opcionális mezőket lehet `null`-ként vagy kihagyva küldeni; ezt el kell dönteni.

### 7. Fordítások

Új kulcsok várhatóan:
- `I confirm that I am over 18 years old`
- `Birth date`
- `Phone number`
- `Address`
- `Profile picture`
- `Upload profile picture`
- `Delete profile picture`
- `Data protection`
- `Check anonymization`
- `Anonymize my account`
- `Download my data`
- `This action cannot be undone`
- `Anonymization is currently blocked`
- `Your account has been anonymized`

## Tesztterv

### Profile

Új vagy frissített tesztek:
- betölti és megjeleníti a `GET me` válasz compliance mezőit
- `address` mezőt használ, nem `adress` mezőt
- guest módban megjelenik a GDPR blokk
- staff módban nem jelenik meg a guest-only GDPR blokk
- profilkép feltöltés multipart `FormData` payloadot küld
- profilkép törlés `DELETE me/picture` hívást küld

### GDPR

Tesztek:
- `can_anonymize = false` esetén megjelennek a blocking reason üzenetek, és a végleges gomb disabled
- `can_anonymize = true` esetén megerősítés után `POST me/anonymize` `{ confirm: true }` payloaddal
- sikeres anonimizálás után meghívódik a logout/cleanup és navigáció
- `409` anonimizálási válasz nem logoutol, hanem megjeleníti a blocking reason listát

### Export

Tesztek:
- `GET me/export` után létrejön JSON Blob letöltés
- a letöltött fájlnév dátumot tartalmaz
- export payload nincs console logban

### Register

Tesztek:
- 18+ checkbox nélkül a submit gomb disabled vagy a form invalid
- 18+ elfogadással a payload tartalmazza `is_over_18: true`
- opcionális `birth_date`, `phone`, `address` mezők bekerülnek a payloadba, ha ki vannak töltve
- backend validációs hiba message-ként megjelenik

## Ellenőrzési parancsok

Repo rootból Dockerrel:

```bash
docker compose exec -T node npm run test -- src/components/common/Profile.test.jsx
docker compose exec -T node npm run test -- src/components/public/Register.test.jsx
docker compose exec -T node npm run build
```

Ha több közös helper vagy context módosul:

```bash
docker compose exec -T node npm run test
```

## Biztonsági és adatkezelési szabályok

- Token, profiladat, export payload, payer/számviteli adat nem kerülhet logba.
- Export csak letöltésként készüljön, ne legyen teljes payload előnézet.
- Anonimizálás visszafordíthatatlanként legyen kezelve.
- A végleges anonimizálási gomb csak explicit megerősítés után legyen aktív.
- Backend validáció maradjon authoritative; kliens oldali validáció csak UX segítség.

## Rollback terv

Ha a 2. fázis bevezetése hibát okoz:

- endpoint konstansok használata visszaállítható közvetlen stringekre
- Profile GDPR blokk elrejthető feature flag jellegű feltétellel vagy komponensszintű kikapcsolással
- profilkép feltöltés/törlés gombok eltávolíthatók a profiladat megjelenítés megtartása mellett
- regisztrációs új opcionális mezők eltávolíthatók, de az `is_over_18` backend követelmény miatt annak UI-ja vagy payloadja nem hagyható el, ha a backend már éles

## Eldöntendő kérdések

1. A profil oldalon szerkeszthetők legyenek-e a `phone`, `address`, `birth_date` mezők?
   - Jelenlegi backend `POST me` nem engedi ezeket frissíteni, csak regisztrációnál kezeli őket.

2. A regisztráció opcionális mezőit üresen `null` értékként küldjük, vagy hagyjuk ki a payloadból?
   - Mindkettő működhet, de egységesíteni kell.

3. A sikeres anonimizálás után hova navigáljon a frontend?
   - Javaslat: `/login`, de `/` is elfogadható.

4. A profilkép `picture` mezőből hogyan képezzünk publikus image URL-t?
   - A backend tárolt pathot ad vissza, de a frontend asset/public URL konvenciót pontosítani kell.

5. Kell-e külön guest profil route és staff profil route komponens?
   - Jelenleg közös `common/Profile.jsx` van; a 2. fázisban maradhat közös, de a GDPR UI csak guest módban jelenjen meg.

6. A retention policy rövid szövege most bekerüljön-e a profil GDPR blokkba, vagy külön Privacy oldal frissítés legyen?
   - Javaslat: rövid profil szöveg most, részletes Privacy oldal külön szeletben.
