import { PieceRecord } from "./board.model";
import { renderSquares } from "./squares.component";
import styles from "./board.module.css";

export function Chessboard() {
  const pieces: PieceRecord[] = [
    { type: "king", location: [3, 2] },
    { type: "pawn", location: [1, 6] },
  ];

  return <div className={styles.board}>{renderSquares(pieces)}</div>;
}
