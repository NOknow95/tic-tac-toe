import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      history: [
        {
          squares: Array(9).fill(null),
          xIsNext: true,
        }
      ],
      stepNo: 0,
    }
  }

  handelClick(i) {
    // console.log("stepNo=%d", this.state.stepNo);
    const history = this.state.history.slice(0, this.state.stepNo + 1);
    const currentSquares = history[history.length - 1];
    const squares = currentSquares.squares.slice();
    console.log(squares);
    if (calculateWinner(squares) || squares[i]) {
      console.log('return');
      return;
    }
    const {xIsNext} = history[history.length - 1];
    squares[i] = xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        xIsNext: !xIsNext,
      }]),
      xIsNext: !xIsNext,
      stepNo: this.state.stepNo + 1,
    });
  }

  jumpTo(stepNo) {
    this.setState({
      stepNo: stepNo,
      xIsNext: this.state.history.xIsNext,
    })
  }

  render() {
    const {history} = this.state;
    // console.log(history);
    const {squares} = history[this.state.stepNo];
    const {xIsNext} = history[this.state.stepNo];
    const winner = calculateWinner(squares);
    const status = winner ? 'Winner:' + winner : ('Next player: ' + (xIsNext ? 'X' : 'O'));
    const moves = history.map((step, move) => {
      // console.log("step--->" + step);
      // console.log("move--->" + move);
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    });
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={squares}
            onClick={(i) => this.handelClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
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
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game/>,
  document.getElementById('root')
);
