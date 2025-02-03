function calculateDistance(bridgeX, A_x, A_y, B_x, B_y, riverWidth) {
    const distAtoBridge = Math.sqrt((A_x - bridgeX) ** 2 + (A_y - 0) ** 2);
    const distBridgetoB = Math.sqrt((B_x - bridgeX) ** 2 + (B_y - riverWidth) ** 2);
    const totalDistance = distAtoBridge + riverWidth + distBridgetoB;
    return { distAtoBridge, distBridgetoB, totalDistance };
}

function updatePlot() {
    const A_x = parseFloat(document.getElementById('A_x').value);
    const A_y = parseFloat(document.getElementById('A_y').value);
    const B_x = parseFloat(document.getElementById('B_x').value);
    const B_y = parseFloat(document.getElementById('B_y').value);
    const riverWidth = parseFloat(document.getElementById('river_width').value);
    const bridgeX = parseFloat(document.getElementById('bridge_x').value);

    const { distAtoBridge, distBridgetoB, totalDistance } = calculateDistance(bridgeX, A_x, A_y, B_x, B_y, riverWidth);

    const data = [
        {
            x: [A_x, bridgeX, B_x],
            y: [A_y, 0, B_y],
            mode: 'lines+markers',
            name: 'Path',
            line: { color: 'orange', dash: 'dash' }
        },
        {
            x: [bridgeX, bridgeX],
            y: [0, riverWidth],
            mode: 'lines',
            name: 'Bridge',
            line: { color: 'brown', width: 4 }
        }
    ];

    const layout = {
        title: 'Bridge Placement and Travel Path',
        xaxis: { title: 'X Coordinate (km)', range: [-1, 7] },
        yaxis: { title: 'Y Coordinate (km)', range: [-4, 8] },
        showlegend: true
    };

    Plotly.newPlot('plot', data, layout);

    // Display distances
    console.log(`Distance A → Bridge: ${distAtoBridge.toFixed(4)} km`);
    console.log(`Distance Bridge → B: ${distBridgetoB.toFixed(4)} km`);
    console.log(`Total Distance: ${totalDistance.toFixed(4)} km`);
}

// Initial plot
updatePlot();