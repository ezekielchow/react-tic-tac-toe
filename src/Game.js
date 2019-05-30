import React from 'react';
import './index.css';
import Board from './Board.js';

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
            movePositions: [],
            showMovesDecending: false,
        };
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winner = calculateWinner(squares);

        if(squares[i] || winner){
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares:squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            movePositions: this.state.movePositions.slice(0, this.state.stepNumber).concat([i]),
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    getRowColumn(move){

        const movePosition = this.state.movePositions[move - 1];
        const row = Math.ceil((movePosition + 1) / 3);
        const column = 1 + movePosition % 3;

        return `Row:${row} Column:${column}`;
    }

    handleReorderMoves(){
        this.setState({
            showMovesDecending: !this.state.showMovesDecending
        });
    }

    render(){
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const draw = (history[history.length - 1].squares.includes(null)) ? false : true;

        const moves = history.map((step, move) => {
            const desc = move ?
                `Go to move #${move} ${this.getRowColumn(move)}`:
                'Go to game start';
            return (
                <li key={move}>
                   <button
                        className={(this.state.stepNumber === move) ? 'bolded' : ''}
                        onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });

        let status;
        if(winner){
            status = 'Winner: ' + winner;
        }else if (draw){
            status = 'Draw';
        }else{
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return(
            <div className="game">
                <div className="game-board">
                    <Board
                        winnersLocation={winner}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button
                        onClick={() => this.handleReorderMoves()}>
                        {"Reorder Moves"}
                    </button>
                    <div>
                        {
                            (this.state.showMovesDecending) ?
                            moves.slice(0).reverse() :
                            moves
                        }
                    </div>
                </div>
            </div>
        )
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [a, b, c];
        }
    }
    return null;
}

export default Game