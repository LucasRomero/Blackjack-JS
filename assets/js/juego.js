/**
 * 2C = two of Clubs
 * 2D = two of Diamings
 * 2H = two of Hearts
 * 2S = two of Spades
 */

// funciones anonimas autoinvocadas, que crea un nuevo scope y no tiene una refencia por nombre y entonces no se puede llamar el objeto directamente.
const miModulo = (() => {
    'user strict';


    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'];
    const especiales = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [];

    // referencias del HTML
    const btnPedir = document.querySelector('#btnPedir');
    const btnDeteneder = document.querySelector('#btnDetener');
    const btnNuevo = document.querySelector('#btnNuevo');
    const divCartasJugadores = document.querySelectorAll('.divCartas');
    const puntosHTML = document.querySelectorAll('small');

    // esta funcion inicializa el juego
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }

        puntosHTML.forEach(elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = '');

        btnPedir.disabled = false;
        btnDeteneder.disabled = false;
    };

    // generacion del deck (baraja)
    const crearDeck = () => {

        deck = [];
        // hago un for para empezar desde el 2 hasta el 10, de las cartas y para agregarle los tipos
        // por cada tipo de carta le agrego su carta en la escala quedando asi todas las cartas desde 2 al 10
        for (let i = 2; i <= 10; i++) {

            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }

        // de cada tipo de carta, debo agregarle las especiales, entonces recorro cada tipo de carta con el primer for
        // y despues recorro las especiales y las agregego al deck (baraja)
        for (let tipo of tipos) {
            for (let esp of especiales) {
                deck.push(esp + tipo);
            }
        }

        return _.shuffle(deck);
    };


    // tomamos una carta
    const pedirCarta = () => {

        if (deck.length === 0) {
            throw 'No hay cartas en el deck';
        }

        return deck.pop();
    };

    // de la carta obtenida, vemos que valor tiene
    const valorcarta = (carta) => {

        const valor = carta.substring(0, carta.length - 1);
        return (isNaN(valor)) ?
            (valor === 'A') ? 11 : 10
            :
            valor * 1;
    };

    // Turno: 0 = primero jugado y el ultimo sera la computadora
    const acumularPuntos = (carta, turno) => {

        puntosJugadores[turno] = puntosJugadores[turno] + valorcarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    };

    const crearCarta = (carta, turno) => {

        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');

        divCartasJugadores[turno].append(imgCarta);

    };

    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);

        } while ((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador();
    };

    const determinarGanador = () => {

        const [puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout(() => {

            if (puntosComputadora === puntosMinimos) {
                alert('Nadie gana :(');
            }
            else if (puntosMinimos > 21) {
                alert('Computadora gana');
            }
            else if (puntosComputadora > 21) {
                alert('jugador gana');
            }
            else {
                alert('Computadora gana');
            }
        }, 40);
    };

    //Eventos
    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            btnPedir.disabled = true;
            btnDeteneder.disabled = true;
            turnoComputadora(puntosJugador);
        }
        else if (puntosJugador === 21) {
            btnPedir.disabled = true;
            btnDeteneder.disabled = true;
            turnoComputadora(puntosJugador);
        }

    });

    btnDeteneder.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDeteneder.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    });


    // todo lo que se retorna aca, va ser publico y se va poder acceder desde otro lugar
    return {
        nuevoJuego: inicializarJuego
    };

})();
