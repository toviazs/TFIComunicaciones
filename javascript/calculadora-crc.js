window.addEventListener('DOMContentLoaded', () => {
    localStorage["tipoTeoria"] = 'default';

    const formCalculoCRC = document.getElementById('formCalculoCRC');

    formCalculoCRC.addEventListener('submit', evt => {
        evt.preventDefault();
        const txtMensaje = document.getElementById('txtMensaje').value;
        const txtGenerador = document.getElementById('txtGenerador').value;

        try {
            validarCadena(txtMensaje);
            validarCadena(txtGenerador);
            validarMensajeGeneradorCalculo(txtMensaje, txtGenerador);

            let mensaje = imprimir(comprimirNroBinario(txtMensaje));
            let generador = imprimir(comprimirNroBinario(txtGenerador));

            let resultado = calcularResto(mensaje, generador);
            renderCalculo(resultado);

            localStorage["generador"] = generador;
            localStorage["mensaje"] = mensaje;

            const sugerenciaTxt = document.getElementById('sugerenciaTxt');

            sugerenciaTxt.innerHTML = `<p class="text-center text-muted fs-4 fw-light">No entiendo, quiero ver la <a
            href="../teoría/teoria-crc.html">teoría</a>
            </p>
            <p class="text-center text-muted fs-4 fw-light">Prefiero ver la <a
            href="../teoría/teoria-crc.html" onClick="cambiarLocalStorage('tipoTeoria','personalizada')">teoría de mi cálculo</a>
            </p>`
        } catch (error) {
            renderCalculo(error.message);
        }
    })

    const formChequeoCRC = document.getElementById('formChequeoCRC');

    formChequeoCRC.addEventListener('submit', evt => {
        evt.preventDefault();
        const txtRecibido = document.getElementById('txtRecibido').value;
        const txtGenerador = document.getElementById('txtGenerador').value;

        try {
            validarCadena(txtRecibido);
            validarCadena(txtGenerador);
            validarMensajeGeneradorChequeo(txtRecibido, txtGenerador);

            let recibido = imprimir(comprimirNroBinario(txtRecibido));
            let generador = imprimir(comprimirNroBinario(txtGenerador));

            let resultado = chequearResto(recibido, generador);
            renderChequeo(resultado);
        } catch (error) {
            renderChequeo(error.message);
        }
    })
})

const cambiarLocalStorage = (indice, valor) => {
    localStorage[indice] = valor;
}

//#region Funciones principales

const calcularResto = (mensaje, generador) => {
    let printOperacion = '';
    let polinomioAuxiliar = formarP(mensaje, generador);

    printOperacion += `${imprimir(polinomioAuxiliar)}|${generador}`;

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
            resultadoXOR = operadorXOR(imprimirN(generador.length, '0'), partGenerador);
            ultimoGeneradorUsado = imprimirN(generador.length, '0');
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

        printOperacion += `\n${imprimirN(i, ' ')}${ultimoGeneradorUsado}\n${imprimirN(i, ' ')}${imprimirN(generador.length, '-')}\n${imprimirN(i + 1, ' ')}${imprimir(partGenerador)}`
        i++;
    }

    let resto = imprimir(partGenerador);

    let printCompleto = `generador: ${generador}\n\nmensaje: ${mensaje}\n\nresto: ${resto}\n\n\n`

    printCompleto += printOperacion;

    let mensajeFinal = mensaje + resto;

    renderConclusionCalculo(`Se transmite<br>T(X) = ${mensajeFinal}`);
    arrastrarResultado(mensajeFinal);

    return printCompleto;
}

const chequearResto = (mensaje, generador) => {
    let printOperacion = '';
    let polinomioAuxiliar = mensaje.split('');

    printOperacion += `${imprimir(polinomioAuxiliar)}|${generador}`;

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
            resultadoXOR = operadorXOR(imprimirN(generador.length, '0'), partGenerador);
            ultimoGeneradorUsado = imprimirN(generador.length, '0');
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

        printOperacion += `\n${imprimirN(i, ' ')}${ultimoGeneradorUsado}\n${imprimirN(i, ' ')}${imprimirN(generador.length, '-')}\n${imprimirN(i + 1, ' ')}${imprimir(partGenerador)}`
        i++;
    }

    let resto = imprimir(partGenerador);

    let printCompleto = `generador: ${generador}\n\nrecibido: ${mensaje}\n\nresto: ${resto}\n\n\n`

    printCompleto += printOperacion;

    if (parseInt(resto) == 0) {
        renderConclusionChequeo(`El resto es ${resto}<br>No hay error`, 'sinError');
    } else {
        renderConclusionChequeo(`El resto (${resto}) no es nulo<br>Hubo error`, 'error');
    }

    return printCompleto;
}

//#endregion

//#region Validaciones

const validarMensajeGeneradorChequeo = (mensaje, generador) => {
    gradoGenerador = generador.length - 1;
    gradoRecibido = mensaje.length - 1;
    gradoMensaje = gradoRecibido - gradoGenerador;

    if (gradoMensaje <= gradoGenerador) {
        throw new Error('El grado de T(X) debe ser mayor que la suma de los grados de G(X) y M(X)');
    }
}

const validarMensajeGeneradorCalculo = (mensaje, generador) => {
    if (mensaje.length <= generador.length) {
        throw new Error('El grado de M(X) debe ser mayor que el de G(X)');
    }
}

const validarCadena = (str) => {
    if (str == '') {
        throw new Error('Ingrese un generador');
    }

    if (str.length > 15) {
        throw new Error("Longitud máxima 15 bits")
    }

    for (let i = 0; i < str.length; i++) {
        if (str[i] != "0" && str[i] != "1") {
            throw new Error('La cadena ingresada no corresponde a un número binario')
        }
    }
}

//#endregion

//#region Impresiones

const imprimir = (array) => {
    let str = '';
    array.forEach(e => { str += `${e}`; });

    return str;
}

const renderCalculo = (texto) => {
    const txtAreaCalculo = document.getElementById('resultadoCalculoTxt');
    const txtAreaChequeo = document.getElementById('resultadoChequeoTxt');
    txtAreaChequeo.innerHTML = ''

    txtAreaCalculo.innerHTML = texto;

    let numLines = texto.split('\n').length;
    for (let i = 0; i < numLines; i++) {
        txtAreaChequeo.innerHTML += '\n';
    }
}

const renderChequeo = (texto) => {
    const txtAreaChequeo = document.getElementById('resultadoChequeoTxt');

    txtAreaChequeo.innerHTML = texto;
}

const renderConclusionCalculo = (texto) => {
    const div = document.getElementById("divConclusion");
    div.innerHTML = `
        <h1 class="display-5 fs-3 text-center centered" id="parrafoConclusion">
            ${texto}
        </h1>
        <img src="../recursos/flecha.png" alt="flecha" srcset="" class="imagen" width="100%">`
}

const renderConclusionChequeo = (texto, tipo) => {
    const div = document.getElementById("divConclusion");
    div.innerHTML = `
        <h1 class="display-5 fs-3 text-center centered" id="parrafoConclusion">
            ${texto}
        </h1>`

    if (tipo == 'error') {
        div.innerHTML += `
        <img src="../recursos/cruz.png" alt="cruz" srcset="" class="imagen" width="100%">`
    } else {
        div.innerHTML += `
        <img src="../recursos/tilde.png" alt="tilde" srcset="" class="imagen" width="100%">`
    }
}

const arrastrarResultado = (resultado) => {
    const txtRecibido = document.getElementById('txtRecibido');
    txtRecibido.value = resultado;
}

const imprimirN = (num, char) => {
    let str = '';
    for (let i = 0; i < num; i++) {
        str += char;
    }
    return str;
}

//#endregion

//#region Funciones del dominio

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

//#endregion