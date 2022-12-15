window.addEventListener('DOMContentLoaded', () => {
    if (localStorage["tipoTeoria"] == 'default') {
        renderAlgoritmoPorDefecto();
    } else {
        const mensaje = localStorage["mensaje"];
        const generador = localStorage["generador"];
        renderAlgoritmoPersonalizado(mensaje, generador);
    }
});

const renderAlgoritmoPorDefecto = () => {
    //Paso 1
    const paso1Item = document.getElementById('paso1');
    paso1Item.innerHTML += `<img src="../recursos/item-1.png" width="100%">`;

    //Paso 2
    const paso2Item = document.getElementById('paso2');
    paso2Item.innerHTML += `<img src="../recursos/item-2.png" width="100%">`;

    //Paso 3
    const paso3Item = document.getElementById('paso3');
    paso3Item.innerHTML += `<img src="../recursos/item-3.png" width="100%">`;

    //Paso 4
    const paso4Item = document.getElementById('paso4');
    paso4Item.innerHTML += `<img src="../recursos/item-4.png" width="100%">`;

    //Paso 5
    const paso5Item = document.getElementById('paso5');
    paso5Item.innerHTML += `<img src="../recursos/item-5.png" width="100%">`;

    //Paso 6
    const paso6Item = document.getElementById('paso6');
    paso6Item.innerHTML += `<img src="../recursos/item-6.png" width="100%">`;

    //Paso 7
    const paso7Item = document.getElementById('paso7');
    paso7Item.innerHTML += `<img src="../recursos/item-7.png" width="100%">`;

    //Paso 8
    const paso8Item = document.getElementById('paso8');
    paso8Item.innerHTML += `<img src="../recursos/item-8.png" width="100%">`;
}

const renderAlgoritmoPersonalizado = (mensaje, generador) => {
    //Paso 1
    let printPaso1 = `M(x) = ${mensaje} = ${transformarAPolinomio(mensaje)}`;
    const paso1Item = document.getElementById('paso1');
    paso1Item.innerHTML += `<p class="txtItem p-5" id="resultadoChequeoTxt">${printPaso1}</p>`;

    //Paso 2
    let printPaso2 = `G(x) = ${generador} = ${transformarAPolinomio(generador)}`;
    const paso2Item = document.getElementById('paso2');
    paso2Item.innerHTML += `<p class="txtItem p-5" id="resultadoChequeoTxt">${printPaso2}</p>`;

    //Paso 3
    let printPaso3 = `X^r = x^${generador.length - 1}\nn = ${mensaje.length - 1} >> ${generador.length - 1} = r`;
    const paso3Item = document.getElementById('paso3');
    paso3Item.innerHTML += `<p class="txtItem p-5" id="resultadoChequeoTxt">${printPaso3}</p>`;

    //Paso 4
    let polinomioAuxiliar = mensaje.split('');
    for (let i = 0; i < generador.length - 1; i++) {
        polinomioAuxiliar.push('0');
    }
    let polinomioAuxiliarStr = imprimir(polinomioAuxiliar);
    let printPaso4 = `P(x) = x^${generador.length - 1}(${transformarAPolinomio(mensaje)})\nP(x) = ${polinomioAuxiliarStr}`;
    const paso4Item = document.getElementById('paso4');
    paso4Item.innerHTML += `<p class="txtItem p-5" id="resultadoChequeoTxt">${printPaso4}</p>`;

    //Paso 5
    const res = calcularResto(generador, polinomioAuxiliar);
    let resto = imprimir(comprimirNroBinario(res.resto));
    resto = resto == '' ? '0' : resto;
    const printPaso5 = res.print;
    const paso5Item = document.getElementById('paso5');
    paso5Item.innerHTML += `<p class="txtDivision p-5" id="resultadoChequeoTxt">${printPaso5}</p>`

    //Paso 6
    let recibidoStr = `${parseInt(polinomioAuxiliarStr) + parseInt(resto)}`;
    let recibidoArray = recibidoStr.split('');
    let printPaso6 = `T(x) = P(x) + R(x)\nT(x) = (${transformarAPolinomio(polinomioAuxiliarStr)}) + (${transformarAPolinomio(resto)})`;
    printPaso6 += `\nT(x) = ${recibidoStr}`;
    const paso6Item = document.getElementById('paso6');
    paso6Item.innerHTML += `<p class="txtItem p-5" id="resultadoChequeoTxt">${printPaso6}</p>`;

    //Paso 7
    const paso7Item = document.getElementById('paso7');
    paso7Item.innerHTML += `<img src="../recursos/item-7.png" width="100%">`;

    //Paso 8
    let printPaso8 = calcularResto(generador, recibidoArray).print;
    const paso8Item = document.getElementById('paso8');
    paso8Item.innerHTML += `<p class="txtDivision p-5" id="resultadoChequeoTxt">${printPaso8}</p>`;
}

const transformarAPolinomio = (numeroBinario) => {
    let longitud = numeroBinario.length;
    let numeroBinarioArray = numeroBinario.split('');
    let polinomio = '';

    for (i = 0; i < longitud; i++) {
        if (numeroBinarioArray[i] == '1') {
            if (i == 0) {
                polinomio += longitud == 1 ? `1` : `x^${longitud - 1}`;
            } else if (i == longitud - 1) {
                polinomio += ` + 1`;
            } else if (i == longitud - 2) {
                polinomio += ` + x`;
            } else {
                polinomio += ` + x^${longitud - i - 1}`;
            }
        }
    }

    return polinomio;
}

const imprimir = (array) => {
    let str = '';
    array.forEach(e => { str += `${e}`; });

    return str;
}

const calcularResto = (generador, polinomioAuxiliar) => {
    let printOperacion = `${imprimir(polinomioAuxiliar)}|${generador}`;

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

    return { print: printOperacion, resto: resto };
}

const operadorXOR = (str1, str2) => {
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

const imprimirN = (num, char) => {
    let str = '';
    for (let i = 0; i < num; i++) {
        str += char;
    }
    return str;
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