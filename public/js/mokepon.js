
const sectionSeleccionarAtaque = document.getElementById("seleccionar-ataque")
const botonReiniciar = document.getElementById("boton-reiniciar")
const sectionReiniciar = document.getElementById("reiniciar")

const sectionSeleccionarMascota = document.getElementById("seleccionar-mascota")
const spanMascotaJugador = document.getElementById("mascota-jugador")
const spanMascotaEnemigo = document.getElementById("mascota-enemigo")
const spanVidasJugador = document.getElementById("vidas-jugador")
const spanVidasEnemigo = document.getElementById("vidas-enemigo")

const sectionMensajes = document.getElementById("resultado")
const ataquesDelJugador = document.getElementById("ataque-del-jugador")
const ataquesDelEnemigo = document.getElementById("ataque-del-enemigo")
const contenedorTarjetas = document.getElementById("contenedor-de-tarjetas")
const contenedorAtaques = document.getElementById("contenedor-ataques")
const sectionVerMapa = document.getElementById("ver-mapa")
const mapa = document.getElementById("mapa")

let jugadorId = null
let enemigoId = null
let mokepones = []
let botones = []
let mokeponesEnemigos = []
let ataqueJugador = []
let ataqueEnemigo = []
let opcionesDelContenedor
let ataquesMokepon
let ataquesMokeponEnemigo
let mascotaJugador
let mascotaJugadorObjeto
let botonFuego
let botonAgua
let botonTierra
let botonMascotaJugador
let inputHipodoge
let inputCapipepo
let inputRatigueya
let vidasJugador = 0
let vidasEnemigos = 0
let resultado
let resultadoFinal
let contadorAtaque = 0
let contadorCombates = 0
let indexAtaqueJugador
let indexAtaqueEnemigo
let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackground = new Image()
mapaBackground.src = "./assets/mokemap2.jpeg"

// Calculamos el tamaño del canvas en función del ancho visible real del contenedor,
// así el espacio lógico de movimiento siempre coincide con lo que se ve en pantalla.
const anchoMaximoDelMapa = 450
const anchoDelMapa = Math.min(mapa.parentElement.clientWidth || window.innerWidth - 20, anchoMaximoDelMapa)
const alturaQueBuscamos = Math.round(anchoDelMapa * 600 / 800)

mapa.width = anchoDelMapa
mapa.height = alturaQueBuscamos
class Mokepon {
    constructor(nombre, foto, vida, fotoMapa, id = null) {
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques = []
        this.ancho = 50
        this.alto = 50
        this.x = aleatoria(0, mapa.width - this.ancho)
        this.y = aleatoria(0, mapa.height - this.alto)
        this.mapafoto = new Image()
        this.mapafoto.src = fotoMapa
        this.velocidadX = 0
        this.velocidadY = 0
    }
    pintarMokepon() {
        lienzo.drawImage(
            this.mapafoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
        )
    }
}

let hipodoge = new Mokepon("Hipodoge", "./assets/mokepons_mokepon_hipodoge_attack.png", 5, "./assets/hipodoge.png")
let capipepo = new Mokepon("Capipepo", "./assets/mokepons_mokepon_capipepo_attack.png", 5, "./assets/capipepo.png")
let ratigueya = new Mokepon("Ratigueya", "./assets/mokepons_mokepon_ratigueya_attack.png", 5, "./assets/ratigueya.png")

const HIPODOGE_ATAQUES = [
    { nombre: "💧", id: "boton-agua" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🌱", id: "boton-tierra" }
]

hipodoge.ataques.push(...HIPODOGE_ATAQUES)

const CAPIPEPO_ATAQUES = [
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "🌱", id: "boton-tierra" }
]

capipepo.ataques.push(...CAPIPEPO_ATAQUES)

const RATIGUEYA_ATAQUES = [
    { nombre: "🌱", id: "boton-tierra" },
    { nombre: "🌱", id: "boton-tierra" },
    { nombre: "🌱", id: "boton-tierra" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "🔥", id: "boton-fuego" }
]

ratigueya.ataques.push(...RATIGUEYA_ATAQUES)


mokepones.push(hipodoge, capipepo, ratigueya)

mokepones.forEach(mokepon => {
    opcionesDelContenedor = `
            <input type="radio" name="mascota" id=${mokepon.nombre}>
            <label class="tarjetas-mokepon" for=${mokepon.nombre}>
                <p>${mokepon.nombre}</p>
                <img src=${mokepon.foto} alt=${mokepon.nombre}>
            </label>`

    contenedorTarjetas.innerHTML += opcionesDelContenedor

    inputHipodoge = document.getElementById("Hipodoge")
    inputCapipepo = document.getElementById("Capipepo")
    inputRatigueya = document.getElementById("Ratigueya")
})


botonMascotaJugador = document.getElementById("boton-seleccionar")
botonMascotaJugador.addEventListener("click", seleccionarMascotaJugador)


sectionSeleccionarAtaque.style.display = "none"
sectionReiniciar.style.display = "none"
sectionVerMapa.style.display = "none"


botonReiniciar.addEventListener("click", reiniciar)
unirseAlJuego()

function unirseAlJuego() {
    fetch("http://192.168.100.158:8080/unirse")
        .then(function (res) {

            if (res.ok) {
                res.text()
                    .then(function (respuesta) {
                        console.log(respuesta)
                        jugadorId = respuesta
                    })
            }
        })
}

function seleccionarMascotaJugador() {

    if (inputHipodoge.checked) {
        spanMascotaJugador.innerHTML = inputHipodoge.id
        mascotaJugador = inputHipodoge.id
    } else if (inputCapipepo.checked) {
        spanMascotaJugador.innerHTML = inputCapipepo.id
        mascotaJugador = inputCapipepo.id
    } else if (inputRatigueya.checked) {
        spanMascotaJugador.innerHTML = inputRatigueya.id
        mascotaJugador = inputRatigueya.id
    } else {
        alert("Selecciona una Mascota")
        return
    }
    sectionSeleccionarMascota.style.display = "none"
    sectionVerMapa.style.display = "flex"
    seleccionarMokepon(mascotaJugador)
    iniciarMapa()
    extraerAtaques(mascotaJugador)

}

function seleccionarMokepon(mascotaJugador) {
    fetch(`http://192.168.100.158:8080/mokepon/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mokepon: mascotaJugador
        })
    })
}

function extraerAtaques(mascotaJugador) {
    let ataques
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre) {
            ataques = mokepones[i].ataques
        }
    }
    mostrarAtaques(ataques)
}

function mostrarAtaques(ataques) {

    ataques.forEach(ataque => {
        ataquesMokepon = `<button class="sci-fi-btn btn-orange btn-general BAtaque" id=${ataque.id}>${ataque.nombre}</button>`

        contenedorAtaques.innerHTML += ataquesMokepon
    })

    botonFuego = document.getElementById("boton-fuego")
    botonAgua = document.getElementById("boton-agua")
    botonTierra = document.getElementById("boton-tierra")
    botones = document.querySelectorAll(".BAtaque")
}

function secuenciaDeAtaques() {
    botones.forEach(boton => {
        boton.addEventListener("click", (e) => {
            if (e.target.textContent === "🔥") {
                ataqueJugador.push("FUEGO")
                boton.style.background = "rgb(141, 17, 24)"
                boton.disabled = true
            } else if (e.target.textContent === "💧") {
                ataqueJugador.push("AGUA")
                boton.style.background = "rgb(141, 17, 24)"
                boton.disabled = true
            } else {
                ataqueJugador.push("TIERRA")
                boton.style.background = "rgb(141, 17, 24)"
                boton.disabled = true
            }
            if (ataqueJugador.length === 5) {
                enviarAtaque()
            }
        })
    });
}

function enviarAtaque() {
    fetch(`http://192.168.100.158:8080/mokepon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    })

    intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques() {
    fetch(`http://192.168.100.158:8080/mokepon/${enemigoId}/ataques`)
        .then(function (res) {
            if (res.ok) {
                res.json()
                    .then(function ({ ataques }) {
                        if (ataques.length === 5) {
                            ataqueEnemigo = ataques
                            combateMokepon()
                        }
                    })
            }
        })
}

function seleccionarMascotaEnemigo(enemigo) {
    spanMascotaEnemigo.innerHTML = enemigo.nombre
    ataquesMokeponEnemigo = enemigo.ataques
    secuenciaDeAtaques()
}

function ataqueMascotaEnemigo() {
    let ataqueEnemigoActual = ataquesMokeponEnemigo[contadorAtaque]
    if (ataqueEnemigoActual.nombre === "🔥") {
        ataqueEnemigo.push("FUEGO")
    } else if (ataqueEnemigoActual.nombre === "💧") {
        ataqueEnemigo.push("AGUA")
    } else {
        ataqueEnemigo.push("TIERRA")
    }
    contadorAtaque++
    console.log(ataqueEnemigo)
}

function indexAmbosOponentes(jugador, enemigo) {
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
    crearMensajes()
}

function combateMokepon() {
    clearInterval(intervalo)
    for (let i = 0; i < ataqueJugador.length; i++) {
        if (ataqueJugador[i] === ataqueEnemigo[i]) {
            indexAmbosOponentes(i, i)
            resultado = "Empate 🤓"
        } else if (ataqueJugador[i] == "AGUA" && ataqueEnemigo[i] == "FUEGO") {
            indexAmbosOponentes(i, i)
            resultado = "Gana el Jugador"
            vidasJugador++
        } else if (ataqueJugador[i] == "TIERRA" && ataqueEnemigo[i] == "AGUA") {
            indexAmbosOponentes(i, i)
            resultado = "Gana el Jugador"
            vidasJugador++
        } else if (ataqueJugador[i] == "FUEGO" && ataqueEnemigo[i] == "TIERRA") {
            indexAmbosOponentes(i, i)
            resultado = "Gana el Jugador"
            vidasJugador++
        } else {
            indexAmbosOponentes(i, i)
            resultado = "Gana la PC"
            vidasEnemigos++
        }
    }

    spanVidasJugador.innerHTML = vidasJugador
    spanVidasEnemigo.innerHTML = vidasEnemigos
    contadorCombates++

    conteoVidas()
}

function conteoVidas() {
    if (contadorCombates == "1") {
        if (vidasJugador < vidasEnemigos) {
            crearMensajeFinal("🏆Felicidades, El Ganador es el JUGADOR-2 🏆")
        } else if (vidasEnemigos < vidasJugador) {
            crearMensajeFinal("🏆Felicidades, El Ganador es el JUGADOR-1 🏆")
        } else if (vidasJugador === vidasEnemigos) {
            crearMensajeFinal("⚔️ Esto ha sido un Empate ⚔️")
        }
    }
}

function crearMensajes() {
    let nuevoAtaqueJugador = document.createElement("p")
    let nuevoAtaqueEnemigo = document.createElement("p")

    sectionMensajes.innerHTML = resultado
    nuevoAtaqueJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueEnemigo.innerHTML = indexAtaqueEnemigo

    ataquesDelJugador.appendChild(nuevoAtaqueJugador)
    ataquesDelEnemigo.appendChild(nuevoAtaqueEnemigo)
}

function crearMensajeFinal(resultadoFinal) {
    sectionMensajes.innerHTML = (resultadoFinal)
    sectionReiniciar.style.display = "block"
}

function reiniciar() {
    location.reload()
}

function aleatoria(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function pintarCanvas() {
    mascotaJugadorObjeto.x = mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadX
    mascotaJugadorObjeto.y = mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidadY
    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )
    mascotaJugadorObjeto.pintarMokepon()
    enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y)

    mokeponesEnemigos.forEach(function (mokepon) {
        mokepon.pintarMokepon()
        revisarColision(mokepon)
    })
}

function enviarPosicion(x, y) {
    fetch(`http://192.168.100.158:8080/mokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
    .then(function (res) {
        if (res.ok) {
            res.json()
            .then(function ({ enemigos }) {
                        

                mokeponesEnemigos = enemigos.map(function (enemigo) {
                    console.log({enemigo})

                    let mokeponEnemigo = null
                    const mokeponNombre = enemigo.mokepon.nombre || ""
                    if (mokeponNombre === "Hipodoge") {
                        mokeponEnemigo = new Mokepon("Hipodoge", "./assets/mokepons_mokepon_hipodoge_attack.png", 5, "./assets/hipodoge.png", enemigo.id)
                    } else if (mokeponNombre === "Capipepo") {
                        mokeponEnemigo = new Mokepon("Capipepo", "./assets/mokepons_mokepon_capipepo_attack.png", 5, "./assets/capipepo.png", enemigo.id)
                    } else if (mokeponNombre === "Ratigueya") {
                        mokeponEnemigo = new Mokepon("Ratigueya", "./assets/mokepons_mokepon_ratigueya_attack.png", 5, "./assets/ratigueya.png", enemigo.id)
                    }

                        mokeponEnemigo.x = enemigo.x  || 0
                        mokeponEnemigo.y = enemigo.y  || 0

                        return mokeponEnemigo
                })
            })
       }
   })
}

function moverDerecha() {
    
    let limiteDerecha = mapa.width - mascotaJugadorObjeto.ancho - 5;
    if (mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadX <= limiteDerecha) {
        mascotaJugadorObjeto.velocidadX = 5
    }else{
        detenerMovimiento()
    }
}

function moverAbajo() {
    
    let limiteAbajo = mapa.height - mascotaJugadorObjeto.alto - 5;
    if (mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidadY <= limiteAbajo) {
        mascotaJugadorObjeto.velocidadY = 5
    }else{
        detenerMovimiento()
    }
    
}

function moverIzquierda() {
    
    if (mascotaJugadorObjeto.x - mascotaJugadorObjeto.velocidadX >= 10) {
        mascotaJugadorObjeto.velocidadX = - 5
    }else{
        detenerMovimiento()
    }
}

function moverArriba() {
    
    if (mascotaJugadorObjeto.y - mascotaJugadorObjeto.velocidadY >= 10) {
        mascotaJugadorObjeto.velocidadY = - 5
    }else{
        detenerMovimiento()
    }   
}


function detenerMovimiento() {
    mascotaJugadorObjeto.velocidadX = 0
    mascotaJugadorObjeto.velocidadY = 0
}

function sePresionaUnaTecla(event) {
    switch (event.key) {
        case "ArrowUp":
            moverArriba()
            break;
        case "ArrowDown":
            moverAbajo()
            break;
        case "ArrowLeft":
            moverIzquierda()
            break;
        case "ArrowRight":
            moverDerecha()
            break;
        default:
            break;
    }
}


function iniciarMapa() {
    mascotaJugadorObjeto = obtenerObjetoMascota(mascotaJugador)
    intervalo = setInterval(pintarCanvas, 50)
    window.addEventListener("keydown", sePresionaUnaTecla)
    window.addEventListener("keyup", detenerMovimiento)
}

function obtenerObjetoMascota() {
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre) {
            return mokepones[i]
        }
    }
}

function revisarColision(enemigo) {
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaMascota = mascotaJugadorObjeto.y
    const abajoMascota = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto
    const derechaMascota = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho
    const izquierdaMascota = mascotaJugadorObjeto.x

    if (
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ) {
        return
    }

    detenerMovimiento()
    clearInterval(intervalo)

    enemigoId = enemigo.id
    sectionSeleccionarAtaque.style.display = "flex"
    sectionVerMapa.style.display = "none"
    seleccionarMascotaEnemigo(enemigo)

}


