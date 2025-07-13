# Kuntur UPC Frontend Test

Este proyecto es una app móvil construida con **React Native** y **Expo Router**.

## Requisitos

- Node.js >= 18
- npm >= 9
- [Expo CLI](https://docs.expo.dev/get-started/installation/):
  ```bash
  npm install -g expo-cli
  ```

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPO>
   cd kuntur-upc-fronted-test
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Ejecución

### Modo desarrollo (Expo Go)
```bash
npm start
```
- Escanea el QR con la app **Expo Go** en tu dispositivo móvil.
- O presiona `a` para Android, `i` para iOS, `w` para web.

### Web
```bash
npm run web
```

## Estructura del proyecto

```
kuntur-upc-fronted-test/
├── app/                # Pantallas y rutas Expo Router
├── components/         # Componentes reutilizables
├── hooks/              # Custom hooks (incluye mocks)
├── adapter/            # Adaptadores y clientes API/WebSocket
├── assets/             # Imágenes, fuentes, etc
├── theme/              # Temas y estilos globales
├── constants/          # Constantes
├── package.json
└── README.md
```

## Dependencias principales
- react-native
- expo
- expo-router
- styled-components
- react-native-webview
- @expo/vector-icons

## Notas
- Los datos de elementos y casos están mockeados en hooks para pruebas.
- El WebSocket está simulado, cambia la URL por la de tu backend real.
- Para ver el stream de cámara IP, asegúrate de que la IP sea accesible desde tu dispositivo/emulador.

## Scripts útiles
- `npm start` — Inicia el servidor de desarrollo Expo
- `npm run web` — Inicia la app en modo web
- `npm run lint` — Linting del código

---

¿Dudas? Contacta al equipo de desarrollo.
