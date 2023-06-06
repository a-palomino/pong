let posInicialPelota = [100,15];//X,Y
let velocidadPelota = [8,8]; //X,Y
let puntuaciones = [0,0];
let pausa = false;
$(document).ready(function(){
    let jugador = document.getElementById('jugador');
    let ia = document.getElementById('ia');
    let pelota = document.getElementById('pelota');
    


    $(document.body).on('keydown',function(e){
        //Dibujo controlable
        let jugador = document.getElementById('jugador');

        if(e.key == 'Escape'){
            pausa = pausa == true ? false : true;
        }
        
        //Flecha derecha
        if(!pausa){
            if(e.key == 'ArrowUp'){
            
                //Comprobamos que no se salga de los margenes de la derecha
                if(jugador.style.top && parseInt(jugador.style.top ) >= 10){
                    jugador.style.top = parseInt(jugador.style.top) - 20 ;
                }
            }else if(e.key == 'ArrowDown'){
                
                //Comprobamos que no se salga de los margenes de la izquierda
                if(jugador.style.top && parseInt(jugador.style.top ) <= 500){
                    jugador.style.top = parseInt(jugador.style.top) + 20 ;
                }
            }
        }


        
    });

    

    setInterval(function(){
        if(!pausa){
            controlJuego();
        }
    },16);
    
    
});

/**
 * Se encarga de 
 */
function controlJuego(){


    moverPelota(pelota);
    movimientoIA(ia,pelota);
    //Colisiones
    isCollidingParedes();
    isCollidingTecho();
    isCollidingPlayer(jugador);
    isCollidingIA(ia);

    
    
}

function reiniciarJuego(){
    let pelota = document.getElementById('pelota');
    pelota.style.left = 625;
    pelota.style.top = 15;

    let random = Math.floor(Math.random() * (1 - 0 + 1)) + 0;

    if(random == 0){
        velocidadPelota[0] *= (-1);
    }

    
}

function movimientoIA(ia,pelota){
    //posiciones
    let posX = pelota.style.left;
    posX = parseInt(posX);

    let posY = pelota.style.top;
    posY = parseInt(posY);
    
    //Establecemos limites
    if(posX >= 500 && velocidadPelota[0] > 0){ 
        if((parseInt(ia.style.top) + velocidadPelota[1]) >= 10 &&  (parseInt(ia.style.top) + velocidadPelota[1]) <= 500){
            ia.style.top = parseInt(ia.style.top) + (velocidadPelota[1]-1);
        } 
    }
}

function isCollidingPlayer(jugador){
    let widthJugador = widthPlayer(jugador);
    let pelota = document.getElementById('pelota');
    let pelotaPosY = pelota.style.top;
    pelotaPosY = parseInt(pelotaPosY);

    let pelotaPosX = pelota.style.left;
    pelotaPosX = parseInt(pelotaPosX);

    let widthPelotaObj = widthPelota(pelota);

    //Comprobamos si esta a la altura adecuada para detectar la colisión
    if((pelotaPosX) >= 20 && (pelotaPosX) <= 30){
        
        //Comparamos si la anchura de la pelota entra dentro del rango del jugador
        if(widthPelotaObj[0] >= widthJugador[0] && widthPelotaObj[0] <= widthJugador[1] ||
             widthPelotaObj[1] >= widthJugador[0] && widthPelotaObj[1] <= widthJugador[1])
             {
            velocidadPelota[0] *= (-1);
            
        }
    }
}

function isCollidingIA(jugador){
    let widthJugador = widthPlayer(jugador);
    let pelota = document.getElementById('pelota');
    let pelotaPosY = pelota.style.top;
    pelotaPosY = parseInt(pelotaPosY);

    let pelotaPosX = pelota.style.left;
    pelotaPosX = parseInt(pelotaPosX);

    let widthPelotaObj = widthPelota(pelota);

    //Comprobamos si esta a la altura adecuada para detectar la colisión
    if((pelotaPosX) >= 1270 && (pelotaPosX) <= 1280){
        
        //Comparamos si la anchura de la pelota entra dentro del rango del jugador
        if(widthPelotaObj[0] >= widthJugador[0] && widthPelotaObj[0] <= widthJugador[1] ||
             widthPelotaObj[1] >= widthJugador[0] && widthPelotaObj[1] <= widthJugador[1])
             {
            velocidadPelota[0] *= (-1);
            
        }
    }
}

/**
 * Si colisiona con el techo, cambiamos la dirección del eje y
 */
function isCollidingTecho(){
    pelota = document.getElementById('pelota');
    let pelotaPosY = pelota.style.top;
    pelotaPosY = parseInt(pelotaPosY);

    

    //Comprobamos si esta a la altura adecuada para detectar la colisión con el techo
    if(pelotaPosY <= 10 ||pelotaPosY >= 600){
        velocidadPelota[1] *= (-1);
    }
}

/**
 * Si colisiona con las paredes, cambiamos la dirección del eje x
 */
function isCollidingParedes(){
    pelota = document.getElementById('pelota');
    let pelotaPosX = pelota.style.left;
    pelotaPosX = parseInt(pelotaPosX);

    

    //Comprobamos si esta a la altura adecuada para detectar la colisión con el techo
    if(pelotaPosX  <= 0){
        actualizarPuntuaciones(0,1);
        reiniciarJuego();
    }else if(pelotaPosX >= 1300){
        reiniciarJuego();
        actualizarPuntuaciones(1,0);
    }
}

//Calcula el rango posX que ocupa el jugador en ese momento
function widthPlayer(jugador){
    let pos = jugador.style.top;
    let rango = [parseInt(pos),parseInt(pos)+150];
    return rango;
}

function widthPelota(pelota){
    let pos = pelota.style.top;
    let rango = [parseInt(pos),parseInt(pos)+50];
    return rango;
}



function moverPelota(pelota){
    
    pelota.style.top = parseInt(pelota.style.top) + velocidadPelota[1];
    pelota.style.left = parseInt(pelota.style.left) + velocidadPelota[0];
}

/**
 * Actualiza las puntuaciones
 * @param {int} jugador 
 * @param {int} ia 
 */
function actualizarPuntuaciones(jugador,ia){
    puntuaciones[0] += jugador;
    puntuaciones[1] += ia;

    let textoPuntJugador = document.getElementById('puntosJugador');
    let textoPuntIA = document.getElementById('puntosIA');

    textoPuntJugador.innerHTML = puntuaciones[0];
    textoPuntIA.innerHTML = puntuaciones[1];
}