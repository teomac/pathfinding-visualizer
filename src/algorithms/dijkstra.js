const node = {
    row,
    col,
    isVisited,
    distance,
};

function dijkstra(grid, startNode, finishNode) {
    if(!startNode || !finishNode || startNode === finishNode) {
        return false;
    }
    nodes[startNode].distance = 0;
    const unvisitedNodes = nodes.slice();
    while(!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.unshift();
        closestNode.isVisited = true;
        if(closestNode === finishNode) return 'success!';
        updateNeighbors(closestNode, grid);
    }
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateNeighbors(node, grid) {
    const neighbors = getNeighbors(node, grid);
    for(const neighbor of neighbors) {
        neighbor.distance = node.distance + 1;
    }
}

function getNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(table[row - 1][col]);
    if (row < table.length - 1) neighbors.push(table[row + 1][col]);
    if (col > 0) neighbors.push(table[row][col - 1]);
    if (col < table[0].length - 1) neighbors.push(table[row][col + 1]);
    return neighbors;
}