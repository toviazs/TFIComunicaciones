window.addEventListener('DOMContentLoaded', () => {
    const formCRC = document.getElementById('formCRC');

    formCRC.addEventListener('submit', evt => {
        evt.preventDefault();
        const txtMensaje = document.getElementById('txtMensaje').value;
        const txtGenerador = document.getElementById('txtGenerador').value;

        try {
            validarCadena(txtMensaje);
            validarCadena(txtGenerador);
            validarMensajeGenerador(txtMensaje, txtGenerador);

            let mensaje = imprimir(comprimirNroBinario(txtMensaje));
            let generador = imprimir(comprimirNroBinario(txtGenerador));

            let resultado = calcularResto(mensaje, generador);
            render(resultado);
        } catch (error) {
            render(error.message);
        }
    })
})


const calcularResto = (mensaje, generador) => {
    let printOperacion = '';
    let polinomioAuxiliar = mensaje.split('');

    printOperacion += `
${imprimir(polinomioAuxiliar)}|${generador}`;

    let i = 0;
    let partMensaje;
    let resultadoXOR;
    let partGenerador;
    let ultimoGeneradorUsado;
    while (polinomioAuxiliar.length >= generador.length) {
        partMensaje = polinomioAuxiliar.slice(0, generador.length);

        if (i == 0) {
            resultadoXOR = operadorXOR(partMensaje, generador);
            ultimoGeneradorUsado = generador;
        } else if (partGenerador[0] == '0') {
            resultadoXOR = operadorXOR(imprimirNCeros(generador.length), partGenerador);
            ultimoGeneradorUsado = imprimirNCeros(generador.length);
        } else {
            resultadoXOR = operadorXOR(generador, partGenerador);
            ultimoGeneradorUsado = generador;
        }

        polinomioAuxiliar.shift();

        if (polinomioAuxiliar.length >= generador.length) {
            partGenerador = resultadoXOR.concat(polinomioAuxiliar[generador.length - 1]);
        } else {
            partGenerador = resultadoXOR;
        }
        partGenerador.shift();

        printOperacion += `
${imprimirNEspacios(i)}${ultimoGeneradorUsado}
${imprimirNEspacios(i)}${imprimirNGuiones(generador.length)}
${imprimirNEspacios(i + 1)}${imprimir(partGenerador)}`
        i++;
    }

    let resto = imprimir(partGenerador);

    let printCompleto = `G(X) = ${generador} | generador\n
T(X) = ${mensaje} | recibido\n
R(X) = ${resto} | resto\n\n
Operación:
`

    printCompleto += printOperacion;

    if (parseInt(resto) == 0) {
        renderConclusion(`El resto es ${resto}<br>No hay error`);
    } else {
        renderConclusion(`El resto (${resto}) no es nulo<br>Hubo error en la transmisión`);
    }

    return printCompleto;
}

const imprimirNEspacios = (num) => {
    let str = '';
    for (let i = 0; i < num; i++) {
        str += ' ';
    }
    return str;
}

const imprimirNGuiones = (num) => {
    let str = '';
    for (let i = 0; i < num; i++) {
        str += '-';
    }
    return str;
}

const imprimirNCeros = (num) => {
    let str = "";
    for (let i = 0; i < num; i++) {
        str += '0';
    }
    return str;
}

const formarP = (mensaje, generador) => {
    const n = generador.split('').length - 1;
    let polinomioAuxiliar = mensaje.split('');

    for (let i = 0; i < n; i++) {
        polinomioAuxiliar.push('0');
    }

    return polinomioAuxiliar;
}

const operadorXOR = (str1, str2) => {
    if (str1.length != str2.length) {
        throw new Error('Ambos numeros deben tener igual longitud');
    }

    let resultado = [];
    for (let i = 0; i < str1.length; i++) {
        if (str1[i] != str2[i]) {
            resultado[i] = '1';
        } else {
            resultado[i] = '0';
        }
    }

    return resultado;
}

const validarCadena = (str) => {
    if (str == '') {
        throw new Error('Hay campos vacíos');
    }

    for (let i = 0; i < str.length; i++) {
        if (str[i] != "0" && str[i] != "1") {
            throw new Error('La cadena ingresada no corresponde a un número binario')
        }
    }
    return true;
}

const validarMensajeGenerador = (mensaje, generador) => {
    gradoGenerador = generador.length - 1;
    gradoRecibido = mensaje.length - 1;
    gradoMensaje = gradoRecibido - gradoGenerador;

    if (gradoMensaje <= gradoGenerador) {
        throw new Error('El grado de T(X) debe ser mayor que la suma de los grados de G(X) y M(X)');
    }
}

const comprimirNroBinario = (str) => {
    let isSignificativo = false;
    let strComprimido = [];
    let j = 0;
    for (let i = 0; i < str.length; i++) {

        if (str[i] == "1") isSignificativo = true;

        if (isSignificativo) {
            strComprimido[j] = str[i];
            j++;
        }
    }

    return strComprimido;
}

const imprimir = (array) => {
    let str = '';
    array.forEach(e => {
        str += `${e}`;
    })

    return str;
}

const render = (texto) => {
    const txtArea = document.getElementById('resultadoTxt');
    txtArea.innerHTML = ''

    txtArea.innerHTML = texto;
}

const renderConclusion = (texto) => {
    const parrafo = document.getElementById("parrafoConclusion");
    parrafo.innerHTML = ''
    parrafo.innerHTML = texto;
}