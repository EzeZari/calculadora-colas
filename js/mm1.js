export function calcularMM1() {
  const lambda = parseFloat(document.getElementById("lambda").value);
  const mu = parseFloat(document.getElementById("mu").value);
  const nPn = parseInt(document.getElementById("nPn").value);

  if (isNaN(lambda) || isNaN(mu) || lambda <= 0 || mu <= 0) {
    window.mostrarError("Por favor, ingresá valores válidos para λ y μ (mayores que 0).");
    return;
  }

  const rho = lambda / mu;
  
  if (rho >= 1) {
    window.mostrarError("El sistema es inestable. La utilización (ρ = λ/μ) debe ser menor a 1.");
    return;
  }

  const P0 = 1 - rho;
  const L = rho / (1 - rho);
  const Lq = (rho ** 2) / (1 - rho);
  const W = 1 / (mu - lambda);
  const Wq = rho / (mu - lambda);

  // Preparar resultados
  const resultados = {
    "Utilización (ρ)": rho,
    "P₀ (sin clientes)": P0,
    "Clientes en el sistema (L)": L,
    "Clientes en la cola (Lq)": Lq,
    "Tiempo en el sistema (W)": W,
    "Tiempo en la cola (Wq)": Wq
  };

  // Calcular Pn específico si se ingresó un valor
  if (!isNaN(nPn) && nPn >= 0) {
    const PnEspecifico = P0 * Math.pow(rho, nPn);
    resultados[`P${nPn}`] = PnEspecifico;
  }

  window.mostrarResultados(resultados);
}