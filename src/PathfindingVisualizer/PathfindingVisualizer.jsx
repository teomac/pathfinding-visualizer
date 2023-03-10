import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import {astar, getNodesInShortestPathOrderAstar} from '../algorithms/astar';
import {bfs, getNodesInShortestPathOrderBFS} from '../algorithms/bfs';
import {dfs, getNodesInShortestPathOrderDFS} from '../algorithms/dfs';

import './PathfindingVisualizer.css';
import NavBar from './Navbar';

const initialDimensions = getInitialDimensions(window.innerWidth, window.innerHeight);
const initialRows = initialDimensions[0];
const initialColumns = initialDimensions[1];

const START_NODE_ROW = Math.floor(initialRows * 0.5);
const START_NODE_COL = Math.floor(initialColumns * 0.2);
const FINISH_NODE_ROW = Math.floor(initialRows * 0.5);
const FINISH_NODE_COL = Math.floor(initialColumns * 0.8);

export default class PathfindingVisualizer extends Component {
    state = {
        grid: [],
        mouseIsPressed: false,
        visualizingAlgorithm: false,
        width: window.innerWidth,
        height: window.innerHeight,
        numRows: initialRows,
        numColumns: initialColumns,
    };

    updateDimensions = () => {
        let newD = getInitialDimensions(window.innerWidth, window.innerHeight);
        this.setState({
            numRows: newD[0],
            numColumns: newD[1],
            width: window.innerWidth,
            height: window.innerHeight,
        });
      };

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
        const grid = getInitialGrid(this.state.numRows, this.state.numColumns);
        this.setState({grid});
    }

    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseEnter(row, col) {
        if(!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    handleMouseUp() {
        this.setState({mouseIsPressed: false});
    }

    clearGrid(){
        for (let row=0; row<this.state.grid.length; row++) {
            for (let col=0; col<this.state.grid[0].length; col++) {
                if (
                    !(
                        (row === START_NODE_ROW && col === START_NODE_COL) ||
                        (row === FINISH_NODE_ROW && col === FINISH_NODE_COL)
                    )
                ) {
                    document.getElementById(`node-${row}-${col}`).className = "node";
                }
            }
        }
        const newGrid = getInitialGrid(this.state.numRows, this.state.numColumns);
        this.setState({
            grid: newGrid,
            visualizingAlgorithm: false,
        });
    }

    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i=1; i<=visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-visited';
            }, 10 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i=0; i<nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-shortest-path';
            }, 50 * i);
        }
    }

    visualizeDijkstra() {
        if (this.state.visualizingAlgorithm) {
            return;
        }
        this.setState({ visualizingAlgorithm: true });
        setTimeout(() => {
            const {grid} = this.state;
            const startNode = grid[START_NODE_ROW][START_NODE_COL];
            const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
            const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
            const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
            this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
        });
    }

    visualizeAStar() {
        if (this.state.visualizingAlgorithm) {
            return;
        }
        this.setState({ visualizingAlgorithm: true });
        setTimeout(() => {
            const {grid} = this.state;
            const startNode = grid[START_NODE_ROW][START_NODE_COL];
            const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
            const visitedNodesInOrder = astar(grid, startNode, finishNode);
            const nodesInShortestPathOrder = getNodesInShortestPathOrderAstar(finishNode);
            this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
        });
    }

    visualizeBFS() {
        if (this.state.visualizingAlgorithm || this.state.generatingMaze) {
            return;
          }
          this.setState({ visualizingAlgorithm: true });
          setTimeout(() => {
            const { grid } = this.state;
            const startNode = grid[START_NODE_ROW][START_NODE_COL];
            const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
            const visitedNodesInOrder = bfs(
                grid,
                startNode,
                finishNode
            );
            const nodesInShortestPathOrder = getNodesInShortestPathOrderBFS(
                finishNode
            );
            this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
          }, this.state.speed);
    }

    visualizeDFS() {
        if (this.state.visualizingAlgorithm || this.state.generatingMaze) {
            return;
        }
        this.setState({ visualizingAlgorithm: true });
        setTimeout(() => {
            const { grid } = this.state;
            const startNode = grid[START_NODE_ROW][START_NODE_COL];
            const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
            const visitedNodesInOrder = dfs(grid, startNode, finishNode);
            const nodesInShortestPathOrder = getNodesInShortestPathOrderDFS(
            finishNode
            );
          this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
        }, this.state.speed);
      }


    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
            <>
            <NavBar
                visualizingAlgorithm = {this.state.visualizingAlgorithm}
                visualizeDijkstra = {this.visualizeDijkstra.bind(this)}
                visualizeAStar = {this.visualizeAStar.bind(this)}
                visualizeBFS = {this.visualizeBFS.bind(this)}
                visualizeDFS = {this.visualizeDFS.bind(this)}
                clearGrid = {this.clearGrid.bind(this)}
            />
                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key = {rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const {row, col, isFinish, isStart, isWall} = node;
                                    return (
                                        <Node
                                            key ={nodeIdx}
                                            row = {row}
                                            col = {col}
                                            isFinish = {isFinish}
                                            isStart = {isStart}
                                            isWall = {isWall}
                                            mouseIsPressed = {mouseIsPressed}
                                            onMouseDown = {(row, col) => this.handleMouseDown(row, col)}
                                            onMouseEnter = {(row, col) =>
                                                this.handleMouseEnter(row, col)
                                            }
                                            onMouseUp = {() => this.handleMouseUp()}
                                            width = {this.state.width}
                                            height = {this.state.height}
                                            numRows = {this.state.numRows}
                                            numColumns = {this.state.numColumns}></Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }
}

const getInitialGrid = (initialRows, initialColumns) => {
    let grid = [];
    for (let row=0; row<initialRows; row++) {
        const currentRow = [];
        for (let col=0; col<initialColumns; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

function getInitialDimensions (width, height) {
    let columns;
    if(width > 1500) {
        columns = Math.floor(width / 30);
    } else if(width > 1250) {
        columns = Math.floor(width / 27.5);
    } else if(width > 1000) {
        columns = Math.floor(width / 25);
    } else if(width > 750) {
        columns = Math.floor(width / 22.5);
    } else if(width > 500) {
        columns = Math.floor(width / 20);
    } else if(width > 250) {
        columns = Math.floor(width / 17.5);
    } else if(width > 0) {
        columns = Math.floor(width / 15);
    }
    let cellWidth = Math.floor(width / columns);
    let rows = Math.floor((height / cellWidth) * 0.78);
    
    return [rows, columns];
}