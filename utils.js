// Funciones utilitarias

// Formatear fecha actual
function obtenerFechaActual() {
    return new Date().toISOString().split('T')[0];
}

// Formatear fecha y hora para reloj
function formatearFechaHora() {
    return new Date().toLocaleString('es-HN');
}

// Formatear minutos a texto legible
function formatearTiempo(minutos) {
    const h = Math.floor(minutos / 60);
    const m = Math.round(minutos % 60);
    return `${h}h ${m}m`;
}

// Calcular horas trabajadas
function calcularHoras(entrada, salida) {
    if (!entrada || !salida) return null;
    
    const [entradaH, entradaM] = entrada.split(':').map(Number);
    const [salidaH, salidaM] = salida.split(':').map(Number);
    
    let entradaMinutos = entradaH * 60 + entradaM;
    let salidaMinutos = salidaH * 60 + salidaM;
    
    // Si salida es menor, asumir día siguiente
    if (salidaMinutos <= entradaMinutos) {
        salidaMinutos += 24 * 60;
    }
    
    const totalMinutos = salidaMinutos - entradaMinutos;
    const totalHoras = totalMinutos / 60;
    
    // Distribución de horas
    let horasNormales = 0;
    let horasExtra50 = 0;
    let horasExtra100 = 0;
    
    if (totalHoras <= CONFIG.HORAS_NORMALES_DIA) {
        horasNormales = totalHoras;
    } else if (totalHoras <= CONFIG.HORAS_EXTRA_50_LIMITE) {
        horasNormales = CONFIG.HORAS_NORMALES_DIA;
        horasExtra50 = totalHoras - CONFIG.HORAS_NORMALES_DIA;
    } else {
        horasNormales = CONFIG.HORAS_NORMALES_DIA;
        horasExtra50 = CONFIG.HORAS_EXTRA_50_LIMITE - CONFIG.HORAS_NORMALES_DIA;
        horasExtra100 = totalHoras - CONFIG.HORAS_EXTRA_50_LIMITE;
    }
    
    return {
        totalMinutos,
        totalHoras,
        horasNormales,
        horasExtra50,
        horasExtra100,
        formatoTotal: formatearTiempo(totalMinutos),
        formatoNormales: formatearTiempo(horasNormales * 60),
        formatoExtra50: formatearTiempo(horasExtra50 * 60),
        formatoExtra100: formatearTiempo(horasExtra100 * 60)
    };
}

// Mostrar/ocultar elemento
function mostrarElemento(elemento, mostrar = true) {
    if (mostrar) {
        elemento.classList.add('show');
    } else {
        elemento.classList.remove('show');
    }
}

// Mostrar mensaje temporal
function mostrarMensaje(elemento, texto, duracion = 5000) {
    elemento.textContent = texto;
    mostrarElemento(elemento, true);
    
    setTimeout(() => {
        mostrarElemento(elemento, false);
    }, duracion);
}


// Turnos
function obtenerTurnos(){
    return [
        { value: '', texto: 'Seleccionar turno...' },
        { value: '06:00-15:00', texto: '06:00 - 15:00' },
        { value: '07:00-16:00', texto: '07:00 - 16:00' },
        { value: '09:00-18:00', texto: '09:00 - 18:00' },
        { value: '13:00-20:00', texto: '13:00 - 20:00' },
        { value: '14:00-21:00', texto: '14:00 - 21:00' },
        { value: '17:00-23:00', texto: '17:00 - 23:00' },
        { value: '18:00-00:00', texto: '18:00 - 00:00' },
        { value: '00:00-06:00', texto: '00:00 - 06:00' },
        { value: 'descanso1', texto: '1er Día Descanso' },
        { value: 'descanso2', texto: '2do Día Descanso' },
        { value: 'feriado', texto: 'Feriado' }
    ];
}


// Llenar select
function llenarSelect(selectElement, opciones){

    selectElement.innerHTNL = '';

    opciones.forEach(opcion => {
        const option = document.createElement('option');
        option.value = opcion.value;
        option.textContent = opcion.texto;
        selectElement.appendChild(option);
    });
}


function obtenerIngTurno(){
    return [
        { value: '', texto: 'Seleccionar Ingeniero...' },
        { value: 'juanperez', texto: 'Ing. Juan Pérez' },
        { value: 'mariolopez', texto: 'Ing. Mario López' },
        { value: 'anatorres', texto: 'Ing. Ana Torres' }
    ];
}


let ctxFirma, dibujando = false;

function inicializarFirma(){
    ctxFirma = elementos.firmaCanvas.getContext("2d");

    // Ajustar tamaño canvas al contenedor
    elementos.firmaCanvas.width = elementos.firmaCanvas.offsetWidth;
    elementos.firmaCanvas.height = 200;

    // Eventos mouse
    elementos.firmaCanvas.addEventListener("mousedown", empezarDibujo);
    elementos.firmaCanvas.addEventListener("mouseup", terminarDibujo);
    elementos.firmaCanvas.addEventListener("mousemove", dibujar);

    // Eventos touch (móvil)
    elementos.firmaCanvas.addEventListener("touchstart", empezarDibujo);
    elementos.firmaCanvas.addEventListener("touchend", terminarDibujo);
    elementos.firmaCanvas.addEventListener("touchmove", dibujar);

    // Botón limpiar
    elementos.limpiarFirmaBtn.addEventListener("click", limpiarFirma);
}

function empezarDibujo(e){
    e.preventDefault();
    dibujando = true;
    ctxFirma.beginPath();
    ctxFirma.moveTo(obtenerX(e), obtenerY(e));
}

function terminarDibujo(e){
    e.preventDefault();
    dibujando = false;
}

function dibujar(e){
    if (!dibujando) return;
    e.preventDefault();
    ctxFirma.lineTo(obtenerX(e), obtenerY(e));
    ctxFirma.stroke();
}

function obtenerX(e){
    return e.type.includes("touch") ? 
        e.touches[0].clientX - elementos.firmaCanvas.getBoundingClientRect().left :
        e.offsetX;
}

function obtenerY(e){
    return e.type.includes("touch") ? 
        e.touches[0].clientY - elementos.firmaCanvas.getBoundingClientRect().top :
        e.offsetY;
}

function limpiarFirma(){
    ctxFirma.clearRect(0, 0, elementos.firmaCanvas.width, elementos.firmaCanvas.height);
}
