import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, Compass, Truck, Package, Map, CheckCircle2 } from 'lucide-react';
import { supabase } from './supabaseClient';

const NAVY = '#1F3A5F';
const RED = '#C0392B';
const NAVY_LIGHT = '#2E4E7E';
const BG = '#F5F6F8';

// ---- Contenido oficial ----
const THEMES = [
  {
    id: 'network_design',
    icon: Compass,
    title: 'Network Design',
    questions: [
      {
        text: '¿Cómo decides abrir, cerrar o reubicar un centro de distribución?',
        options: [
          'Instinto, sin proceso formal',
          'Reaccionas cuando un problema lo obliga',
          'Revisión periódica de costos',
          'Modelación estructurada de escenarios',
          'Evaluación continua contra datos en vivo',
        ],
      },
      {
        text: '¿Qué nivel de detalle de costos tienes en tu red?',
        options: [
          'Sin desglose de costos',
          'Solo el costo total',
          'Costo por región o unidad de negocio',
          'Visibilidad por ruta y por instalación',
          'Costo-a-servir completo por cliente y SKU',
        ],
      },
      {
        text: '¿Modelas restricciones reales al diseñar o rediseñar tu red?',
        options: [
          'Sin modelación',
          'Distancias y capacidad aproximadas',
          'Capacidad y costos fijos vs. variables',
          'Capacidad, tiempos de entrega y nivel de servicio',
          'Todas las restricciones, incl. regulatorias y estacionales',
        ],
      },
      {
        text: '¿Cada cuánto revisas formalmente tu red?',
        options: [
          'Nunca',
          'Solo cuando una crisis lo obliga',
          'Cada varios años',
          'Anualmente, dentro de la planeación S&OP',
          'Continuamente, con una cadencia regular',
        ],
      },
    ],
    recommendations: [
      { nextStep: 'Mapea tu red actual: ubica nodos, flujos y distancias en un solo lugar.', tools: ['Supply Chain Map', 'Distance Matrix'] },
      { nextStep: 'Calcula tu centro de gravedad para ver si tus CD están bien ubicados.', tools: ['Center of Gravity', 'Nearest Warehouses'] },
      { nextStep: 'Modela entre 3 y 5 configuraciones de red con restricciones reales.', tools: ['Network Design', 'Supply Chain Designer'] },
      { nextStep: 'Optimiza costo-servicio y prueba escenarios de crecimiento y disrupción.', tools: ['Network Design Plus', 'Flow Visualization'] },
      { nextStep: 'Revisa la red en continuo contra datos en vivo y automatiza el rediseño.', tools: ['Supply Chain Designer', 'Location Planning'] },
    ],
  },
  {
    id: 'transport_optimization',
    icon: Truck,
    title: 'Transport Optimization',
    questions: [
      {
        text: '¿Cómo creas tus rutas de entrega y planes de transporte?',
        options: [
          'Los conductores deciden el día a día',
          'Manualmente en hojas de cálculo',
          'Plantillas fijas, rara vez actualizadas',
          'Software de optimización de rutas',
          'Optimización dinámica diaria',
        ],
      },
      {
        text: '¿Qué tan bien tus planes consideran ventanas de tiempo, capacidad y horas de conductor?',
        options: [
          'No se consideran',
          'Solo lo básico, mucha improvisación',
          'Ventanas y capacidad; los casos límite se escapan',
          'Todas las restricciones, de forma manual pero sistemática',
          'Todas embebidas y forzadas por el optimizador',
        ],
      },
      {
        text: '¿Cómo mides los costos de transporte?',
        options: [
          'Sin visibilidad',
          'Solo la factura total',
          'Por ruta o región',
          'Por entrega, parada y kg por ruta',
          'Transparencia total, comparada contra el mercado',
        ],
      },
      {
        text: '¿Analizas datos históricos de despachos para mejorar?',
        options: [
          'No',
          'Ocasionalmente, cuando surge un problema',
          'Revisión manual de reportes',
          'Análisis regular de KPIs',
          'Análisis estructurado, incl. simulaciones de consolidación',
        ],
      },
    ],
    recommendations: [
      { nextStep: 'Consolida tus despachos y mide el costo real por ruta y por entrega.', tools: ['Shipment Analyzer', 'Freight Matrix'] },
      { nextStep: 'Reemplaza la planeación manual por optimización de rutas asistida.', tools: ['Transport Optimization'] },
      { nextStep: 'Optimiza toda la flota con ventanas, capacidad y horas de conductor.', tools: ['Transport Opt Plus', 'Milkrun Optimization'] },
      { nextStep: 'Añade last-mile y llenado de contenedor; compara costos contra el mercado.', tools: ['Last Mile', '3D Container Loading'] },
      { nextStep: 'Optimización dinámica diaria integrada a datos en vivo.', tools: ['Transport Opt Plus', 'Shipment Analyzer'] },
    ],
  },
  {
    id: 'inventory_demand_planning',
    icon: Package,
    title: 'Inventory & Demand Planning',
    questions: [
      {
        text: '¿Cómo clasificas tus SKUs para priorizar la planeación?',
        options: [
          'Sin clasificación',
          'Importancia aproximada, sin sistema formal',
          'ABC básico por ingresos o volumen',
          'ABC + variabilidad de demanda (XYZ)',
          'ABC/XYZ mantenido al día, guía políticas diferenciadas',
        ],
      },
      {
        text: '¿Cómo pronosticas la demanda?',
        options: [
          'Sin pronóstico, reaccionas a los pedidos',
          'Instinto o promedios año contra año',
          'Métodos estadísticos básicos',
          'Modelos avanzados con estacionalidad y tendencias',
          'A nivel SKU, con factores externos e intervalos de confianza',
        ],
      },
      {
        text: '¿Cómo defines tus niveles de inventario y políticas de reabastecimiento?',
        options: [
          'Por costumbre o experiencia del comprador',
          'Reglas fijas de semanas de stock',
          'Mín/máx básico según tiempos de entrega',
          'Stock de seguridad según variabilidad del lead time',
          'Políticas optimizadas y automatizadas por SKU',
        ],
      },
      {
        text: '¿Comparas políticas de inventario para hallar la mejor por producto?',
        options: [
          'No, un solo enfoque para todos',
          'Rara vez, solo tras un problema',
          'Comparación informal ocasional',
          'Evaluación regular por tipo de producto',
          'Modelación sistemática multi-política por SKU',
        ],
      },
    ],
    recommendations: [
      { nextStep: 'Clasifica tus SKUs con un ABC por ingresos o volumen.', tools: ['ABC Analysis'] },
      { nextStep: 'Suma variabilidad de demanda (XYZ) y arranca un pronóstico estadístico.', tools: ['ABC XYZ Analysis', 'Demand Forecasting'] },
      { nextStep: 'Define política mínima de reabastecimiento y stock de seguridad por SKU.', tools: ['Inventory Optimization'] },
      { nextStep: 'Pronostica con estacionalidad y simula políticas de inventario por producto.', tools: ['Forecasting ARIMA', 'Inventory Simulation'] },
      { nextStep: 'Optimiza y automatiza políticas por SKU con factores externos.', tools: ['Inventory Optimization', 'Schedule Optimization'] },
    ],
  },
  {
    id: 'geospatial_visibility',
    icon: Map,
    title: 'Geospatial & Visibility',
    questions: [
      {
        text: '¿Qué tan precisas y actualizadas están tus ubicaciones geocodificadas?',
        options: [
          'Sin datos estructurados',
          'Las direcciones existen, pero son inconsistentes',
          'Sitios clave geocodificados, el resto disperso',
          'Todas las ubicaciones principales geocodificadas y mantenidas',
          'Maestro verificado y automatizado en los sistemas de planeación',
        ],
      },
      {
        text: '¿Usas mapas o visualización espacial en la planeación?',
        options: [
          'No, solo tablas',
          'Ocasionalmente, para presentaciones',
          'Mapeo básico de la estructura de red',
          'Mapas interactivos de flujos y desempeño',
          'Geoespacial multicapa como herramienta estándar',
        ],
      },
      {
        text: '¿Usas distancias reales de carretera o tiempos de viaje en la planeación?',
        options: [
          'No, estimaciones en línea recta',
          'Herramientas en línea, ad-hoc',
          'Distancias reales solo para rutas clave',
          'Matrices precisas de tiempo por carretera',
          'Matrices completas integradas en las herramientas de optimización',
        ],
      },
      {
        text: '¿Analizas qué zonas alcanzas dentro de los tiempos de entrega objetivo?',
        options: [
          'No, se asume sin medición',
          'Una sensación aproximada por experiencia',
          'Análisis ocasional al abrir o cerrar sitios',
          'Mapeo regular de cobertura con identificación de brechas',
          'Monitoreo continuo que guía decisiones de depósitos y territorios',
        ],
      },
    ],
    recommendations: [
      { nextStep: 'Estructura y geocodifica tu maestro de ubicaciones.', tools: ['Geocoding', 'what3words'] },
      { nextStep: 'Construye una visualización de tus flujos para ver rutas y brechas.', tools: ['Flow Visualization', 'Area Mapper'] },
      { nextStep: 'Usa distancias reales de carretera y matrices de tiempo en la planeación.', tools: ['Distance Matrix'] },
      { nextStep: 'Mapea cobertura por isócronas e identifica brechas de servicio.', tools: ['Isochrone', 'Area Mapper'] },
      { nextStep: 'Monitorea cobertura en continuo para decidir depósitos y territorios.', tools: ['Isochrone Plus', 'Schedule Visualization'] },
    ],
  },
];

const TOTAL_QUESTIONS = THEMES.reduce((acc, t) => acc + t.questions.length, 0);

const LEVELS = [
  { level: 1, name: 'Inicial', min: 1.0, max: 1.49, color: RED },
  { level: 2, name: 'Reactivo', min: 1.5, max: 2.49, color: '#D68A1F' },
  { level: 3, name: 'Estructurado', min: 2.5, max: 3.49, color: NAVY_LIGHT },
  { level: 4, name: 'Avanzado', min: 3.5, max: 4.49, color: '#1E8E5A' },
  { level: 5, name: 'Óptimo', min: 4.5, max: 5.0, color: '#0F6B3F' },
];

const OVERALL_DESCRIPTIONS = {
  1: 'Tus decisiones dependen principalmente de la intuición, sin datos ni modelos de por medio. El primer paso es levantar información base y construir tu primer modelo, aunque sea simple.',
  2: 'Ya tienes algunos datos y procesos, pero se usan de forma reactiva, más para resolver problemas que para anticiparlos. El siguiente paso es formalizar procesos y empezar a modelar antes de decidir.',
  3: 'Ya tienes procesos estructurados en varias áreas. El siguiente paso es hacerlos consistentes en toda la operación y automatizar lo repetitivo.',
  4: 'Tu operación combina datos, modelos y procesos de forma consistente. El siguiente paso es integrar estas capacidades entre áreas y anticipar escenarios de crecimiento o disrupción.',
  5: 'Tu operación toma decisiones basadas en datos en tiempo real y modelos optimizados. El siguiente paso es mantener ese estándar y extenderlo a nuevas dimensiones del negocio.',
};

function round1(n) {
  return Math.round(n * 10) / 10;
}

function getLevel(score) {
  return LEVELS.find((l) => score >= l.min && score <= l.max) || LEVELS[0];
}

function OptionButton({ text, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '13px 16px',
        marginBottom: 9,
        borderRadius: 9,
        border: selected ? `2px solid ${NAVY}` : '1px solid #E3E7EC',
        background: selected ? '#EEF2F7' : '#fff',
        color: NAVY,
        fontSize: 14,
        fontFamily: 'inherit',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {text}
    </button>
  );
}

export default function App() {
  const flatQuestions = useMemo(
    () => THEMES.flatMap((t) => t.questions.map((q) => ({ ...q, themeId: t.id, themeTitle: t.title, icon: t.icon }))),
    []
  );

  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [nombre, setNombre] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [starting, setStarting] = useState(false);
  const responseIdRef = useRef(null); // id de la fila creada en Supabase al arrancar
  const savedRef = useRef(false);

  const startSurvey = async () => {
    if (!nombre.trim() || !empresa.trim() || !email.includes('@')) {
      setFormError('Completa tu nombre, empresa y un correo válido para empezar.');
      return;
    }
    setFormError('');
    setStarting(true);

    const { data, error } = await supabase
      .from('respuestas')
      .insert([{ nombre: nombre.trim(), empresa: empresa.trim(), email: email.trim() }])
      .select();

    if (!error && data && data[0]) {
      responseIdRef.current = data[0].id;
    }
    setStarting(false);
    setStarted(true);
  };

  const selectAnswer = (value) => {
    setAnswers({ ...answers, [step]: value });
    setTimeout(() => {
      if (step < TOTAL_QUESTIONS - 1) setStep(step + 1);
      else setStep(TOTAL_QUESTIONS);
    }, 200);
  };

  const themeScores = useMemo(() => {
    return THEMES.map((theme) => {
      const idxs = flatQuestions.map((q, i) => (q.themeId === theme.id ? i : null)).filter((i) => i !== null);
      const vals = idxs.map((i) => answers[i]).filter((v) => v !== undefined);
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      return { ...theme, score: round1(avg) };
    });
  }, [answers, flatQuestions]);

  const overallScore = useMemo(() => {
    if (!themeScores.length) return 0;
    const avg = themeScores.reduce((a, t) => a + t.score, 0) / themeScores.length;
    return round1(avg);
  }, [themeScores]);

  const overallLevel = getLevel(overallScore || 1);

  // Al llegar a resultados, completa (update) la fila que ya se creó al empezar la
  // encuesta, agregando los puntajes y respuestas. Si por algún motivo no se guardó
  // esa fila inicial (ej. sin conexión al arrancar), la crea ahora con todo incluido.
  useEffect(() => {
    if (step !== TOTAL_QUESTIONS || savedRef.current) return;
    savedRef.current = true;

    const themeScoresPayload = Object.fromEntries(themeScores.map((t) => [t.id, t.score]));
    const payload = { overall_score: overallScore, overall_level: overallLevel.name, theme_scores: themeScoresPayload, answers };

    if (responseIdRef.current) {
      supabase.from('respuestas').update(payload).eq('id', responseIdRef.current);
    } else {
      supabase.from('respuestas').insert([{ nombre, empresa, email, ...payload }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  if (!started) {
    const inputStyle = {
      width: '100%',
      padding: '11px 14px',
      borderRadius: 8,
      border: '1px solid #DDE2E8',
      fontSize: 14,
      fontFamily: 'inherit',
      color: NAVY,
      marginBottom: 12,
      boxSizing: 'border-box',
    };
    return (
      <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", background: BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 480, width: '100%', background: '#fff', borderRadius: 14, border: '1px solid #E3E7EC', padding: 36, boxShadow: '0 4px 16px rgba(16,24,40,0.06)' }}>
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: RED, textTransform: 'uppercase', marginBottom: 10 }}>
              Arkitekt Supply Chain Consulting
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: NAVY, marginBottom: 10, lineHeight: 1.3 }}>
              Evaluación de madurez en analítica de supply chain
            </div>
            <div style={{ fontSize: 13.5, color: '#5A6577', lineHeight: 1.5 }}>
              16 preguntas rápidas. Al final recibes tu puntaje de madurez y los próximos pasos recomendados.
            </div>
          </div>

          <label style={{ fontSize: 11.5, fontWeight: 600, color: '#5A6577', display: 'block', marginBottom: 4 }}>Nombre</label>
          <input style={inputStyle} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" />

          <label style={{ fontSize: 11.5, fontWeight: 600, color: '#5A6577', display: 'block', marginBottom: 4 }}>Empresa</label>
          <input style={inputStyle} value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Nombre de tu empresa" />

          <label style={{ fontSize: 11.5, fontWeight: 600, color: '#5A6577', display: 'block', marginBottom: 4 }}>Correo</label>
          <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@empresa.com" />

          {formError && <div style={{ fontSize: 12, color: RED, marginBottom: 12 }}>{formError}</div>}

          <button
            onClick={startSurvey}
            disabled={starting}
            style={{ width: '100%', background: NAVY, color: '#fff', border: 'none', borderRadius: 8, padding: '13px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: starting ? 0.7 : 1, marginTop: 6 }}
          >
            {starting ? 'Cargando...' : 'Empezar evaluación →'}
          </button>
        </div>
      </div>
    );
  }

  if (step === TOTAL_QUESTIONS) {
    return (
      <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", background: BG, minHeight: '100vh', padding: '32px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: RED, textTransform: 'uppercase', marginBottom: 6 }}>
              Resultado
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: NAVY }}>Tu evaluación de madurez</div>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E3E7EC', padding: 28, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: '#8A94A3', marginBottom: 6 }}>Puntaje general de madurez</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 38, fontWeight: 800, color: NAVY }}>{overallScore.toFixed(1)} / 5</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: overallLevel.color }}>{overallLevel.name}</div>
            </div>
            <div style={{ height: 8, background: '#EDEFF2', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ height: '100%', width: `${(overallScore / 5) * 100}%`, background: overallLevel.color, transition: 'width 0.4s' }} />
            </div>
            <div style={{ fontSize: 13.5, color: '#5A6577', lineHeight: 1.5 }}>{OVERALL_DESCRIPTIONS[overallLevel.level]}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 22 }}>
            {themeScores.map((theme) => {
              const level = getLevel(theme.score || 1);
              const rec = theme.recommendations[level.level - 1];
              const Icon = theme.icon;
              return (
                <div key={theme.id} style={{ background: '#fff', borderRadius: 10, border: '1px solid #E3E7EC', padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <Icon size={14} color={NAVY_LIGHT} />
                    <span style={{ fontSize: 11.5, color: '#8A94A3', fontWeight: 600 }}>{theme.title}</span>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: NAVY, marginBottom: 2 }}>{theme.score.toFixed(1)}</div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: level.color, marginBottom: 12 }}>{level.name}</div>
                  <div style={{ fontSize: 12, color: '#5A6577', lineHeight: 1.4, marginBottom: 8 }}>
                    <strong style={{ color: NAVY }}>Siguiente paso:</strong> {rec.nextStep}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#8A94A3', lineHeight: 1.4 }}>
                    <strong>Herramientas:</strong> {rec.tools.join(', ')}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: `linear-gradient(90deg, ${NAVY}, ${NAVY_LIGHT})`, borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <CheckCircle2 size={20} color="#8FE3B8" style={{ marginBottom: 8 }} />
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
              ¡Gracias{nombre ? `, ${nombre.split(' ')[0]}` : ''}!
            </div>
            <div style={{ color: '#C9D6E5', fontSize: 12.5 }}>
              Un consultor de Arkitekt va a revisar tu evaluación y te va a contactar a {email} con un diagnóstico completo para {empresa || 'tu empresa'}.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const current = flatQuestions[step];
  const Icon = current.icon;

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", background: BG, minHeight: '100vh', padding: '32px 20px' }}>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#8A94A3', fontWeight: 600 }}>
            <Icon size={14} color={NAVY_LIGHT} /> {current.themeTitle}
          </div>
          <div style={{ fontSize: 12, color: '#8A94A3' }}>{step + 1} / {TOTAL_QUESTIONS}</div>
        </div>

        <div style={{ height: 6, background: '#E3E7EC', borderRadius: 3, overflow: 'hidden', marginBottom: 26 }}>
          <div style={{ height: '100%', width: `${(step / TOTAL_QUESTIONS) * 100}%`, background: NAVY, transition: 'width 0.3s' }} />
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E3E7EC', padding: 28 }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: NAVY, marginBottom: 20, lineHeight: 1.4 }}>{current.text}</div>

          {current.options.map((opt, i) => (
            <OptionButton key={i} text={opt} selected={answers[step] === i + 1} onClick={() => selectAnswer(i + 1)} />
          ))}

          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: '#8A94A3', fontSize: 12.5, cursor: 'pointer', marginTop: 10 }}
            >
              <ChevronLeft size={14} /> Anterior
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
