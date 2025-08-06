export function calcularMG1() {
    const lambda = parseFloat(document.getElementById('lambda').value) / 60; // Convertir de clientes/hora a clientes/minuto
    const esperanzaServicio = parseFloat(document.getElementById('esperanzaServicio').value);
    const varianza = parseFloat(document.getElementById('varianza').value);

    if (isNaN(lambda) || isNaN(esperanzaServicio) || isNaN(varianza)) {
        window.mostrarError("Ingresá valores válidos para λ, E[S] y σ².");
        return;
    }

    if (lambda <= 0 || esperanzaServicio <= 0 || varianza < 0) {
        window.mostrarError("Ingresá valores válidos (λ > 0, E[S] > 0, σ² ≥ 0).");
        return;
    }

    // Calcular μ a partir de E[S] - usando tu fórmula: μ = 1 / E(s)
    const mu = 1 / esperanzaServicio;

    // Calcular ρ - usando tu fórmula: ρ = λ / μ
    const rho = lambda / mu;

    if (rho >= 1) {
        window.mostrarError("El sistema no es estable (ρ ≥ 1). ρ = λ / μ debe ser menor que 1.");
        return;
    }

    // P₀ para M/G/1
    const P0 = 1 - rho;

    // Fórmulas de Pollaczek-Khinchine usando tu implementación
    // Tu fórmula: Lq = (λ²·θ + ρ²) / [2(1 - ρ)]
    // Donde θ es la varianza (σ²)
    const Lq = (Math.pow(lambda, 2) * varianza + Math.pow(rho, 2)) / (2 * (1 - rho));

    // Tu fórmula: E(n) = Lq + ρ
    const L = Lq + rho;

    // Tu fórmula: wq = Lq / λ
    const Wq = Lq / lambda;

    // Tu fórmula: E(T) = wq + E(s)
    const W = Wq + esperanzaServicio;

    // Preparar resultados siguiendo el formato de mm1n.js
    const resultados = {
        "Utilización (ρ)": rho,
        "P₀ (sistema vacío)": P0,
        "Tasa de servicio (μ)": mu,
        "Esperanza de servicio E[S]": esperanzaServicio,
        "Varianza del servicio (σ²)": varianza,
        "Clientes en el sistema (L)": L,
        "Clientes en la cola (Lq)": Lq,
        "Tiempo en el sistema (W)": W,
        "Tiempo en la cola (Wq)": Wq
    };

    window.mostrarResultados(resultados);
}