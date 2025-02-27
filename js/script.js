let elementos = document.querySelectorAll('.dragable');
let huecos = document.querySelectorAll('.hueco');
let elementoArrastrado;
var tieneObjeto = {
    pocionMagica: false,
    espadaLegendaria: false,
    amuletoFantasmal: false,
    monedas: 100
};

let currentGameState = {
    lugar: '',
    criatura: '',
    ambiente: ''
};

elementos.forEach(elemento => {
    elemento.addEventListener('dragstart', function(event) {
        elementoArrastrado = event.target;
        document.getElementById('p1').innerHTML = "¡Has cogido un elemento!";
    });
});

huecos.forEach(hueco => {
    hueco.addEventListener('dragenter', function() {
        document.getElementById('p1').innerHTML = "¡Elemento sobre el hueco!";
    });
    
    hueco.addEventListener('dragleave', function() {
        document.getElementById('p1').innerHTML = "Elemento fuera del hueco";
    });
    
    hueco.addEventListener('dragover', function(event) {
        event.preventDefault();
    });
    
    hueco.addEventListener('drop', function(event) {
        event.preventDefault();
        if (elementoArrastrado.dataset.tipo === event.target.dataset.tipo) {
            event.target.textContent = elementoArrastrado.textContent;
            event.target.classList.remove('error');
            document.getElementById('p1').innerHTML = "¡Colocado correctamente!";
        } else {
            event.target.classList.add('error');
            document.getElementById('p1').innerHTML = "¡Este elemento no va aquí!";
        }
    });
});

function limpiar() {
    try {
        huecos.forEach(hueco => {
            hueco.textContent = '';
            hueco.classList.remove('error');
        });
        document.getElementById('p1').innerHTML = "Todo limpio";
    } catch (error) {
        console.error("Error al limpiar:", error);
    }
}

function mostrarTienda() {
    try {
        const tiendaHTML = `
            <div class="tienda">
                <h3>🏰 Mercado del Reino 🏰</h3>
                <p>Vuestras monedas de oro: ${tieneObjeto.monedas}</p>
                <button onclick="comprar('pocionMagica', 50)" ${tieneObjeto.monedas < 50 ? 'disabled' : ''}>
                    Adquirir Poción Mística (50 monedas)
                </button>
                <button onclick="comprar('espadaLegendaria', 80)" ${tieneObjeto.monedas < 80 ? 'disabled' : ''}>
                    Obtener Espada Ancestral (80 monedas)
                </button>
                <button onclick="comprar('amuletoFantasmal', 60)" ${tieneObjeto.monedas < 60 ? 'disabled' : ''}>
                    Comprar Amuleto Místico (60 monedas)
                </button>
                <button onclick="volverAHistoria()">Regresar a la Aventura</button>
            </div>
        `;
        document.querySelector('.story-text').innerHTML = tiendaHTML;
        document.querySelector('.decisiones').style.display = 'none';
    } catch (error) {
        console.error("Error al mostrar la tienda:", error);
        document.getElementById('p1').innerHTML = "Error al cargar la tienda";
    }
}

function comprar(objeto, precio) {
    try {
        if (!objeto || !precio) {
            throw new Error("Parámetros inválidos");
        }
        if (tieneObjeto.monedas >= precio && !tieneObjeto[objeto]) {
            tieneObjeto[objeto] = true;
            tieneObjeto.monedas -= precio;
            actualizarInventarioVisual();
            document.getElementById('p1').innerHTML = `¡Has comprado ${objeto}!`;
            mostrarTienda();
        } else if (tieneObjeto[objeto]) {
            document.getElementById('p1').innerHTML = `¡Ya tienes este objeto!`;
        }
    } catch (error) {
        console.error("Error al realizar la compra:", error);
        document.getElementById('p1').innerHTML = "Error al procesar la compra";
    }
}

function volverAHistoria() {
    if (!currentGameState.lugar) {
        document.querySelector('.story-text').innerHTML = `
            <div class="historia-inicial">
                <p>En una noche <span class="hueco" data-tipo="ambiente"></span>, 
                nuestro héroe caminaba por un/una <span class="hueco" data-tipo="lugar"></span> 
                cuando apareció un <span class="hueco" data-tipo="criatura"></span>.</p>
                <button onclick="confirmar()" class="btn-tienda">Confirmar</button>
            </div>
        `;
        document.querySelector('.decisiones').style.display = 'none';
        document.querySelector('.botones-control').style.display = 'flex';
        
        elementos = document.querySelectorAll('.dragable');
        huecos = document.querySelectorAll('.hueco');
        
        inicializarEventosDragAndDrop();
        
        actualizarInventarioVisual();
    } else {
        document.querySelector('.story-text').innerHTML = `
            <div class="historia-inicial">
                <p>En una noche <span class="hueco" data-tipo="ambiente">${currentGameState.ambiente}</span>, 
                nuestro héroe caminaba por un/una <span class="hueco" data-tipo="lugar">${currentGameState.lugar}</span> 
                cuando apareció un <span class="hueco" data-tipo="criatura">${currentGameState.criatura}</span>.</p>
            </div>
        `;
        
        setTimeout(() => {
            confirmar();
        }, 100);
    }
}

function inicializarEventosDragAndDrop() {
    const elementos = document.querySelectorAll('.dragable');
    elementos.forEach(elemento => {
        elemento.addEventListener('dragstart', function(event) {
            elementoArrastrado = event.target;
            document.getElementById('p1').innerHTML = "¡Has cogido un elemento!";
        });
    });

    // Reinicializar huecos
    const huecos = document.querySelectorAll('.hueco');
    huecos.forEach(hueco => {
        hueco.addEventListener('dragenter', function() {
            document.getElementById('p1').innerHTML = "¡Elemento sobre el hueco!";
        });
        
        hueco.addEventListener('dragleave', function() {
            document.getElementById('p1').innerHTML = "Elemento fuera del hueco";
        });
        
        hueco.addEventListener('dragover', function(event) {
            event.preventDefault();
        });
        
        hueco.addEventListener('drop', function(event) {
            event.preventDefault();
            if (elementoArrastrado.dataset.tipo === event.target.dataset.tipo) {
                event.target.textContent = elementoArrastrado.textContent;
                event.target.classList.remove('error');
                document.getElementById('p1').innerHTML = "¡Colocado correctamente!";
            } else {
                event.target.classList.add('error');
                document.getElementById('p1').innerHTML = "¡Este elemento no va aquí!";
            }
        });
    });
}

const resultados = {
    atacar: {
        'dragón': {
            conEspada: {
                texto: (ambiente) => `¡Usando tu espada legendaria, derrotaste al dragón en una batalla épica! El ${ambiente} resplandor de tu arma fue decisivo. ¡VICTORIA ÉPICA!`,
                monedas: 200
            },
            conPocion: {
                texto: () => `La poción te dio fuerza sobrehumana, pero el dragón era demasiado poderoso. Lograste escapar malherido.`,
                monedas: -50
            },
            normal: {
                texto: () => `Intentar atacar a un dragón sin equipo fue una mala idea. Apenas sobrevives.`,
                monedas: -100
            }
        },
        'fantasma': {
            conAmuleto: {
                texto: () => `¡El amuleto fantasmal convierte tus golpes en energía espectral! El fantasma se desvanece dejando un tesoro. ¡VICTORIA!`,
                monedas: 150
            },
            conPocion: {
                texto: () => `La poción mágica te permite golpear al fantasma, pero no es muy efectiva. El encuentro termina en empate.`,
                monedas: 0
            },
            normal: {
                texto: () => `Tus ataques atraviesan al fantasma. Te congela el alma con su toque.`,
                monedas: -75
            }
        },
        'duende': {
            conPocion: {
                texto: () => `¡La poción te da reflejos sobrenaturales! Capturas al duende y encuentras su tesoro. ¡VICTORIA!`,
                monedas: 100
            },
            conEspada: {
                texto: () => `El duende es demasiado ágil, pero tu espada lo mantiene a raya. Logras un empate.`,
                monedas: 0
            },
            normal: {
                texto: () => `El duende es más rápido y astuto. Te roba algunas monedas mientras huye.`,
                monedas: -50
            }
        }
    },
    huir: {
        'dragón': {
            conPocion: {
                texto: () => `La poción mágica te da la velocidad necesaria para escapar del dragón. ¡Una sabia decisión!`,
                monedas: 0
            },
            normal: {
                texto: () => `Apenas logras escapar del dragón, pero pierdes algunas monedas en la huida.`,
                monedas: -30
            }
        },
        'fantasma': {
            conAmuleto: {
                texto: () => `Tu amuleto fantasmal brilla con fuerza, manteniendo al fantasma a distancia mientras escapas. ¡Escape exitoso!`,
                monedas: 0
            },
            conPocion: {
                texto: () => `La poción te da la velocidad necesaria para dejar atrás al fantasma. ¡Bien pensado!`,
                monedas: 0
            },
            normal: {
                texto: (lugar, ambiente) => `El fantasma te persigue a través del ${lugar} ${ambiente}, pero eventualmente logras escapar. La experiencia te deja exhausto.`,
                monedas: -25
            }
        },
        'duende': {
            conPocion: {
                texto: () => `Con la poción, eres más rápido que el duende. ¡Incluso recuperas algunas monedas que dejó caer!`,
                monedas: 30
            },
            normal: {
                texto: () => `El duende te deja ir, pero no sin antes robarte algunas monedas.`,
                monedas: -40
            }
        }
    },
    negociar: {
        'dragón': {
            conEspada: {
                texto: () => `El dragón respeta tu espada legendaria. Llegas a un acuerdo y compartes un tesoro.`,
                monedas: 100
            },
            conPocion: {
                texto: () => `Ofreces la poción al dragón como regalo. Aprecia el gesto y te recompensa.`,
                monedas: 50
            },
            normal: {
                texto: () => `El dragón acepta dejarte ir a cambio de algunas monedas.`,
                monedas: -50
            }
        },
        'fantasma': {
            conAmuleto: {
                texto: () => `¡El amuleto te permite comunicarte con el fantasma! Te revela la ubicación de un tesoro.`,
                monedas: 120
            },
            conPocion: {
                texto: () => `El fantasma se interesa por tu poción mágica. Intercambian historias y algunos tesoros.`,
                monedas: 40
            },
            normal: {
                texto: () => `El fantasma acepta tu presencia pero exige un tributo para dejarte en paz.`,
                monedas: -30
            }
        },
        'duende': {
            conPocion: {
                texto: () => `¡El duende queda fascinado por tu poción! Te ofrece un trato muy ventajoso.`,
                monedas: 80
            },
            conEspada: {
                texto: () => `El duende respeta tu poder y te ofrece un trato justo.`,
                monedas: 50
            },
            normal: {
                texto: () => `El duende es un negociador astuto. Terminas perdiendo en el trato.`,
                monedas: -20
            }
        }
    }
};

function tomarDecision(accion) {
    const lugar = currentGameState.lugar;
    const criatura = currentGameState.criatura;
    const ambiente = currentGameState.ambiente;
    let resultadoFinal;

    const criaturaLower = criatura.toLowerCase();
    
    console.log('Criatura:', criatura);
    console.log('Criatura Lower:', criaturaLower);
    
    if (!resultados[accion] || !resultados[accion][criaturaLower]) {
        resultadoFinal = {
            texto: () => `No puedes realizar esta acción con esta criatura.`,
            monedas: 0
        };
    } else {
        const opcionesCriatura = resultados[accion][criaturaLower];
        
        if (criaturaLower === 'dragón') {
            if (tieneObjeto.espadaLegendaria && opcionesCriatura.conEspada) {
                resultadoFinal = opcionesCriatura.conEspada;
            } else if (tieneObjeto.pocionMagica && opcionesCriatura.conPocion) {
                resultadoFinal = opcionesCriatura.conPocion;
            } else {
                resultadoFinal = opcionesCriatura.normal;
            }
        } else if (criaturaLower === 'fantasma') {
            if (tieneObjeto.amuletoFantasmal && opcionesCriatura.conAmuleto) {
                resultadoFinal = opcionesCriatura.conAmuleto;
            } else if (tieneObjeto.pocionMagica && opcionesCriatura.conPocion) {
                resultadoFinal = opcionesCriatura.conPocion;
            } else {
                resultadoFinal = opcionesCriatura.normal;
            }
        } else if (criaturaLower === 'duende') {
            if (tieneObjeto.pocionMagica && opcionesCriatura.conPocion) {
                resultadoFinal = opcionesCriatura.conPocion;
            } else if (tieneObjeto.espadaLegendaria && opcionesCriatura.conEspada) {
                resultadoFinal = opcionesCriatura.conEspada;
            } else {
                resultadoFinal = opcionesCriatura.normal;
            }
        } else {
            resultadoFinal = opcionesCriatura.normal;
        }
    }

    tieneObjeto.monedas = Math.max(0, tieneObjeto.monedas + resultadoFinal.monedas);

    const finalHTML = `
        <div class="final">
            <p>${resultadoFinal.texto(ambiente, lugar)}</p>
            <p>${resultadoFinal.monedas >= 0 ? '¡Ganaste' : 'Perdiste'} ${Math.abs(resultadoFinal.monedas)} monedas!</p>
            <p>Monedas totales: ${tieneObjeto.monedas}</p>
            <div class="botones-final">
                <button onclick="reiniciarJuego()">Nueva Aventura</button>
            </div>
        </div>
    `;
    
    document.querySelector('.story-text').innerHTML = finalHTML;
    document.getElementById('p1').innerHTML = "¡Aventura completada!";
}

const historias = {
    lluviosa: {
        bosque: {
            dragon: {
                imagen: "../../assets/images/lluvia-bosque-dragon.png",
                texto: "En medio de la lluvia torrencial, el dragón emerge entre los árboles del bosque, su silueta amenazante recortada por los relámpagos."
            },
            duende: {
                imagen: "../../assets/images/lluvia-bosque-duende.png",
                texto: "Bajo la lluvia incesante, descubres a un duende travieso refugiándose entre los arbustos del bosque."
            },
            fantasma: {
                imagen: "../../assets/images/lluvia-bosque-fantasma.png",
                texto: "La lluvia atraviesa la forma espectral de un fantasma que flota entre los árboles del bosque empapado."
            }
        },
        castillo: {
            dragon: {
                imagen: "../../assets/images/lluvia-castillo-dragon.png",
                texto: "El dragón se posa sobre las torres del castillo mientras la lluvia golpea contra las piedras antiguas."
            },
            duende: {
                imagen: "../../assets/images/lluvia-castillo-duende.png",
                texto: "En los pasillos lluviosos del castillo, un duende juguetón se esconde entre las sombras."
            },
            fantasma: {
                imagen: "../../assets/images/lluvia-castillo-fantasma.png",
                texto: "El fantasma atraviesa los muros del castillo, mientras la lluvia cae sin cesar en el exterior."
            }
        },
        cueva: {
            dragon: {
                imagen: "../../assets/images/lluvia-cueva-dragon.png",
                texto: "El dragón se refugia en la cueva, mientras la lluvia forma cortinas de agua en la entrada."
            },
            duende: {
                imagen: "../../assets/images/lluvia-cueva-duende.png",
                texto: "El duende se esconde en las profundidades de la cueva, protegido de la lluvia exterior."
            },
            fantasma: {
                imagen: "../../assets/images/lluvia-cueva-fantasma.png",
                texto: "El fantasma flota en la oscuridad de la cueva, mientras la lluvia resuena en el exterior."
            }
        }
    },
    oscura: {
        bosque: {
            dragon: {
                imagen: "../../assets/images/oscura-bosque-dragon.png",
                texto: "En la oscuridad del bosque, los ojos del dragón brillan como brasas entre los árboles."
            },
            duende: {
                imagen: "../../assets/images/oscura-bosque-duende.png",
                texto: "Las risitas del duende resuenan en la oscuridad del bosque, mientras se mueve entre las sombras."
            },
            fantasma: {
                imagen: "../../assets/images/oscura-bosque-fantasma.png",
                texto: "El fantasma emite un tenue resplandor en la oscuridad del bosque, flotando entre los árboles."
            }
        },
        castillo: {
            dragon: {
                imagen: "../../assets/images/oscura-castillo-dragon.png",
                texto: "El dragón acecha en las sombras del castillo, sus escamas apenas visibles en la oscuridad."
            },
            duende: {
                imagen: "../../assets/images/oscura-castillo-duende.png",
                texto: "El duende se desliza por los oscuros pasillos del castillo, sus pasos apenas audibles."
            },
            fantasma: {
                imagen: "../../assets/images/oscura-castillo-fantasma.png",
                texto: "El fantasma vaga por los pasillos oscuros del castillo, su forma espectral apenas visible."
            }
        },
        cueva: {
            dragon: {
                imagen: "../../assets/images/oscura-cueva-dragon.png",
                texto: "En la oscuridad de la cueva, el dragón se confunde con las sombras, solo visible por el brillo de sus ojos."
            },
            duende: {
                imagen: "../../assets/images/oscura-cueva-duende.png",
                texto: "El duende se esconde en los rincones oscuros de la cueva, sus risitas haciendo eco en las paredes."
            },
            fantasma: {
                imagen: "../../assets/images/oscura-cueva-fantasma.png",
                texto: "El fantasma se funde con la oscuridad de la cueva, su presencia apenas perceptible."
            }
        }
    },
    tranquila: {
        bosque: {
            dragon: {
                imagen: "../../assets/images/oscura-bosque-dragon.png",
                texto: "En la tranquilidad del bosque, el dragón reposa majestuosamente entre los árboles."
            },
            duende: {
                imagen: "../../assets/images/oscura-bosque-duende.png",
                texto: "El duende juega pacíficamente en el tranquilo bosque, saltando entre los arbustos."
            },
            fantasma: {
                imagen: "../../assets/images/oscura-bosque-fantasma.png",
                texto: "El fantasma flota serenamente en el bosque tranquilo, su presencia casi reconfortante."
            }
        },
        castillo: {
            dragon: {
                imagen: "../../assets/images/oscura-castillo-dragon.png",
                texto: "El dragón descansa tranquilamente sobre las almenas del castillo, observando el horizonte."
            },
            duende: {
                imagen: "../../assets/images/oscura-castillo-duende.png",
                texto: "El duende pasea tranquilamente por los pasillos del castillo, explorando curioso."
            },
            fantasma: {
                imagen: "../../assets/images/oscura-castillo-fantasma.png",
                texto: "El fantasma deambula pacíficamente por el castillo, su presencia apenas notada."
            }
        },
        cueva: {
            dragon: {
                imagen: "../../assets/images/oscura-cueva-dragon.png",
                texto: "El dragón descansa plácidamente en la cueva, su respiración apenas audible."
            },
            duende: {
                imagen: "../../assets/images/oscura-cueva-duende.png",
                texto: "El duende explora tranquilamente la cueva, tarareando una melodía suave."
            },
            fantasma: {
                imagen: "../../assets/images/oscura-cueva-fantasma.png",
                texto: "El fantasma flota serenamente en la cueva, creando una atmósfera de calma."
            }
        }
    }
};

function confirmar() {
    try {
        let todosRellenos = true;
        
        huecos.forEach(hueco => {
            if (!hueco.textContent) {
                todosRellenos = false;
                hueco.classList.add('error');
            }
        });

        if (!todosRellenos) {
            document.getElementById('p1').innerHTML = "¡Rellena todos los huecos!";
            return;
        }

        // Función para normalizar texto (quitar acentos y convertir a minúsculas)
        const normalizeText = (text) => {
            return text.toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "");
        };

        currentGameState.ambiente = normalizeText(document.querySelector('.hueco[data-tipo="ambiente"]').textContent);
        currentGameState.lugar = normalizeText(document.querySelector('.hueco[data-tipo="lugar"]').textContent);
        currentGameState.criatura = normalizeText(document.querySelector('.hueco[data-tipo="criatura"]').textContent);

        if (!historias[currentGameState.ambiente]) {
            console.error('Ambiente no válido:', currentGameState.ambiente);
            throw new Error('Ambiente no válido');
        }
        if (!historias[currentGameState.ambiente][currentGameState.lugar]) {
            console.error('Lugar no válido:', currentGameState.lugar);
            throw new Error('Lugar no válido');
        }
        if (!historias[currentGameState.ambiente][currentGameState.lugar][currentGameState.criatura]) {
            console.error('Criatura no válida:', currentGameState.criatura);
            throw new Error('Criatura no válida');
        }

        const situacion = historias[currentGameState.ambiente]
                                 [currentGameState.lugar]
                                 [currentGameState.criatura];

        let imagen = document.getElementById('historiaImagen');
        imagen.src = situacion.imagen;

        const historia = `${situacion.texto}
                         ${tieneObjeto.pocionMagica ? 'Tu poción mágica podría ser útil.' : ''}
                         ${tieneObjeto.espadaLegendaria ? ' Tu espada legendaria te da confianza.' : ''}
                         ${tieneObjeto.amuletoFantasmal ? ' El amuleto fantasmal te protege.' : ''}`;

        const decisionesHTML = `
            <div class="story-text">
                <p>${historia}</p>
            </div>
            <div class="decisiones">
                <button onclick="tomarDecision('atacar')">Atacar</button>
                <button onclick="tomarDecision('huir')">Huir</button>
                <button onclick="tomarDecision('negociar')">Negociar</button>
            </div>
        `;
        
        document.querySelector('.story-text').innerHTML = decisionesHTML;
        document.querySelector('.botones-control').style.display = 'none';
        document.getElementById('p1').innerHTML = "¡Historia actualizada!";
    } catch (error) {
        console.error("Error al confirmar:", error);
        document.getElementById('p1').innerHTML = "Hubo un error al procesar la historia. Verifica que las palabras sean correctas.";
    }
}

function reiniciarJuego() {
    tieneObjeto = {
        pocionMagica: false,
        espadaLegendaria: false,
        amuletoFantasmal: false,
        monedas: 100
    };

    currentGameState = {
        lugar: '',
        criatura: '',
        ambiente: ''
    };
    
    const historiaInicial = `
        <div class="historia-inicial">
            <p>En una noche <span class="hueco" data-tipo="ambiente"></span>, 
            nuestro héroe caminaba por un/una <span class="hueco" data-tipo="lugar"></span> 
            cuando apareció un <span class="hueco" data-tipo="criatura"></span>.</p>
            <button onclick="confirmar()" class="btn-tienda">Confirmar</button>
        </div>
    `;
    
    document.getElementById('historiaImagen').src = 'https://okdiario.com/img/2017/01/04/caballeros-edad-media-curiosidades.jpg';
    document.querySelector('.story-text').innerHTML = historiaInicial;
    
    document.querySelector('.decisiones').style.display = 'none';
    document.querySelector('.botones-control').style.display = 'flex';
    
    const huecos = document.querySelectorAll('.hueco');
    huecos.forEach(hueco => {
        hueco.textContent = '';
        hueco.classList.remove('error');
    });
    
    actualizarInventarioVisual();
    
    inicializarEventosDragAndDrop();
    
    document.getElementById('p1').innerHTML = "¡Nueva aventura comenzada!";
}

function actualizarInventarioVisual() {
    try {
        document.getElementById('monedas-display').textContent = tieneObjeto.monedas;
        
        const objetosLista = document.getElementById('objetos-lista');
        if (!objetosLista) {
            throw new Error("No se encontró el elemento objetos-lista");
        }
        
        objetosLista.innerHTML = '';
        
        const nombresObjetos = {
            pocionMagica: 'Poción Mística',
            espadaLegendaria: 'Espada Ancestral',
            amuletoFantasmal: 'Amuleto Místico'
        };
        
        for (const [objeto, tiene] of Object.entries(tieneObjeto)) {
            if (tiene === true && nombresObjetos[objeto]) {
                const objetoElement = document.createElement('div');
                objetoElement.className = 'objeto-inventario';
                objetoElement.textContent = nombresObjetos[objeto];
                objetosLista.appendChild(objetoElement);
            }
        }
    } catch (error) {
        console.error("Error al actualizar inventario:", error);
        document.getElementById('p1').innerHTML = "Error al actualizar inventario";
    }
}
