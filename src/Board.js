import React from 'react';
import Square from './Square.js';

class Board extends React.Component {

    renderSquare(i) {
      return (
        <Square
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
      );
    }

    getSquaresForBoard(rows, columns)
    {
        let board = [];

        for(let i = 0; i < rows; i++){

          let squares = [];
          for(let x = 0; x < columns; x++){
            squares.push(this.renderSquare(i * columns + x));
          }

          board.push(<div key={i} className="board-row">{squares}</div>);
        }

        return board;
    }

    render() {
      return (
        <div>
          {this.getSquaresForBoard(3,3)}
        </div>
      );
    }
  }

  export default Board;