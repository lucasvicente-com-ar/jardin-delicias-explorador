const artUrl =
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg?width=2560";

const points = [
  {
    id: 1,
    x: 14,
    y: 36,
    panel: "Paraiso",
    category: "Simbolos",
    title: "La fuente de la vida",
    subtitle: "Arquitectura organica y mineral",
    text: "La estructura rosada se alza en el centro del Paraiso. Su forma combina lo vegetal, lo petreo y lo fantastico; debajo aparece una lechuza, animal de lectura ambivalente en la epoca.",
    certainty: "Interpretacion",
  },
  {
    id: 2,
    x: 22,
    y: 68,
    panel: "Paraiso",
    category: "Criaturas",
    title: "Animales reales e imaginarios",
    subtitle: "Un mundo antes de la caida",
    text: "El Bosco reune especies conocidas en Europa con animales exoticos y criaturas inventadas. La convivencia no es completamente pacifica: ya hay depredacion y tension.",
    certainty: "Documentado",
  },
  {
    id: 3,
    x: 42,
    y: 30,
    panel: "Jardin",
    category: "Simbolos",
    title: "La cabalgata circular",
    subtitle: "Deseo, repeticion y movimiento",
    text: "Jinetes sobre animales reales y fabulosos giran alrededor de un estanque de mujeres. La circularidad puede sugerir deseo reiterado, inestabilidad y falta de direccion moral.",
    certainty: "Interpretacion",
  },
  {
    id: 4,
    x: 53,
    y: 63,
    panel: "Jardin",
    category: "Pecado",
    title: "Frutos gigantes",
    subtitle: "Placer intenso y fugaz",
    text: "Fresas, cerezas y otros frutos aparecen fuera de escala. En interpretaciones tradicionales aluden al placer sensual: atractivo, dulce y rapidamente perecedero.",
    certainty: "Interpretacion",
  },
  {
    id: 5,
    x: 63,
    y: 39,
    panel: "Jardin",
    category: "Criaturas",
    title: "Aves desmesuradas",
    subtitle: "La inversion del orden natural",
    text: "Aves enormes alimentan, transportan o rodean a los seres humanos. El cambio de escala borra las jerarquias habituales y vuelve inestable el mundo visible.",
    certainty: "Documentado",
  },
  {
    id: 6,
    x: 78,
    y: 63,
    panel: "Infierno",
    category: "Musica",
    title: "El infierno musical",
    subtitle: "Instrumentos convertidos en tormento",
    text: "Arpa, laud, zanfona y otros instrumentos dejan de producir armonia y se transforman en maquinas de castigo. Una partitura aparece escrita sobre el cuerpo de un condenado.",
    certainty: "Documentado",
  },
  {
    id: 7,
    x: 86,
    y: 35,
    panel: "Infierno",
    category: "Pecado",
    title: "El hombre-arbol",
    subtitle: "Identidad, fragilidad y castigo",
    text: "La figura hueca mira al espectador mientras sostiene una escena de taberna. Es una de las invenciones mas reconocibles del triptico y su significado exacto sigue abierto.",
    certainty: "Interpretacion",
  },
  {
    id: 8,
    x: 93,
    y: 71,
    panel: "Infierno",
    category: "Criaturas",
    title: "El monstruo devorador",
    subtitle: "La degradacion final",
    text: "Una criatura con cabeza de ave ingiere cuerpos y los expulsa a un pozo. La escena enlaza gula, avaricia y humillacion corporal dentro del sistema de castigos.",
    certainty: "Interpretacion",
  },
];

const categories = ["Todos", "Simbolos", "Criaturas", "Musica", "Pecado"];
const categoryIcons = {
  Todos: "T",
  Simbolos: "S",
  Criaturas: "C",
  Musica: "M",
  Pecado: "P",
};

let started = false;
let category = "Todos";
let selectedPoint = null;

const stage = document.querySelector("[data-stage]");
const lens = document.querySelector("[data-lens]");
const hotspots = document.querySelector("[data-hotspots]");
const welcome = document.querySelector("[data-welcome]");
const categoriesNav = document.querySelector("[data-categories]");
const detail = document.querySelector("[data-detail]");
const helpModal = document.querySelector("[data-help-modal]");

lens.style.backgroundImage = `url("${artUrl}")`;

function visiblePoints() {
  return points.filter((point) => category === "Todos" || point.category === category);
}

function renderCategories() {
  categoriesNav.innerHTML = categories
    .map((item) => {
      const count = item === "Todos" ? points.length : points.filter((point) => point.category === item).length;
      const selected = item === category ? " selected" : "";
      return `
        <button class="${selected}" type="button" data-category="${item}">
          <span class="category-icon">${categoryIcons[item]}</span>
          <span>${item}</span>
          <small>${count}</small>
        </button>
      `;
    })
    .join("");
}

function renderHotspots() {
  hotspots.innerHTML = started
    ? visiblePoints()
        .map(
          (point) => `
            <button
              class="hotspot"
              type="button"
              style="left:${point.x}%;top:${point.y}%"
              aria-label="Abrir: ${point.title}"
              data-point="${point.id}"
            ><span>${point.id}</span></button>
          `,
        )
        .join("")
    : "";
}

function openDetail(point) {
  selectedPoint = point;
  detail.hidden = false;
  detail.innerHTML = `
    <button class="close" type="button" data-close-detail aria-label="Cerrar">x</button>
    <p class="eyebrow">${point.panel} - Punto ${String(point.id).padStart(2, "0")}</p>
    <div class="detail-number">${String(point.id).padStart(2, "0")}</div>
    <h2>${point.title}</h2>
    <h3>${point.subtitle}</h3>
    <p class="description">${point.text}</p>
    <div class="certainty">
      <span>${point.certainty}</span>
      <p>${point.certainty === "Documentado"
        ? "Elemento visible y descrito por fuentes museisticas."
        : "Lectura posible; no existe una interpretacion definitiva."}</p>
    </div>
    <div class="pager">
      <button type="button" data-prev>&lt;- Anterior</button>
      <button type="button" data-next>Siguiente -&gt;</button>
    </div>
  `;
}

function closeDetail() {
  selectedPoint = null;
  detail.hidden = true;
  detail.innerHTML = "";
}

function startExploration() {
  started = true;
  welcome.hidden = true;
  renderHotspots();
}

function resetExperience() {
  started = false;
  category = "Todos";
  welcome.hidden = false;
  closeDetail();
  renderCategories();
  renderHotspots();
}

stage.addEventListener("mousemove", (event) => {
  const rect = stage.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  lens.style.left = `${x}%`;
  lens.style.top = `${y}%`;
  lens.style.backgroundPosition = `${x}% ${y}%`;
  lens.classList.toggle("visible", started && !selectedPoint);
});

stage.addEventListener("mouseleave", () => {
  lens.classList.remove("visible");
});

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;

  if (target.matches("[data-start]")) startExploration();
  if (target.matches("[data-reset]")) resetExperience();
  if (target.matches("[data-help]")) helpModal.hidden = false;
  if (target.matches("[data-close-help]")) helpModal.hidden = true;
  if (target.matches("[data-fullscreen]")) document.documentElement.requestFullscreen?.();

  const categoryButton = target.closest("[data-category]");
  if (categoryButton) {
    category = categoryButton.dataset.category;
    startExploration();
    renderCategories();
  }

  const pointButton = target.closest("[data-point]");
  if (pointButton) {
    const point = points.find((item) => item.id === Number(pointButton.dataset.point));
    if (point) openDetail(point);
  }

  if (target.matches("[data-close-detail]")) closeDetail();
  if (target.matches("[data-prev]") && selectedPoint) {
    openDetail(points[(selectedPoint.id + points.length - 2) % points.length]);
  }
  if (target.matches("[data-next]") && selectedPoint) {
    openDetail(points[selectedPoint.id % points.length]);
  }
});

helpModal.addEventListener("click", (event) => {
  if (event.target === helpModal) helpModal.hidden = true;
});

renderCategories();
renderHotspots();
