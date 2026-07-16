"use client";

import { useMemo, useState } from "react";

const ART_URL =
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg?width=2560";

type Category = "Todos" | "Símbolos" | "Criaturas" | "Música" | "Pecado";

type Point = {
  id: number;
  x: number;
  y: number;
  panel: string;
  category: Exclude<Category, "Todos">;
  title: string;
  subtitle: string;
  text: string;
  certainty: "Documentado" | "Interpretación";
};

const points: Point[] = [
  { id: 1, x: 14, y: 36, panel: "Paraíso", category: "Símbolos", title: "La fuente de la vida", subtitle: "Arquitectura orgánica y mineral", text: "La estructura rosada se alza en el centro del Paraíso. Su forma combina lo vegetal, lo pétreo y lo fantástico; debajo aparece una lechuza, animal de lectura ambivalente en la época.", certainty: "Interpretación" },
  { id: 2, x: 22, y: 68, panel: "Paraíso", category: "Criaturas", title: "Animales reales e imaginarios", subtitle: "Un mundo antes de la caída", text: "El Bosco reúne especies conocidas en Europa con animales exóticos y criaturas inventadas. La convivencia no es completamente pacífica: ya hay depredación y tensión.", certainty: "Documentado" },
  { id: 3, x: 42, y: 30, panel: "Jardín", category: "Símbolos", title: "La cabalgata circular", subtitle: "Deseo, repetición y movimiento", text: "Jinetes sobre animales reales y fabulosos giran alrededor de un estanque de mujeres. La circularidad puede sugerir deseo reiterado, inestabilidad y falta de dirección moral.", certainty: "Interpretación" },
  { id: 4, x: 53, y: 63, panel: "Jardín", category: "Pecado", title: "Frutos gigantes", subtitle: "Placer intenso y fugaz", text: "Fresas, cerezas y otros frutos aparecen fuera de escala. En interpretaciones tradicionales aluden al placer sensual: atractivo, dulce y rápidamente perecedero.", certainty: "Interpretación" },
  { id: 5, x: 63, y: 39, panel: "Jardín", category: "Criaturas", title: "Aves desmesuradas", subtitle: "La inversión del orden natural", text: "Aves enormes alimentan, transportan o rodean a los seres humanos. El cambio de escala borra las jerarquías habituales y vuelve inestable el mundo visible.", certainty: "Documentado" },
  { id: 6, x: 78, y: 63, panel: "Infierno", category: "Música", title: "El infierno musical", subtitle: "Instrumentos convertidos en tormento", text: "Arpa, laúd, zanfoña y otros instrumentos dejan de producir armonía y se transforman en máquinas de castigo. Una partitura aparece escrita sobre el cuerpo de un condenado.", certainty: "Documentado" },
  { id: 7, x: 86, y: 35, panel: "Infierno", category: "Pecado", title: "El hombre-árbol", subtitle: "Identidad, fragilidad y castigo", text: "La figura hueca mira al espectador mientras sostiene una escena de taberna. Es una de las invenciones más reconocibles del tríptico y su significado exacto sigue abierto.", certainty: "Interpretación" },
  { id: 8, x: 93, y: 71, panel: "Infierno", category: "Criaturas", title: "El monstruo devorador", subtitle: "La degradación final", text: "Una criatura con cabeza de ave ingiere cuerpos y los expulsa a un pozo. La escena enlaza gula, avaricia y humillación corporal dentro del sistema de castigos.", certainty: "Interpretación" },
];

const categories: Category[] = ["Todos", "Símbolos", "Criaturas", "Música", "Pecado"];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [category, setCategory] = useState<Category>("Todos");
  const [selected, setSelected] = useState<Point | null>(null);
  const [lens, setLens] = useState({ x: 58, y: 43, visible: false });
  const [help, setHelp] = useState(false);

  const visiblePoints = useMemo(
    () => points.filter((point) => category === "Todos" || point.category === category),
    [category],
  );

  return (
    <main className="experience">
      <header className="topbar">
        <button className="brand" onClick={() => { setStarted(false); setSelected(null); }}>
          El jardín de las delicias <span>— Explorador</span>
        </button>
        <nav aria-label="Herramientas">
          <button onClick={() => setHelp(true)}><i>?</i> Ayuda</button>
          <a href="https://www.museodelprado.es/coleccion/obra-de-arte/triptico-del-jardin-de-las-delicias/02388242-6d6a-4e9e-a992-e1311eab3609" target="_blank" rel="noreferrer"><i>↗</i> Museo del Prado</a>
          <button onClick={() => document.documentElement.requestFullscreen?.()}><i>⛶</i> Pantalla completa</button>
        </nav>
      </header>

      <section
        className="painting-stage"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setLens({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100, visible: started });
        }}
        onMouseLeave={() => setLens((current) => ({ ...current, visible: false }))}
      >
        <img className="painting" src={ART_URL} alt="El jardín de las delicias, tríptico de El Bosco" />
        <div className="panel-labels" aria-hidden="true"><span>Paraíso</span><span>El jardín</span><span>Infierno</span></div>
        <div
          className={`lens ${lens.visible && !selected ? "visible" : ""}`}
          style={{ left: `${lens.x}%`, top: `${lens.y}%`, backgroundImage: `url("${ART_URL}")`, backgroundPosition: `${lens.x}% ${lens.y}%` }}
        />

        {started && visiblePoints.map((point) => (
          <button
            key={point.id}
            className="hotspot"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            aria-label={`Abrir: ${point.title}`}
            onClick={(event) => { event.stopPropagation(); setSelected(point); }}
          ><span>{point.id}</span></button>
        ))}

        {!started && (
          <div className="welcome">
            <p>Una obra. Tres mundos. Cientos de enigmas.</p>
            <h1>Entrá en el cuadro</h1>
            <button onClick={() => setStarted(true)}>Comenzar exploración <span>→</span></button>
            <small>Mové el cursor para ampliar · Elegí un punto para descubrirlo</small>
          </div>
        )}

        <div className="shade" />
      </section>

      <div className="chapter-line"><span>01 — El origen</span><span>02 — El deseo</span><span>03 — La consecuencia</span></div>

      <nav className={`category-bar ${started ? "active" : ""}`} aria-label="Filtros temáticos">
        {categories.map((item) => (
          <button key={item} className={category === item ? "selected" : ""} onClick={() => { setCategory(item); setStarted(true); }}>
            <span className="category-icon">{item === "Todos" ? "◎" : item === "Símbolos" ? "◇" : item === "Criaturas" ? "⌁" : item === "Música" ? "♫" : "◉"}</span>
            <span>{item}</span>
            <small>{item === "Todos" ? points.length : points.filter((p) => p.category === item).length}</small>
          </button>
        ))}
      </nav>

      {selected && (
        <aside className="detail" aria-live="polite">
          <button className="close" onClick={() => setSelected(null)} aria-label="Cerrar">×</button>
          <p className="eyebrow">{selected.panel} · Punto {String(selected.id).padStart(2, "0")}</p>
          <div className="detail-number">{String(selected.id).padStart(2, "0")}</div>
          <h2>{selected.title}</h2>
          <h3>{selected.subtitle}</h3>
          <p className="description">{selected.text}</p>
          <div className="certainty"><span>{selected.certainty}</span><p>{selected.certainty === "Documentado" ? "Elemento visible y descrito por fuentes museísticas." : "Lectura posible; no existe una interpretación definitiva."}</p></div>
          <div className="pager">
            <button onClick={() => setSelected(points[(selected.id + points.length - 2) % points.length])}>← Anterior</button>
            <button onClick={() => setSelected(points[selected.id % points.length])}>Siguiente →</button>
          </div>
        </aside>
      )}

      {help && (
        <div className="modal-backdrop" onClick={() => setHelp(false)}>
          <section className="help" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setHelp(false)}>×</button>
            <p className="eyebrow">Cómo explorar</p>
            <h2>Mirar antes de interpretar</h2>
            <ol><li>Mové el cursor sobre la pintura para activar la lente.</li><li>Filtrá los puntos por tema desde la barra inferior.</li><li>Abrí una ficha y distinguí entre hechos documentados e interpretaciones.</li></ol>
          </section>
        </div>
      )}

      <footer>El Bosco · hacia 1490–1500 · óleo sobre tabla · Museo Nacional del Prado <span>Imagen de dominio público vía Wikimedia Commons</span></footer>
    </main>
  );
}
