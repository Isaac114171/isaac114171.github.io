
// ==========================================
// MARS SURVIVAL 2.0
// MAIN JAVASCRIPT
// ==========================================


// ==========================================
// 1. MOBILE MENU
// ==========================================

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


// ==========================================
// 2. EXPLORATION MISSIONS
// ==========================================

const missions = {

    base: {
        number: "BASE",
        name: "Starship",
        problem: "The survivor must ration available resources to complete the missions.",
        objective: "Maintain survival systems and monitor available resources.",
        benefit: "Provide a safe shelter from which to organize expeditions.",
        data: "Resource monitoring, energy levels, and shelter conditions.",
        resources: {
            water: 0,
            oxygen: 0,
            energy: 0,
            food: 0
        },
        position: { x: 65, y: 35 }
    },

    seitah: {
        number: "MISSION 01",
        name: "Séítah",
        problem: "Sandy and rocky terrain may make movement difficult and create obstacles for exploration.",
        objective: "Analyze the terrain, identify accessible areas, and study geological materials.",
        benefit: "Identify potentially safer routes and better understand the characteristics of the Martian soil.",
        data: "Optical images, rock composition, soil texture, and surface elevation.",
        resources: {
            water: 15,
            oxygen: 20,
            energy: 15,
            food: 10
        },
        position: { x: 75, y: 30 }
    },

    threeforks: {
        number: "MISSION 02",
        name: "Three Forks",
        problem: "More information is needed about the area's geological materials and their relationship to the Perseverance sample depot.",
        objective: "Document the terrain characteristics and study the geological materials present.",
        benefit: "Obtain additional information about the composition of the soil and Martian materials.",
        data: "Visual records of rocks, terrain characteristics, and sample depot location.",
        resources: {
            water: 20,
            oxygen: 25,
            energy: 20,
            food: 15
        },
        position: { x: 61, y: 64 }
    },

    delta: {
        number: "MISSION 03",
        name: "Delta Front",
        problem: "Questions remain about ancient aquatic environments and the sediments deposited in the delta.",
        objective: "Examine sedimentary layers and search for minerals that provide evidence of ancient water.",
        benefit: "Better understand Mars' geological history and investigate potentially habitable environments from the past.",
        data: "Sedimentary layers, outcrop images, minerals, and geological structures.",
        resources: {
            water: 25,
            oxygen: 30,
            energy: 25,
            food: 20
        },
        position: { x: 30, y: 37 }
    },

    neretva: {
        number: "MISSION 04",
        name: "Neretva Vallis",
        problem: "Sediments and rocks associated with the ancient river channel need further investigation.",
        objective: "Analyze terrain materials and search for evidence of ancient water-related processes.",
        benefit: "Expand our understanding of ancient Martian environments and identify new areas of scientific interest.",
        data: "Landforms, sediment deposits, optical images, and rock composition.",
        resources: {
            water: 30,
            oxygen: 35,
            energy: 30,
            food: 25
        },
        position: { x: 85, y: 53 }
    }
};


// ==========================================
// 3. RESOURCE ELEMENTS
// ==========================================

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


// ==========================================
// 4. INTERFACE ELEMENTS
// ==========================================

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


// ==========================================
// 5. GET AVAILABLE RESOURCES
// ==========================================

function getAvailableResources() {
    return {
        water: Number(resourceInputs.water.value),
        oxygen: Number(resourceInputs.oxygen.value),
        energy: Number(resourceInputs.energy.value),
        food: Number(resourceInputs.food.value)
    };
}


// ==========================================
// 6. UPDATE RESOURCE VALUES
// ==========================================

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


// ==========================================
// 7. SELECT AN EXPLORATION MISSION
// ==========================================

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
        <li>Water: ${mission.resources.water}%</li>
        <li>Oxygen: ${mission.resources.oxygen}%</li>
        <li>Energy: ${mission.resources.energy}%</li>
        <li>Food: ${mission.resources.food}%</li>
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


// ==========================================
// 8. MAP MARKER EVENTS
// ==========================================

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


// ==========================================
// 9. MAP LAYER SWITCHING
// ==========================================

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
        layerMessage.textContent = "Surface view selected.";
    }

    if (layer === "topography") {
        topographicMap.classList.remove("hidden");
        layerMessage.textContent = "Topographic view selected. Explore the crater's terrain.";
    }
}

layerButtons.forEach(button => {
    button.addEventListener("click", () => {
        changeLayer(button.dataset.layer);
    });
});


// ==========================================
// 10. EXPLORATION ROUTE
// ==========================================

// These coordinates represent visual positions on the map.
// They are not actual geographic coordinates on Mars.

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
        `Illustrative route: Starship → ${missions[missionId].name} → Starship`;
}


// ==========================================
// 11. RESET MISSION EVALUATION
// ==========================================

function resetEvaluation() {

    decisionStatus.textContent = "PENDING";
    decisionStatus.className = "decision-status";

    evaluationResult.innerHTML = `
        <div class="result-icon">⌁</div>
        <h3>Awaiting Evaluation</h3>
        <p>
            Press the button to check whether the available resources
            are sufficient to complete this expedition.
        </p>
    `;

    updateComparison();
}


// ==========================================
// 12. RESOURCE COMPARISON
// ==========================================

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
            `Available: ${available[resource]}% / Required: ${required[resource]}%`;

        row.classList.toggle(
            "insufficient",
            available[resource] < required[resource]
        );

    });
}


// ==========================================
// 13. MISSION EVALUATION SYSTEM
// ==========================================

function evaluateMission() {

    const mission = missions[selectedMission];

    const available = getAvailableResources();
    const required = mission.resources;

    if (selectedMission === "base") {

        decisionStatus.textContent = "BASE";
        decisionStatus.className = "decision-status";

        evaluationResult.innerHTML = `
            <div class="result-icon">⌂</div>
            <h3>Starship Base</h3>
            <p>
                This location represents the crew's shelter.
                Select an exploration mission to evaluate
                the available resources.
            </p>
        `;

        hasEvaluated = false;
        updateComparison();
        return;
    }

    const resourceNames = {
        water: "water",
        oxygen: "oxygen",
        energy: "energy",
        food: "food"
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

        decisionStatus.textContent = "NOT RECOMMENDED";
        decisionStatus.className = "decision-status danger";

        evaluationResult.innerHTML = `
            <div class="result-icon">!</div>
            <h3>Expedition Not Recommended</h3>
            <p>
                Current resources are insufficient to meet
                the estimated requirements for this mission.
            </p>
            <p class="result-detail">
                Insufficient resources:
                <strong>${insufficient.join(", ")}</strong>.
            </p>
            <p>
                It is recommended to remain at the base,
                conserve resources, and check available supplies.
            </p>
        `;

        return;
    }

    if (lowReserve.length > 0) {

        decisionStatus.textContent = "CAUTION";
        decisionStatus.className = "decision-status warning";

        evaluationResult.innerHTML = `
            <div class="result-icon">⚠</div>
            <h3>Expedition Requires Caution</h3>
            <p>
                Available resources meet the mission requirements,
                but the safety margin is limited.
            </p>
            <p class="result-detail">
                Reserves requiring attention:
                <strong>${lowReserve.join(", ")}</strong>.
            </p>
            <p>
                It is recommended to review supplies and
                consider postponing the expedition.
            </p>
        `;

        return;
    }

    decisionStatus.textContent = "VIABLE";
    decisionStatus.className = "decision-status viable";

    evaluationResult.innerHTML = `
        <div class="result-icon">✓</div>
        <h3>Expedition Viable</h3>
        <p>
            Available resources meet the estimated requirements
            for this mission and maintain the safety margin
            configured for this simulation.
        </p>
        <p>
            Continue monitoring resources and always prioritize
            a safe return to the base.
        </p>
    `;
}


// ==========================================
// 14. EVALUATION BUTTON
// ==========================================

if (evaluateButton) {

    evaluateButton.addEventListener("click", () => {

        evaluateMission();

        document.getElementById("decision").scrollIntoView({
            behavior: "smooth"
        });

    });

}


// ==========================================
// 15. INITIALIZE THE SYSTEM
// ==========================================

selectMission("seitah");
updateResourceValues();
changeLayer("surface");

console.log("MARS SURVIVAL 2.0 successfully initialized.");
