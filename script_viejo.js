//Se simulan las colisiones mediante trigonometria (De momento solo funcionaria para colisiones horizontales)
let posInicialPelota = [100,15];//X,Y
let posFinalPelota = [];
let grados = 40;
let movPelota = [];
$(document).ready(function(){
    let dibujo = document.getElementById('rectangle');
    let pelota = document.getElementById('pelota');
    


    $(document.body).on('keydown',function(e){
        //Dibujo controlable
        let dibujo = document.getElementById('rectangle');
        
        //Flecha derecha
        if(e.key == 'ArrowRight'){
            
            //Comprobamos que no se salga de los margenes de la derecha
            if(dibujo.style.left && parseInt(dibujo.style.left ) != 960){
                dibujo.style.left = parseInt(dibujo.style.left) + 20 ;
            }
        }else if(e.key == 'ArrowLeft'){
            
            //Comprobamos que no se salga de los margenes de la izquierda
            if(dibujo.style.left && parseInt(dibujo.style.left ) > 20){
                dibujo.style.left = parseInt(dibujo.style.left) - 20 ;
            }
        }
    });

    movPelota = calcularMovimientoPelota(grados, pelota);
    console.log(movPelota);
    //Movimiento constante de la pelota
    setInterval(function(){
        moverPelota(pelota);
        //console.log(pelota.getAttribute('bajar'));
        /*if(pelota.getAttribute('bajar') == "true"){
            //moverPelotaAbajo(pelota);
            moverPelota(pelota,grados);
        }else{
            //moverPelotaArriba(pelota);
        }*/
    },16);

    setInterval(function(){
        //console.log(pelota.getAttribute('bajar'));
        isCollidingTecho();
        isColliding(dibujo);
    }, 16);
});


function isColliding(jugador){
    let widthJugador = widthPlayer(jugador);
    let pelota = document.getElementById('pelota');
    let pelotaPosY = pelota.style.top;
    pelotaPosY = parseInt(pelotaPosY);

    let pelotaPosX = pelota.style.left;
    pelotaPosX = parseInt(pelotaPosX);

    let widthPelotaObj = widthPelota(pelota);

    //Comprobamos si esta a la altura adecuada para detectar la colisión
    if(pelotaPosY >= 300 && pelotaPosY <= 350){
        
        //Comparamos si la anchura de la pelota entra dentro del rango del jugador
        if(widthPelotaObj[0] >= widthJugador[0] && widthPelotaObj[0] <= widthJugador[1] ||
             widthPelotaObj[1] >= widthJugador[0] && widthPelotaObj[1] <= widthJugador[1])
             {
            //Calculamos la posición en la que ha habido la colision
            posFinalPelota = [parseInt(pelota.style.top),parseInt(pelota.style.left)];
            grados = calcularGrados(pelota);
            movPelota = calcularMovimientoPelota(grados, pelota);
            //Mover pelota arriba
            pelota.setAttribute('bajar', "false");
            
        }
    }
}


function isCollidingTecho(){
    pelota = document.getElementById('pelota');
    let pelotaPosY = pelota.style.top;
    pelotaPosY = parseInt(pelotaPosY);

    

    //Comprobamos si esta a la altura adecuada para detectar la colisión con el techo
    if(pelotaPosY <= 10){
        pelota.setAttribute('bajar', "true");
    }
}

//Calcula el rango posX que ocupa el jugador en ese momento
function widthPlayer(jugador){
    let pos = jugador.style.left;
    let rango = [parseInt(pos),parseInt(pos)+400];
    return rango;
}

function widthPelota(pelota){
    let pos = pelota.style.left;
    let rango = [parseInt(pos),parseInt(pos)+100];
    return rango;
}

//file:///C:/Users/ALUMNO04/Desktop/cliente/Repaso/prueba/index.html
function moverPelotaAbajo(pelota){
    
    if(pelota.style.top && parseInt(pelota.style.top) <= 500){
        pelota.style.top = parseInt(pelota.style.top) + 5;
    }
}


function moverPelotaArriba(pelota){
    
    if(pelota.style.top && parseInt(pelota.style.top) >= 10){
        pelota.style.top = parseInt(pelota.style.top) - 5;
    }
}

function calcularGrados(pelota){
    
    //Calculamos la distancia recorrida x,y
    let distRecorrida = [posFinalPelota[0] - posInicialPelota[0],posFinalPelota[1] - posInicialPelota[1]]; 
    console.log('Distancia recorrida: ' + distRecorrida);
    let division = distRecorrida[1]/distRecorrida[0];
    console.log('La división: ' + division);
    let tg = Math.tan(division * (Math.PI / 180));//Lo configuramos en grados
    console.log('La tangente: ' + tg);
    let gradosPelota = 1 / tg;
    console.log('Los grados: ' + grados);

    return gradosPelota*(-1);

}
function calcularMovimientoPelota(gradosPelota, pelota){
    let vertical = gradosPelota > 0 ? 5 : -5;
    let horizontal = 5 / Math.tan(gradosPelota * (Math.PI / 180));
    let  movPelotaC = [horizontal,vertical];
    console.log(movPelotaC);
    return movPelotaC;
}


function moverPelota(pelota){
    
    pelota.style.top = parseInt(pelota.style.top) + movPelota[1];
    pelota.style.left = parseInt(pelota.style.left) +movPelota[0];
}