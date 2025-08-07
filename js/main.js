import { calcularMM1 } from './mm1.js';
import { calcularMM1N } from './mm1n.js';
import { calcularMM2 } from './mm2.js';
import { calcularMG1 } from './mg1.js';
import { calcularMD1 } from './md1.js';

let modeloSeleccionado = null;

document.getElementById('btnCalcular').addEventListener('click', calcular);

window.seleccionarModelo = function (modelo) {
  modeloSeleccionado = modelo;
  mostrarCampos(modelo);
  actualizarEstilos(modelo);

  // Mostrar formulario con las nuevas clases
  const formularioSection = document.getElementById('formularioSection');
  formularioSection.classList.add('visible');

  // Ocultar resultados
  const resultadosSection = document.getElementById('resultadosSection');
  resultadosSection.classList.remove('visible');
};

function actualizarEstilos(modelo) {
  document.querySelectorAll('.modelo-card').forEach(card => {
    card.classList.remove('activo');
  });
  const cardSeleccionado = document.getElementById(`card-${modelo}`);
  if (cardSeleccionado) cardSeleccionado.classList.add('activo');
}

function mostrarCampos(modelo) {
  const contenedor = document.getElementById('formularioInputs');
  contenedor.innerHTML = '';

  // λ se usa siempre - AHORA EN CLIENTES/HORA
  contenedor.innerHTML += `
    <div class="input-group">
      <label for="lambda">Tasa de llegada λ (clientes/hora):</label>
      <input type="number" id="lambda" step="any" placeholder="210">
    </div>
  `;

  // μ se usa en todos excepto mm2
  if (modelo !== "mm2") {
    contenedor.innerHTML += `
      <div class="input-group" id="grupo-mu">
        <label for="mu">Tasa de servicio μ (clientes/hora):</label>
        <input type="number" id="mu" step="any" placeholder="300">
      </div>
    `;
  }

  // Campos específicos por modelo
  if (modelo === "mm1n") {
    contenedor.innerHTML += `
    <div class="input-group">
      <label for="n">Capacidad máxima (N):</label>
      <input type="number" id="n" placeholder="10">
    </div>
    <div class="input-group">
      <label for="nPn">Valor de n para calcular Pn:</label>
      <input type="number" id="nPn" placeholder="5">
    </div>
  `;
  }

  if (modelo === "mg1") {
    contenedor.innerHTML += `
      <div class="input-group">
        <label for="esperanzaServicio">Tiempo promedio de servicio E[S] (minutos):</label>
        <input type="number" id="esperanzaServicio" step="any" placeholder="0.2" min="0">
      </div>
      <div class="input-group">
        <label for="varianza">Varianza del tiempo de servicio σ² (minutos²):</label>
        <input type="number" id="varianza" step="any" placeholder="0.25" min="0">
      </div>
    `;
  }

  if (modelo === "md1") {
    contenedor.innerHTML += `
      <div class="input-group">
        <label for="d">E(s)Tiempo de servicio por cliente:</label>
        <input type="number" id="d" step="any" placeholder="0.2" min="0">
      </div>
    `;
  }

  if (modelo === "mm2") {
    contenedor.innerHTML += `
      </div>
      <div class="input-group">
        <label for="mu1">Tasa de servicio servidor 1 μ₁ (clientes/hora):</label>
        <input type="number" id="mu1" placeholder="180" step="any" min="0">
      </div>
      <div class="input-group">
        <label for="mu2">Tasa de servicio servidor 2 μ₂ (clientes/hora):</label>
        <input type="number" id="mu2" placeholder="240" step="any" min="0">
      </div>
      <div class="input-group">
        <label for="configuracion">Configuración de servidores:</label>
        <select id="configuracion">
          <option value="iguales">Servidores idénticos (μ₁ = μ₂)</option>
          <option value="sin_eleccion">Servidores distintos - Cola única</option>
          <option value="con_eleccion">Servidores distintos - Con elección</option>
        </select>
    `;
  }

  if (modelo === "mm1") {
    contenedor.innerHTML += `
    <div class="input-group">
      <label for="nPn">Valor de n (opcional para calcular Pn):</label>
      <input type="number" id="nPn" placeholder="Ej: 4" min="0">
    </div>
    <div class="input-group">
      <label for="tipoCalculo">Tipo de cálculo de probabilidad:</label>
      <select id="tipoCalculo">
        <option value="exactamente">P(X = n) - Exactamente n clientes</option>
        <option value="al_menos">P(X ≥ n) - Al menos n clientes</option>
        <option value="a_lo_sumo">P(X ≤ n) - A lo sumo n clientes</option>
      </select>
    </div>
  `;
  }
}

function calcular() {
  switch (modeloSeleccionado) {
    case "mm1":
      calcularMM1();
      break;
    case "mm1n":
      calcularMM1N();
      break;
    case "mm2":
      calcularMM2();
      break;
    case "mg1":
      calcularMG1();
      break;
    case "md1":
      calcularMD1();
      break;
    default:
      // Usar las nuevas clases para mostrar errores
      mostrarError('Seleccioná un modelo.');
  }
}

// Nueva función para mostrar errores con el nuevo diseño
function mostrarError(mensaje) {
  const contenedor = document.getElementById('resultados');
  const section = document.getElementById('resultadosSection');

  contenedor.innerHTML = `<div class="error">${mensaje}</div>`;
  section.classList.add('visible');
}

// Nueva función para mostrar resultados (si tus archivos mm1.js, etc. no la tienen)
function mostrarResultados(resultados) {
  const contenedor = document.getElementById('resultados');
  const section = document.getElementById('resultadosSection');

  const descripciones = {
    "Tasa de llegada (λ)": "Número promedio de clientes que llegan por hora al sistema.",
    "Utilización (ρ)": "Porcentaje de tiempo que el sistema está ocupado.",
    "Clientes en el sistema (L)": "Cantidad promedio de clientes en el sistema.",
    "Clientes en la cola (Lq)": "Cantidad promedio de clientes en espera.",
    "Tiempo en el sistema (W)": "Tiempo promedio que un cliente pasa en el sistema.",
    "Tiempo en la cola (Wq)": "Tiempo promedio que un cliente espera en la cola.",
    "P0": "Probabilidad de que el sistema esté vacío.",
    "P₀ (sin clientes)": "Probabilidad de que el sistema esté vacío.",
    "P₀ (sistema vacío)": "Probabilidad de que el sistema esté vacío.",
    "PN (bloqueo)": "Probabilidad de que el sistema esté lleno y se bloquee el ingreso.",
    "Tasa de llegada efectiva (λₑ)": "Tasa real de clientes que ingresan al sistema (descontando los rechazados).",
    "Tasa de rechazo": "Tasa de clientes rechazados por estar el sistema lleno.",
    "Configuración": "Tipo de configuración de servidores utilizada.",
    "Esperanza de servicio E[S]": "Tiempo promedio que toma servir a un cliente.",
    "Varianza del servicio (σ²)": "Varianza del tiempo de servicio (medida de variabilidad).",
    "Tasa de servicio (μ)": "Número promedio de clientes que pueden ser servidos por unidad de tiempo.",
    "Tiempo fijo de servicio (D)": "Tiempo constante que toma servir a cada cliente.",
    "Clientes en espera (Lq)": "Cantidad promedio de clientes esperando en la cola.",
    "Tiempo medio en espera (Wq)": "Tiempo promedio que un cliente espera en la cola.",
    "Tiempo medio en el sistema (W)": "Tiempo promedio que un cliente pasa en el sistema completo.",
    "Tasa servicio servidor 1 (μ₁)": "Tasa de servicio del primer servidor.",
    "Tasa servicio servidor 2 (μ₂)": "Tasa de servicio del segundo servidor.",
    "Tasa servicio total (μₜ)": "Suma de las tasas de servicio de ambos servidores.",
    "Utilización por servidor (ρₛ)": "Utilización promedio de cada servidor individual.",
    "Utilización total (ρₜ)": "Utilización total del sistema con ambos servidores.",
    "Utilización servidor 1 (ρ₁)": "Utilización específica del primer servidor.",
    "Utilización servidor 2 (ρ₂)": "Utilización específica del segundo servidor.",
    "Llegadas al servidor 1 (λ₁)": "Tasa de llegadas asignada al servidor 1.",
    "Llegadas al servidor 2 (λ₂)": "Tasa de llegadas asignada al servidor 2.",
    "P₁ (1 cliente)": "Probabilidad de que haya exactamente 1 cliente en el sistema.",
    "P₂ (2+ clientes)": "Probabilidad de que haya 2 o más clientes en el sistema.",
    "P₂+ (2+ clientes)": "Probabilidad de que haya 2 o más clientes en el sistema.",
    "P(ambos ocupados)": "Probabilidad de que ambos servidores estén ocupados.",
    "Clientes en servidor 1 (L₁)": "Cantidad promedio de clientes en el servidor 1.",
    "Clientes en servidor 2 (L₂)": "Cantidad promedio de clientes en el servidor 2.",
    "L": "Cantidad promedio de clientes en el sistema.",
    "Lq": "Cantidad promedio de clientes en la cola.",
    "W": "Tiempo promedio en el sistema por cliente.",
    "Wq": "Tiempo promedio de espera en la cola.",
  };

  // Agregar descripciones dinámicas para Pn específicos
  for (const key of Object.keys(resultados)) {
    if (key.startsWith('P') && key.match(/^P\d+$/)) {
      const n = key.substring(1);
      descripciones[key] = `Probabilidad de que haya exactamente ${n} clientes en el sistema.`;
    }
    // Nuevas descripciones para los diferentes tipos de cálculo
    else if (key.startsWith('P(X = ')) {
      const match = key.match(/P\(X = (\d+)\)/);
      if (match) {
        const n = match[1];
        descripciones[key] = `Probabilidad de que haya exactamente ${n} clientes en el sistema.`;
      }
    }
    else if (key.startsWith('P(X ≥ ')) {
      const match = key.match(/P\(X ≥ (\d+)\)/);
      if (match) {
        const n = match[1];
        descripciones[key] = `Probabilidad de que haya ${n} o más clientes en el sistema.`;
      }
    }
    else if (key.startsWith('P(X ≤ ')) {
      const match = key.match(/P\(X ≤ (\d+)\)/);
      if (match) {
        const n = match[1];
        descripciones[key] = `Probabilidad de que haya como máximo ${n} clientes en el sistema.`;
      }
    }
    else if (key === "Fórmula utilizada") {
      descripciones[key] = "Fórmula matemática utilizada para el cálculo de probabilidad.";
    }
  }

  let html = '<h3>Resultados</h3><div class="resultados-grid">';

  for (const [key, value] of Object.entries(resultados)) {
    let displayValue;
    let unidad = '';
    const keyLower = key.toLowerCase();

    // Verificar si el valor es un string (como "Configuración")
    if (typeof value === 'string') {
      displayValue = value;
    } else if (keyLower.includes('utilización') || key.includes('(ρ)')) {
      const porcentaje = (value * 100).toFixed(2);
      displayValue = `${value.toFixed(4)} (${porcentaje}%)`;
    } else if (keyLower.includes('tiempo') || keyLower.startsWith('w') || key.includes('(D)') || key.includes('E[S]')) {
      unidad = 'minutos';
      displayValue = `${value.toFixed(4)} ${unidad}`;
    } else if (keyLower.includes('clientes') || keyLower.startsWith('l')) {
      unidad = 'clientes';
      displayValue = `${value.toFixed(4)} ${unidad}`;
    } else if (keyLower.includes('tasa')) {
      if (keyLower.includes('llegada') && key.includes('(λ)')) {
        unidad = 'clientes/hora';
      } else if (keyLower.includes('servicio') && key.includes('(μ)')) {
        unidad = 'clientes/minuto';
      } else if (keyLower.includes('rechazo') || keyLower.includes('efectiva')) {
        unidad = 'clientes/hora';
      } else {
        unidad = 'clientes/hora';
      }
      displayValue = `${value.toFixed(4)} ${unidad}`;
    } else if (keyLower.includes('varianza') && key.includes('σ²')) {
      unidad = 'minutos²';
      displayValue = `${value.toFixed(4)} ${unidad}`;
    } else {
      displayValue = value.toFixed(4);
    }

    const descripcion = descripciones[key] || '';

    html += `
      <div class="resultado-item">
        <span class="resultado-label">${key}</span>
        <span class="resultado-valor">${displayValue}</span>
        <p class="resultado-descripcion">${descripcion}</p>
      </div>
    `;
  }

  html += '</div>';
  contenedor.innerHTML = html;
  section.classList.add('visible');
}

// Hacer la función mostrarResultados global para que tus otros archivos JS puedan usarla
window.mostrarResultados = mostrarResultados;
window.mostrarError = mostrarError;