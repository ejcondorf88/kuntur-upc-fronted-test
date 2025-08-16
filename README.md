# Kuntur UPC Frontend

Este frontend es una app móvil y web construida con **React Native**, **Expo** y **Expo Router**. Se conecta a un backend FastAPI y a RabbitMQ para recibir alertas en tiempo real, y usa OpenAI para autocompletar campos de casos.

---

## Requisitos

- Node.js >= 1
- npm o yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/):  
  `npm install -g expo-cli`
- (Opcional) Emulador Android/iOS o dispositivo físico con Expo Go

---

## Instalación

1. **Clona el repositorio:**
   ```sh
   git clone <URL_DEL_REPO>
   cd kuntur-upc-fronted-test
   ```

2. **Instala las dependencias:**
   ```sh
   npm install
   # o
   yarn install
   ```

3. **Instala dependencias nativas necesarias:**
   ```sh
   npm install react-native-youtube-iframe @react-native-picker/picker expo-av
   npm install react-native-web-webview  # Si usarás Expo web
   ```

---

## Ejecución

### **Modo desarrollo (Expo Go)**
```sh
npx expo start
```
- Escanea el QR con la app **Expo Go** en tu dispositivo móvil.
- O presiona `a` para Android, `i` para iOS, `w` para web.

### **Modo web**
```sh
npm run web
```

---

## Configuración de conexión

- El frontend espera que el backend FastAPI esté corriendo en `http://localhost:8001` (puedes cambiar la URL en los hooks/adapters si tu backend está en otra IP/puerto).
- El backend debe exponer los endpoints `/get_alerta`, `/ack_alerta`, `/api/completar-campos`, etc.

---

## Flujo de la app

1. **Recibe alertas** desde RabbitMQ a través del backend (polling automático).
2. **Muestra la alerta** y habilita el botón “Responder a Evento”.
3. **Al crear un caso**, los campos vacíos del formulario se autocompletan automáticamente usando OpenAI (a través del backend).
4. **En la pantalla de conexión**, se muestra un clip de YouTube usando el campo `stream_url` de la alerta.
5. **El usuario puede responder o marcar falsa alarma**; esto elimina la alerta de la cola.

---

## Estructura del proyecto

```
kuntur-upc-fronted-test/
├── app/                # Pantallas y rutas Expo Router
├── components/         # Componentes reutilizables
├── hooks/              # Custom hooks (incluye mocks y lógica de API)
├── adapter/            # Adaptadores y clientes API
├── assets/             # Imágenes, fuentes, etc
├── theme/              # Temas y estilos globales
├── constants/          # Constantes
├── package.json
└── README.md
```

---

## Notas importantes

- **No expongas tu API Key de OpenAI en el frontend.** El autocompletado se hace vía backend.
- Si usas Expo web, asegúrate de instalar `react-native-web-webview`.
- Si tienes problemas con videos de YouTube, asegúrate de usar `react-native-youtube-iframe` y pasar solo el videoId.
- El frontend está preparado para recibir solo **una alerta a la vez** (la más reciente de la cola).

---

## Troubleshooting

- Si el botón “Responder a Evento” no se habilita, revisa la consola para ver si llega la alerta.
- Si ves errores de CORS, asegúrate de que el backend permita peticiones desde el origen del frontend.
- Si ves muchos logs de conexiones a RabbitMQ, consulta la sección de optimización de conexiones en el backend.

---

## Scripts útiles

- `npm start` — Inicia el servidor de desarrollo Expo
- `npm run web` — Inicia la app en modo web
- `npm run lint` — Linting del código

---


