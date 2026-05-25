# 01. fázis: API endpoint inventory terv

Frissítve: 2026-05-25

Kapcsolódó áttekintő terv:
- `frontend/docs/backend-url-integration-plan.md`

Risk tier:
- Tier 2, mert a döntés szerint a meglévő endpoint stringeket is átírjuk, így auth, profile, order és staff/admin hívások is érintettek lehetnek.

## Cél

A backend URL változások kezeléséhez legyen egy egyszerű, JavaScript alapú endpoint inventory, hogy az új és módosuló API hívások ne szétszórt stringként jelenjenek meg a komponensekben.

Nem cél ebben a fázisban:
- API kliens generálás
- OpenAPI codegen bevezetés
- új dependency hozzáadása
- feature UI építés
- API payloadok, response kezelés vagy üzleti viselkedés módosítása

## Kiinduló frontend minta

A frontend jelenleg realmenként választ base URL-t:
- guest: `/api/guest/`
- staff: `/api/staff/`

Az `ApiContext` relatív endpointokat vár:
- `get("me")`
- `post("register", payload)`
- `post("/orders", payload)`

Az 1. fázis ne változtassa meg ezt a működést. Az endpoint inventory csak a relatív endpoint stringeket tegye könnyebben követhetővé.

## Realm kezelés értékelése

A jelenlegi realm-alapú API választás megtartható. A `ConfigContext` választja ki a guest/staff base URL-t, ezért az endpoint inventory csak relatív endpointokat tartalmazzon.

Szabályok:
- Ne kerüljön `/api/guest` vagy `/api/staff` prefix az endpoint konstansokba.
- A guest és staff endpointok külön objektumban legyenek.
- Közös komponensekben, például profil/login esetén, a guest-only és staff-only viselkedés legyen explicit `realm` alapján.
- Új auth, profile, GDPR, payment, table vagy staff/admin flow esetén legyen teszt arra, hogy a megfelelő realm endpointját használja.
- Ne váltsunk realmet API hívás közben komponensből; a realmet layout vagy route szint állítsa.

## Javasolt fájlok

Új fájlok:
- `src/api/guestEndpoints.js`
- `src/api/staffEndpoints.js`
- `src/api/index.js`

Opcionális teszt:
- `src/api/endpoints.test.js`

## Javasolt struktúra

Az endpointokat külön guest és staff fájlban kezeljük a későbbi karbantarthatóság miatt.

Első körben csak azokat az endpointokat vegyük fel, amelyek a 2. fázis profil/GDPR munkájához szükségesek, plusz azokat a meglévő endpointokat, amelyeket a mostani átírás érint.

`src/api/guestEndpoints.js`:

```js
export const guestEndpoints = {
  me: "me",
  register: "register",
  profilePicture: "me/picture",
  anonymizeCheck: "me/anonymize/check",
  anonymize: "me/anonymize",
  dataExport: "me/export",
};
```

`src/api/staffEndpoints.js`:

```js
export const staffEndpoints = {
  me: "me",
};
```

`src/api/index.js`:

```js
export { guestEndpoints } from "./guestEndpoints";
export { staffEndpoints } from "./staffEndpoints";
```

Későbbi bővítéskor hozzáadható:

```js
export const guestEndpoints = {
  // ...
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

## Szabályok

- Az endpoint értékek maradjanak relatívak a realm base URL-hez képest.
- Ne kerüljön `/api/guest` vagy `/api/staff` prefix az endpoint konstansokba.
- Ne keverjük a guest és staff endpointokat ugyanabba az objektumba.
- Dinamikus path csak kis, tiszta függvény legyen, például `receipt: (receipt) => ...`.
- Új feature fejlesztésekor az új backend URL-eket már ezen keresztül használjuk.
- A meglévő endpoint stringeket ebben a fázisban átírjuk az inventory használatára.
- Az átírás mechanikus legyen: endpoint string csere igen, payload/response/error kezelés módosítás nem.
- Ha egy meglévő hívás olyan endpointot használ, ami nem tartozik a 2. fázishoz, csak akkor vegyük fel az inventoryba, ha az adott hívást ténylegesen átírjuk.

## Implementációs lépések

1. Hozzuk létre a `src/api/guestEndpoints.js`, `src/api/staffEndpoints.js` és `src/api/index.js` fájlokat.
2. Vegyük fel a 2. fázishoz szükséges guest endpointokat.
3. Vegyük fel a minimális staff endpointokat, amelyek a meglévő staff hívások átírásához kellenek.
4. Keressük meg a meglévő frontend API hívások endpoint stringjeit.
5. Írjuk át a meglévő endpoint stringeket az inventory használatára.
6. Ne módosítsuk a payloadokat, response feldolgozást vagy UI viselkedést ebben a fázisban.
7. Futtassunk célzott teszteket és buildet, mert meglévő hívások importjai változnak.

## Tesztterv

Ha csak statikus string konstansok vannak:
- külön unit teszt nem szükséges
- ellenőrzés import/build útján elég

Ha dinamikus helper függvények kerülnek be:
- `receipt(123)` eredménye `receipts/123`
- table/member helpernél a path pontosan egyezzen a backend route-tal
- ne adjon hozzá API realm prefixet

Opcionális célzott teszt:

```bash
docker compose exec -T node npm run test -- src/api/endpoints.test.js
```

Build ellenőrzés:

```bash
docker compose exec -T node npm run build
```

Mivel meglévő hívások is átírásra kerülnek, legalább ezek is fussanak:

```bash
docker compose exec -T node npm run test
```

## Elfogadási feltételek

- Létezik `src/api/guestEndpoints.js`.
- Létezik `src/api/staffEndpoints.js`.
- Létezik `src/api/index.js`.
- A 2. fázis profil/GDPR endpointjai szerepelnek a guest endpoint inventoryban.
- Az endpointok relatívak.
- Nincs új dependency.
- A meglévő frontend API hívások endpoint stringjei inventory használatra vannak átírva.
- Az átírás nem változtat payloadot, response feldolgozást vagy UI viselkedést.
- A későbbi fázistervek ezekre a fájlokra tudnak hivatkozni.

## Rollback terv

Ha az endpoint inventory problémát okoz:
- az importok visszaállíthatók közvetlen stringekre
- maguk az endpoint inventory fájlok törölhetők, mert nem tartalmaznak állapotot vagy runtime mellékhatást

## Eldöntendő kérdések

Nincs nyitott kérdés.
