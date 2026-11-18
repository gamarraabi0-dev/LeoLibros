const librosCatalogo = [
    {
        id: 1,
        titulo: "El Principito",
        autor: "Antoine de Saint-Exupéry",
        categoria: "escolar",
        etiqueta: "Lectura Escolar · 4° Grado",
        precio: 6000,
        color: "#162b4d",
        estado: "Nuevo · Edición económica",
        sinopsis: "El clásico más solicitado por las escuelas del barrio Echesortu. Incluye ilustraciones y edición accesible para estudiantes."
    },
    {
        id: 2,
        titulo: "La señal de los cuatro",
        autor: "Arthur Conan Doyle",
        categoria: "clasicos",
        etiqueta: "Clásico Económico",
        precio: 2000,
        color: "#7c2d12",
        estado: "Nuevo · Oportunidad Feria",
        sinopsis: "Una de las grandes novelas de Sherlock Holmes en edición económica ideal para iniciarse en el policial clásico y armar biblioteca."
    },
    {
        id: 3,
        titulo: "Orgullo y Prejuicio",
        autor: "Jane Austen",
        categoria: "clasicos",
        etiqueta: "Clásico Económico",
        precio: 2500,
        color: "#3f6212",
        estado: "Nuevo · Edición accesible",
        sinopsis: "La obra maestra de Jane Austen dentro de la línea de clásicos económicos destacados por los libreros de Marcos Paz 3904."
    },
    {
        id: 4,
        titulo: "Antología de Novela Romántica",
        autor: "Selección de Barrio Echesortu",
        categoria: "novelas",
        etiqueta: "Favorito del Local",
        precio: 4500,
        color: "#831843",
        estado: "Usado seleccionado / Saldo",
        sinopsis: "Uno de los géneros más buscados por los vecinos en el local de Marcos Paz 3904, con ejemplares renovados cada semana."
    },
    {
        id: 5,
        titulo: "Cuentos Clásicos Ilustrados",
        autor: "Varios Autores",
        categoria: "infantil",
        etiqueta: "Infantil · Regalo",
        precio: 3800,
        color: "#b45309",
        estado: "Nuevo · 20% OFF en Feria",
        sinopsis: "Historias breves ilustradas elegidas por abuelos, tíos y familias para compartir lectura en papel con los más chicos."
    },
    {
        id: 6,
        titulo: "Estudio en Escarlata",
        autor: "Arthur Conan Doyle",
        categoria: "clasicos",
        etiqueta: "Clásico Económico",
        precio: 2000,
        color: "#1e3a8a",
        estado: "Nuevo · Desde $2.000",
        sinopsis: "La primera aparición de Sherlock Holmes y el Dr. Watson, disponible en la mesa de oportunidades de Leo Libros."
    }
];

// Estado de bolsa y comentarios persistentes
let bolsa = JSON.parse(localStorage.getItem("leolibros_bolsa") || "[]");
const comentariosIniciales = [
    {
        nombre: "Laura (Barrio Echesortu)",
        libro: "El Principito",
        mensaje: "Todos los años pasamos por Marcos Paz 3904 a buscar los libros para la escuela de mis hijos. Siempre nos atienden con la mejor onda y precios súper accesibles."
    },
    {
        nombre: "Carlos M. (Rosario Centro)",
        libro: "La señal de los cuatro",
        mensaje: "Los conocí en el stand de la Feria del Libro y me llevé tres clásicos económicos a $2.000 cada uno. ¡Un lujo que sigan defendiendo el libro en papel!"
    }
];
let comentarios = JSON.parse(localStorage.getItem("leolibros_muro") || JSON.stringify(comentariosIniciales));

document.addEventListener("DOMContentLoaded", () => {
    // 1. Descarga del proyecto separado en ZIP
    const btnZip = document.getElementById("btnDescargarZip");
    if (btnZip) {
        btnZip.addEventListener("click", async () => {
            if (typeof JSZip === "undefined") return;
            const zip = new JSZip();
            const carpeta = zip.folder("LeoLibros-Rosario");

            const [resCss, resJs] = await Promise.all([
                fetch("leolibros.css").then(r => r.ok ? r.text() : "").catch(() => ""),
                fetch("leolibros.js").then(r => r.ok ? r.text() : "").catch(() => "")
            ]);

            carpeta.file("index.html", "<!DOCTYPE html>\n" + document.documentElement.outerHTML);
            if (resCss) carpeta.file("leolibros.css", resCss);
            if (resJs) carpeta.file("leolibros.js", resJs);
            carpeta.file("LEEME.txt",
                "PROYECTO WEB SEPARADO: LEO LIBROS (Marcos Paz 3904, Echesortu, Rosario)\n" +
                "=======================================================================\n\n" +
                "Archivos incluidos:\n" +
                "- index.html (Estructura HTML)\n" +
                "- leolibros.css (Estilos CSS)\n" +
                "- leolibros.js (Lógica JavaScript e interactividad)\n\n" +
                "Para escuchar tu grabación original automáticamente, colocá tu archivo\n" +
                "'WhatsApp Audio 2026-11-18 at 16.29.15.mp4' en esta misma carpeta.\n"
            );

            const blob = await zip.generateAsync({ type: "blob" });
            const enlace = document.createElement("a");
            enlace.href = URL.createObjectURL(blob);
            enlace.download = "LeoLibros-Rosario-Separado.zip";
            enlace.click();
            URL.revokeObjectURL(enlace.href);
        });
    }

    // 2. Catálogo Vivo y Filtros
    const gridCatalogo = document.getElementById("gridCatalogo");
    const inputBuscador = document.getElementById("inputBuscador");
    const filterBtns = document.querySelectorAll(".filter-btn");
    let categoriaActual = "todos";

    function renderCatalogo() {
        const texto = (inputBuscador.value || "").toLowerCase().trim();
        const filtrados = librosCatalogo.filter(libro => {
            const coincideCat = categoriaActual === "todos" || libro.categoria === categoriaActual;
            const coincideTexto = libro.titulo.toLowerCase().includes(texto) ||
                                  libro.autor.toLowerCase().includes(texto) ||
                                  libro.etiqueta.toLowerCase().includes(texto);
            return coincideCat && coincideTexto;
        });

        if (filtrados.length === 0) {
            gridCatalogo.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-muted mb-0">No encontramos libros con esa búsqueda. Probá con otro término o consultanos por WhatsApp.</p>
                </div>`;
            return;
        }

        gridCatalogo.innerHTML = filtrados.map(libro => `
            <div class="col-md-6 col-lg-4">
                <div class="card-libro h-100 d-flex overflow-hidden shadow-sm">
                    <div class="lomo-decorativo flex-shrink-0" style="background-color: ${libro.color};"></div>
                    <div class="p-4 d-flex flex-column justify-content-between flex-grow-1">
                        <div>
                            <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                                <span class="badge rounded-pill" style="background-color: var(--dorado-suave); color: #7c5208;">${libro.etiqueta}</span>
                                <span class="fw-bold" style="color: var(--azul-editorial);">$${libro.precio.toLocaleString("es-AR")}</span>
                            </div>
                            <h3 class="h5 fw-bold mb-1">${libro.titulo}</h3>
                            <p class="small text-muted mb-2">${libro.autor}</p>
                            <p class="small text-secondary mb-3">${libro.sinopsis}</p>
                        </div>
                        <div class="d-flex gap-2 pt-2 border-top">
                            <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3" onclick="verFichaLibro(${libro.id})">
                                Ficha
                            </button>
                            <button type="button" class="btn btn-sm btn-azul rounded-pill px-3 flex-grow-1" onclick="agregarALaBolsa('${libro.titulo.replace(/'/g, "\\'")}', ${libro.precio})">
                                <i class="bi bi-bag-plus me-1"></i>Agregar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join("");
    }

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => {
                b.classList.remove("btn-azul", "active");
                b.classList.add("btn-outline-secondary");
            });
            btn.classList.remove("btn-outline-secondary");
            btn.classList.add("btn-azul", "active");
            categoriaActual = btn.dataset.cat;
            renderCatalogo();
        });
    });

    if (inputBuscador) {
        inputBuscador.addEventListener("input", renderCatalogo);
    }
    renderCatalogo();

    // 3. Selector de etapas de El Principito
    const textosEtapas = {
        infancia: {
            titulo: "Mirada en la Infancia (4° Grado):",
            texto: "“De chico te maravilla la aventura por los asteroides, los dibujos del elefante dentro de la boa y la ternura del zorro. Es la puerta de entrada perfecta para enamorarse de los libros en papel.”"
        },
        adolescencia: {
            titulo: "Mirada en la Adolescencia:",
            texto: "“Empezás a notar la crítica al mundo de los adultos ocupados en cifras y apariencias, y el valor de cuidar aquello que uno elige domesticar.”"
        },
        adultez: {
            titulo: "Mirada en la Adultez:",
            texto: "“Descubrís toda su profundidad filosófica sobre los vínculos humanos, la responsabilidad afectiva y la certeza de que lo esencial es invisible a los ojos.”"
        }
    };

    document.querySelectorAll(".btn-etapa").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".btn-etapa").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const info = textosEtapas[btn.dataset.etapa];
            const caja = document.getElementById("cajaReflexionEtapa");
            if (caja) {
                caja.innerHTML = `
                    <div class="fw-bold mb-1" style="color: var(--azul-editorial);">${info.titulo}</div>
                    <p class="mb-0 text-secondary">${info.texto}</p>
                `;
            }
        });
    });

    // 4. Bolsa de consulta WhatsApp
    window.agregarALaBolsa = function(titulo, precio) {
        const existente = bolsa.find(i => i.titulo === titulo);
        if (existente) {
            existente.cantidad += 1;
        } else {
            bolsa.push({ titulo, precio, cantidad: 1 });
        }
        guardarYRenderizarBolsa();
        const drawerEl = document.getElementById("drawerBolsa");
        if (drawerEl) {
            const drawer = bootstrap.Offcanvas.getOrCreateInstance(drawerEl);
            drawer.show();
        }
    };

    window.quitarDeBolsa = function(idx) {
        bolsa.splice(idx, 1);
        guardarYRenderizarBolsa();
    };

    function guardarYRenderizarBolsa() {
        localStorage.setItem("leolibros_bolsa", JSON.stringify(bolsa));
        const cont = document.getElementById("itemsBolsa");
        const badge = document.getElementById("badgeBolsa");
        const totalEl = document.getElementById("totalBolsa");
        if (!cont || !badge || !totalEl) return;

        const totalItems = bolsa.reduce((acc, i) => acc + i.cantidad, 0);
        const totalPrecio = bolsa.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

        badge.textContent = totalItems;
        totalEl.textContent = `$${totalPrecio.toLocaleString("es-AR")}`;

        if (bolsa.length === 0) {
            cont.innerHTML = `<div class="text-center text-muted small py-4">Todavía no agregaste libros a tu consulta.</div>`;
            return;
        }

        cont.innerHTML = bolsa.map((item, idx) => `
            <div class="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                <div>
                    <div class="fw-semibold small">${item.titulo} <span class="text-muted">x${item.cantidad}</span></div>
                    <div class="small text-secondary">$${(item.precio * item.cantidad).toLocaleString("es-AR")}</div>
                </div>
                <button type="button" class="btn btn-sm btn-outline-danger rounded-circle" onclick="quitarDeBolsa(${idx})" aria-label="Quitar">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `).join("");
    }
    guardarYRenderizarBolsa();

    function construirTextoConsulta() {
        if (bolsa.length === 0) {
            return "Hola Leo Libros (Marcos Paz 3904), quiero consultar por el catálogo disponible en el local.";
        }
        const lineas = bolsa.map(i => `- ${i.titulo} (x${i.cantidad}) - $${(i.precio * i.cantidad).toLocaleString("es-AR")}`).join("\n");
        return `Hola Leo Libros (Marcos Paz 3904), vengo de su página web y quiero consultar disponibilidad de:\n${lineas}`;
    }

    const btnWa = document.getElementById("btnEnviarWhatsapp");
    if (btnWa) {
        btnWa.addEventListener("click", () => {
            const msg = encodeURIComponent(construirTextoConsulta());
            window.open(`https://wa.me/5493410000000?text=${msg}`, "_blank");
        });
    }

    const btnCopiar = document.getElementById("btnCopiarConsulta");
    if (btnCopiar) {
        btnCopiar.addEventListener("click", () => {
            const temp = document.createElement("textarea");
            temp.value = construirTextoConsulta();
            document.body.appendChild(temp);
            temp.select();
            document.execCommand("copy");
            document.body.removeChild(temp);
            const fb = document.getElementById("feedbackCopia");
            if (fb) {
                fb.classList.remove("d-none");
                setTimeout(() => fb.classList.add("d-none"), 2500);
            }
        });
    }

    // 5. Modal de ficha bibliográfica
    window.verFichaLibro = function(id) {
        const libro = librosCatalogo.find(l => l.id === id);
        if (!libro) return;
        document.getElementById("modalTitulo").textContent = libro.titulo;
        document.getElementById("modalCuerpo").innerHTML = `
            <span class="badge rounded-pill mb-2" style="background-color: var(--dorado-suave); color: #7c5208;">${libro.etiqueta}</span>
            <p class="fw-semibold text-muted mb-3">Autor: ${libro.autor}</p>
            <p class="text-secondary">${libro.sinopsis}</p>
            <div class="p-3 rounded-3 bg-light small mb-3">
                <div><strong>Estado:</strong> ${libro.estado}</div>
                <div><strong>Punto de retiro:</strong> Marcos Paz 3904, Echesortu, Rosario</div>
                <div><strong>Precio referencial:</strong> $${libro.precio.toLocaleString("es-AR")}</div>
            </div>
            <button type="button" class="btn btn-dorado w-100 rounded-pill py-2" data-bs-dismiss="modal" onclick="agregarALaBolsa('${libro.titulo.replace(/'/g, "\\'")}', ${libro.precio})">
                <i class="bi bi-bag-plus-fill me-2"></i>Agregar a mi bolsa de consulta
            </button>
        `;
        bootstrap.Modal.getOrCreateInstance(document.getElementById("modalLibro")).show();
    };

    // 6. Muro de comentarios de lectores
    function renderMuro() {
        const lista = document.getElementById("listaComentarios");
        if (!lista) return;
        lista.innerHTML = comentarios.map(c => `
            <div class="bg-white p-4 rounded-4 border shadow-sm">
                <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                    <span class="fw-bold" style="color: var(--azul-editorial);"><i class="bi bi-person-circle me-1"></i> ${c.nombre}</span>
                    <span class="badge rounded-pill" style="background-color: var(--dorado-suave); color: #7c5208;">
                        <i class="bi bi-book me-1"></i> ${c.libro}
                    </span>
                </div>
                <p class="text-secondary mb-0 small">${c.mensaje}</p>
            </div>
        `).join("");
    }
    renderMuro();

    const formMuro = document.getElementById("formMuro");
    if (formMuro) {
        formMuro.addEventListener("submit", (e) => {
            e.preventDefault();
            const nombre = document.getElementById("nombreLector").value.trim();
            const libro = document.getElementById("libroFavorito").value.trim();
            const mensaje = document.getElementById("mensajeLector").value.trim();
            if (!nombre || !libro || !mensaje) return;
            comentarios.unshift({ nombre, libro, mensaje });
            localStorage.setItem("leolibros_muro", JSON.stringify(comentarios));
            e.target.reset();
            renderMuro();
        });
    }

    // 7. Controlador de Audio HTML5 + Narración de Voz + Carga Local (.mp4)
    const audioEl = document.getElementById("entrevistaAudio");
    const inputAudioLocal = document.getElementById("cargarAudioLocal");
    const btnPlay = document.getElementById("btnPlayPause");
    const iconPlay = document.getElementById("iconPlayPause");
    const barra = document.getElementById("barraProgreso");
    const lblActual = document.getElementById("tiempoActual");
    const lblTotal = document.getElementById("tiempoTotal");
    const lblEstado = document.getElementById("estadoReproduccion");
    const badgeSource = document.getElementById("audioSourceBadge");
    const btnMute = document.getElementById("btnMute");
    const iconMute = document.getElementById("iconMute");

    if (!audioEl || !btnPlay) return;

    let usandoArchivoReal = false;
    let reproduciendoVoz = false;
    let silenciado = false;
    let indiceDialogo = 0;
    let tiempoSimulado = 0;
    const duracionTotalNarracion = 115;
    let intervaloReloj = null;

    const guionEntrevista = [
        {
            seg: 0,
            rol: "corresponsal",
            texto: "¿Cuál es el perfil principal de la propuesta de Leo Libros y qué tipo de catálogo eligen traer a la feria?"
        },
        {
            seg: 12,
            rol: "librero",
            texto: "Acá a la feria sí o sí tenemos que traer libros nuevos, porque Leo Libros en realidad vende libros usados y de saldo fundamentalmente en el local. Tenemos en casi todos descuentos de hasta el veinte por ciento y ofertas en efectivo variadas."
        },
        {
            seg: 34,
            rol: "corresponsal",
            texto: "Para quien no conoce Leo Libros en Rosario, ¿cómo definiría su catálogo o su sello distintivo?"
        },
        {
            seg: 45,
            rol: "librero",
            texto: "La mayoría de catálogos son libros usados clásicos, muchas novelas románticas, que es lo que se vende mucho en el barrio, y después los clásicos económicos como Orgullo y Prejuicio de Jane Austen o los de Conan Doyle. Tenemos libros nuevos desde dos mil pesos, como La señal de los cuatro, ideales para empezar a leer y formar una biblioteca."
        },
        {
            seg: 72,
            rol: "corresponsal",
            texto: "¿Cuál es el público que más se acerca a buscar libros y por qué destacan El Principito?"
        },
        {
            seg: 81,
            rol: "librero",
            texto: "Fundamentalmente escuelas a partir de cuarto grado. Todas las escuelas del barrio Echesortu nos compran; las maestras mandan a comprar El Principito, que está en seis mil pesos nuevo en edición económica. Es un libro que deja una enseñanza sobre las relaciones humanas."
        },
        {
            seg: 100,
            rol: "corresponsal",
            texto: "¿Qué ventaja le da a una editorial y distribuidora rosarina participar en ferias del libro?"
        },
        {
            seg: 107,
            rol: "librero",
            texto: "Nos ayuda muchísimo: nos hacemos conocidos y llevamos a la gente al barrio. A todos los libros les ponemos nuestro sellito con los contactos, el Instagram leo punto libros punto rosario y nuestro WhatsApp, acercando a los vecinos a Marcos Paz tres mil novecientos cuatro."
        }
    ];

    function formatearTiempo(seg) {
        const m = Math.floor(seg / 60).toString().padStart(2, "0");
        const s = Math.floor(seg % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    function resaltarTranscripcion(segundos, maxRef) {
        const bloques = document.querySelectorAll(".segmento-audio");
        const paso = maxRef / bloques.length;
        bloques.forEach((seg, idx) => {
            const inicio = idx * paso;
            const fin = (idx + 1) * paso;
            if (segundos >= inicio && segundos < fin) {
                seg.classList.add("bg-warning", "bg-opacity-25", "border-start", "border-4", "border-warning");
            } else {
                seg.classList.remove("bg-warning", "bg-opacity-25", "border-start", "border-4", "border-warning");
            }
        });
    }

    audioEl.addEventListener("loadedmetadata", () => {
        if (audioEl.duration && !isNaN(audioEl.duration)) {
            usandoArchivoReal = true;
            barra.max = Math.floor(audioEl.duration);
            lblTotal.textContent = formatearTiempo(audioEl.duration);
            badgeSource.innerHTML = '<i class="bi bi-file-earmark-music-fill me-1"></i> Grabación Original Cargada';
        }
    });

    if (inputAudioLocal) {
        inputAudioLocal.addEventListener("change", (e) => {
            const archivo = e.target.files[0];
            if (!archivo) return;
            detenerNarracionVoz();
            const urlBlob = URL.createObjectURL(archivo);
            audioEl.src = urlBlob;
            audioEl.load();
            usandoArchivoReal = true;
            badgeSource.innerHTML = `<i class="bi bi-check-circle-fill me-1"></i> ${archivo.name.slice(0, 22)}...`;
            lblEstado.textContent = "Archivo cargado. Listo para reproducir";
            iconPlay.className = "bi bi-play-fill fs-3";
        });
    }

    audioEl.addEventListener("timeupdate", () => {
        if (usandoArchivoReal) {
            barra.value = Math.floor(audioEl.currentTime);
            lblActual.textContent = formatearTiempo(audioEl.currentTime);
            resaltarTranscripcion(audioEl.currentTime, audioEl.duration || 258);
        }
    });

    audioEl.addEventListener("ended", () => {
        iconPlay.className = "bi bi-play-fill fs-3";
        lblEstado.textContent = "Entrevista finalizada";
    });

    function obtenerVozEspanol(rol) {
        const voces = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
        const vocesEs = voces.filter(v => v.lang && v.lang.toLowerCase().startsWith("es"));
        if (vocesEs.length === 0) return null;
        if (rol === "librero" && vocesEs.length > 1) return vocesEs[1];
        return vocesEs[0];
    }

    if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }

    function hablarFragmento(idx) {
        if (!reproduciendoVoz || idx >= guionEntrevista.length) {
            if (idx >= guionEntrevista.length) {
                detenerNarracionVoz();
                tiempoSimulado = 0;
                barra.value = 0;
                lblActual.textContent = "00:00";
                lblEstado.textContent = "Entrevista finalizada";
            }
            return;
        }

        indiceDialogo = idx;
        const item = guionEntrevista[idx];
        tiempoSimulado = item.seg;
        barra.value = tiempoSimulado;
        lblActual.textContent = formatearTiempo(tiempoSimulado);
        resaltarTranscripcion(tiempoSimulado, duracionTotalNarracion);

        if (!("speechSynthesis" in window)) {
            lblEstado.textContent = "Tu navegador no soporta voz integrada";
            return;
        }

        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(item.texto);
        utter.lang = "es-AR";
        const voz = obtenerVozEspanol(item.rol);
        if (voz) utter.voice = voz;
        utter.rate = item.rol === "corresponsal" ? 1.05 : 0.98;
        utter.pitch = item.rol === "corresponsal" ? 1.12 : 0.92;
        utter.volume = silenciado ? 0 : 1;

        utter.onend = () => {
            if (reproduciendoVoz) {
                hablarFragmento(idx + 1);
            }
        };
        utter.onerror = () => {
            if (reproduciendoVoz) {
                hablarFragmento(idx + 1);
            }
        };

        window.speechSynthesis.speak(utter);
    }

    function iniciarNarracionVoz() {
        reproduciendoVoz = true;
        barra.max = duracionTotalNarracion;
        lblTotal.textContent = formatearTiempo(duracionTotalNarracion);
        iconPlay.className = "bi bi-pause-fill fs-3";
        lblEstado.textContent = "Escuchando entrevista narrada...";

        clearInterval(intervaloReloj);
        intervaloReloj = setInterval(() => {
            if (reproduciendoVoz && tiempoSimulado < duracionTotalNarracion) {
                tiempoSimulado++;
                barra.value = tiempoSimulado;
                lblActual.textContent = formatearTiempo(tiempoSimulado);
            }
        }, 1000);

        hablarFragmento(indiceDialogo);
    }

    function detenerNarracionVoz() {
        reproduciendoVoz = false;
        clearInterval(intervaloReloj);
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
        iconPlay.className = "bi bi-play-fill fs-3";
        lblEstado.textContent = "En pausa";
    }

    btnPlay.addEventListener("click", () => {
        if (usandoArchivoReal) {
            if (audioEl.paused) {
                audioEl.play().then(() => {
                    iconPlay.className = "bi bi-pause-fill fs-3";
                    lblEstado.textContent = "Reproduciendo grabación...";
                }).catch(() => {
                    usandoArchivoReal = false;
                    iniciarNarracionVoz();
                });
            } else {
                audioEl.pause();
                iconPlay.className = "bi bi-play-fill fs-3";
                lblEstado.textContent = "En pausa";
            }
            return;
        }

        if (reproduciendoVoz) {
            detenerNarracionVoz();
        } else {
            iniciarNarracionVoz();
        }
    });

    barra.addEventListener("input", (e) => {
        const val = Number(e.target.value);
        if (usandoArchivoReal) {
            audioEl.currentTime = val;
        } else {
            tiempoSimulado = val;
            lblActual.textContent = formatearTiempo(val);
            resaltarTranscripcion(val, duracionTotalNarracion);
            const nuevoIdx = guionEntrevista.findIndex((g, i) => {
                const sig = guionEntrevista[i + 1];
                return val >= g.seg && (!sig || val < sig.seg);
            });
            if (nuevoIdx !== -1) {
                indiceDialogo = nuevoIdx;
                if (reproduciendoVoz) hablarFragmento(indiceDialogo);
            }
        }
    });

    if (btnMute) {
        btnMute.addEventListener("click", () => {
            silenciado = !silenciado;
            audioEl.muted = silenciado;
            iconMute.className = silenciado ? "bi bi-volume-mute-fill text-warning" : "bi bi-volume-up-fill";
            if (reproduciendoVoz) {
                hablarFragmento(indiceDialogo);
            }
        });
    }
});
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel-button.next');
const prevButton = document.querySelector('.carousel-button.prev');
const dotsNav = document.querySelector('.carousel-nav');
const dots = Array.from(dotsNav.children);

// Función para mover el carrusel a una diapositiva específica
const moveToSlide = (track, targetSlideIndex) => {
    track.style.transform = 'translateX(-' + (targetSlideIndex * 100) + '%)';
};

// Actualizar la clase activa de los indicadores
const updateDots = (currentDot, targetDot) => {
    currentDot.classList.remove('current-slide');
    targetDot.classList.add('current-slide');
};

// Click en botón SIGUIENTE
nextButton.addEventListener('click', e => {
    let currentIndex = slides.findIndex(slide => track.style.transform.includes(`-${slides.indexOf(slide) * 100}%`));
    
    if (currentIndex === -1 || track.style.transform === "") {
        currentIndex = 0;
    }

    const nextIndex = (currentIndex + 1) % slides.length;
    
    moveToSlide(track, nextIndex);
    updateDots(dots[currentIndex], dots[nextIndex]);
});

// Click en botón ANTERIOR
prevButton.addEventListener('click', e => {
    let currentIndex = slides.findIndex(slide => track.style.transform.includes(`-${slides.indexOf(slide) * 100}%`));
    
    if (currentIndex === -1 || track.style.transform === "") {
        currentIndex = 0;
    }

    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    
    moveToSlide(track, prevIndex);
    updateDots(dots[currentIndex], dots[prevIndex]);
});

// Click en los PUNTOS indicadores
dotsNav.addEventListener('click', e => {
    const targetDot = e.target.closest('button');
    if (!targetDot) return;

    const targetIndex = dots.findIndex(dot => dot === targetDot);
    let currentIndex = slides.findIndex(slide => track.style.transform.includes(`-${slides.indexOf(slide) * 100}%`));
    if (currentIndex === -1) currentIndex = 0;

    moveToSlide(track, targetIndex);
    updateDots(dots[currentIndex], targetDot);
});