function mostrarCampos()
 {
  const modelo = document.getElementById('modelo').value;
  const contenedor = document.getElementById('formularioInputs');
  contenedor.innerHTML = '';

  if (modelo === "mm1" || modelo === "mm1n" || modelo === "mm2" || modelo === "mg1" || modelo === "md1") {
    contenedor.innerHTML += `
      <label for="lambda">Tasa de llegada (λ):</label>
      <input type="number" id="lambda" step="any">
      <label for="mu">Tasa de servicio (μ):</label>
      <input type="number" id="mu" step="any">
    `;
  }
  if (modelo === "mm1n") {
    contenedor.innerHTML += `
      <label for="n">Capacidad máxima del sistema (N):</label>
      <input type="number" id="n">
    `;
  }
  if (modelo === "mg1") {
    contenedor.innerHTML += `
      <label for="varianza">Varianza del tiempo de servicio (σ²):</label>
      <input type="number" id="varianza" step="any">
    `;
  }
  if (modelo === "md1") {
    contenedor.innerHTML += `
      <label for="d">Tiempo fijo de servicio (D):</label>
      <input type="number" id="d" step="any">
    `;
  }
}


function calcular() 
{
  const modelo = document.getElementById('modelo').value;
  switch (modelo) {
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
      calcularMD1(); // ← CAMBIA alert() por calcularMD1()
      break;
    default:
      document.getElementById('resultados').innerHTML = '<p style="color:red">Seleccioná un modelo válido.</p>';
  }
}


function calcularMM1()
 {
  const lambda = parseFloat(document.getElementById('lambda').value);
  const mu = parseFloat(document.getElementById('mu').value);
  const resultados = document.getElementById('resultados');

  if (isNaN(lambda) || isNaN(mu) || lambda <= 0 || mu <= 0) {
    resultados.innerHTML = "<p style='color:red'>Ingresá valores válidos para λ y μ.</p>";
    return;
  }

  if (lambda >= mu) {
    resultados.innerHTML = "<p style='color:red'>El sistema no es estable: λ debe ser menor que μ.</p>";
    return;
  }

  const rho = lambda / mu;
  const L = lambda / (mu - lambda);
  const Lq = (lambda ** 2) / (mu * (mu - lambda));
  const W = 1 / (mu - lambda);
  const Wq = lambda / (mu * (mu - lambda));
  const P0 = 1 - rho;

  resultados.innerHTML = `
    <h3>Resultados M/M/1</h3>
    <ul>
      <li>ρ (utilización): ${rho.toFixed(4)}</li>
      <li>L (clientes en el sistema): ${L.toFixed(4)}</li>
      <li>Lq (clientes en la cola): ${Lq.toFixed(4)}</li>
      <li>W (tiempo en el sistema): ${W.toFixed(4)}</li>
      <li>Wq (tiempo en la cola): ${Wq.toFixed(4)}</li>
      <li>P₀ (sistema vacío): ${P0.toFixed(4)}</li>
    </ul>
  `;
}

function calcularMM1N()
 
{
  const lambda = parseFloat(document.getElementById('lambda').value);
  const mu = parseFloat(document.getElementById('mu').value);
  const N = parseInt(document.getElementById('n').value);
  const resultados = document.getElementById('resultados');

  if (isNaN(lambda) || isNaN(mu) || isNaN(N) || lambda <= 0 || mu <= 0 || N < 1) {
    resultados.innerHTML = "<p style='color:red'>Ingresá valores válidos para λ, μ y N.</p>";
    return;
  }

  const rho = lambda / mu;
  if (rho === 1) {
    resultados.innerHTML = "<p style='color:red'>Este modelo no está definido para ρ = 1 (λ = μ).</p>";
    return;
  }

  const numeradorP0 = 1 - rho;
  const denominadorP0 = 1 - Math.pow(rho, N + 1);
  const P0 = numeradorP0 / denominadorP0;

  let L = 0;
  for (let n = 0; n <= N; n++) {
    const Pn = P0 * Math.pow(rho, n);
    L += n * Pn;
  }

  const PN = P0 * Math.pow(rho, N);
  const Lq = L - (1 - P0);
  const lambdaEfectiva = lambda * (1 - PN);
  const W = L / lambdaEfectiva;
  const Wq = Lq / lambdaEfectiva;

  resultados.innerHTML = `
    <h3>Resultados M/M/1/N</h3>
    <ul>
      <li>ρ (utilización): ${rho.toFixed(4)}</li>
      <li>P₀ (sin clientes): ${P0.toFixed(4)}</li>
      <li>PN (bloqueo): ${PN.toFixed(4)}</li>
      <li>L (clientes en el sistema): ${L.toFixed(4)}</li>
      <li>Lq (clientes en la cola): ${Lq.toFixed(4)}</li>
      <li>W (tiempo en el sistema): ${W.toFixed(4)}</li>
      <li>Wq (tiempo en la cola): ${Wq.toFixed(4)}</li>
    </ul>
  `;
  
}

function calcularMM2() 
{
  const lambda = parseFloat(document.getElementById('lambda').value);
  const mu = parseFloat(document.getElementById('mu').value);
  const resultados = document.getElementById('resultados');

  if (isNaN(lambda) || isNaN(mu) || lambda <= 0 || mu <= 0) {
    resultados.innerHTML = "<p style='color:red'>Ingresá valores válidos para λ y μ.</p>";
    return;
  }

  const c = 2; // número de servidores
  const rho = lambda / (c * mu);

  if (rho >= 1) {
    resultados.innerHTML = "<p style='color:red'>El sistema no es estable (ρ debe ser menor que 1).</p>";
    return;
  }

  // Calcular sumatoria para P0
  let sumatoria = 0;
  for (let n = 0; n < c; n++) {
    sumatoria += Math.pow(lambda / mu, n) / factorial(n);
  }
  const parteFinal = (Math.pow(lambda / mu, c) / (factorial(c) * (1 - rho)));
  const P0 = 1 / (sumatoria + parteFinal);

  // Calcular Lq
  const Lq = (P0 * Math.pow(lambda / mu, c) * rho) / (factorial(c) * Math.pow(1 - rho, 2));

  // Calcular L, Wq y W
  const L = Lq + (lambda / mu);
  const Wq = Lq / lambda;
  const W = Wq + (1 / mu);

  resultados.innerHTML = `
    <h3>Resultados M/M/2</h3>
    <ul>
      <li>ρ (utilización): ${rho.toFixed(4)}</li>
      <li>P₀ (sistema vacío): ${P0.toFixed(4)}</li>
      <li>Lq (clientes en la cola): ${Lq.toFixed(4)}</li>
      <li>L (clientes en el sistema): ${L.toFixed(4)}</li>
      <li>Wq (tiempo en la cola): ${Wq.toFixed(4)}</li>
      <li>W (tiempo en el sistema): ${W.toFixed(4)}</li>
    </ul>
  `;
}

function factorial(n) {
  if (n === 0 || n === 1) return 1;
  let resultado = 1;
  for (let i = 2; i <= n; i++) {
    resultado *= i;
  }
  return resultado;
}


function calcularMG1() {
  const lambda = parseFloat(document.getElementById('lambda').value);
  const mu = parseFloat(document.getElementById('mu').value);
  const sigma2 = parseFloat(document.getElementById('varianza').value);
  const resultados = document.getElementById('resultados');

  if (
    isNaN(lambda) || isNaN(mu) || isNaN(sigma2) ||
    lambda <= 0 || mu <= 0 || sigma2 < 0
  ) {
    resultados.innerHTML = "<p style='color:red'>Ingresá valores válidos para λ, μ y σ².</p>";
    return;
  }

  const rho = lambda / mu;

  if (rho >= 1) {
    resultados.innerHTML = "<p style='color:red'>El sistema no es estable: ρ debe ser menor que 1.</p>";
    return;
  }

  const Lq = ((lambda ** 2) * sigma2 + rho * rho) / (2 * (1 - rho));
  const L = Lq + rho;
  const Wq = Lq / lambda;
  const W = Wq + (1 / mu);

  resultados.innerHTML = `
    <h3>Resultados M/G/1</h3>
    <ul>
      <li>ρ (utilización): ${rho.toFixed(4)}</li>
      <li>Lq (clientes en la cola): ${Lq.toFixed(4)}</li>
      <li>L (clientes en el sistema): ${L.toFixed(4)}</li>
      <li>Wq (tiempo en la cola): ${Wq.toFixed(4)}</li>
      <li>W (tiempo en el sistema): ${W.toFixed(4)}</li>
    </ul>
  `;
}


function calcularMD1() {
  const lambda = parseFloat(document.getElementById('lambda').value);
  const mu = parseFloat(document.getElementById('mu').value);
  const d = parseFloat(document.getElementById('d').value);
  const resultados = document.getElementById('resultados');

  if (
    isNaN(lambda) || isNaN(mu) || isNaN(d) ||
    lambda <= 0 || mu <= 0 || d <= 0
  ) {
    resultados.innerHTML = "<p style='color:red'>Ingresá valores válidos para λ, μ y D.</p>";
    return;
  }

  const rho = lambda / mu;

  if (rho >= 1) {
    resultados.innerHTML = "<p style='color:red'>El sistema no es estable: ρ debe ser menor que 1.</p>";
    return;
  }

  const Lq = (rho * rho) / (2 * (1 - rho));
  const L = Lq + rho;
  const Wq = Lq / lambda;
  const W = Wq + (1 / mu);

  resultados.innerHTML = `
    <h3>Resultados M/D/1</h3>
    <ul>
      <li>ρ (utilización): ${rho.toFixed(4)}</li>
      <li>Lq (clientes en la cola): ${Lq.toFixed(4)}</li>
      <li>L (clientes en el sistema): ${L.toFixed(4)}</li>
      <li>Wq (tiempo en la cola): ${Wq.toFixed(4)}</li>
      <li>W (tiempo en el sistema): ${W.toFixed(4)}</li>
    </ul>
  `;
}

