//secciones:

const inputMokepones = document.getElementById('input-mascotas')
const inputAtaques = document.getElementById('input-ataques')
const seleccionarMascotas = document.getElementById("seleccionar-mascota")
const seleccionarAtaque = document.getElementById("seleccionar-ataque")
const mensajes = document.getElementById('mensajes')
const resultadoFinal =  document.getElementById('ultimo-resultado')
const verMapa = document.getElementById('ver-mapa')
const mapa = document.getElementById('mapa')
const fondoMapa = new Image
fondoMapa.src = './assets/mokemap.png'

// botones:

const botonMascota = document.getElementById("boton-mascota")

let jugadorId = null

let botonAgua
let botonTierra
let botonFuego
let arrayBotones = []
const botonReiniciar = document.getElementById('reiniciar')




//variables

let mokepones = []
let mokeponesEnemigos = []
let mascotaJugadorObjeto
let mascotaRivalObjeto

let intervalo
let intervaloMovimientoEnemigo
let ataquesJugador = []
let ataquesRival = []


let mascotaJugadorGlobal=''
let mascotaRivalGlobal=''

let colisionBool = false

let ataqueJugador=""
let ataqueRival = ''

let vidasJugador= 0
let vidasRival = 0
let turno = 0

let resultado=''

let lienzo = mapa.getContext('2d')

class Mokepon {
    constructor(nombre, foto, foto2){
        this.nombre = nombre
        this.foto = foto
        this.fotoMapa = new Image
        this.fotoMapa.src = foto2
        this.ataques = []
        this.x = 10 
        this.y = 10 
        this.velocidadX = 0
        this.velocidadY = 0
        this.width = 40
        this.height = 40
    }


    pintar(){
    lienzo.drawImage(
        this.fotoMapa,
        this.x,
        this.y,
        this.width,
        this.height
    )
    }


}

class Ataque {
    constructor(nombre, id){
        this.nombre = nombre
        this.id = id
    }
}

let hipodoge = new Mokepon('Hipodoge', './assets/mokepons_mokepon_hipodoge_attack.webp', './assets/hipodoge.png')
let capipepo = new Mokepon('Capipepo', './assets/mokepons_mokepon_capipepo_attack.png', './assets/capipepo.png')
let ratigueya = new Mokepon('Ratigueya', './assets/mokepons_mokepon_ratigueya_attack.webp', './assets/ratigueya.png')

let ataqueAgua = new Ataque('💧', 'boton-agua')
let ataqueFuego = new Ataque('🔥', 'boton-fuego')
let ataqueTierra = new Ataque('🌿', 'boton-tierra')

hipodoge.ataques.push(ataqueAgua, ataqueAgua, ataqueAgua, ataqueFuego, ataqueTierra)
capipepo.ataques.push(ataqueTierra, ataqueTierra, ataqueTierra, ataqueAgua, ataqueFuego)
ratigueya.ataques.push(ataqueFuego, ataqueFuego, ataqueFuego, ataqueAgua, ataqueTierra)

mokepones.push(hipodoge, capipepo, ratigueya);



function iniciarJuego() {

    verMapa.style.display='none'

    mokepones.forEach((mokepon)=> {
        tarjetaMokepon = `
        <input hidden type="radio" name="mascota" id=${mokepon.nombre}>
        <label class="tarjeta-mokepon" for=${mokepon.nombre}>
            <p>${mokepon.nombre}</p>
            <img src=${mokepon.foto} alt=${mokepon.nombre}>
        </label>
        `
        inputMokepones.innerHTML += tarjetaMokepon
    })

    botonMascota.addEventListener('click', seleccionarMascotaJugador)
    botonReiniciar.addEventListener('click', reiniciarJuego)

    unirseAlJuego()
}

function unirseAlJuego(){
    fetch('http://localhost:8080/unirse')
        .then(function(res){
            console.log(res)
            if (res.ok){
                res.text()
                    .then(function(respuesta){
                        console.log(respuesta)
                        jugadorId = respuesta
                    })
            }
        })
}

function aleatorio(min, max){
    return Math.floor(Math.random()*(max - min + 1) + min)
}

function seleccionarMascotaJugador(){

    let mascotaJugador = document.getElementById('mascota-jugador')


    mokepones.forEach((mokepon)=> {

        let inputMokepon = document.getElementById(mokepon.nombre)

        if(inputMokepon.checked) {
            mascotaJugador.innerHTML=mokepon.nombre
            mascotaJugadorGlobal=mokepon.nombre
            mascotaJugadorObjeto=mokepon
            mokepon.ataques.forEach((ataque)=>{
                botonAtaque=`
                <button class='botones-ataque' id=${ataque.id}>${ataque.nombre}</button>
                `
                inputAtaques.innerHTML += botonAtaque
            })
            arrayBotones = document.querySelectorAll('.botones-ataque')
            botonAgua=document.getElementById("boton-agua")
            botonTierra=document.getElementById("boton-tierra")
            botonFuego=document.getElementById("boton-fuego") 
            
        }
    } )
      
    seleccionarMokepon(mascotaJugadorGlobal)
    iniciarMapa()
    seleccionarMascotaRival()
    seleccionarMascotas.style.display = 'none'
    seleccionarAtaque.style.display = 'none'
    verMapa.style.display = 'flex'
    seleccionarAtaque.style.alignItems = 'center'
    mensajes.style.display = 'block'
    
    
}

function seleccionarMokepon(mascotaJugadorGlobal){
    fetch(`http://localhost:8080/mokepon/${jugadorId}`, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mokepon: mascotaJugadorGlobal
        })
    })
}

function addEventsToAttackButtons(){
    arrayBotones.forEach((boton) => {
        boton.addEventListener('click', (e)=>{
            if (e.target.innerText === "🔥") {
                ataquesJugador.push("🔥")
            } else if(e.target.innerText==="💧"){
                ataquesJugador.push("💧")
            } else {
                ataquesJugador.push("🌿")
            }

            e.target.innerText = "❌"
            e.target.disabled = "true"
            turno += 1
            boton.style.background = "#EEF296"
            seleccionarAtaqueRival()
            console.log(ataquesJugador);
            console.log(ataquesRival);
        })
    })

}

function seleccionarMascotaRival(){
    let mascotaAleatoria = aleatorio(1,mokepones.length-1) 

    let mascotaRival = document.getElementById('mascota-rival')

    mascotaRival.innerHTML = mokepones[mascotaAleatoria].nombre
    mascotaRivalGlobal = mokepones[mascotaAleatoria].nombre
    mascotaRivalObjeto = new Mokepon ('Rival', mokepones[mascotaAleatoria].foto.src, mokepones[mascotaAleatoria].fotoMapa.src)

    for (let i = 0; i < mokepones[mascotaAleatoria].ataques.length; i++) {
        mascotaRivalObjeto.ataques.push(mokepones[mascotaAleatoria].ataques[i])
        console.log('array clase: ', mokepones[mascotaAleatoria].ataques[i])
        console.log('array rival: ',mascotaRivalObjeto.ataques[i])        
    }
    

    mascotaRivalObjeto.x = aleatorio(0,((mapa.width/5)-mascotaRivalObjeto.width))*5
    mascotaRivalObjeto.y = aleatorio(0, ((mapa.height/5)-mascotaJugadorObjeto.height))*5

    colisionCheck()    
    pintarCanvas()
    addEventsToAttackButtons()

    }

function seleccionarAtaqueRival(){

    let numero = aleatorio(0,mascotaRivalObjeto.ataques.length-1)

    ataquesRival.push(mascotaRivalObjeto.ataques[numero].nombre)
    mascotaRivalObjeto.ataques.splice(numero, 1)

    if (turno == 5) {
    calcularResultado(ataqueJugador, ataqueRival)
}
}

function calcularResultado(jug, riv){
    let vidasJugadorSpan = document.getElementById('vidas-jugador')
    let vidasRivalSpan = document.getElementById('vidas-rival')
    
    for (let i = 0 ; i < ataquesJugador.length ; i++){
        ataqueJugador = ataquesJugador[i]
        ataqueRival = ataquesRival[i]

    if (ataquesJugador[i]==ataquesRival[i]){
        resultado='EMPATE.'
        
    } else if(ataquesJugador[i]=='💧' && ataquesRival[i]=='🔥' || ataquesJugador[i]=='🌿' && ataquesRival[i]=='💧' || ataquesJugador[i]=='🔥' && ataquesRival[i]=='🌿'){
        resultado='GANASTE!'
        vidasJugador++
        vidasJugadorSpan.innerHTML=vidasJugador
        
    } else {
        resultado='PERDISTE...'
        vidasRival++
        vidasRivalSpan.innerHTML=vidasRival
        
    }

    crearMensaje(ataqueJugador, ataqueRival)
}

    
}

function crearMensaje(jug, riv){
    let parrafo = document.createElement('p')

    parrafo.innerHTML = ('Tu '+mascotaJugadorGlobal+' atacó con '+ataqueJugador+'. El '+mascotaRivalGlobal+' rival atacó con '+ataqueRival+'. '+resultado)
    mensajes.appendChild(parrafo)

    if (turno == 5) {
        crearMensajeFinal();
    }
}

function crearMensajeFinal() {
    let mensajeFinal 
    if (vidasJugador==vidasRival){
        mensajeFinal = "PARTIDA EMPATADA"
    }else if (vidasJugador<vidasRival){
        mensajeFinal = "PERDISTE LA PARTIDA"
    } else{
        mensajeFinal = 'GANASTE LA PARTIDA'
    }

    
    finDePartida();
    resultadoFinal.innerHTML = mensajeFinal

}

function finDePartida(){
    if (turno == 5) {
        botonReiniciar.style.display = 'block';
    }
}

function reiniciarJuego() {
    location.reload()
}

function pintarCanvas(){
    mascotaJugadorObjeto.x = mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadX
    mascotaJugadorObjeto.y = mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidadY

    mascotaRivalObjeto.x = mascotaRivalObjeto.x + mascotaRivalObjeto.velocidadX
    mascotaRivalObjeto.y = mascotaRivalObjeto.y + mascotaRivalObjeto.velocidadY


    lienzo.clearRect(0,0,mapa.width, mapa.height)
    lienzo.drawImage(fondoMapa,0,0,mapa.width,mapa.height)

    mascotaJugadorObjeto.pintar()
//    mascotaRivalObjeto.pintar()

    if ((colisionBool === false) && colisionCheck()){
        alert('Prepárate para pelear!')
        mascotaJugadorObjeto.velocidadX = 0
        mascotaJugadorObjeto.velocidadY = 0
        mascotaRivalObjeto.velocidadX = 0
        mascotaRivalObjeto.velocidadY = 0

        verMapa.style.display = 'none'
        seleccionarAtaque.style.display = 'flex'
        seleccionarAtaque.style.flexDirection = 'column'
        clearInterval(intervalo)
        clearInterval(intervaloMovimientoEnemigo)

    } else {
        colisionCheck()
    }

    
    // PARA QUE NO SE SALGAN DEL MAPA:
    if (mascotaJugadorObjeto.y <= 0 || (mascotaJugadorObjeto.y + mascotaJugadorObjeto.height) >= mapa.height){
        mascotaJugadorObjeto.velocidadY = 0
        }
    if (mascotaJugadorObjeto.x <= 0 || (mascotaJugadorObjeto.x + mascotaJugadorObjeto.width) >= mapa.width){
        mascotaJugadorObjeto.velocidadX = 0
    }

    enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y)
}

function enviarPosicion(x, y){
    fetch(`http://localhost:8080/mokepon/${jugadorId}/posicion`, {
        method: 'post',
        headers: {
            "Content-Type":"application/json"
        }, 
        body: JSON.stringify({
            x,
            y
        })
        })

        .then(function (res){
            if(res.ok){
                res.json()
                .then(function({enemigos}){
                    /* 
                    1 
                    */
                })
            }
        })
}

function moverPersonajeArriba(){
    if (mascotaJugadorObjeto.y > 0){
    mascotaJugadorObjeto.velocidadY = -10
    }
}

function moverPersonajeIzquierda(){
    if(mascotaJugadorObjeto.x > 0){
    mascotaJugadorObjeto.velocidadX = -10
    }
}

function moverPersonajeAbajo(){
    if((mascotaJugadorObjeto.y + mascotaJugadorObjeto.height) < mapa.height){
    mascotaJugadorObjeto.velocidadY = 10
    }
}

function moverPersonajeDerecha(){
    if ((mascotaJugadorObjeto.x + mascotaJugadorObjeto.width) < mapa.width)
    mascotaJugadorObjeto.velocidadX = 10

}

function detenerPersonaje(){
    mascotaJugadorObjeto.velocidadX = 0
    mascotaJugadorObjeto.velocidadY = 0
}




function sePresionoUnaTecla(event){
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            moverPersonajeArriba()
            break;
        case 'ArrowDown':
        case 's':
            moverPersonajeAbajo()
            break;
        case 'ArrowLeft':
        case 'a':
            moverPersonajeIzquierda()
            break;
        case 'ArrowRight':
        case 'd':
            moverPersonajeDerecha()
            break;
        default:
            break;
    }
}


function moverRival(){

    let distanciaIzquierda = Math.abs(mascotaRivalObjeto.x - (mascotaJugadorObjeto.x+mascotaJugadorObjeto.width))
    let distanciaDerecha = Math.abs((mascotaRivalObjeto.x + mascotaJugadorObjeto.width) - mascotaJugadorObjeto.x)
    let distanciaArriba = Math.abs(mascotaRivalObjeto.y - (mascotaJugadorObjeto.y + mascotaJugadorObjeto.height))
    let distanciaAbajo = Math.abs((mascotaRivalObjeto.y + mascotaRivalObjeto.height) - mascotaJugadorObjeto.y)
    
    if(colisionBool){
        return
    } else {
    if (mascotaJugadorObjeto.x === mascotaRivalObjeto.x){
        mascotaRivalObjeto.velocidadX = 0
    } else if(distanciaIzquierda < distanciaDerecha){
        mascotaRivalObjeto.velocidadX = -5
    } else {
        mascotaRivalObjeto.velocidadX = 5
    }

    if (mascotaRivalObjeto.y === mascotaJugadorObjeto.y){
        mascotaRivalObjeto.velocidadY = 0
    } else if (distanciaArriba < distanciaAbajo){
        mascotaRivalObjeto.velocidadY = -5
    } else {
        mascotaRivalObjeto.velocidadY= 5
    }
}

}


function colisionCheck(){
    
    let jugadorIzquierda = mascotaJugadorObjeto.x
    let jugadorDerecha = mascotaJugadorObjeto.x + mascotaJugadorObjeto.width
    let jugadorArriba = mascotaJugadorObjeto.y
    let jugadorAbajo = mascotaJugadorObjeto.y + mascotaJugadorObjeto.height
    
    let rivalIzquierda = mascotaRivalObjeto.x
    let rivalDerecha = mascotaRivalObjeto.x + mascotaRivalObjeto.width
    let rivalArriba = mascotaRivalObjeto.y
    let rivalAbajo = mascotaRivalObjeto.y + mascotaRivalObjeto.height

    if(
        jugadorIzquierda > rivalDerecha ||
        jugadorDerecha < rivalIzquierda ||
        jugadorArriba > rivalAbajo ||
        jugadorAbajo < rivalArriba
    ) {
        colisionBool = false
        return colisionBool;
    } else {
        colisionBool = true
        return colisionBool;
    }

    
}


function iniciarMapa(){

    if (window.innerWidth > 600){
    mapa.width = 600
    mapa.height = 450
}   else if(window.innerWidth < 300){
    alert('El mapa no cabe en la pantalla!','Usa una pantalla más grande.')
    reiniciarJuego()
} else {
    mapa.width = window.innerWidth - 30
    mapa.height = mapa.width * 600 / 800
}

    intervalo = setInterval(pintarCanvas, 50)
    intervaloMovimientoEnemigo = setInterval(moverRival, 50)
    
    window.addEventListener('keydown', sePresionoUnaTecla)
    
    window.addEventListener('keyup', detenerPersonaje)


}

iniciarJuego()


