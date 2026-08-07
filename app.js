/* Notitimba Online — JS principal */

/* Fecha de hoy en el header */
(function () {
  var el = document.getElementById('fecha-hoy');
  if (el) {
    var f = new Date();
    el.textContent = f.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
})();

/* ---- Tabla de los sueños (00–99) ---- */
var SUENOS = [
  ["00","Los huevos"],["01","El agua"],["02","El niño"],["03","San Cono"],["04","La cama"],
  ["05","El gato"],["06","El perro"],["07","El revólver"],["08","El incendio"],["09","El arroyo"],
  ["10","La leche"],["11","El palito"],["12","El soldado"],["13","La yeta"],["14","El borracho"],
  ["15","La niña bonita"],["16","El anillo"],["17","La desgracia"],["18","La sangre"],["19","El pescado"],
  ["20","La fiesta"],["21","La mujer"],["22","El loco"],["23","La mariposa"],["24","El caballo"],
  ["25","La gallina"],["26","La misa"],["27","El peine"],["28","El cerro"],["29","San Pedro"],
  ["30","Santa Rosa"],["31","La luz"],["32","El dinero"],["33","Cristo"],["34","La cabeza"],
  ["35","El pajarito"],["36","La manteca"],["37","El dentista"],["38","El aceite"],["39","La lluvia"],
  ["40","El cura"],["41","El cuchillo"],["42","Las zapatillas"],["43","El balcón"],["44","La cárcel"],
  ["45","El vino"],["46","Los tomates"],["47","El muerto"],["48","El muerto que habla"],["49","La carne"],
  ["50","El pan"],["51","El serrucho"],["52","La madre y el hijo"],["53","El barco"],["54","La vaca"],
  ["55","Los gallegos"],["56","La caída"],["57","El jorobado"],["58","El ahogado"],["59","Las plantas"],
  ["60","La Virgen"],["61","La escopeta"],["62","La inundación"],["63","El casamiento"],["64","El llanto"],
  ["65","El cazador"],["66","Las lombrices"],["67","La víbora"],["68","Los sobrinos"],["69","Los vicios"],
  ["70","El muerto en sueño"],["71","Los excrementos"],["72","La sorpresa"],["73","El hospital"],["74","Las personas de luto"],
  ["75","El payaso"],["76","Las llamas"],["77","Las piernas de mujer"],["78","La mujer de la vida"],["79","El ladrón"],
  ["80","La bocha"],["81","Las flores"],["82","La pelea"],["83","El mal tiempo"],["84","La iglesia"],
  ["85","La linterna"],["86","El humo"],["87","Los piojos"],["88","El Papa"],["89","La rata"],
  ["90","El miedo"],["91","El excusado"],["92","El médico"],["93","El enamorado"],["94","El cementerio"],
  ["95","Los anteojos"],["96","El marido"],["97","La mesa"],["98","La lavandera"],["99","Los hermanos"]
];

function normalizar(t) {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function iniciarSuenos() {
  var cont = document.getElementById('tabla-suenos');
  if (!cont) return;
  var input = document.getElementById('buscar-sueno');
  var vacio = document.getElementById('sin-resultados');

  function pintar(lista) {
    cont.innerHTML = '';
    lista.forEach(function (s) {
      var d = document.createElement('div');
      d.className = 'sueno';
      d.innerHTML = '<b>' + s[0] + '</b><span>' + s[1] + '</span>';
      cont.appendChild(d);
    });
    if (vacio) vacio.style.display = lista.length ? 'none' : 'block';
  }

  pintar(SUENOS);

  if (input) {
    input.addEventListener('input', function () {
      var q = normalizar(input.value.trim());
      if (!q) { pintar(SUENOS); return; }
      pintar(SUENOS.filter(function (s) {
        return s[0].indexOf(q) !== -1 || normalizar(s[1]).indexOf(q) !== -1;
      }));
    });
  }
}
iniciarSuenos();

/* ---- Resultados de la quiniela ---- */
var HORARIOS = {
  previa: "10:15", primera: "12:00", matutina: "15:00", vespertina: "18:00", nocturna: "21:00"
};
var NOMBRES_SORTEO = {
  previa: "La Previa", primera: "La Primera", matutina: "Matutina", vespertina: "Vespertina", nocturna: "Nocturna"
};

function iniciarResultados() {
  var cont = document.getElementById('resultados-quiniela');
  if (!cont) return;
  var loteria = cont.getAttribute('data-loteria') || 'nacional';

  fetch('/resultados.json?v=' + new Date().toISOString().slice(0, 10))
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var fechaEl = document.getElementById('fecha-resultados');
      if (fechaEl && data.fecha) fechaEl.textContent = data.fecha_texto || data.fecha;
      var sorteos = (data.quiniela && data.quiniela[loteria]) || {};
      cont.innerHTML = '';
      ['previa', 'primera', 'matutina', 'vespertina', 'nocturna'].forEach(function (clave) {
        var s = sorteos[clave] || {};
        var numeros = s.numeros || [];
        var art = document.createElement('article');
        art.className = 'sorteo';
        var celdas = '';
        for (var i = 0; i < 20; i++) {
          var n = numeros[i] || '—';
          var pend = (n === '—') ? ' class="pendiente"' : '';
          celdas += '<div' + pend + '>' + n + '<small>' + (i + 1) + 'º</small></div>';
        }
        var cabeza = numeros[0] || '—';
        art.innerHTML =
          '<header><h3>' + NOMBRES_SORTEO[clave] + '</h3><span class="hora">' + HORARIOS[clave] + ' hs</span></header>' +
          '<div class="cabeza"><span class="num' + (cabeza === '—' ? ' pendiente' : '') + '">' + cabeza + '</span>' +
          '<span class="etq">A la cabeza</span></div>' +
          '<div class="numeros">' + celdas + '</div>' +
          (cabeza === '—' ? '<p class="estado">Sorteo pendiente — los resultados se publican minutos después de cada sorteo.</p>' : '');
        cont.appendChild(art);
      });
    })
    .catch(function () {
      cont.innerHTML = '<p>No pudimos cargar los resultados. Actualizá la página en unos minutos.</p>';
    });
}
iniciarResultados();
