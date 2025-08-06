export function calcularMM1N() {
  const lambda = parseFloat(document.getElementById("lambda").value);
  const mu = parseFloat(document.getElementById("mu").value);
  const N = parseInt(document.getElementById("n").value);
  const nPn = parseInt(document.getElementById("nPn").value);

  if (isNaN(lambda) || isNaN(mu) || isNaN(N) || lambda <= 0 || mu <= 0 || N < 1) {
    window.mostrarError("Ingresá valores válidos para λ, μ y N (todos mayores que 0, N ≥ 1).");
    return;
  }

  const rho = lambda / mu;

  // Para M/M/1/N, el sistema puede ser estable incluso con ρ ≥ 1 porque tiene capacidad limitada
  // Solo verificamos que no sea exactamente 1 para evitar división por cero en algunas fórmulas
  if (rho === 1) {
    window.mostrarError("Este modelo no está definido para ρ = 1 (λ = μ). Usá valores ligeramente diferentes.");
    return;
  }

  const P0 = (1 - rho) / (1 - Math.pow(rho, N + 1));
  let L = 0;
  for (let n = 0; n <= N; n++) {
    const Pn = P0 * Math.pow(rho, n);
    L += n * Pn;
  }

  const PN = P0 * Math.pow(rho, N);
  const Lq = L - (1 - P0);
  const lambdaEfectiva = lambda * (1 - PN);
  const tasaRechazo = lambda * PN;
  const W = L / lambdaEfectiva;
  const Wq = Lq / lambdaEfectiva;

  // Preparar resultados
  const resultados = {
    "Utilización (ρ)": rho,
    "P₀ (sin clientes)": P0,
    "PN (bloqueo)": PN,
    "Tasa de llegada efectiva (λₑ)": lambdaEfectiva,
    "Tasa de rechazo": tasaRechazo,
    "Clientes en el sistema (L)": L,
    "Clientes en la cola (Lq)": Lq,
    "Tiempo en el sistema (W)": W,
    "Tiempo en la cola (Wq)": Wq
  };

  // Calcular Pn específico si se ingresó un valor
  if (!isNaN(nPn) && nPn >= 0 && nPn <= N) {
    const PnEspecifico = P0 * Math.pow(rho, nPn);
    resultados[`P${nPn}`] = PnEspecifico;
  } else if (!isNaN(nPn) && (nPn < 0 || nPn > N)) {
    window.mostrarError(`El valor de n para Pn debe estar entre 0 y ${N} (capacidad máxima del sistema).`);
    return;
  }

  window.mostrarResultados(resultados);
}