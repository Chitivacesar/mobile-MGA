const axios = require('axios');

async function checkBackend() {
  const urls = [
    'https://apiwebmga.onrender.com',      // API en la nube
    'http://localhost:3000/api',           // Local fallback
    'http://127.0.0.1:3000/api'            // Local alternativo
  ];

  console.log('🔍 Verificando estado del backend...\n');

  for (const url of urls) {
    try {
      console.log(`Probando: ${url}`);
      // Para la API en la nube, probamos el endpoint raíz
      const testEndpoint = url.includes('apiwebmga.onrender.com') ? '' : '/health';
      const response = await axios.get(`${url}${testEndpoint}`, { timeout: 10000 });
      console.log(`✅ Backend funcionando en: ${url}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data)}`);
      return true;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`❌ Conexión rechazada en: ${url}`);
      } else if (error.code === 'ETIMEDOUT') {
        console.log(`⏰ Timeout en: ${url}`);
      } else {
        console.log(`❌ Error en ${url}: ${error.message}`);
      }
    }
  }

  console.log('\n🚨 PROBLEMA DETECTADO:');
  console.log('No se puede conectar a ninguna API');
  console.log('\n📋 SOLUCIONES:');
  console.log('1. Verifica tu conexión a internet');
  console.log('2. La API en la nube puede estar temporalmente inactiva');
  console.log('3. Para desarrollo local, ejecuta tu backend en el puerto 3000');
  console.log('4. Verifica que https://apiwebmga.onrender.com/ esté funcionando');
  
  return false;
}

checkBackend().catch(console.error);
