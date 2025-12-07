# PocketForms — Mobile Form Builder & Data Collection App

PocketForms is a cross-platform mobile application built with **Expo Router** and **React Native**.  
It enables users to design custom forms, define dynamic field types, and record structured data on-device — including photos and GPS coordinates.

This is the **portfolio-focused** version of the app showcasing architecture, UI, device integration, and data modelling.  
Backend configuration is abstracted so PocketForms can connect to any REST-style API.

---

## ✨ Features

| Category | Capabilities |
|---------|--------------|
| **Form Management** | Create, edit, and delete forms |
| **Dynamic Field Builder** | Text, Number, Dropdown, Image, GPS Location fields |
| **Record Entry** | Input validation, photo capture, real-time GPS data |
| **Filtering** | Basic AND/OR filters for stored records |
| **Data Export** | Copy record JSON to clipboard |
| **Map View** | Plot records with coordinate data *(prototype)* |
| **Responsive UI** | Mobile-friendly screens and smooth navigation |

---

## 🧱 Tech Stack

| Area | Technology |
|------|------------|
| Framework | Expo SDK 51 / React Native 0.74 |
| Routing | Expo Router v3 |
| HTTP Client | Axios |
| Media | Expo Image Picker |
| Location | Expo Location |
| Clipboard | @react-native-clipboard/clipboard |
| UI Components | React Native core + @react-native-picker/picker |

---

## 🚀 Getting Started

### 1️⃣ Install dependencies
```bash
npm install
````

### 2️⃣ Configure backend connection

Edit `src/config.js` with placeholder or real API credentials:

```js
export const API_BASE = 'https://your-api.example.com';
export const USERNAME = 'demo-user';
export const JWT = 'demo-jwt-token';
```

> PocketForms originally connected to a private REST API.
> In this portfolio build, placeholder values are used so anyone can run it
> with their own backend configuration.

### 3️⃣ Start the Expo server

```bash
npx expo start -c --tunnel
```

### 4️⃣ Run on a device

Scan the QR code in your terminal using **Expo Go**
(📱 Android recommended for full feature support)

---

## 🧪 Test Checklist

You can test the core features by:

* Creating, renaming, and deleting forms
* Adding multiple field types (text / number / dropdown / image / location)
* Entering records with validation messages
* Selecting images from device gallery
* Capturing real-time location data
* Viewing and removing saved records
* Copying record JSON to clipboard
* *(Prototype)* Viewing location data on a map

---

## 📁 Project Structure

```
app/
 ├── _layout.js
 ├── index.js
 ├── about.js
 ├── forms/
 │    ├── index.js
 │    └── [id]/
 │         ├── fields.js
 │         ├── records.js
 │         └── map.js   // prototype feature
src/
 ├── api.js
 ├── config.js
 ├── utils.js
assets/
 ├── icons / images
```

---

## 🔧 Future Enhancements

* Public Supabase backend integration
* Enhanced map tools & filtering features
* CSV export & expanded data management
* Offline-first local storage mode
* Theming + improved UX polish

---

## 📌 Status

> Actively maintained portfolio application — core features complete

Demonstrates experience with **mobile app development**,
**REST API integration**, **media + GPS access**, and **modern navigation architecture**.

---

## 📝 License

MIT License — free to use, modify, and learn from.



