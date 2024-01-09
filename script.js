document.addEventListener('DOMContentLoaded', function () {
    const expresionInput = document.getElementById('expresion');

    function insertarEnExpresion(caracter) {
        expresionInput.value += caracter;
    }

    document.querySelectorAll('.botones button').forEach(button => {
        button.addEventListener('click', () => insertarEnExpresion(button.textContent));
    });

    function generarCombinaciones(n) {
        let combinaciones = [];
        for (let i = 0; i < (1 << n); i++) {
            let combinacion = [];
            for (let j = 0; j < n; j++) {
                combinacion.push(Boolean(i & (1 << j)));
            }
            combinaciones.push(combinacion);
        }
        return combinaciones;
    }

    function evaluarExpresion(expresion, valores, variables) {
        let exprModificada = expresion;
        variables.forEach((variable, index) => {
            const valorString = valores[index] ? "true" : "false";
            const regex = new RegExp('\\b' + variable + '\\b', 'g');
            exprModificada = exprModificada.replace(regex, valorString);
        });

        exprModificada = exprModificada.replace(/∧/g, '&&')
                                       .replace(/∨/g, '||')
                                       .replace(/¬/g, '!')
                                       .replace(/→/g, ' <= ')
                                       .replace(/↔/g, ' === ');

        try {
            return eval(exprModificada);
        } catch (error) {
            console.error('Error al evaluar la expresión:', error);
            return false;
        }
    }

    function determinarTipoFormula(resultados) {
        const todosVerdaderos = resultados.every(r => r.resultado);
        const todosFalsos = resultados.every(r => !r.resultado);

        if (todosVerdaderos) return 'Tautología';
        if (todosFalsos) return 'Contradicción';
        return 'Fórmula Neutra';
    }

    function mostrarResultados(resultados, variables, tipoFormula) {
        const resultadoDiv = document.getElementById('resultadoTabla');
        let html = `<table border="1"><tr>${variables.map(v => `<th>${v}</th>`).join('')}<th>Resultado</th></tr>`;

        resultados.forEach(r => {
            html += `<tr>${r.valores.map(valor => `<td>${valor ? '1' : '0'}</td>`).join('')}<td>${r.resultado ? '1' : '0'}</td></tr>`;
        });

        html += `</table>`;
        html += `<p><strong>Tipo de Fórmula: ${tipoFormula}</strong></p>`;
        resultadoDiv.innerHTML = html;
    }

    document.getElementById('btnLimpiar').addEventListener('click', function () {
        expresionInput.value = '';
        document.getElementById('resultadoTabla').innerHTML = '';
    });

    document.getElementById('tablaVerdadForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const expresion = expresionInput.value;
        const variables = [...new Set(expresion.match(/[a-z]/g))].sort();
        const combinaciones = generarCombinaciones(variables.length);
        const resultados = combinaciones.map(valores => {
            return {
                valores,
                resultado: evaluarExpresion(expresion, valores, variables)
            };
        });

        const tipoFormula = determinarTipoFormula(resultados);
        mostrarResultados(resultados, variables, tipoFormula);
    });
});
