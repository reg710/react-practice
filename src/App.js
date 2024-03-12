import { useState } from "react";

function Square({ value, onSquareClick, winning=false }) {
  let squareClass = "square " + (winning ? "winning-square " : "");
  return (
    <button
      className={squareClass}
      onClick={onSquareClick}
    >
      {value}
    </button>);
}

function Board({ xIsNext, squares, onPlay }) {
  const winningDetails = calculateWinner(squares);
  const winner = winningDetails ? winningDetails.winner : null;
  const winningPlay = winningDetails ? winningDetails.winningSquares : [];
  
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const size = 3;
  const boardRows = [...Array(size).keys()].map((row) => {
    const boardSquares = [...Array(size).keys()].map((col) => {
      const squareCountIndex = size * row + col;
      return (
        <Square
          key={squareCountIndex}
          value={squares[squareCountIndex]}
          onSquareClick={() => handleClick(squareCountIndex)}
          winning={winningPlay.includes(squareCountIndex)}
        />
      )
    })
    return (
      <div key={row} className="board-row">{boardSquares}</div>
    )
  })

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [orderIsDescending, setOrderIsDescending] = useState(true);
  const orderLabel = orderIsDescending ? "Descending Order" : "Ascending Order"; 
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function reverseOrder() {
    setOrderIsDescending(!orderIsDescending);
  }

  const moves = history.map((squares, move) => {
    let description;
    if ((move === currentMove) && move === 0) {
      description = <div>You are at the start of the game</div>;
    } else if (move === currentMove) {
      description = <div>You are at move #{move}</div>;
    } else if (move > 0) {
      description = <button onClick={() => jumpTo(move)}>Go to move #{move}</button>;
    } else {
      description = <button onClick={() => jumpTo(move)}>Go to game start</button>;
    }

    return (
      <li key={move}>
        {description}
      </li>
    )
  });


  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div className="toggle-info">
          <label className="switch">
            <input type="checkbox" onClick={reverseOrder}/>
            <span className="slider round"></span>
          </label>
          <p>{orderLabel}</p>
        </div>
        <ul>{orderIsDescending ? moves : moves.slice().reverse()}</ul>
      </div>
    </div>
  )
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
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: lines[i]}
    }
  }
  return null;
}