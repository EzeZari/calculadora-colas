export function calcularMM2() {
  const lambda = parseFloat(document.getElementById("lambda").value);
  const mu1 = parseFloat(document.getElementById("mu1").value);
  const mu2 = parseFloat(document.getElementById("mu2").value);
  const configuracion = document.getElementById("configuracion").value;

  if (isNaN(lambda) || isNaN(mu1) || isNaN(mu2) || lambda <= 0 || mu1 <= 0 || mu2 <= 0) {
    window.mostrarError("Por favor, ingresá valores válidos para λ, μ₁ y μ₂ (todos mayores que 0).");
    return;
  }

  let resultados = {};

  if (configuracion === "iguales") {
    // Servidores idénticos - usar μ1 como la tasa común
    const mu = mu1;
    const rho = lambda / mu;
    const rhoTotal = lambda / (2 * mu);

    if (rhoTotal >= 1) {
      window.mostrarError("El sistema no es estable. ρ = λ/(2×μ) debe ser menor que 1.");
      return;
    }

    // Fórmulas M/M/2 clásico
    const P0 = (1 - rhoTotal) / (1 + rho + rho * rhoTotal);
    const P1 = rho * P0;
    const P2_mas = (rho * rhoTotal * P0) / (1 - rhoTotal);

    const Lq = (rho * rho * rhoTotal * P0) / (2 * (1 - rhoTotal) * (1 - rhoTotal));
    const L = Lq + rho;
    const Wq = Lq / lambda;
    const W = L / lambda;

    resultados = {
      "Configuración": "Servidores idénticos",
      "Tasa de servicio (μ)": mu,
      "Utilización total (ρₜ)": rhoTotal,
      "P₀ (sistema vacío)": P0,
      "P₁ (1 cliente)": P1,
      "P₂+ (2+ clientes)": P2_mas,
      "Clientes en la cola (Lq)": Lq,
      "Clientes en el sistema (L)": L,
      "Tiempo en la cola (Wq)": Wq,
      "Tiempo en el sistema (W)": W
    };

  } else if (configuracion === "con_eleccion") {
    // Servidores distintos con elección
    const muTotal = mu1 + mu2;
    if (lambda >= muTotal) {
      window.mostrarError("El sistema no es estable. λ debe ser menor que (μ₁ + μ₂).");
      return;
    }

    // Distribución proporcional de llegadas
    const lambda1 = lambda * (mu1 / muTotal);
    const lambda2 = lambda * (mu2 / muTotal);

    const rho1 = lambda1 / mu1;
    const rho2 = lambda2 / mu2;
    const rhoTotal = lambda / muTotal;

    const P0 = (1 - rho1) * (1 - rho2);

    const L1 = rho1 / (1 - rho1);
    const L2 = rho2 / (1 - rho2);
    const L = L1 + L2;

    const Lq1 = (rho1 * rho1) / (1 - rho1);
    const Lq2 = (rho2 * rho2) / (1 - rho2);
    const Lq = Lq1 + Lq2;

    const W = L / lambda;
    const Wq = Lq / lambda;

    resultados = {
      "Configuración": "Servidores distintos con elección",
      "Tasa servicio servidor 1 (μ₁)": mu1,
      "Tasa servicio servidor 2 (μ₂)": mu2,
      "Llegadas al servidor 1 (λ₁)": lambda1,
      "Llegadas al servidor 2 (λ₂)": lambda2,
      "Utilización servidor 1 (ρ₁)": rho1,
      "Utilización servidor 2 (ρ₂)": rho2,
      "Utilización total (ρₜ)": rhoTotal,
      "P₀ (sistema vacío)": P0,
      "Clientes en servidor 1 (L₁)": L1,
      "Clientes en servidor 2 (L₂)": L2,
      "Clientes en la cola (Lq)": Lq,
      "Clientes en el sistema (L)": L,
      "Tiempo en la cola (Wq)": Wq,
      "Tiempo en el sistema (W)": W
    };

  } else {
    // Servidores distintos sin elección (cola única)
    const muTotal = mu1 + mu2;
    const rhoTotal = lambda / muTotal;

    if (rhoTotal >= 1) {
      window.mostrarError("El sistema no es estable. λ debe ser menor que (μ₁ + μ₂).");
      return;
    }

    // Aproximación usando servidor promedio ponderado
    const muPromedio = (mu1 + mu2) / 2;
    const rho = lambda / muPromedio;

    // Usar fórmulas similares a M/M/2 pero ajustadas para servidores heterogéneos
    const P0 = 1 / (1 + rho + (rho * rho / 2) / (1 - rhoTotal));
    const P1 = rho * P0;
    const P2_mas = (rho * rho / 2) * P0 / (1 - rhoTotal);

    const Lq = P2_mas * rhoTotal / (1 - rhoTotal);
    const L = Lq + rho;
    const Wq = Lq / lambda;
    const W = L / lambda;

    // Utilización aproximada de cada servidor
    const util1 = lambda / (mu1 + mu2 - lambda) * (mu2 / muTotal);
    const util2 = lambda / (mu1 + mu2 - lambda) * (mu1 / muTotal);

    resultados = {
      "Configuración": "Servidores distintos sin elección",
      "Tasa servicio servidor 1 (μ₁)": mu1,
      "Tasa servicio servidor 2 (μ₂)": mu2,
      "Tasa servicio total (μₜ)": muTotal,
      "Utilización servidor 1 (ρ₁)": util1,
      "Utilización servidor 2 (ρ₂)": util2,
      "Utilización total (ρₜ)": rhoTotal,
      "P₀ (sistema vacío)": P0,
      "P₁ (1 cliente)": P1,
      "P₂+ (2+ clientes)": P2_mas,
      "Clientes en la cola (Lq)": Lq,
      "Clientes en el sistema (L)": L,
      "Tiempo en la cola (Wq)": Wq,
      "Tiempo en el sistema (W)": W
    };
  }

  window.mostrarResultados(resultados);
}