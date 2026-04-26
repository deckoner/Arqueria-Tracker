# Arqueria Tracker - Documentacion del Proyecto

## Descripcion General

Arqueria Tracker es una aplicacion movil desarrollada con Expo (React Native)pensada para Android. Su funcion principal es permitir a los arqueros gestionar sus arcos y registrar sesiones de entrenamiento de tiro con arco.

## Estructura de la Aplicacion

La aplicacion se organiza en tres pestanas principales accesibles desde la barra de navegacion inferior:

1. **Arcos** - Pagina principal donde se gestionan los arcos del usuario
2. **Rondas** - Seccion para gestionar sesiones de entrenamiento
3. **Estadisticas** - Visualizacion de datos y progresos

## Tipos de Arco Soportados

La aplicacion soporta tres tipos de arco, cada uno con campos especificos:

### Recurvo
- Nombre (obligatorio)
- Modelo
- Potencia (lbs)
- Apertura (pulgadas)
- Flechas
- Cuerda
- Palas (superior/inferior)
- Empunadura (riser)

### Compuesto
- Nombre (obligatorio)
- Modelo
- Potencia (lbs)
- Apertura (pulgadas)
- Flechas
- Cuerda
- Let-off (%)
- Longitud del eje a eje (ATA)
- Altura del brace (pulgadas)

### Longbow
- Nombre (obligatorio)
- Modelo
- Potencia (lbs)
- Apertura (pulgadas)
- Flechas
- Cuerda
- Longitud del arco (pulgadas)

## Almacenamiento de Datos

La aplicacion utiliza `@react-native-async-storage/async-storage` para almacenar los datos localmente en el dispositivo. Los datos se guardan en formato JSON y incluyen:

- Arcos registrados
- Rondas creadas
- Tiros registrados en cada ronda

## Estructura de Archivos

El codigo fuente esta organizado de la siguiente manera:

```
app/
├── _layout.tsx                 # Layout raiz de la aplicacion
├── (tabs)/
│   ├── _layout.tsx           # Layout de pestanas
│   ├── index.tsx           # Pagina de Arcos (inicio)
│   ├── rondas.tsx          # Pagina de Rondas
│   └── statistics.tsx       # Pagina de estadisticas
└── bow/
    ├── create/index.tsx      # Formulario crear arco
    └── [id]/index.tsx    # Formulario editar arco
```

```
src/
├── database/
│   └── storage.ts         # Logica de almacenamiento
├── models/
│   └── index.ts         # Definiciones de tipos
└── repositories/
    └── bow-repository.ts  # Acceso a datos de arcos
```

## Tecnologias Utilizadas

- **Expo SDK 54** - Framework principal
- **React Native 0.81** - Libreria de interfaz
- **expo-router** - Navegacion basada en archivos
- **@react-native-async-storage/async-storage** - Almacenamiento local
- **TypeScript** - Lenguaje de programacion

## Requisitos del Sistema

- Node.js 18 o superior
- pnpm (gestor de paquetes)
- Android Studio (para-emulacion y build)
- Expo Go (para pruebas en dispositivo fisico)

## Instalacion

Para instalar las dependencias:

```bash
pnpm install
```

## Ejecucion en Desarrollo

Para iniciar el servidor de desarrollo:

```bash
pnpm exec expo start
```

Escanear el codigo QR con Expo Go en el dispositivo Android.

## Build para Android

Para generar un APK de produccion:

```bash
pnpm run android
```

Esto generara un archivo APK en la carpeta `android/app/build/outputs/apk/release/`.

## Funcionalidades Actuales

### Gestion de Arcos

- Crear nuevos arcos con diferentes tipos
- Editar arcos existentes
- Eliminar arcos
- Establecer arco predeterminado
- Ver lista de arcos registrados

### Funcionalidades en Desarrollo

Las siguientes funcionalidades estan en construccion y disponible proximamente:

- Creacion de rondas de entrenamiento
- Registro de impactos en diana
- Estadisticas y mapa de calor

## Notas de Desarrollo

- La aplicacion esta orientada principalmente a Android
- Los datos se almacenan localmente, sin sincronizacion en la nube
- El diseno es modular para facilitar futuras extensiones
- Se utilizan TypeScript para mayor seguridad en el codigo

## Licencia

Propiedad del autor.