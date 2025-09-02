# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Configure backend URL (optional)

   Create a `.env` in the project root (or set in your shell):

   ```bash
   # default is http://localhost:3000/api if not set
   EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
   ```

3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
# movil-mga

## 🔧 Configuración para Desarrollo Móvil

**IMPORTANTE:** Para que la app funcione en tu dispositivo móvil, debes usar la IP de tu computadora en lugar de `localhost`.

### Pasos para configurar correctamente:

1. **Obtener tu IP local:**
   ```bash
   # En Windows:
   ipconfig | findstr "IPv4"
   
   # En Mac/Linux:
   ifconfig | grep "inet "
   ```

2. **La configuración ya está actualizada** en `constants/config.ts` y `app.json` con tu IP actual: `172.20.10.5`

3. **Si cambias de red WiFi,** actualiza la IP en estos archivos:
   - `constants/config.ts` → `DEV_API_URL`
   - `app.json` → `extra.apiUrl`

### ⚠️ Solución al Error de Network

Si ves "AxiosError: Network Error", significa que:
- Tu backend no está corriendo en el puerto 3000
- Tu dispositivo móvil no puede acceder a tu computadora
- La IP configurada no es correcta

**Soluciones:**
1. ✅ Asegúrate de que el backend esté corriendo: `cd backend && npm start`
2. ✅ Verifica que tanto tu computadora como tu dispositivo estén en la misma red WiFi
3. ✅ Actualiza la IP si cambias de red
