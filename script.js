

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
        });
    });
}




const missions = {

    base: {
        number: "BASE",
        name: "Starship",
        problem: "El superviviente razionara sus recursos para completar las misiones.",
        objective: "Mantener los sistemas de supervivencia y revisar los recursos disponibles.",
        benefit: "Conservar un lugar de resguardo desde el que organizar las expediciones.",
        data: "Monitoreo de recursos, energía y condiciones del refugio.",
        resources: {
            water: 0,
            oxygen: 0,
            energy: 0,
            food: 0
        },
        position: { x: 65, y: 35 }
    },

    seitah: {
        number: "MISIÓN 01",
        name: "Séítah",
        problem: "El terreno arenoso y rocoso puede dificultar el desplazamiento y representar obstáculos para la exploración.",
        objective: "Analizar el terreno, identificar zonas transitables y estudiar materiales geológicos.",
        benefit: "Reconocer posibles rutas más seguras y conocer mejor las características del suelo marciano.",
        data: "Imágenes ópticas, composición de rocas, textura del suelo y relieve superficial.",
        resources: {
            water: 15,
            oxygen: 20,
            energy: 15,
            food: 10
        },
        position: { x: 75, y: 30 }
    },

    threeforks: {
        number: "MISIÓN 02",
        name: "Three Forks",
        problem: "Se necesita ampliar la información sobre los materiales geológicos de la zona y su relación con el depósito de muestras de Perseverance.",
        objective: "Documentar las características del terreno y estudiar los materiales geológicos presentes.",
        benefit: "Obtener información adicional sobre la composición del suelo y los materiales marcianos.",
        data: "Registro visual de rocas, características del terreno y ubicación del depósito de muestras.",
        resources: {
            water: 20,
            oxygen: 25,
            energy: 20,
            food: 15
        },
        position: { x: 61, y: 64 }
    },

    delta: {
        number: "MISIÓN 03",
        name: "Frente del delta",
        problem: "Existen preguntas sobre los antiguos ambientes acuáticos y los sedimentos depositados en el delta.",
        objective: "Examinar capas sedimentarias y buscar minerales que aporten información sobre la presencia antigua de agua.",
        benefit: "Comprender mejor la historia geológica de Marte e investigar posibles ambientes habitables en el pasado.",
        data: "Capas sedimentarias, imágenes de afloramientos, minerales y estructuras geológicas.",
        resources: {
            water: 25,
            oxygen: 30,
            energy: 25,
            food: 20
        },
        position: { x: 30, y: 37 }
    },

    neretva: {
        number: "MISIÓN 04",
        name: "Neretva Vallis",
        problem: "Se requiere investigar los sedimentos y las rocas relacionados con el antiguo canal fluvial.",
        objective: "Analizar los materiales del terreno y buscar evidencias de antiguos procesos relacionados con el agua.",
        benefit: "Ampliar el conocimiento sobre los antiguos ambientes marcianos e identificar nuevas zonas de interés científico.",
        data: "Formas del relieve, depósitos sedimentarios, imágenes ópticas y composición de rocas.",
        resources: {
            water: 30,
            oxygen: 35,
            energy: 30,
            food: 25
        },
        position: { x: 85, y: 53 }
    }
};



const resourceInputs = {
    water: document.getElementById("water"),
    oxygen: document.getElementById("oxygen"),
    energy: document.getElementById("energy"),
    food: document.getElementById("food")
};

const resourceValues = {
    water: document.getElementById("water-value"),
    oxygen: document.getElementById("oxygen-value"),
    energy: document.getElementById("energy-value"),
    food: document.getElementById("food-value")
};

const pointNumber = document.getElementById("point-number");
const pointTitle = document.getElementById("point-title");
const pointProblem = document.getElementById("point-problem");
const pointObjective = document.getElementById("point-objective");
const pointBenefit = document.getElementById("point-benefit");
const pointData = document.getElementById("point-data");
const pointResources = document.getElementById("point-resources");

const decisionMission = document.getElementById("decision-mission");
const decisionStatus = document.getElementById("decision-status");
const evaluationResult = document.getElementById("evaluation-result");

const evaluateButton = document.getElementById("evaluate-button");

const routePath = document.getElementById("route-path");
const routeOrigin = document.getElementById("route-origin");
const routeDestination = document.getElementById("route-destination");
const routeDescription = document.getElementById("route-description");

let selectedMission = "seitah";
let hasEvaluated = false;



function getAvailableResources() {
    return {
        water: Number(resourceInputs.water.value),
        oxygen: Number(resourceInputs.oxygen.value),
        energy: Number(resourceInputs.energy.value),
        food: Number(resourceInputs.food.value)
    };
}



function updateResourceValues() {

    Object.keys(resourceInputs).forEach(resource => {
        resourceValues[resource].textContent =
            resourceInputs[resource].value;
    });

    if (hasEvaluated) {
        evaluateMission();
    } else {
        updateComparison();
    }
}

Object.values(resourceInputs).forEach(input => {
    input.addEventListener("input", updateResourceValues);
});



function selectMission(missionId) {

    const mission = missions[missionId];

    if (!mission) return;

    selectedMission = missionId;

    pointNumber.textContent = mission.number;
    pointTitle.textContent = mission.name;
    pointProblem.textContent = mission.problem;
    pointObjective.textContent = mission.objective;
    pointBenefit.textContent = mission.benefit;
    pointData.textContent = mission.data;

    decisionMission.textContent = mission.name;

    pointResources.innerHTML = `
        <li>Agua: ${mission.resources.water}%</li>
        <li>Oxígeno: ${mission.resources.oxygen}%</li>
        <li>Energía: ${mission.resources.energy}%</li>
        <li>Alimentos: ${mission.resources.food}%</li>
    `;

    document.querySelectorAll(".map-marker").forEach(marker => {
        marker.classList.toggle(
            "selected",
            marker.dataset.point === missionId
        );
    });

    hasEvaluated = false;

    resetEvaluation();
    updateRoute(missionId);
}



document.querySelectorAll(".map-marker").forEach(marker => {

    marker.addEventListener("click", () => {
        selectMission(marker.dataset.point);
    });

});


document.querySelectorAll("[data-select]").forEach(button => {

    button.addEventListener("click", () => {

        selectMission(button.dataset.select);

        document.getElementById("mapa").scrollIntoView({
            behavior: "smooth"
        });

    });

});



const surfaceMap = document.getElementById("surface-map");
const topographicMap = document.getElementById("topographic-map");
const layerMessage = document.getElementById("layer-message");

const layerButtons = document.querySelectorAll(".layer-button");

function changeLayer(layer) {

    surfaceMap.classList.add("hidden");
    topographicMap.classList.add("hidden");

    layerButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.layer === layer
        );
    });

    if (layer === "surface") {
        surfaceMap.classList.remove("hidden");
        layerMessage.textContent = "Vista de superficie seleccionada.";
    }

    if (layer === "topography") {
        topographicMap.classList.remove("hidden");
        layerMessage.textContent = "Vista topográfica seleccionada. Consulta el relieve del cráter.";
    }
}

layerButtons.forEach(button => {
    button.addEventListener("click", () => {
        changeLayer(button.dataset.layer);
    });
});



// Las coordenadas son posiciones visuales del mapa.
// No son coordenadas geográficas de Marte.

function updateRoute(missionId) {

    const base = missions.base.position;
    const destination = missions[missionId].position;

    const middleX = (base.x + destination.x) / 2;
    const middleY = (base.y + destination.y) / 2 - 7;

    const path = `
        M ${base.x} ${base.y}
        Q ${middleX} ${middleY}
        ${destination.x} ${destination.y}
        Q ${middleX} ${middleY + 7}
        ${base.x} ${base.y}
    `;

    routePath.setAttribute("d", path);

    routeOrigin.setAttribute("cx", base.x);
    routeOrigin.setAttribute("cy", base.y);

    routeDestination.setAttribute("cx", destination.x);
    routeDestination.setAttribute("cy", destination.y);

    routeDescription.textContent =
        `Ruta ilustrativa: Starship → ${missions[missionId].name} → Starship`;
}



function resetEvaluation() {

    decisionStatus.textContent = "PENDIENTE";
    decisionStatus.className = "decision-status";

    evaluationResult.innerHTML = `
        <div class="result-icon">⌁</div>
        <h3>Esperando evaluación</h3>
        <p>
            Presiona el botón para comprobar si los recursos
            disponibles permiten realizar esta expedición.
        </p>
    `;

    updateComparison();
}




function updateComparison() {

    const available = getAvailableResources();
    const required = missions[selectedMission].resources;

    const resources = ["water", "oxygen", "energy", "food"];

    resources.forEach(resource => {

        const element = document.getElementById(
            `compare-${resource}`
        );

        const row = element.closest(".comparison-row");

        element.textContent =
            `Disponible: ${available[resource]}% / Requerido: ${required[resource]}%`;

        row.classList.toggle(
            "insufficient",
            available[resource] < required[resource]
        );

    });
}




function evaluateMission() {

    const mission = missions[selectedMission];

    const available = getAvailableResources();
    const required = mission.resources;

    if (selectedMission === "base") {

        decisionStatus.textContent = "BASE";
        decisionStatus.className = "decision-status";

        evaluationResult.innerHTML = `
            <div class="result-icon">⌂</div>
            <h3>Base Starship</h3>
            <p>
                Este punto representa el refugio de la tripulación.
                Selecciona una misión de exploración para evaluar
                los recursos disponibles.
            </p>
        `;

        hasEvaluated = false;
        updateComparison();
        return;
    }

    const resourceNames = {
        water: "agua",
        oxygen: "oxígeno",
        energy: "energía",
        food: "alimentos"
    };

    const resources = ["water", "oxygen", "energy", "food"];

    const insufficient = [];
    const lowReserve = [];

    const safetyReserve = {
        water: 10,
        oxygen: 15,
        energy: 10,
        food: 10
    };

    resources.forEach(resource => {

        if (available[resource] < required[resource]) {
            insufficient.push(resourceNames[resource]);
        } else if (
            available[resource] <
            required[resource] + safetyReserve[resource]
        ) {
            lowReserve.push(resourceNames[resource]);
        }

    });

    updateComparison();
    hasEvaluated = true;

    if (insufficient.length > 0) {

        decisionStatus.textContent = "NO RECOMENDADA";
        decisionStatus.className = "decision-status danger";

        evaluationResult.innerHTML = `
            <div class="result-icon">!</div>
            <h3>Expedición no recomendada</h3>
            <p>
                Los recursos actuales no alcanzan para cubrir
                los requerimientos estimados de la misión.
            </p>
            <p class="result-detail">
                Recursos insuficientes:
                <strong>${insufficient.join(", ")}</strong>.
            </p>
            <p>
                Se recomienda permanecer en la base,
                conservar recursos y revisar las reservas.
            </p>
        `;

        return;
    }

    if (lowReserve.length > 0) {

        decisionStatus.textContent = "PRECAUCIÓN";
        decisionStatus.className = "decision-status warning";

        evaluationResult.innerHTML = `
            <div class="result-icon">⚠</div>
            <h3>Expedición con precaución</h3>
            <p>
                Los recursos alcanzan para cubrir los requerimientos,
                pero el margen de seguridad es reducido.
            </p>
            <p class="result-detail">
                Reservas que requieren atención:
                <strong>${lowReserve.join(", ")}</strong>.
            </p>
            <p>
                Se recomienda revisar los suministros y
                considerar posponer la expedición.
            </p>
        `;

        return;
    }

    decisionStatus.textContent = "VIABLE";
    decisionStatus.className = "decision-status viable";

    evaluationResult.innerHTML = `
        <div class="result-icon">✓</div>
        <h3>Expedición viable</h3>
        <p>
            Los recursos disponibles cubren los requerimientos
            estimados de esta misión y mantienen el margen
            de seguridad configurado para la simulación.
        </p>
        <p>
            Se recomienda mantener el monitoreo de los recursos
            y priorizar siempre el regreso seguro a la base.
        </p>
    `;
}




if (evaluateButton) {

    evaluateButton.addEventListener("click", () => {

        evaluateMission();

        document.getElementById("decision").scrollIntoView({
            behavior: "smooth"
        });

    });

}




selectMission("seitah");
updateResourceValues();
changeLayer("surface");

console.log("MARS SURVIVAL 2.0 iniciado correctamente.");
