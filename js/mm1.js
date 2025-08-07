export function calcularMM1() {
  const lambda = parseFloat(document.getElementById("lambda").value);
  const mu = parseFloat(document.getElementById("mu").value);
  const nPn = parseInt(document.getElementById("nPn").value);
  const tipoCalculo = document.getElementById("tipoCalculo")?.value || "exactamente";

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
    let probabilidadCalculada;
    let etiqueta;

    switch (tipoCalculo) {
      case "exactamente":
        // P(X = n) = P₀ * ρⁿ
        probabilidadCalculada = P0 * Math.pow(rho, nPn);
        etiqueta = `P(X = ${nPn})`;
        break;

      case "al_menos":
        // P(X ≥ n) = ρⁿ (suma de la serie geométrica desde n hasta infinito)
        probabilidadCalculada = Math.pow(rho, nPn);
        etiqueta = `P(X ≥ ${nPn})`;
        break;

      case "a_lo_sumo":
        // P(X ≤ n) = 1 - ρⁿ⁺¹ (suma de la serie geométrica de 0 a n)
        probabilidadCalculada = 1 - Math.pow(rho, nPn + 1);
        etiqueta = `P(X ≤ ${nPn})`;
        break;

      default:
        probabilidadCalculada = P0 * Math.pow(rho, nPn);
        etiqueta = `P${nPn}`;
    }

    resultados[etiqueta] = probabilidadCalculada;

    // Agregar explicación de la fórmula usada
    const formulas = {
      "exactamente": `P(X = ${nPn}) = P₀ × ρ^${nPn} = ${P0.toFixed(4)} × ${rho.toFixed(4)}^${nPn}`,
      "al_menos": `P(X ≥ ${nPn}) = ρ^${nPn} = ${rho.toFixed(4)}^${nPn}`,
      "a_lo_sumo": `P(X ≤ ${nPn}) = 1 - ρ^${nPn + 1} = 1 - ${rho.toFixed(4)}^${nPn + 1}`
    };

    resultados["Fórmula utilizada"] = formulas[tipoCalculo] || formulas["exactamente"];
  }

  window.mostrarResultados(resultados);
}