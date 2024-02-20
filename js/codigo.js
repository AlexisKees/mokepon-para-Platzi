

function aleatorio(min, max) {
    return Math.floor(Math.random()*(max - min + 1) + min )
}

function eleccion(jugada) {
    let resultado = ""
    if (jugada == 1) {
        resultado = "piedra."
    } else if(jugada == 2) {
        resultado = "papel."
    } else if(jugada == 3) {
        resultado = "tijera."
    } else{
        resultado = "cualquier cosa."
    }
    return resultado
    }

function resultadoFinal(pc, jugador) {
        if(pc == jugador){
        alert("EMPATE!")
    } else if(jugador==1 && pc==3 || jugador==2 && pc==1 || jugador==3 && pc==2){
        alert("GANASTE!")
        triunfos += 1
    } else{
        alert("perdiste...")
        derrotas += 1
    }
    }
    

    let triunfos = 0
    let derrotas = 0


while(triunfos < 3 && derrotas < 3){

        let jugador = prompt("Elige: 1 para piedra, 2 para papel o 3 para tijera.")
        let pc =  aleatorio(1,3)


        alert("Elegiste " + eleccion(jugador))
        alert("PC elige " + eleccion(pc))
        resultadoFinal(pc, jugador)

    }

if (triunfos==3){
    alert("Ganaste 3 veces, felicitaciones!")
} else if(derrotas==3){
    alert("Perdiste 3 veces, más suerte la próxima!")
}
