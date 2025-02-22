let selectedPoint = null;

function calculateDistance(bridgeX, A_x, A_y, B_x, B_y, riverWidth) {
    const distAtoBridge = Math.sqrt((A_x - bridgeX) ** 2 + (A_y - 0) ** 2);
    const distBridgeToB = Math.sqrt((B_x - bridgeX) ** 2 + (B_y - riverWidth) ** 2);
    const totalDistance = distAtoBridge + riverWidth + distBridgeToB;
    return { distAtoBridge, distBridgeToB, totalDistance };
}

function findOptimalBridge(A_x, A_y, B_x, B_y, riverWidth) {
    const goldenRatio = (Math.sqrt(5) - 1) / 2;
    let a = 0, b = 6, tolerance = 0.001;

    for (let i = 0; i < 100; i++) {
        let c = b - goldenRatio * (b - a);
        let d = a + goldenRatio * (b - a);
        let fc = calculateDistance(c, A_x, A_y, B_x, B_y, riverWidth).totalDistance;
        let fd = calculateDistance(d, A_x, A_y, B_x, B_y, riverWidth).totalDistance;
        fc < fd ? b = d : a = c;
        if (Math.abs(b - a) < tolerance) break;
    }
    return (a + b) / 2;
}

function updatePlot() {
    const A_x = parseFloat(document.getElementById('A_x')?.value || 0);
    const A_y = parseFloat(document.getElementById('A_y')?.value || -3);
    const B_x = parseFloat(document.getElementById('B_x')?.value || 6);
    const B_y = parseFloat(document.getElementById('B_y')?.value || 6);
    const riverWidth = parseFloat(document.getElementById('river_width')?.value || 1);
    const bridgeX = parseFloat(document.getElementById('bridge_x')?.value || 3);

    const currentDist = calculateDistance(bridgeX, A_x, A_y, B_x, B_y, riverWidth);
    const optimalX = findOptimalBridge(A_x, A_y, B_x, B_y, riverWidth);
    const optimalDist = calculateDistance(optimalX, A_x, A_y, B_x, B_y, riverWidth);

    const traces = [
        {
            x: [A_x, bridgeX], y: [A_y, 0],
            mode: 'lines+markers', name: 'Current A → Bridge',
            line: {color: 'orange', dash: 'dash'}
        },
        {
            x: [bridgeX, B_x], y: [riverWidth, B_y],
            mode: 'lines+markers', name: 'Current Bridge → B',
            line: {color: 'purple', dash: 'dash'}
        },
        {
            x: [A_x, optimalX], y: [A_y, 0],
            mode: 'lines', name: 'Optimal A → Bridge',
            line: {color: 'blue', width: 1.5}
        },
        {
            x: [optimalX, B_x], y: [riverWidth, B_y],
            mode: 'lines', name: 'Optimal Bridge → B',
            line: {color: 'blue', width: 1.5}
        },
        {
            x: [bridgeX, bridgeX], y: [0, riverWidth],
            mode: 'lines', name: 'Bridge',
            line: {color: 'brown', width: 4}
        },
        {
            x: [optimalX], y: [riverWidth / 2],
            mode: 'markers+text', text: [`Optimal: ${optimalX.toFixed(2)}`],
            marker: {size: 12, color: 'blue'},
            textposition: 'bottom center',
            showlegend: false
        }
    ];

    const layout = {
        title: { text: 'Bridge Optimization Simulator', font: { size: window.innerWidth < 600 ? 16 : 24 } },
        dragmode: "pan",
        xaxis: {range: [-1, 7]},
        yaxis: {range: [-4, 8]},
        showlegend: true
    };

    Plotly.newPlot('plot', traces, layout);
}

// Enable Dragging to Adjust Positions
document.getElementById('plot').on('plotly_click', (data) => {
    if (data.points.length > 0) {
        selectedPoint = data.points[0].curveNumber;
    }
});

document.getElementById('plot').on('plotly_relayout', (eventData) => {
    if (selectedPoint !== null) {
        const newX = eventData['xaxis.range[0]'];
        if (selectedPoint === 0) {
            document.getElementById('A_x').value = newX.toFixed(2);
        } else if (selectedPoint === 1) {
            document.getElementById('B_x').value = newX.toFixed(2);
        } else if (selectedPoint === 4) {
            document.getElementById('bridge_x').value = newX.toFixed(2);
        }
        updatePlot();
    }
    selectedPoint = null;
});

window.addEventListener('resize', updatePlot);
updatePlot();
