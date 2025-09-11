export const colors = {
  // === COLORES PRINCIPALES DE TU WEB ===
  // Colores primarios exactos de tu aplicación web
  primary: '#0455a2',           // Color principal (Material-UI primary.main)
  primaryDark: '#034589',       // Variante más oscura del azul
  primaryLight: '#6c8221',      // Verde secundario (hover de botones)
  secondary: '#6c8221',         // Color secundario principal
  
  // === COLORES DE FONDO EXACTOS ===
  // Fondos idénticos a tu aplicación web
  background: '#f5f7fa',        // Fondo principal (Theme background.default)
  backgroundSecondary: '#f1f3f4', // Fondo secundario (scrollbar track)
  backgroundDark: '#121212',    // Fondo modo oscuro
  surface: '#ffffff',           // Superficie de cards y componentes
  surfaceDark: '#1e1e1e',       // Superficie modo oscuro
  paper: '#ffffff',             // Material-UI paper
  
  // === COLORES DE TEXTO EXACTOS ===
  // Textos idénticos a tu aplicación web
  text: '#333333',              // Texto principal (Theme text.primary light)
  textPrimary: '#333333',       // Texto principal
  textSecondary: '#666666',     // Texto secundario (Theme text.secondary)
  textLight: '#b0b0b0',         // Texto claro (Theme text.secondary dark)
  textDark: '#ffffff',          // Texto modo oscuro
  
  // === COLORES DEL SISTEMA ===
  white: '#ffffff',
  black: '#000000',
  
  // === COLORES DE BORDES Y ESTADOS ===
  border: '#e0e0e0',           // Bordes principales
  borderLight: 'rgba(0,0,0,0.1)', // Bordes claros (TableCell)
  borderDark: 'rgba(255,255,255,0.1)', // Bordes modo oscuro
  
  // === COLORES DE ESTADO ===
  success: '#16a34a',          // Verde éxito
  warning: '#f59e0b',          // Amarillo advertencia
  danger: '#dc2626',           // Rojo error/peligro
  error: '#dc2626',            // Alias para danger
  info: '#0284c7',             // Azul información
  
  // === COLORES ADICIONALES DE TU WEB ===
  disabled: '#9ca3af',         // Elementos deshabilitados
  
  // === HOVER Y ESTADOS ACTIVOS (de Navigation.jsx) ===
  hoverBackground: 'rgba(124, 148, 39, 0.1)', // Fondo hover verde claro
  hoverBackgroundStrong: 'rgba(124, 148, 39, 0.2)', // Hover más fuerte
  activeBackground: 'rgba(4, 85, 162, 0.1)', // Fondo activo azul claro
  
  // === COLORES PARA GRÁFICOS Y CHARTS (de Dashboard.jsx) ===
  chart: {
    primary: '#0455a2',
    secondary: '#6c8221', 
    tertiary: '#5c6bc0',
    quaternary: '#26a69a',
    quinary: '#ec407a',
    senary: '#0288d1',
    septenary: '#7cb342',
  },
  
  // === COLORES PARA CLASES/ESPECIALIDADES ===
  specialties: [
    '#4f46e5',
    '#0891b2', 
    '#7c3aed',
    '#16a34a',
    '#ea580c',
    '#db2777',
    '#9333ea',
    '#0284c7',
    '#65a30d',
    '#0d9488',
  ],
  
  // === COLORES ESPECÍFICOS DE MATERIAL-UI ===
  cardShadow: 'rgba(0, 0, 0, 0.1)',
  cardBorder: '#e0e0e0',
  inputFocus: '#0455a2',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // === COLORES PARA MODO OSCURO ===
  dark: {
    background: '#121212',
    surface: '#1e1e1e',
    surfaceVariant: '#2d2d2d',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: 'rgba(255,255,255,0.1)',
    hover: 'rgba(255,255,255,0.08)',
    active: 'rgba(255,255,255,0.04)',
  },
  
  // === GRADIENTES (de ProgramacionClases.jsx) ===
  gradients: {
    primary: 'linear-gradient(180deg, #0455a2 0%, #034589 100%)',
    primaryHover: 'linear-gradient(180deg, #034589 0%, #023660 100%)',
  },
  
  // === COLORES PARA TABLAS ===
  table: {
    header: '#f5f5f5',         // Fondo cabecera tabla
    headerDark: '#2d2d2d',     // Fondo cabecera modo oscuro
    border: 'rgba(0,0,0,0.1)', // Bordes tabla
    borderDark: 'rgba(255,255,255,0.1)', // Bordes modo oscuro
    hover: 'rgba(0,0,0,0.02)',  // Hover fila
    hoverDark: 'rgba(255,255,255,0.04)', // Hover fila modo oscuro
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const radii = {
  xs: 4,
  sm: 8,   // Igual a tu web (borderRadius: "8px")
  md: 12,
  lg: 16,
  xl: 20,
  round: 50,
};

export const typography = {
  // Fuentes exactas de tu web
  fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  
  // Tamaños de fuente de tu web
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  // Pesos de fuente de tu web
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const shadows = {
  // Sombras exactas de tu web
  card: 'rgba(0, 0, 0, 0.1)',
  cardStrong: 'rgba(0, 0, 0, 0.15)',
  elevation: {
    1: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    2: {
      shadowColor: '#000000', 
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    3: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 3,
    },
    4: {
      shadowColor: '#0455a2', // Sombra con color primario
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
    },
  },
};

// Tema completo exportado
export const theme = {
  colors,
  spacing,
  radii,
  typography,
  shadows,
};

export default theme;