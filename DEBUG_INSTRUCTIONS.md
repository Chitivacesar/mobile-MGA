# 🔍 Instrucciones de Depuración para Clases de Beneficiarios

## Problema Identificado
El beneficiario "Cristiano" tiene clases asignadas en el sistema web pero no aparecen en la aplicación móvil.

## ✅ Cambios Implementados

### 1. Mejor Filtrado de Beneficiarios
- **Múltiples criterios de comparación**: ID, correo, número de documento, y nombre completo
- **Logs detallados** para facilitar la depuración
- **Manejo robusto de diferentes formatos de datos**

### 2. Mejoras en la Visualización
- **Días completos** (Lunes, Martes, etc.) en lugar de códigos (L, M, etc.)
- **Mejor mapeo de datos** del profesor y aula
- **Información más clara** del curso/especialidad

## 🚀 Para Depurar el Problema

### Paso 1: Verificar los Logs
1. Abre la aplicación móvil
2. Ve a "Servicios Musicales" > "Programación de Clases"
3. Abre la consola de desarrollo y busca estos logs:

```
ProgramacionClasesScreen: Filtering for beneficiario with user data:
ProgramacionClasesScreen: Beneficiario comparison:
ProgramacionClasesScreen: Class inscribed for user:
```

### Paso 2: Verificar Datos del Usuario
En los logs, verifica que los datos del usuario logueado sean correctos:
- `id`: ID único del usuario
- `correo`: Email del beneficiario
- `numeroDocumento`: Documento de identidad
- `nombre` y `apellido`: Nombres completos

### Paso 3: Verificar Datos de las Clases
En los logs de comparación, verifica que los datos de los beneficiarios en las clases contengan:
- `beneficiarioId._id`: ID del beneficiario
- `beneficiarioId.correo` o `beneficiarioId.email`: Email
- `beneficiarioId.numero_de_documento`: Documento
- `beneficiarioId.nombre` y `beneficiarioId.apellido`: Nombres

## 🛠️ Posibles Soluciones

### Si no aparecen clases:

1. **Verificar el backend**: ¿Está corriendo en el puerto correcto?
2. **Verificar la conexión**: ¿La app se conecta exitosamente?
3. **Verificar los datos**: ¿Los datos del beneficiario coinciden?

### Si los datos no coinciden:

1. **Verificar en el sistema web** que el beneficiario esté correctamente asignado
2. **Verificar que el correo/documento** del usuario móvil sea el mismo que en el sistema web
3. **Verificar la estructura de datos** en el endpoint `/programacion_de_clases`

## 📱 Información de Debug

Los logs te dirán exactamente qué está pasando:
- Si no encuentra clases: `Filtered programaciones for beneficiario: 0`
- Si encuentra clases: `Class inscribed for user: {...}`
- Si hay problemas de comparación: `Beneficiario comparison: {...finalMatch: false}`

## 🔧 Comandos Útiles

### Verificar el backend:
```bash
curl http://localhost:3000/api/programacion_de_clases
```

### Verificar datos de un beneficiario específico:
```bash
curl http://localhost:3000/api/beneficiarios
```

---

**¿Necesitas ayuda adicional?** Revisa los logs con este formato y comparte la información específica para un diagnóstico más detallado.
