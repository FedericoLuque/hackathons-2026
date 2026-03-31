# Lightning Hackathons 2026 — La Crypta

Sitio web estatico para el programa de 8 hackathons mensuales de Bitcoin/Lightning/Nostr organizados por [La Crypta](https://lacrypta.ar). Primera hackathon de Bitcoin con jurado 100% AI.

**Live:** [hackathons.lacrypta.ar](https://hackathons.lacrypta.ar)

---

## Arquitectura

Sitio estatico con progressive enhancement. Sin frameworks, sin build step, sin backend.

| Capa | Tecnologia |
|------|-----------|
| Markup | HTML5 semantico |
| Estilos | CSS puro con custom properties |
| Interactividad | JavaScript vanilla inline (sin archivos .js externos) |
| Datos | JSON files en `data/` |
| Formularios | [Tally.so](https://tally.so) embebido via modal |
| Hosting | GitHub Pages (deploy automatico en push a `main`) |
| Dominio | `hackathons.lacrypta.ar` (CNAME a GitHub Pages) |

**Patron principal:** HTML estatico con datos hardcodeados en el markup. Los archivos JSON (`data/hackathons.json`, `data/projects/*.json`) sirven como fuente de verdad estructurada para futuras integraciones dinamicas, pero actualmente el contenido se renderiza directamente en HTML.

---

## Estructura del Repositorio

```
hackathons-2026/
├── index.html                        # Landing page principal (hero, jurado, timeline, premios, FAQ)
├── hackathons.html                   # Listado de los 8 hackathons con estados (active/disabled)
├── CNAME                             # Custom domain: hackathons.lacrypta.ar
├── DEPLOY.md                         # Guia de deploy
├── LICENSE                           # MIT License
├── .nojekyll                         # Desactiva Jekyll en GitHub Pages
├── .gitignore
│
├── css/
│   ├── styles.css                    # Design system principal (1381 lineas)
│   └── hackathon-detail.css          # Estilos para paginas de detalle de hackathon (284 lineas)
│
├── data/
│   ├── hackathons.json               # Metadata de los 8 hackathons + distribucion de premios
│   └── projects/
│       ├── README.md                 # Guia para enviar proyectos via PR
│       └── foundations.json          # Proyectos enviados al hackathon #1
│
├── hackathons/
│   ├── foundations.html              # #1 FOUNDATIONS — Lightning Payments (ACTIVO)
│   ├── identity.html                 # #2 IDENTITY — Nostr Identity (disabled)
│   ├── zaps.html                     # #3 ZAPS — Lightning + Nostr (disabled)
│   ├── commerce.html                 # #4 COMMERCE — E-commerce (disabled)
│   ├── media.html                    # #5 MEDIA — Decentralized Storage (disabled)
│   ├── ai-agents.html                # #6 AI AGENTS — Bots & Automation (disabled)
│   ├── infrastructure.html           # #7 INFRASTRUCTURE — Nodes & Routing (disabled)
│   ├── integration.html              # #8 INTEGRATION — Full-Stack Apps (disabled)
│   └── como-participar.html          # Guia paso a paso + instrucciones para AI agents
│
├── docs/
│   ├── reglas.html                   # Reglas y terminos de participacion
│   ├── codigo-conducta.html          # Codigo de conducta
│   ├── landing-spec.md               # Especificacion de diseno de la landing
│   └── roadmap-completo.md           # Roadmap detallado del programa
│
└── assets/
    ├── fonts/                        # Fuentes custom (Standerd, Blatant)
    ├── judges/                       # Imagenes de los jueces AI
    ├── logos/                        # Logos de La Crypta
    └── pilares/                      # Iconos de tecnologias Bitcoin/Lightning/Nostr
```

---

## Design System (CSS)

### Variables de color

```css
--primary: #00ff9d       /* Verde neon — color principal de La Crypta */
--primary-dark: #00cc7d
--bitcoin: #f7931a       /* Naranja Bitcoin */
--gold: #ffc800          /* Dorado para acentos y premios */
--black: #000000         /* Fondo principal */
```

### Tipografia

| Fuente | Uso | Pesos |
|--------|-----|-------|
| Standerd | Body text | 400, 500, 600, 700, 800 |
| Blatant | Titulos display | Bold, Bold Italic |
| JetBrains Mono | Bloques de codigo | Monospace fallback |

### Componentes CSS principales

- **`.navbar`** — Barra fija con efecto de scroll (agrega `.scrolled` al pasar 50px)
- **`.hero`** — Seccion principal con gradientes radiales y badge animado
- **`.timeline`** — Linea vertical con items animados al scroll
- **`.judge-card`** — Tarjetas de jueces AI con `data-judge` para estilos especificos y efecto glow
- **`.prize-card`** — Tarjetas de premios con estilos gold/silver/bronze
- **`.project-card`** — Tarjetas de proyectos enviados
- **`.pilar-card`** — Tarjetas de tecnologias (8 pilares)
- **`.benefit-card`** — Tarjetas de beneficios de participar

### Responsive

- Breakpoint principal: `768px`
- Grid con `auto-fit` y `minmax()` para adaptacion automatica
- Menu hamburguesa en mobile via `toggleMenu()`
- Tamanios touch-friendly en botones

### Animaciones

- **Intersection Observer** — Revela elementos (`.visible`) al entrar al viewport
- **CSS transitions** — Efectos hover en tarjetas (scale, translateY, opacity)
- **Gradient text** — `background-clip: text` para titulos con degradado
- **Badge pulsante** — Animacion CSS en el hero

---

## JavaScript

Todo el JS es inline dentro de `<script>` tags. No hay archivos `.js` externos. Las funcionalidades son:

### 1. Menu responsive

```javascript
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('active');
  document.body.classList.toggle('menu-open');
}
```

### 2. Smooth scroll

Intercepta clicks en links `#anchor` y hace scroll suave al target.

### 3. Navbar scroll effect

Agrega/quita la clase `.scrolled` al navbar cuando `window.scrollY > 50`.

### 4. Intersection Observer

Observa `.timeline-item`, `.judge-card`, `.pilar-card`, `.benefit-card` y les agrega la clase `.visible` cuando entran al viewport (threshold 0.2, rootMargin -50px).

### Dependencia externa

- **Tally.so** (`https://tally.so/widgets/embed.js`) — Maneja formularios de inscripcion via modal. Se activa con atributos `data-tally-open`, `data-tally-layout`, `data-tally-width` en botones.

---

## Capa de Datos

### `data/hackathons.json`

Fuente de verdad para el programa completo.

```json
{
  "program": {
    "name": "Lightning Hackathons 2026",
    "organization": "La Crypta",
    "totalPrize": 8000000,
    "prizePerHackathon": 1000000,
    "prizeDistribution": [
      { "position": 1, "sats": 400000 },
      { "position": 2, "sats": 250000 },
      { "position": 3, "sats": 150000 },
      { "position": 4, "sats": 100000 },
      { "position": 5, "sats": 60000 },
      { "position": 6, "sats": 40000 }
    ]
  },
  "hackathons": [
    {
      "id": "foundations",
      "number": 1,
      "name": "FOUNDATIONS",
      "focus": "Lightning Payments Basics",
      "difficulty": "Beginner",
      "stars": 1,
      "month": "Marzo",
      "dates": [{ "date": "2026-03-03", "type": "apertura", "title": "..." }]
    }
  ]
}
```

### `data/projects/*.json`

Un archivo JSON por hackathon con los proyectos enviados.

```json
{
  "hackathon": "foundations",
  "projects": [
    {
      "id": "proyecto-slug",
      "name": "Nombre del Proyecto",
      "description": "Descripcion corta",
      "team": [{ "name": "Dev", "github": "user", "role": "Lead" }],
      "repo": "https://github.com/user/repo",
      "demo": "https://demo.url",
      "tech": ["Lightning", "NWC"],
      "status": "submitted",
      "submittedAt": "2026-03-04"
    }
  ]
}
```

**Estados de un proyecto:**

```
idea → building → submitted → finalist → winner → official
```

- `idea` — Solo concepto
- `building` — En desarrollo
- `submitted` — Entregado para evaluacion
- `finalist` — Seleccionado como finalista
- `winner` — Ganador con premio
- `official` — Integrado al stack de La Crypta

---

## Modelo Economico

### Distribucion de premios por hackathon

| Posicion | Sats | ~USD |
|----------|------|------|
| 1ro | 400,000 | ~$240 |
| 2do | 250,000 | ~$150 |
| 3ro | 150,000 | ~$90 |
| 4to | 100,000 | ~$60 |
| 5to | 60,000 | ~$36 |
| 6to | 40,000 | ~$24 |

- **Total por hackathon:** 1,000,000 sats
- **Total programa (8 hackathons):** 8,000,000 sats (~$4,800 USD)
- **Moneda:** Bitcoin (denominado en satoshis)
- **Metodo de pago:** Lightning Network via [LaWallet](https://lawallet.ar)

### Flujo de pago

1. Deadline del hackathon se cumple
2. Los 3 jueces AI evaluan los proyectos (~24 horas)
3. Se anuncian ganadores en la community call de premios
4. Premios se envian via Lightning Network al wallet del ganador
5. Liquidacion instantanea (caracteristica de Lightning)

### Consideraciones economicas

- **Self-custody:** El ganador debe tener un wallet Lightning configurado para recibir premios
- **Riesgo de tipo de cambio:** Premios en sats, no en USD. El valor fluctua con el precio de BTC
- **Sin escrow:** LaWallet actua como intermediario pero no como servicio de custodia
- **Implicaciones fiscales:** Los pagos en Bitcoin pueden tener consecuencias impositivas segun la jurisdiccion (no abordado en las reglas)

---

## Sistema de Jurado AI

Primera hackathon de Bitcoin evaluada 100% por agentes AI autonomos. Sin jueces humanos.

### Los 3 jueces

| Juez | Modelo | Rol | Pregunta clave | Evalua |
|------|--------|-----|----------------|--------|
| **Claudio** | Claude Opus 4.5 | Visionario / Estrategia | "Esto arregla el dinero?" | Filosofia Bitcoin, valores, proposito, innovacion |
| **Gorilatron** | Claude Opus 4.5 | CTO / Code Quality | "El codigo puede vivir en produccion?" | Arquitectura, tests, calidad tecnica, mantenibilidad |
| **Gorilator** | Grok 3 | Community / UX | "Mi abuela lo puede usar?" | Utilidad real, experiencia de usuario, accesibilidad |

### Por que 3 perspectivas

Cada proyecto se evalua desde angulos complementarios:
- **Filosofia** (Claudio): El proyecto tiene sentido en el ecosistema Bitcoin? Promueve soberania financiera?
- **Codigo** (Gorilatron): El codigo es limpio, testeado, desplegable en produccion?
- **Usabilidad** (Gorilator): Una persona no tecnica puede usarlo? Es accesible?

---

## Fairness y Transparencia

### Ventajas del jurado AI sobre jueces humanos

- **Sin favoritismo:** Los AI no tienen relaciones personales con participantes
- **Sin politica:** No hay intereses ocultos ni presiones externas
- **Criterios deterministas:** Cada juez tiene preguntas explicitas y publicas
- **Reproducibilidad:** Las evaluaciones son auditables (el AI no esconde su razonamiento)
- **Triple evaluacion:** 3 perspectivas distintas reducen puntos ciegos

### Que NO se usa

- **Sin votacion comunitaria:** Evita popularity contests y brigading
- **Sin scoring subjetivo de "vibes":** Criterios concretos y medibles
- **Sin factores ocultos:** Las reglas son las mismas para todos

### Limitaciones conocidas

- No hay proceso de apelacion definido para decisiones del jurado AI
- Los modelos AI pueden tener sesgos sistematicos (aunque diferentes a los humanos)
- No hay capa de supervision humana sobre las evaluaciones
- No se especifica como se resuelven desacuerdos significativos entre los 3 jueces

---

## Edge Cases y Reglas

### Entrega de proyectos

| Situacion | Resolucion |
|-----------|-----------|
| Proyecto entregado fuera de deadline | No se acepta. Deadlines estrictos. |
| Repo no publico en GitHub | Descalificado. Requisito: repo publico en GitHub. |
| Sin licencia open source | Descalificado. Licencia MIT/Apache/GPL obligatoria. |
| Plagio o fraude detectado | Descalificacion inmediata. |
| Proyecto sin demo funcional | Puede participar pero tendra scoring bajo. Se requiere demo + documentacion + codigo. |

### Equipos y participantes

| Situacion | Resolucion |
|-----------|-----------|
| Equipo de mas de 4 personas | No permitido. Maximo 4 integrantes. |
| Participante menor de edad | Requiere consentimiento parental. Sin consentimiento, no puede participar. |
| Cambio de equipo durante hackathon | No se permite modificar el equipo una vez registrado. |
| Participar en multiples hackathons | Permitido. Cada hackathon es independiente. |

### Premios y pagos

| Situacion | Resolucion |
|-----------|-----------|
| Ganador sin wallet Lightning | Debe proveer direccion Lightning valida. Si no lo hace, el premio puede retenerse o anularse. |
| Disputa entre miembros del equipo por el premio | No cubierto explicitamente en las reglas. La organizacion no arbitra divisiones internas. |
| Wallet del ganador comprometida | Self-custody: el ganador es responsable de la seguridad de su wallet. |

### Propiedad intelectual

- El codigo pertenece a los desarrolladores
- La Crypta puede integrar proyectos ganadores a su stack de produccion
- La licencia open source se mantiene

---

## Paginas del Sitio

| Pagina | Archivo | Descripcion |
|--------|---------|-------------|
| Landing | `index.html` | Pagina principal con hero, jurado AI, timeline de 8 hackathons, premios, beneficios, FAQ, registro |
| Hackathons | `hackathons.html` | Grid de los 8 hackathons con estados (activo/disabled/WIP) |
| Foundations | `hackathons/foundations.html` | Detalle del hackathon #1: premios, calendario, topics, proyectos enviados |
| Como Participar | `hackathons/como-participar.html` | Tutorial de 7 pasos + instrucciones ocultas para AI agents |
| Identity - Integration | `hackathons/{identity...integration}.html` | Hackathons #2-#8 (templates deshabilitados, en construccion) |
| Reglas | `docs/reglas.html` | Terminos y condiciones de participacion |
| Codigo de Conducta | `docs/codigo-conducta.html` | Normas de comportamiento, reportes, consecuencias |

---

## Desarrollo Local

```bash
git clone https://github.com/FedericoLuque/hackathons-2026.git
cd hackathons-2026

# Servir localmente
python3 -m http.server 8000
# o
npx serve .

# Abrir http://localhost:8000
```

No requiere build, compilacion ni instalacion de dependencias para el sitio.

### Agregar un proyecto

Los proyectos se agregan via Pull Request al archivo JSON correspondiente en `data/projects/`:

1. Fork el repo
2. Editar `data/projects/{hackathon-id}.json`
3. Agregar el proyecto siguiendo el schema documentado arriba
4. Abrir PR

### Tests

```bash
npm install    # Instalar dependencias de test
npm test       # Correr tests
```

---

## Deploy

El sitio se despliega automaticamente a GitHub Pages en cada push a `main`.

- **URL default:** `https://FedericoLuque.github.io/hackathons-2026/`
- **Custom domain:** `hackathons.lacrypta.ar` (via CNAME)
- **CI/CD:** GitHub Pages nativo (sin pipeline custom)

---

## Contribuir

1. Fork el repo
2. Crear branch (`git checkout -b feature/mejora`)
3. Commit cambios (`git commit -m 'Descripcion del cambio'`)
4. Push (`git push origin feature/mejora`)
5. Abrir Pull Request

---

## Contacto

- **Discord:** [La Crypta](https://discord.com/invite/SN8JNhMgvY)
- **Twitter:** [@LaCryptaOk](https://twitter.com/LaCryptaOk)
- **Email:** hackathons@lacrypta.ar
- **Web:** [lacrypta.ar](https://lacrypta.ar)

---

## Licencia

MIT License — Ver [LICENSE](LICENSE).

---

**Powered by:**
[La Crypta](https://lacrypta.ar) | [OpenClaw](https://github.com/clawdbot/clawdbot) | [LaWallet](https://lawallet.ar)
