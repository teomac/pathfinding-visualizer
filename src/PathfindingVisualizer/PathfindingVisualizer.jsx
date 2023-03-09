import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import {astar, getNodesInShortestPathOrderAstar} from '../algorithms/astar';

import './PathfindingVisualizer.css';
import NavBar from './Navbar';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
    state = {
        grid: [],
        mouseIsPressed: false,
        visualizingAlgorithm: false,
        width: window.innerWidth,
        height: window.innerHeight,
        numRows: START_NODE_ROW,
        numColumns: START_NODE_COL,
    };

    componentDidMount() {
        const grid = getInitialGrid();
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
        if(this.state.visualizingAlgorithm) {
            return;
        }
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
        const newGrid = getInitialGrid(this.state.START_NODE_ROW, this.state.START_NODE_COL);
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
        for (let i=1; i<nodesInShortestPathOrder.length; i++) {
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
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
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



    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
            <>
            <NavBar
                visualizingAlgorithm = {this.state.visualizingAlgorithm}
                visualizeDijkstra = {this.visualizeDijkstra.bind(this)}
                visualizeAStar = {this.visualizeAStar.bind(this)}
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
                                            row = {row}></Node>
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

const getInitialGrid = () => {
    const grid = [];
    for (let row=0; row<20; row++) {
        const currentRow = [];
        for (let col=0; col<50; col++) {
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