import React, {Component} from "react";

import './Node.css';

export default class Node extends Component {

    constructor(props) {
        super(props);
        this.state = {};
      }

    render() {
        const {
            row,
            col,
            isFinish,
            isStart,
            isWall,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
            width,
            height,
            numRows,
            numColumns,
        } = this.props;
        const extraClassName = isFinish
            ? 'node-finish'
            : isStart
            ? 'node-start'
            : isWall
            ? 'node-wall'
            : '';

        let cellWidth = Math.floor((width - 15) / numColumns);
        let cellHeight;
        if (width > 1500) {
            cellHeight = Math.floor((height - 70) / numRows);
        } else if (width > 1000) {
            cellHeight = Math.floor((height - 70) / numRows);
        } else if (width > 500) {
            cellHeight = Math.floor((height - 60) / numRows);
        } else if (width > 0) {
            cellHeight = Math.floor((height - 50) / numRows);
        }

        return (
            <div
                id = {`node-${row}-${col}`}
                className = {`node ${extraClassName}`}
                style={{ "--width": `${cellWidth}px`, "--height": `${cellHeight}px` }}
                onMouseDown = {() => onMouseDown(row, col)}
                onMouseEnter = {() => onMouseEnter(row, col)}
                onMouseUp = {() => onMouseUp()}></div>
        );
    }
}