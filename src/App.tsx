import './App.css';
import { useState, useEffect } from 'react';

const generateHexColour = () => {
	return '#' + ('000000' + Math.floor(Math.random() * 0xffffff).toString(16)).slice(-6);
};

export function App() {
	const [hexColourCode, setHexColourCode] = useState(generateHexColour());
	const [board, setBoard] = useState(
		Array(6)
			.fill('')
			.map(() => Array(6).fill('')),
	);
	const [tileStatus, setTileStatus] = useState(
		Array(6)
			.fill('')
			.map(() => Array(6).fill('')),
	);
	const [currentRow, setCurrentRow] = useState(0);
	const [currentTile, setCurrentTile] = useState(0);

	const resetGame = () => {
		setBoard(
			Array(6)
				.fill('')
				.map(() => Array(6).fill('')),
		);
		setTileStatus(
			Array(6)
				.fill('')
				.map(() => Array(6).fill('')),
		);
		setCurrentRow(0);
		setCurrentTile(0);

		setHexColourCode(generateHexColour());
	};

	const evaluateRow = (row: string[], rowIndex: number) => {
		const answer = hexColourCode.slice(1).toUpperCase().split('');
		const guess = [...row];

		const newStatus = [...tileStatus.map((r) => [...r])];

		guess.forEach((letter, i) => {
			if (letter === answer[i]) {
				newStatus[rowIndex][i] = 'correct';
				answer[i] = '_';
				guess[i] = '*';
			}
		});

		guess.forEach((letter, i) => {
			if (letter === '*') return;

			if (answer.includes(letter)) {
				newStatus[rowIndex][i] = 'present';
				answer[answer.indexOf(letter)] = '_';
			} else {
				newStatus[rowIndex][i] = 'absent';
			}
		});

		setTileStatus(newStatus);
	};

	const animateRowFlip = (rowIndex: number) => {
		const tiles = document.querySelectorAll(`#row-${rowIndex} .tile`);

		tiles.forEach((tile, idx) => {
			setTimeout(() => {
				tile.classList.add('flip');
			}, idx * 200);
		});

		setTimeout(
			() => {
				tiles.forEach((tile) => tile.classList.remove('flip'));
			},
			200 * 6 + 600,
		);
	};

	const checkGuess = () => {
		return board[currentRow].join('') === hexColourCode.slice(1).toUpperCase();
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase();

			if (key === 'backspace') {
				if (currentTile > 0) {
					const newBoard = board.map((r) => [...r]);
					newBoard[currentRow][currentTile - 1] = '';
					setBoard(newBoard);
					setCurrentTile(currentTile - 1);
				}
				return;
			}

			if (key === 'enter') {
				if (currentTile === 6) {
					const row = board[currentRow];

					evaluateRow(row, currentRow);
					animateRowFlip(currentRow);

					console.log(tileStatus)

					if (checkGuess()) {
						setTimeout(() => alert('You win!'), 1200);
					} else if (currentRow === 5) {
						setTimeout(() => alert(`The hex colour code was ${hexColourCode}. Try again!`), 1200)
					}
					setCurrentRow(currentRow + 1);
					setCurrentTile(0);
				}
				return;
			}

			if (/^[0-9a-f]$/.test(key)) {
				if (currentTile < 6) {
					const newBoard = board.map((r) => [...r]);
					newBoard[currentRow][currentTile] = key.toUpperCase();
					setBoard(newBoard);
					setCurrentTile(currentTile + 1);
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [board, currentRow, currentTile]);

	return (
		<div className="container">
			<h1>Hex Colour Code Guesser</h1>
			<p>Guess the following hex colour code in 6 tries!</p>
			<div id="colour-box" style={{ backgroundColor: hexColourCode }} />
			<div id="board">
				{board.map((row, rIdx) => (
					<div key={rIdx} id={`row-${rIdx}`} className="row">
						{row.map((tile, tIdx) => (
							<div key={tIdx} className={`tile ${tileStatus[rIdx][tIdx]}`}>
								{tile}
							</div>
						))}
					</div>
				))}
			</div>
			<button className="reset-btn" onClick={resetGame}>
				New Game
			</button>
		</div>
	);
}
