// Script para probar la conectividad con el backend
const axios = require('axios');

const TEST_URLS = [
  'http://localhost:3000/api',
  'http://127.0.0.1:3000/api',
  'http://10.0.2.2:3000/api',
  'http://172.20.10.5:3000/api',
  'http://192.168.1.100:3000/api',
  'http://192.168.0.100:3000/api',
];

async function testURL(url) {
  try {
    console.log(`🔄 Probando: ${url}`);
    const response = await axios.get(url + '/health', { timeout: 5000 });
    console.log(`✅ ÉXITO: ${url} - Status: ${response.status}`);
    return { url, success: true, status: response.status };
  } catch (error) {
    const errorMsg = error.code || error.message;
    console.log(`❌ FALLO: ${url} - Error: ${errorMsg}`);
    return { url, success: false, error: errorMsg };
  }
}

async function findWorkingBackend() {
  console.log('🚀 Iniciando prueba de conectividad del backend...\n');
  
  const results = [];
  
  for (const url of TEST_URLS) {
    const result = await testURL(url);
    results.push(result);
    
    if (result.success) {
      console.log(`\n🎉 ¡BACKEND ENCONTRADO!`);
      console.log(`📝 URL que funciona: ${result.url}`);
      console.log(`📋 Actualiza tu config.ts para usar esta URL\n`);
      break;
    }
    
    // Esperar un poco entre pruebas
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const workingUrls = results.filter(r => r.success);
  
  if (workingUrls.length === 0) {
    console.log('\n🚨 NINGUNA URL FUNCIONA');
    console.log('📋 Posibles soluciones:');
    console.log('1. Verificar que el backend esté corriendo');
    console.log('2. Verificar que esté en el puerto 3000');
    console.log('3. Verificar la configuración de red');
    console.log('4. Verificar el firewall\n');
  }
  
  return workingUrls;
}

// Ejecutar el test
findWorkingBackend();
