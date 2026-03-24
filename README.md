# food-order-app

Vollständige Bestellanwendung für Restaurants mit Frontend (React/Vite) und Backend (Node.js/Express).

## Inhaltsverzeichnis

- [Überblick](#überblick)
- [Voraussetzungen](#voraussetzungen)
- [Installation](#installation)
- [Schnellstart](#schnellstart)
- [Manüller Start](#manüller-start)
- [Environment-Variablen](#environment-variablen)
- [Fehlerbehebung](#fehlerbehebung)
- [Technische Dokumentation](#technische-dokumentation)
  - [System-Architektur](#system-architektur)
  - [Projektstruktur](#projektstruktur)
  - [API-Endpunkte](#api-endpunkte)
  - [Authentifizierung und Sicherheit](#authentifizierung-und-sicherheit)
  - [Datenbank (SQLite)](#datenbank-sqlite)
  - [Tech Stack](#tech-stack)
- [Entwicklungsmodus](#entwicklungsmodus)
- [Build und Produktion](#build-und-produktion)
- [Weitere Ressourcen](#weitere-ressourcen)

## Überblick

Die Anwendung besteht aus:

- Frontend mit React und Vite auf `http://localhost:5173`
- Backend mit Express und SQLite auf `http://localhost:5000`
- JWT-basierter Authentifizierung
- Sicherheitsmechanismen wie Helmet, CORS und Rate Limiting

## Voraussetzungen

Bitte vor dem Start installieren:

- **Node.js** (empfohlen: LTS, z. B. 20.x oder neür) - [Download](https://nodejs.org/)
- **PowerShell 5.1+** (Windows, für `start.ps1`)

## Installation

Falls das Projekt noch nicht lokal vorliegt:

```bash
git clone <https://github.com/SensenTV/food-order-app.git>
cd food-order-app
```

Abhängigkeiten installieren:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Zurück zur Root
cd ..
```

## Schnellstart

Empfohlener Start über das Skript:

```powershell
.\start.ps1
```

Das Skript:

- beendet alte Node.js-Prozesse
- startet das Backend auf Port `5000`
- startet das Frontend auf Port `5173`
- überwacht beide Prozesse

Danach im Browser öffnen:

```text
http://localhost:5173
```

## Manüller Start

Backend (Terminal 1):

```bash
cd backend
npm start
```

Frontend (Terminal 2):

```bash
cd frontend
npm run dev
```

## Environment-Variablen

Eine `.env`-Datei in `backend/` ist optional.

Beispiel:

```env
PORT=5000
JWT_SECRET=dein-super-geheimes-jwt-secret
DATABASE_URL=./database.sqlite
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Fehlerbehebung

| Problem | Lösung |
| --- | --- |
| Port bereits belegt | Anderen Port in `.env` setzen oder blockierenden Prozess beenden |
| `npm install`-Fehler bei `sqlite3` | Node.js auf aktülle LTS-Version aktualisieren und `npm install` erneut ausführen |
| Frontend erreicht Backend nicht | Prüfen, ob das Backend läuft und die API-URL korrekt ist |
| `start.ps1` läuft nicht | Execution-Policy setzen: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` |

---

## Technische Dokumentation

### System-Architektur

Die Anwendung folgt einem MERN-ähnlichen Stack (mit SQLite statt MongoDB):

```text
Frontend (React/Vite)  -->  HTTP/REST  -->  Backend (Express/SQLite)
http://localhost:5173                       http://localhost:5000
```

### Projektstruktur

```text
food-order-app/
|-- backend/
|   |-- src/
|   |   |-- server.js
|   |   |-- app.js
|   |   |-- config/
|   |   |   |-- db.js
|   |   |   |-- jwt.js
|   |   |   `-- initDB.js
|   |   |-- controllers/
|   |   |   |-- auth.controller.js
|   |   |   |-- menu.controller.js
|   |   |   |-- order.controller.js
|   |   |   `-- restaurant.controller.js
|   |   |-- database/
|   |   |   `-- init.sql
|   |   |-- middleware/
|   |   |   `-- auth.middleware.js
|   |   |-- models/
|   |   |   |-- menu.model.js
|   |   |   |-- order.model.js
|   |   |   |-- restaurant.model.js
|   |   |   `-- user.model.js
|   |   `-- routes/
|   |       |-- auth.routes.js
|   |       |-- menu.routes.js
|   |       |-- order.routes.js
|   |       `-- restaurant.routes.js
|   |-- package.json
|   `-- seed.js
|-- frontend/
|   |-- src/
|   |   |-- App.css
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   |-- api/
|   |   |   `-- api.js
|   |   |-- components/
|   |   |   |-- CartBadge.jsx
|   |   |   |-- MenuItem.jsx
|   |   |   `-- RestaurantCard.jsx
|   |   |-- pages/
|   |   |   |-- Cart.jsx
|   |   |   |-- login.jsx
|   |   |   |-- Menu.jsx
|   |   |   |-- Register.jsx
|   |   |   |-- Restaurants.jsx
|   |   |   `-- RestaurantsDebug.jsx
|   |   |-- redux/
|   |   |   |-- store.js
|   |   |   `-- slices/
|   |   |       `-- cartSlice.js
|   |   |-- routes/
|   |   |   |-- AppRoutes.js
|   |   |   `-- AppRoutes.jsx
|   |   `-- styles/
|   |       `-- main.css
|   |-- debug.html
|   |-- index.html
|   |-- package.json
|   `-- vite.config.js
|-- test_skripts/
|   |-- e2e-test.mjs
|   |-- run-tests.mjs
|   |-- security-test.mjs
|   `-- test-auth.ps1
|-- README.md
`-- start.ps1
```

### API-Endpunkte

#### Authentication (`/api/auth`)

```text
POST   /api/auth/register      Register neür Benutzer
POST   /api/auth/login         Login (JWT Token)
GET    /api/auth/profile       Profil abrufen (protected)
```

Beispiel Login-Response:

```json
{
  "token": "<jwt-token>",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Max Mustermann"
  }
}
```

#### Restaurants (`/api/restaurants`)

```text
GET    /api/restaurants            Alle Restaurants abrufen
GET    /api/restaurants/:id        Restaurant-Details
GET    /api/restaurants/:id/menu   Menü des Restaurants
POST   /api/restaurants            Neüs Restaurant (protected)
PUT    /api/restaurants/:id        Restaurant aktualisieren (protected)
DELETE /api/restaurants/:id        Restaurant löschen (protected)
```

#### Menü (`/api/menu`)

```text
GET    /api/menu/:id                          Menü-Item-Details
GET    /api/menu/restaurant/:restaurantId     Alle Items eines Restaurants
POST   /api/menu                              Neüs Item (protected)
PUT    /api/menu/:id                          Item aktualisieren (protected)
DELETE /api/menu/:id                          Item löschen (protected)
```

#### Bestellungen (`/api/orders`) (protected)

```text
GET    /api/orders               Alle Bestellungen des Benutzers
GET    /api/orders/:id           Bestellungsdetails
POST   /api/orders               Neü Bestellung erstellen
PATCH  /api/orders/:id/status    Bestellstatus aktualisieren
```

### Authentifizierung und Sicherheit

#### JWT

- Algorithmus: `HS256`
- Speicherung: Browser `localStorage`
- Ablaufzeit: konfigurierbar (Standard: 24 Stunden)
- Header: `Authorization: Bearer <token>`

#### Auth-Middleware

Die Datei `backend/src/middleware/auth.middleware.js` validiert JWT-Tokens auf geschützten Routen.

Beispiel:

```http
GET /api/orders
Authorization: Bearer <jwt-token>
```

#### Security Features

| Feature | Beschreibung |
| --- | --- |
| Helmet.js | Setzt Security Header wie CSP und X-Frame-Options |
| CORS | Whitelist für erlaubte Frontend-URLs |
| Rate Limiting | Begrenzung von Login- und API-Reqüsts |
| Body Size Limit | JSON Payload-Limit von max. 10 KB |
| Password Hashing | Passwort-Hashing mit `bcryptjs` |

### Datenbank (SQLite)

#### Tabellen-Schema

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  city VARCHAR(100),
  phone VARCHAR(20),
  description TEXT,
  rating DECIMAL(3,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurant_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(255),
  available BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  restaurant_id INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  total_price DECIMAL(10,2),
  delivery_address TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  menu_item_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
```

### Tech Stack

#### Frontend

- React 18
- Vite
- Redux Toolkit
- React Router
- CSS

#### Backend

- Node.js
- Express.js
- SQLite3
- jsonwebtoken
- bcryptjs
- helmet
- cors
- express-rate-limit

#### Development Tools

- npm
- nodemon (optional)
- PowerShell (für Startskript)

## Entwicklungsmodus

Frontend mit Hot Module Replacement:

```bash
cd frontend
npm run dev
```

Backend mit Nodemon:

```bash
cd backend
npm run dev
```

## Build und Produktion

Frontend Build:

```bash
cd frontend
npm run build
```

Build-Output: `frontend/dist`

Backend Produktion:

```bash
cd backend
npm start
```

## Weitere Ressourcen

- [Express.js Dokumentation](https://expressjs.com/)
- [React Dokumentation](https://react.dev/)
- [Vite Dokumentation](https://vitejs.dev/)
- [SQLite Dokumentation](https://www.sqlite.org/)
- [JWT Einführung](https://jwt.io/introduction)
