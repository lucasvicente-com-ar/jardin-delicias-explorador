const artUrl =
  "https://upload.wikimedia.org/wikipedia/commons/6/62/The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution_2.jpg";
const imageSize = {
  width: 19569,
  height: 11035,
};

const points = [
  {
    id: 1,
    x: 14,
    y: 36,
    panel: "Paraíso",
    category: "Símbolos",
    title: "La fuente de la vida",
    subtitle: "Arquitectura orgánica y mineral",
    text: "La estructura rosada se alza en el centro del Paraíso. Su forma combina lo vegetal, lo pétreo y lo fantástico; debajo aparece una lechuza, animal de lectura ambivalente en la época.",
  },
  {
    id: 2,
    x: 22,
    y: 68,
    panel: "Paraíso",
    category: "Criaturas",
    title: "Animales reales e imaginarios",
    subtitle: "Un mundo antes de la caída",
    text: "El Bosco reúne especies conocidas en Europa con animales exóticos y criaturas inventadas. La convivencia no es completamente pacífica: ya hay depredación y tensión.",
  },
  {
    id: 3,
    x: 42,
    y: 30,
    panel: "Jardín",
    category: "Símbolos",
    title: "La cabalgata circular",
    subtitle: "Deseo, repetición y movimiento",
    text: "Jinetes sobre animales reales y fabulosos giran alrededor de un estanque de mujeres. La circularidad puede sugerir deseo reiterado, inestabilidad y falta de dirección moral.",
  },
  {
    id: 4,
    x: 53,
    y: 63,
    panel: "Jardín",
    category: "Pecado",
    title: "Frutos gigantes",
    subtitle: "Placer intenso y fugaz",
    text: "Fresas, cerezas y otros frutos aparecen fuera de escala. En interpretaciones tradicionales aluden al placer sensual: atractivo, dulce y rápidamente perecedero.",
  },
  {
    id: 5,
    x: 63,
    y: 39,
    panel: "Jardín",
    category: "Criaturas",
    title: "Aves desmesuradas",
    subtitle: "La inversión del orden natural",
    text: "Aves enormes alimentan, transportan o rodean a los seres humanos. El cambio de escala borra las jerarquías habituales y vuelve inestable el mundo visible.",
  },
  {
    id: 6,
    x: 78,
    y: 63,
    panel: "Infierno",
    category: "Música",
    title: "El infierno musical",
    subtitle: "Instrumentos convertidos en tormento",
    text: "Arpa, laúd, zanfoña y otros instrumentos dejan de producir armonía y se transforman en máquinas de castigo. Una partitura aparece escrita sobre el cuerpo de un condenado.",
  },
  {
    id: 7,
    x: 86,
    y: 35,
    panel: "Infierno",
    category: "Pecado",
    title: "El hombre-árbol",
    subtitle: "Identidad, fragilidad y castigo",
    text: "La figura hueca mira al espectador mientras sostiene una escena de taberna. Es una de las invenciones más reconocibles del tríptico y su significado exacto sigue abierto.",
  },
  {
    id: 8,
    x: 93,
    y: 71,
    panel: "Infierno",
    category: "Criaturas",
    title: "El monstruo devorador",
    subtitle: "La degradación final",
    text: "Una criatura con cabeza de ave ingiere cuerpos y los expulsa a un pozo. La escena enlaza gula, avaricia y humillación corporal dentro del sistema de castigos.",
  },
];

const categories = ["Todos", "Símbolos", "Criaturas", "Música", "Pecado"];
const categoryIcons = {
  Todos: "T",
  Símbolos: "S",
  Criaturas: "C",
  Música: "M",
  Pecado: "P",
};

let started = false;
let category = "Todos";
let selectedPoint = null;
let viewer = null;

const viewerElement = document.querySelector("[data-viewer]");
const hotspots = document.querySelector("[data-hotspots]");
const panelNotes = document.querySelector("[data-panel-notes]");
const categoriesNav = document.querySelector("[data-categories]");
const detail = document.querySelector("[data-detail]");
const helpModal = document.querySelector("[data-help-modal]");

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

function clearHotspots() {
  hotspots.innerHTML = "";
  viewer?.clearOverlays();
}

function renderHotspots() {
  clearHotspots();
  if (!started || !viewer || !viewer.world.getItemCount()) return;

  visiblePoints().forEach((point) => {
    const button = document.createElement("button");
    button.className = "hotspot";
    button.type = "button";
    button.dataset.point = point.id;
    button.setAttribute("aria-label", `Abrir: ${point.title}`);
    button.innerHTML = `<span>${point.id}</span>`;

    viewer.addOverlay({
      element: button,
      location: new OpenSeadragon.Point(point.x / 100, (point.y / 100) * (imageSize.height / imageSize.width)),
      placement: OpenSeadragon.Placement.CENTER,
    });
  });
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
  panelNotes.hidden = true;
  renderHotspots();
}

function resetExperience() {
  started = false;
  category = "Todos";
  panelNotes.hidden = false;
  panelNotes.querySelectorAll("[data-panel-note]").forEach((note) => {
    note.hidden = false;
  });
  closeDetail();
  renderCategories();
  clearHotspots();
  viewer?.viewport.goHome(true);
}

function initViewer() {
  if (!window.OpenSeadragon) {
    viewerElement.innerHTML = `<img class="painting" src="${artUrl}" alt="El jardín de las delicias, tríptico de El Bosco">`;
    return;
  }

  viewer = OpenSeadragon({
    id: "painting-viewer",
    prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@6.0.2/build/openseadragon/images/",
    tileSources: {
      type: "image",
      url: artUrl,
      buildPyramid: true,
    },
    showNavigator: true,
    showRotationControl: false,
    animationTime: 0.45,
    blendTime: 0.12,
    constrainDuringPan: true,
    visibilityRatio: 0.85,
    minZoomLevel: 0.9,
    maxZoomPixelRatio: 2,
    gestureSettingsMouse: {
      clickToZoom: false,
      dblClickToZoom: true,
    },
  });

  viewer.addHandler("open", () => {
    viewer.viewport.goHome(true);
    renderHotspots();
  });
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;

  if (target.matches("[data-start]")) startExploration();
  if (target.matches("[data-reset]")) resetExperience();
  if (target.matches("[data-help]")) helpModal.hidden = false;
  if (target.matches("[data-close-help]")) helpModal.hidden = true;
  if (target.matches("[data-fullscreen]")) document.documentElement.requestFullscreen?.();
  if (target.matches("[data-close-note]")) {
    target.closest("[data-panel-note]").hidden = true;
    const openNotes = panelNotes.querySelectorAll("[data-panel-note]:not([hidden])");
    if (openNotes.length === 0) startExploration();
  }

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
initViewer();
