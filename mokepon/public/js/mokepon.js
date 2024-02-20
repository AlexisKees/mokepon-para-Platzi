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
let lienzo = mapa.getContext('2d')


// DAR ANCHO Y ALTO AL MAPA PARA PODER INICIALIZAR LAS POSICIONES DE LOS MOKEPONES CREADOS
                            let anchoDelMapa = window.innerWidth - 20
                            const anchoMaximoDelMapa = 350

                            if (anchoDelMapa > anchoMaximoDelMapa){
                                anchoDelMapa = anchoMaximoDelMapa
                            }   

                            let altoDelMapa = anchoDelMapa * 600 / 800

                            mapa.width = anchoDelMapa
                            mapa.height = altoDelMapa


// botones:

const botonMascota = document.getElementById("boton-mascota")
let arrayBotones = []
const botonReiniciar = document.getElementById('reiniciar')




//variables

let jugadorId = null
let enemigoId= null

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








class Mokepon {
    constructor(nombre, foto, foto2, id = null){
        this.id = id
        this.nombre = nombre
        this.foto = new Image
        this.foto.src = foto
        this.fotoMapa = new Image
        this.fotoMapa.src = foto2
        this.ataques = []
        this.width = 40
        this.height = 40
        this.x = aleatorio(0, (mapa.width - this.width)) 
        this.y = aleatorio(0, (mapa.height - this.height)) 
        this.velocidadX = 0
        this.velocidadY = 0
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
            <img src=${mokepon.foto.src} alt=${mokepon.nombre}>
        </label>
        `
        inputMokepones.innerHTML += tarjetaMokepon
    })


    botonMascota.addEventListener('click', seleccionarMascotaJugador)

    botonReiniciar.addEventListener('click', reiniciarJuego)

    unirseAlJuego()
}

function unirseAlJuego(){
    fetch('http://192.168.0.69:8080/unirse')
        .then(function (res) {
            if (res.ok) {
                res.text()
                    .then(function (respuesta) {
                        jugadorId = respuesta
                    })
            }
        })
}

function aleatorio(min, max){
    return Math.floor(Math.random()*(max - min + 1) + min)
}

function seleccionarMascotaJugador(){
    let mokeponCheckedBoolean = false
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
            mokeponCheckedBoolean = true
            arrayBotones = document.querySelectorAll('.botones-ataque')            
        }
    } )
      
    if(mokeponCheckedBoolean){
    seleccionarMokepon(mascotaJugadorGlobal)
    iniciarMapa()
    seleccionarMascotaRival()
    seleccionarMascotas.style.display = 'none'
    seleccionarAtaque.style.display = 'none'
    verMapa.style.display = 'flex'
    seleccionarAtaque.style.alignItems = 'center'
    mensajes.style.display = 'block'
    }
    
}

function seleccionarMokepon(mascotaJugadorGlobal){
    fetch(`http://192.168.0.69:8080/mokepon/${jugadorId}`, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mokepon: mascotaJugadorGlobal
        })
    })
}



function seleccionarMascotaRival(){
   
    /*
    let mascotaAleatoria = aleatorio(1,mokepones.length-1) 

    let mascotaRival = document.getElementById('mascota-rival')

    mascotaRival.innerHTML = mokepones[mascotaAleatoria].nombre
    mascotaRivalGlobal = mokepones[mascotaAleatoria].nombre
    mascotaRivalObjeto = new Mokepon ('Rival', mokepones[mascotaAleatoria].foto.src, mokepones[mascotaAleatoria].fotoMapa.src)

    for (let i = 0; i < mokepones[mascotaAleatoria].ataques.length; i++) {
        mascotaRivalObjeto.ataques.push(mokepones[mascotaAleatoria].ataques[i])   
    }
    

    mascotaRivalObjeto.x = aleatorio(0,((mapa.width/5)-mascotaRivalObjeto.width))*5
    mascotaRivalObjeto.y = aleatorio(0, ((mapa.height/5)-mascotaJugadorObjeto.height))*5 
    
 

    colisionCheck()  
    */

    

    pintarCanvas()
    addEventsToAttackButtons()

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
                
                if(ataquesJugador.length === 5){
                    enviarAtaques()
                }
            })
        })
    
    }


    function enviarAtaques(){
        fetch(`http://192.168.0.69:8080/mokepon/${jugadorId}/ataques`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify ({
                ataques: ataquesJugador,
                enemigo: enemigoId
            })
        })

        intervalo = setInterval(recibirAtaques, 50);
    }

    
    function recibirAtaques(){
        fetch(`http://192.168.0.69:8080/mokepon/${enemigoId}/ataques`)

        .then(function(res){
            if(res.ok){
                res.json()
                .then(function({ataquesEnemigo}){
                    if(ataquesEnemigo.length === 5){
                    calcularResultado(ataquesJugador, ataquesEnemigo)
                }
                })

            }}

        )
    }


    /*
function seleccionarAtaqueRival(){

    let numero = aleatorio(0,mascotaRivalObjeto.ataques.length-1)

    ataquesRival.push(mascotaRivalObjeto.ataques[numero].nombre)
    mascotaRivalObjeto.ataques.splice(numero, 1)

    if (turno == 5) {
    calcularResultado(ataqueJugador, ataqueRival)
}
}
*/


function calcularResultado(jug, riv){

    clearInterval(intervalo)


    let vidasJugadorSpan = document.getElementById('vidas-jugador')
    let vidasRivalSpan = document.getElementById('vidas-rival')
    
    for (let i = 0 ; i < ataquesJugador.length ; i++){
        ataqueJugador = jug[i]
        ataqueRival = riv[i]

        if (jug[i]==riv[i]){
            resultado='EMPATE.'
            
        } else if(jug[i]=='💧' && riv[i]=='🔥' || jug[i]=='🌿' && riv[i]=='💧' || jug[i]=='🔥' && riv[i]=='🌿'){
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

    /*
    mascotaRivalObjeto.x = mascotaRivalObjeto.x + mascotaRivalObjeto.velocidadX
    mascotaRivalObjeto.y = mascotaRivalObjeto.y + mascotaRivalObjeto.velocidadY
    */

    lienzo.clearRect(0,0,mapa.width, mapa.height)
    lienzo.drawImage(fondoMapa,0,0,mapa.width,mapa.height)

    mascotaJugadorObjeto.pintar()
    //mascotaRivalObjeto.pintar()

    

    

    
    // PARA QUE NO SE SALGAN DEL MAPA:
    if (mascotaJugadorObjeto.y <= 0 || (mascotaJugadorObjeto.y + mascotaJugadorObjeto.height) >= mapa.height){
        mascotaJugadorObjeto.velocidadY = 0
        }
    if (mascotaJugadorObjeto.x <= 0 || (mascotaJugadorObjeto.x + mascotaJugadorObjeto.width) >= mapa.width){
        mascotaJugadorObjeto.velocidadX = 0
    }

    enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y)

    mokeponesEnemigos.forEach((enemigo)=>{
        enemigo.pintar()
    })

    mokeponesEnemigos.forEach((enemigo) =>{
        if ((colisionBool === false) && colisionCheck(enemigo)){
        alert('Prepárate para pelear!')
        mascotaJugadorObjeto.velocidadX = 0
        mascotaJugadorObjeto.velocidadY = 0
        
        /*
        enemigo.velocidadX = 0
        enemigo.velocidadY = 0
        */

        verMapa.style.display = 'none'
        seleccionarAtaque.style.display = 'flex'
        seleccionarAtaque.style.flexDirection = 'column'
        clearInterval(intervalo)
        //clearInterval(intervaloMovimientoEnemigo)

    } else {
        colisionCheck(enemigo)}
    })
}

function enviarPosicion(x, y){
    fetch(`http://192.168.0.69:8080/mokepon/${jugadorId}/posicion`, {
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
                .then(function ({ enemigos }) { 
                    console.log(enemigos)
                    mokeponesEnemigos = enemigos.map((enemigo) => {
                        
                        let nombreMokeponEnemigo = enemigo.mokepon.nombre || ""
                        let enemigoImportado = null
                        
                        let mokeponMolde = mokepones.findIndex((mokeponDeLaLista) => nombreMokeponEnemigo === mokeponDeLaLista.nombre )

                        console.log(mokeponMolde);

                        enemigoImportado = new Mokepon(mokepones[mokeponMolde].nombre, mokepones[mokeponMolde].foto.src, mokepones[mokeponMolde].fotoMapa.src, enemigo.id)

                            for (let i = 0; i < enemigoImportado.ataques.length; i++) {
                                enemigoImportado.ataques.push(mokepones[mokeponMolde].ataques[i])       
                            }

                        enemigoImportado.x = enemigo.x
                        enemigoImportado.y = enemigo.y
                        return enemigoImportado


                    })

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

/*
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
*/

function colisionCheck(rival){
    
    const jugadorIzquierda = mascotaJugadorObjeto.x
    const jugadorDerecha = mascotaJugadorObjeto.x + mascotaJugadorObjeto.width
    const jugadorArriba = mascotaJugadorObjeto.y
    const jugadorAbajo = mascotaJugadorObjeto.y + mascotaJugadorObjeto.height
    
    const rivalIzquierda = rival.x
    const rivalDerecha = rival.x + rival.width
    const rivalArriba = rival.y
    const rivalAbajo = rival.y + rival.height

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
        enemigoId = rival.id
        return colisionBool;
    }

    
}


function iniciarMapa(){

    intervalo = setInterval(pintarCanvas, 50)
    // intervaloMovimientoEnemigo = setInterval(moverRival, 50)
    
    window.addEventListener('keydown', sePresionoUnaTecla)
    
    window.addEventListener('keyup', detenerPersonaje)


}

iniciarJuego()


