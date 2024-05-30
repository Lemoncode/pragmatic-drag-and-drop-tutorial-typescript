import { PieceRecord, Coord } from "./board.model";
import { isEqualCoord, pieceLookup } from "./board.utils";
import styles from "./squares.module.css";

export function renderSquares(pieces: PieceRecord[]) {
  const squares = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const squareCoord: Coord = [row, col];

      const piece = pieces.find((piece) =>
        isEqualCoord(piece.location, squareCoord)
      );

      const isDark = (row + col) % 2 === 1;
      const squareClass = isDark ? styles.dark : styles.light;

      squares.push(
        <div
          className={`${styles.square} ${squareClass}`}
          key={`${row}-${col}`}
        >
          {piece && pieceLookup[piece.type]()}
        </div>
      );
    }
  }
  return squares;
}
