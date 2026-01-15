console.log("JS cargado");

/* =========================
LOGIN Y PROTECCIÓN DE PÁGINAS
========================= */

// Usuario válido
const usuarioValido = {
    email: "leandro1234@gmail.com",
    contrasenia: "1234",
    nombreUsuario: "Leandro Campos"
};

// Login
const loginFormulario = document.getElementById("loginFormulario");

if (loginFormulario) {
    /* Manejar el envío del formulario Login*/
    loginFormulario.addEventListener("submit", function (e) {
        e.preventDefault();
        /* Obtener los valores ingresados */
        const emailIngresado = document.getElementById("email").value;
        const contraseniaIngresado = document.getElementById("contrasenia").value;
        /* Validar credenciales */
        if (
            emailIngresado === usuarioValido.email &&
            contraseniaIngresado === usuarioValido.contrasenia
        ) {
            /* Guardar en localStorage */
            localStorage.setItem("usuarioLogueado", usuarioValido.nombreUsuario);
            /* Inicializar saldo si no existe */
            if (!localStorage.getItem("saldo")) {
                localStorage.setItem("saldo", 100000);
            }
            /* Redirigir a menú */
            window.location.href = "menu.html";
        } else {
            /* Mostrar mensaje de error si no coinciden credenciales*/
            document.getElementById("error").textContent =
                "Correo o contraseña incorrectos";
        }
    });
}

// Usuario logueado
const usuarioLogueado = localStorage.getItem("usuarioLogueado");

// Protección de páginas
const paginaProtegida =
    window.location.pathname.includes("menu.html") ||
    window.location.pathname.includes("deposito.html") ||
    window.location.pathname.includes("transferir.html") ||
    window.location.pathname.includes("transacciones.html");

if (paginaProtegida && !usuarioLogueado) {
    window.location.href = "login.html";
}

// Mostrar nombre usuario
const usuarioTexto = document.getElementById("usuario");
if (usuarioTexto && usuarioLogueado) {
    usuarioTexto.textContent = usuarioLogueado;
}

//Salir
const botonSalir = document.getElementById("salir");
if (botonSalir) {
    botonSalir.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "login.html";
    });
}

/* =========================
SALDO
========================= */
// Obtener saldo
let saldo = parseInt(localStorage.getItem("saldo")) || 0;
const saldoTexto = document.getElementById("saldo");
// Mostrar saldo en la página
if (saldoTexto) {
    saldoTexto.textContent = `$${saldo.toLocaleString("es-CL")}`;
}

/* =========================
FUNCIÓN MOVIMIENTOS
========================= */
/*Guardar movimiento */
function guardarMovimiento(tipo, monto, detalle) {
    /* Obtener movimientos existentes o inicializar array vacío */
    let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
    /* Agregar nuevo movimiento */
    movimientos.push({
        tipo,
        monto,
        detalle,
        fecha: new Date().toLocaleDateString("es-CL")
    });
    /* Guardar en localStorage */
    localStorage.setItem("movimientos", JSON.stringify(movimientos));
}
/* =========================
DEPÓSITO
========================= */
// Manejar formulario de depósito
const formularioDeposito = document.getElementById("formularioDeposito");
//Agregar evento submit al formulario de depósito
if (formularioDeposito) {
    formularioDeposito.addEventListener("submit", (e) => {
        e.preventDefault();
        // Obtener monto ingresado
        const monto = parseInt(document.getElementById("monto").value);
        saldo += monto;
        localStorage.setItem("saldo", saldo);
        //Guardar movimiento
        guardarMovimiento("Depósito", monto, "Ingreso de dinero");
        /* Mostrar alerta y redirigir */
        alert("Depósito realizado con éxito");
        window.location.href = "menu.html";
    });
}

/* =========================
CONTACTOS
========================= */
/* Obtener contactos desde localStorage o inicializar array vacío */
let contactos = JSON.parse(localStorage.getItem("contactos")) || [];
/* Elementos del DOM */
const formularioContacto = document.getElementById("formularioContacto");
const buscadorContacto = document.getElementById("buscadorContacto");
const sugerenciasContacto = document.getElementById("sugerenciasContacto");
const listaContactos = document.getElementById("listaContactos");

// Manejar formulario de contacto
if (formularioContacto) {
    formularioContacto.addEventListener("submit", (e) => {
        e.preventDefault();
        /* Obtener valores del formulario */
        const rut = document.getElementById("rutContacto").value;
        const nombre = document.getElementById("nombreContacto").value;
        const alias = document.getElementById("aliasContacto").value;
        const email = document.getElementById("correoContacto").value;
        const banco = document.getElementById("bancoContacto").value;
        const tipoCuenta = document.getElementById("tipocuentaContacto").value;
        const cuenta = document.getElementById("cuentaContacto").value;

        // Validar selección de banco y tipo de cuenta
        if (!banco || !tipoCuenta) {
            alert("Debe seleccionar banco y tipo de cuenta");
            return;
        }
        // Agregar contacto al array y guardar en localStorage
        contactos.push({ rut, nombre, alias, email, banco, tipoCuenta, cuenta });
        localStorage.setItem("contactos", JSON.stringify(contactos));
        // Resetear formulario y actualizar lista
        formularioContacto.reset();
        //Mostrar lista de contactos actualizada
        mostrarListaContactos();
    });
}

// Mostrar lista de contactos
function mostrarListaContactos(filtro = "") {
    // Si listaContactos no existe, salir de la función
    if (!listaContactos) return;

    listaContactos.innerHTML = "";
    //Filtrar y mostrar contactos
    contactos.forEach((contacto, index) => {
        // Verificar si el contacto coincide con el filtro
        if (
            contacto.rut.includes(filtro) ||
            contacto.nombre.toLowerCase().includes(filtro) ||
            (contacto.email && contacto.email.toLowerCase().includes(filtro)) ||
            (contacto.alias && contacto.alias.toLowerCase().includes(filtro))
        ) {
            // Crear elemento de contacto
            const item = document.createElement("button");
            item.type = "button";
            item.className = "list-group-item list-group-item-action";
            // Rellenar contenido del contacto
            item.innerHTML = `
                <div class="contacto-nombre">
                    ${contacto.nombre}
                    ${contacto.alias ? `<span class="contacto-alias">(${contacto.alias})</span>` : ""}
                </div>
                <div class="contacto-detalle">
                    ${contacto.banco} - ${contacto.tipoCuenta} ****${contacto.cuenta.slice(-4)}
                </div>
`;
            // Manejar selección de contacto
            item.addEventListener("click", () => {
                buscadorContacto.value = contacto.nombre;
                buscadorContacto.dataset.index = index;
            });
            // Agregar contacto a la lista
            listaContactos.appendChild(item);
        }
    });
}
// Mostrar lista de contactos al cargar la página
mostrarListaContactos();

// Buscador con autocompletado
if (buscadorContacto) {
    // Manejar entrada en el buscador
    buscadorContacto.addEventListener("input", () => {
        const texto = buscadorContacto.value.toLowerCase();
        sugerenciasContacto.innerHTML = "";
        // Si el texto está vacío, mostrar toda la lista
        if (texto === "") {
            mostrarListaContactos();
            return;
        }
        // Filtrar y mostrar sugerencias
        mostrarListaContactos(texto);
        // Mostrar sugerencias debajo del buscador
        contactos.forEach((contacto, index) => {
            if (contacto.nombre.toLowerCase().includes(texto)) {
                const item = document.createElement("button");
                item.type = "button";
                item.className = "list-group-item list-group-item-action";
                // Rellenar contenido de la sugerencia
                item.textContent = `${contacto.nombre} (${contacto.alias})`;
                // Manejar selección de sugerencia
                item.addEventListener("click", () => {
                    buscadorContacto.value = contacto.nombre;
                    buscadorContacto.dataset.index = index;
                    sugerenciasContacto.innerHTML = "";
                });
                // Agregar sugerencia a la lista
                sugerenciasContacto.appendChild(item);
            }
        });
    });
}

/* =========================
TRANSFERENCIA
========================= */
// Manejar formulario de transferencia
const formularioTransferencia = document.getElementById("formularioTransferencia");
//Agregar evento submit al formulario de transferencia
if (formularioTransferencia) {
    formularioTransferencia.addEventListener("submit", (e) => {
        e.preventDefault();
        // Obtener monto y contacto seleccionado
        const monto = parseInt(document.getElementById("montoTransferencia").value);
        const contactoIndex = buscadorContacto.dataset.index;
        // Validar selección de contacto y saldo suficiente
        if (contactoIndex === undefined) {
            alert("Debe seleccionar un contacto");
            return;
        }
        if (monto > saldo) {
            alert("Saldo insuficiente");
            return;
        }

        saldo -= monto;
        localStorage.setItem("saldo", saldo);
        //Guardar movimiento
        guardarMovimiento(
            "Transferencia",
            monto,
            contactos[contactoIndex].nombre
        );
        // Mostrar alerta y redirigir
        alert("Transferencia realizada con éxito");
        window.location.href = "menu.html";
    });
}

/* =========================
MOVIMIENTOS
========================= */
// Mostrar movimientos en la página
const movimientosLista = document.getElementById("movimientosLista");
// Si existe el contenedor de movimientos, cargar y mostrar movimientos
if (movimientosLista) {
    const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
    // Si no hay movimientos, mostrar mensaje
    if (movimientos.length === 0) {
        movimientosLista.innerHTML =
            "<p class='text-center' id='noMovimientos'>No hay movimientos registrados.</p>";
    } else {
        // Mostrar cada movimiento
        movimientos.forEach((mov) => {
            const card = document.createElement("div");
            card.classList.add("card", "mb-2");
            // Rellenar contenido del movimiento
            card.innerHTML = `
                <div id='tarjetaMovimiento'class="card-body">
                    <strong>${mov.tipo}</strong><br>
                    Monto: $${mov.monto.toLocaleString("es-CL")}<br>
                    Detalle: ${mov.detalle}<br>
                    Fecha: ${mov.fecha}
                </div>
            `;
            // Agregar movimiento a la lista
            movimientosLista.appendChild(card);
        });
    }
}