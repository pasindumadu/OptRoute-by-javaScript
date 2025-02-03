let selectedPoint = null;

// Function to calculate total distance
function calculateDistance(bridgeX, A_x, A_y, B_x, B_y, riverWidth) {
    const distAtoBridge = Math.sqrt((A_x - bridgeX) ** 2 + (A_y - 0) ** 2);
    const distBridgeToB = Math.sqrt((B_x - bridgeX) ** 2 + (B_y - riverWidth) ** 2);
    const totalDistance = distAtoBridge + riverWidth + distBridgeToB;
    return { distAtoBridge, distBridgeToB, totalDistance };
}

// Function to find optimal bridge position (golden-section search)
function findOptimalBridge(A_x, A_y, B_x, B_y, riverWidth) {
    const goldenRatio = (Math.sqrt(5) - 1) / 2;
    let a = 0, b = 6;
    let tolerance = 0.001;

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
    // Get input values
    const A_x = parseFloat(document.getElementById('A_x').value);
    const A_y = parseFloat(document.getElementById('A_y').value);
    const B_x = parseFloat(document.getElementById('B_x').value);
    const B_y = parseFloat(document.getElementById('B_y').value);
    const riverWidth = parseFloat(document.getElementById('river_width').value);
    const bridgeX = parseFloat(document.getElementById('bridge_x').value);

    // Calculate distances
    const currentDist = calculateDistance(bridgeX, A_x, A_y, B_x, B_y, riverWidth);
    const optimalX = findOptimalBridge(A_x, A_y, B_x, B_y, riverWidth);
    const optimalDist = calculateDistance(optimalX, A_x, A_y, B_x, B_y, riverWidth);

    // Create Plotly traces
    const traces = [
        // Current paths
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
        // Optimal paths
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
        // Bridge
        {
            x: [bridgeX, bridgeX], y: [0, riverWidth],
            mode: 'lines', name: 'Bridge',
            line: {color: 'brown', width: 4}
        },
        // Optimal bridge indicator
        {
            x: [optimalX], y: [riverWidth/2],
            mode: 'markers+text', text: [`Optimal: ${optimalX.toFixed(2)}`],
            marker: {size: 12, color: 'blue'},
            textposition: 'bottom center',
            showlegend: false
        }
    ];

    // Update layout
    const layout = {
        title: 'Bridge Optimization Simulator',
        xaxis: {range: [-1, 7]},
        yaxis: {range: [-4, 8]},
        showlegend: true,
        annotations: [
            {
                x: (A_x + bridgeX)/2, y: A_y/2,
                text: `Current: ${currentDist.distAtoBridge.toFixed(2)} km`,
                showarrow: false,
                font: {color: 'orange'}
            },
            {
                x: (bridgeX + B_x)/2, y: (riverWidth + B_y)/2,
                text: `Current: ${currentDist.distBridgeToB.toFixed(2)} km`,
                showarrow: false,
                font: {color: 'purple'}
            },
            {
                x: optimalX, y: riverWidth/2,
                text: `Optimal Total: ${optimalDist.totalDistance.toFixed(2)} km`,
                showarrow: true,
                arrowhead: 4,
                ax: 0,
                ay: -40,
                font: {color: 'blue'}
            }
        ]
    };

    Plotly.react('plot', traces, layout);
}

// Initialize drag-and-drop functionality
document.getElementById('plot').on('plotly_click', (data) => {
    selectedPoint = data.points[0].curveNumber;
});

document.getElementById('plot').on('plotly_relayout', (eventData) => {
    if (selectedPoint !== null) {
        const newX = eventData['xaxis.range[0]'];
        const newY = eventData['yaxis.range[0]'];
        
        if(selectedPoint === 0) { // City A
            document.getElementById('A_x').value = newX.toFixed(2);
            document.getElementById('A_y').value = newY.toFixed(2);
        } 
        else if(selectedPoint === 1) { // City B
            document.getElementById('B_x').value = newX.toFixed(2);
            document.getElementById('B_y').value = newY.toFixed(2);
        }
        
        updatePlot();
    }
    selectedPoint = null;
});

// Initialize the plot
updatePlot();
