import { PieceRecord, Coord } from "../board.model";
import { isEqualCoord, pieceLookup } from "../board.utils";
import { Square } from "./square.component";

export function renderSquares(pieces: PieceRecord[]) {
  const squares = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const squareCoord: Coord = [row, col];

      const piece = pieces.find((piece) =>
        isEqualCoord(piece.location, squareCoord)
      );

      squares.push(
        <Square location={[row, col]} key={`${row}-${col}`}>
          {piece && pieceLookup[piece.type]()}
        </Square>
      );
    }
  }
  return squares;
}
