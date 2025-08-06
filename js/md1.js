export function calcularMD1() {
    const lambda = parseFloat(document.getElementById('lambda').value);
    const d = parseFloat(document.getElementById('d').value);

    if (isNaN(lambda) || isNaN(d)) {
        window.mostrarError("Ingresá valores válidos para λ y D.");
        return;
    }

    if (lambda <= 0 || d <= 0) {
        window.mostrarError("Ingresá valores válidos (λ > 0, D > 0).");
        return;
    }

    // En M/D/1, μ = 1/D porque el tiempo de servicio es fijo (determinístico)
    const mu = 1 / d;
    const rho = lambda / mu; // Equivale a lambda * d

    if (rho >= 1) {
        window.mostrarError("El sistema no es estable. ρ = λ × D debe ser menor que 1.");
        return;
    }

    // P₀ para M/D/1
    const P0 = 1 - rho;

    // Fórmulas para modelo M/D/1 (caso especial de M/G/1 con varianza = 0)
    // Wq = (ρ × D) / (2 × (1 - ρ))
    const Wq = (rho * d) / (2 * (1 - rho));

    // W = Wq + D (tiempo de servicio fijo)
    const W = Wq + d;

    // Lq = λ × Wq
    const Lq = lambda * Wq;

    // L = λ × W
    const L = lambda * W;

    // Preparar resultados siguiendo el formato de mm1n.js
    const resultados = {
        "Utilización (ρ)": rho,
        "P₀ (sistema vacío)": P0,
        "Tasa de servicio (μ)": mu,
        "Tiempo fijo de servicio (D)": d,
        "Clientes en el sistema (L)": L,
        "Clientes en la cola (Lq)": Lq,
        "Tiempo en el sistema (W)": W,
        "Tiempo en la cola (Wq)": Wq
    };

    window.mostrarResultados(resultados);
}