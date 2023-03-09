import React, { Component } from "react";
import "./Navbar.css";
import Dropdown from 'react-bootstrap/Dropdown';

const brand = window.innerWidth > 600 ? "Pathfinding Visualizer" : "Pathfinder";

class NavBar extends Component {
  state = {
    algorithm: "Visualize Algorithm",
    pathState: false,
  };

  selectAlgorithm(selection) {
    if (this.props.visualizingAlgorithm) {
      return;
    }
    if (
      selection === this.state.algorithm ||
      this.state.algorithm === "Visualize Algorithm" ||
      this.state.algorithm === "Select an Algorithm!"
    ) {
      this.setState({ algorithm: selection });
    } else {
      this.setState({ algorithm: selection });
    }
  }


  visualizeAlgorithm() {
    if (this.props.visualizingAlgorithm) {
      return;
    }
    if (this.state.pathState) {
      this.clearTemp();
      return;
    }
    if (
      this.state.algorithm === "Visualize Algorithm" ||
      this.state.algorithm === "Select an Algorithm!"
    ) {
      this.setState({ algorithm: "Select an Algorithm!" });
    } else {
      this.setState({ pathState: true });
      if (this.state.algorithm === "Visualize Dijkstra")
        this.props.visualizeDijkstra();
      else if (this.state.algorithm === "Visualize A*")
        this.props.visualizeAStar();
    }
  }

  clearGrid() {
    if (this.props.visualizingAlgorithm) {
      return;
    }
    this.props.clearGrid();
    this.setState({
      algorithm: "Visualize Algorithm",
      pathState: false,
    });
  }


  clearTemp() {
    if (this.props.visualizingAlgorithm) {
      return;
    }
    this.props.clearGrid();
    this.setState({
      pathState: false,
    });
  }

  render() {
    return (
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a
          className="navbar-brand h1 mb-0"
          href="https://github.com/magicteo/pathfinding-visualizer"
        >
          {brand}
        </a>
        <Dropdown>
          <Dropdown.Toggle className="btn btn-light dropdown-toggle">
            Algorithms
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item 
                className="dropdown-item btn-light"
                onClick={() => this.selectAlgorithm("Visualize Dijkstra")}>Dijkstra</Dropdown.Item>
            <Dropdown.Item
              className="dropdown-item btn-light"
              onClick={() => this.selectAlgorithm("Visualize A*")}>A*</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <li>
          <button
            className="btn btn-success"
            onClick={() => this.visualizeAlgorithm()}
          >
            {this.state.algorithm}
          </button>
        </li>
        <li>
          <button
            className="btn btn-danger"
            onClick={() => this.clearGrid()}
          >
            Clear Grid
          </button>
        </li>
      </nav>
    );
  }
}
export default NavBar;