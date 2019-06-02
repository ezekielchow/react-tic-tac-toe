# [react-tic-tac-toe](https://peaceful-inlet-72790.herokuapp.com/)

This is my solutions to [React Tutorial](https://reactjs.org/tutorial/tutorial.html) improvements suggested

## Getting Started

```
git clone https://github.com/ezekielchow/react-tic-tac-toe.git
cd react-tic-tac-toe
npm install
npm start
```

## Solutions

### 1. Display the location for each move in the format (col, row) in the move history list

* On every step taken, we append the position to movePositions which is stored in the state.
* When rendering the list of items, we pass move to getRowColumn to be used as the index to get the positions stored. Which then, will return the formatted Row and Column string.

```
//Game.js
handleClick(i){
    ...
    this.setState({
        history: history.concat([{
            squares:squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        movePositions: this.state.movePositions.slice(0, this.state.stepNumber).concat([i]),
    });
}

getRowColumn(move){
    const movePosition = this.state.movePositions[move - 1];
    const row = Math.ceil((movePosition + 1) / 3);
    const column = 1 + movePosition % 3;

    return `Row:${row} Column:${column}`;
}

render(){
    const history = this.state.history;

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
}

```

### 2. Bold the currently selected item in the move list

* On every step taken, we also update the stepNumber which is the amount of histories
* We have a css that bolds the text
* When rendering the list of moves, if we are at that move, bold the button's text

```
//Game.js
handleClick(i){
    ...
    this.setState({
        history: history.concat([{
            squares:squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        movePositions: this.state.movePositions.slice(0, this.state.stepNumber).concat([i]),
    });
}

render(){
    ...
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
}
```

### 3. Rewrite Board to use two loops to make the squares instead of hardcoding them

* In the original, the rendered squares are hardcoded
* In the second loop, we will create the neccessary squares for each row
* In the first loop, we will add the squares to each row

```
//Board.js
renderSquare(i) {
    return (
        <Square
            isWinner={this.props.winnersLocation ? this.props.winnersLocation.includes(i) : false}
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
```

### 4. Add a toggle button that lets you sort the moves in either ascending or descending order

* We add a button to reorder moves
* Once click we update the state to be the opposite for showMovesDecending
* Using the state, we show the original moves. Or reverse it before showing

```
//Game.js
render(){
    ...
    handleReorderMoves(){
        this.setState({
            showMovesDecending: !this.state.showMovesDecending
        });
    }

    return(
        <div className="game">
            ...
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
```

### 5. When someone wins, highlight the three squares that caused the win

* We update calculateWinner to return the position of the squares who won
* We then pass down the locations to the renderSquare function in Board
* If there is a winner and the square is one of the winners, pass winner to Square
* If there are winners passed by props, then color the square

```
//Game.js
function calculateWinner(squares) {
    ...
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [a, b, c];
        }
    }
    return null;
}

render(){
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    ...
    return(
        <div className="game">
            <div className="game-board">
                <Board
                    winnersLocation={winner}
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
            </div>
            ...
        </div>
    )
}
```

```
//Board.js
renderSquare(i) {
    return (
    <Square
        isWinner={this.props.winnersLocation ? this.props.winnersLocation.includes(i) : false}
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
    />
    );
}
```

```
//Square.js
function Square(props) {
    return (
        <button
            className={"square " +
            (props.isWinner ? "colored" : "")}
            onClick={props.onClick}
        >
        {props.value}
        </button>
    );
}
```

### 6. When no one wins, display a message about the result being a draw
* We check for the end of the game, which only can a draw happen
* If there is no winner, definitely it is a draw, which we will show as the status

```
//Game.js
render(){
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const draw = (history[history.length - 1].squares.includes(null)) ? false : true;

    ...
    let status;
    if(winner){
        status = 'Winner: ' + winner;
    }else if (draw){
        status = 'Draw';
    }else{
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    ...
}
```