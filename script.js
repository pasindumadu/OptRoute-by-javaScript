let selectedPoint = null;

function calculateDistance(bridgeX, A_x, A_y, B_x, B_y, riverWidth) {
    // Path connects: A → bridge_start (y=0) → bridge_end (y=riverWidth) → B
    const distAtoBridgeStart = Math.sqrt((A_x - bridgeX) ** 2 + (A_y - 0) ** 2);
    const distBridgeEndToB = Math.sqrt((B_x - bridgeX) ** 2 + (B_y - riverWidth) ** 2);
    const totalDistance = distAtoBridgeStart + riverWidth + distBridgeEndToB;
    return { distAtoBridgeStart, distBridgeEndToB, totalDistance };
}

function updatePlot() {
    const A_x = parseFloat(document.getElementById('A_x').value);
    const A_y = parseFloat(document.getElementById('A_y').value);
    const B_x = parseFloat(document.getElementById('B_x').value);
    const B_y = parseFloat(document.getElementById('B_y').value);
    const riverWidth = parseFloat(document.getElementById('river_width').value);
    const bridgeX = parseFloat(document.getElementById('bridge_x').value);

    const { distAtoBridgeStart, distBridgeEndToB, totalDistance } = calculateDistance(bridgeX, A_x, A_y, B_x, B_y, riverWidth);

    // Plotly data configuration
    const data = [
        // City A marker (draggable)
        {
            x: [A_x],
            y: [A_y],
            mode: 'markers',
            name: 'City A',
            marker: { size: 12, color: 'red' },
            hoverinfo: 'none',
            drag: 'none'
        },
        // City B marker (draggable)
        {
            x: [B_x],
            y: [B_y],
            mode: 'markers',
            name: 'City B',
            marker: { size: 12, color: 'green' },
            hoverinfo: 'none',
            drag: 'none'
        },
        // Bridge (vertical line)
        {
            x: [bridgeX, bridgeX],
            y: [0, riverWidth],
            mode: 'lines',
            name: 'Bridge',
            line: { color: 'brown', width: 4 },
            hoverinfo: 'none'
        },
        // Path A → Bridge Start
        {
            x: [A_x, bridgeX],
            y: [A_y, 0],
            mode: 'lines',
            name: 'A → Bridge',
            line: { color: 'orange', dash: 'dash' }
        },
        // Path Bridge End → B
        {
            x: [bridgeX, B_x],
            y: [riverWidth, B_y],
            mode: 'lines',
            name: 'Bridge → B',
            line: { color: 'purple', dash: 'dash' }
        }
    ];

    const layout = {
        title: 'Bridge Optimization Simulator',
        xaxis: { range: [-1, 7] },
        yaxis: { range: [-4, 8] },
        dragmode: false,
        hovermode: 'closest'
    };

    Plotly.react('plot', data, layout);

    // Attach drag handlers after initial render
    document.getElementById('plot').on('plotly_click', (data) => {
        selectedPoint = data.points[0].curveNumber;
    });

    document.getElementById('plot').on('plotly_relayout', (eventData) => {
        if (selectedPoint !== null) {
            const newX = eventData['xaxis.range[0]'];
            const newY = eventData['yaxis.range[0]'];
            
            // Update coordinates based on dragged point
            switch(selectedPoint) {
                case 0: // City A
                    document.getElementById('A_x').value = newX.toFixed(2);
                    document.getElementById('A_y').value = newY.toFixed(2);
                    break;
                case 1: // City B
                    document.getElementById('B_x').value = newX.toFixed(2);
                    document.getElementById('B_y').value = newY.toFixed(2);
                    break;
            }
            updatePlot();
        }
        selectedPoint = null;
    });
}

// Initialize the plot
updatePlot();
