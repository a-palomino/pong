let posInicialPelota = [100,15];//X,Y
let velocidadPelota = [8,8]; //X,Y
let puntuaciones = [0,0];
let pausa = false;
let segundoJugador = false;
let dificultadIA = 'normal';
let movJugador = null;

$(document).ready(function(){
    let jugador = document.getElementById('jugador');
    let ia = document.getElementById('ia');
    let pelota = document.getElementById('pelota');
    segundoJugador = sessionStorage.getItem('segundoJugador');
    let valorDificultad = sessionStorage.getItem('dificultadIA');
    configurarDificultad(valorDificultad);
    

    //Texto dificultad
    let textoDificultad = document.getElementById('textoDificultad');
    textoDificultad.innerHTML += ' ' + dificultadIA;
    $('#continuar').on('click',function(){
        pausa = false;
        pausarPartida();
    });


    $(document.body).on('keydown',function(e){
        //Dibujo controlable
        let jugador = document.getElementById('jugador');
        let jugador2 = document.getElementById('ia');

        if(e.key == 'Escape'){
            pausa = pausa == true ? false : true;
            pausarPartida();
        }
        
        //Flecha derecha
        if(!pausa){
        
            if(e.key == 'w'){
            
                //Comprobamos que no se salga de los margenes de la derecha
                if(!movJugador){
                    movJugador = setInterval(movimientoJugadorArriba,16);
                }
                
                
            }else if(e.key == 's'){
                
                //Comprobamos que no se salga de los margenes de la izquierda
                if(!movJugador){
                    movJugador = setInterval(movimientoJugadorAbajo,16);
                }
                
            }
    
            //Controles jugador 2 
            if(segundoJugador == 'true'){
                if(e.key == '8'){
            
                    //Comprobamos que no se salga de los margenes de la derecha
                    if(jugador2.style.top && parseInt(jugador2.style.top ) >= 10){
                        jugador2.style.top = (parseInt(jugador2.style.top) - 20) * 60 ;
                    }
                }else if(e.key == '2'){
                    
                    //Comprobamos que no se salga de los margenes de la izquierda
                    if(jugador2.style.top && parseInt(jugador2.style.top ) <= 500){
                        jugador2.style.top = parseInt(jugador2.style.top) + 20 ;
                    }
                }
            }
        }
        


        
    });

    $(document.body).on('keyup',function(e){
        

        
        
        //Flecha derecha
        if(e.key == 'w'){

            if(movJugador){
                clearInterval(movJugador);
                movJugador = null;
            }
        }else if(e.key == 's'){

            if(movJugador){
                clearInterval(movJugador);
                movJugador = null;
            }
        }
        


        
    });

    

    setInterval(function(){
        if(!pausa){
            controlJuego(ia,pelota,jugador);
        }
    },16);
    
    
});

function movimientoJugadorArriba(){
    let jugador = document.getElementById('jugador');
    if(jugador.style.top && parseInt(jugador.style.top ) >= 10){
        jugador.style.top = (parseInt(jugador.style.top) - 10 );
    }
}

function movimientoJugadorAbajo(){
    let jugador = document.getElementById('jugador');
    if(jugador.style.top && parseInt(jugador.style.top ) <= 500){
        jugador.style.top = parseInt(jugador.style.top) + 10 ;
    }
}

/**
 * A partir de la configuración anterior, configura los valores de dificultad de la IA
 * @param {int} valorDificultad 
 */
function configurarDificultad(valorDificultad){
    
    switch(valorDificultad){
        case '0': dificultadIA = 'facil';
        break;
        
        case '1': dificultadIA = 'normal';
        break;

        case '2': dificultadIA = 'dificil';
        break;

        case '3': dificultadIA = 'infinito';
        break;
    }
}

/**
 * Para el movimiento de la partida y habilita el menú de pausa
 */
function pausarPartida(){

    let juegoDiv = document.getElementById('juego');
    let menuPausa = document.getElementById('menuPausa');

    //Botones
    let botonContinuar = document.getElementById('continuar');
    let botonVolver = document.getElementById('volver');
    

    if(pausa){
        juegoDiv.style.opacity = 0.2;
        menuPausa.style.display = 'inline';
        botonContinuar.disabled = false;
        botonVolver.disabled = false;
    }else{
        juegoDiv.style.opacity = 1;
        menuPausa.style.display = 'none';
        botonContinuar.disabled = true;
        botonVolver.disabled = true;
    }
}

/**
 * Se encarga de que se ejecuten todas las acciones necesarias para que funcione el juego
 */
function controlJuego(ia,pelota,jugador){


    moverPelota(pelota);
    if(segundoJugador == 'false'){
        movimientoIA(ia,pelota);
    }
    //Colisiones
    isCollidingParedes();
    isCollidingTecho();
    isCollidingPlayer(jugador);
    isCollidingIA(ia);

    
    
}

/**
 *Se coloca la pelota en la posición inicial y le da un sentido de movimiento aleatorio 
 */
function reiniciarJuego(){
    let pelota = document.getElementById('pelota');
    pelota.style.left = 625;
    pelota.style.top = 15;

    let random = Math.floor(Math.random() * (1 - 0 + 1)) + 0;

    if(random == 0){
        velocidadPelota[0] *= (-1);
    }

    
}

/**
 * Calcula el movimiento de la IA en función de la pelota
 * @param {DOM} ia 
 * @param {DOM} pelota 
 */
function movimientoIA(ia,pelota){
    //posiciones
    let posX = pelota.style.left;
    posX = parseInt(posX);

    let posY = pelota.style.top;
    posY = parseInt(posY);
    
    //Establecemos limites
    if(posX >= 500 && velocidadPelota[0] > 0){ 
        if((parseInt(ia.style.top) + velocidadPelota[1]) >= 10 &&  (parseInt(ia.style.top) + velocidadPelota[1]) <= 500){
            //Crearemos margenes de error
            let velocidadPala = margenErrorIA();
            ia.style.top = parseInt(ia.style.top) + (velocidadPala);
        } 
    }
}

//Se encarga de ajustar el margen de error de la IA en función de la dificultad elegida
function margenErrorIA(){
    let velocidad = 0;
    let margenError = 0;
    let random;

    switch(dificultadIA){
        case 'facil': random = Math.floor(Math.random() * (1 - 0 + 1)) + 0; //50% de probabilidad de reducir la velocidad
                      margenError = 4;
        break;

        case 'normal': random = Math.floor(Math.random() * (2 - 0 + 1)) + 0; //33% de probabilidad de reducir la velocidad
                       margenError = 2;
        break;

        case 'dificil' : random = Math.floor(Math.random() * (3 - 0 + 1)) + 0; //25% de probabilidad de reducir la velocidad
                         margenError = 1;
        break;

        case 'infinito': random = 0; //La IA siempre golpeará la pelota
        break;

        case 'default' : random = 0;
        break;
    }

    //Comprobamos si el número random a acertado
    if(random == 1){
        //Comprobamos el sentido de la velocidad de la pelota
        if(velocidadPelota[1] > 0){
            velocidad = velocidadPelota[1] - margenError;
        }else{
            velocidad = velocidadPelota[1] + margenError;
        }
    }else{
        velocidad = velocidadPelota[1];
    }

    return velocidad;
}

/**
 * Calcula si la pelota está colisionando con el jugador1
 * @param {DOM} jugador 
 */
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

/**
 * Calcula si la pelota está colisionando con la IA (o jugador2 dependiendo del modo de juego)
 * @param {DOM} jugador 
 */
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
 * Si colisiona con las paredes, actualizamos las puntuaciones i reiniciamos la partida
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

//Calcula el rango posY que ocupa el jugador e IA
function widthPlayer(jugador){
    let pos = jugador.style.top;
    let rango = [parseInt(pos),parseInt(pos)+150];
    return rango;
}

/**
 * Calcula el alto de la pelota para calcular luego las colisiones
 * @param {DOM} pelota 
 * @returns 
 */
function widthPelota(pelota){
    let pos = pelota.style.top;
    let rango = [parseInt(pos),parseInt(pos)+50];
    return rango;
}


/**
 * Da velocidad y movimiento a la pelota
 * @param {DOM} pelota 
 */
function moverPelota(pelota){
    
    pelota.style.top = parseInt(pelota.style.top) + velocidadPelota[1];
    pelota.style.left = parseInt(pelota.style.left) + velocidadPelota[0];
}

/**
 * Actualiza las puntuaciones y comprueba si se ha terminado la partida
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

    //Comprobamos si se acabó la partida
    let texto = document.getElementById('textoResultado');
    let menuFinPartida = document.getElementById('menuFinPartida');
    let juegoDiv = document.getElementById('juego');
    let botonVolver = document.getElementById('volverFin');

    if(puntuaciones[0] == 5){
        texto.innerHTML = 'HAS GANADO LA PARTIDA';
        pausa = true;
        menuFinPartida.style.display= 'inline';
        juegoDiv.style.opacity = 0.2;
        botonVolver.removeAttribute('disabled');
    }else if(puntuaciones[1] == 5){
        texto.innerHTML = 'HAS PERDIDO LA PARTIDA';
        pausa = true;
        menuFinPartida.style.display= 'inline';
        juegoDiv.style.opacity = 0.2;
        botonVolver.removeAttribute('disabled');
    }

    
}