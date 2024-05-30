import { PieceRecord, Coord } from "./board.model";
import { isEqualCoord, pieceLookup } from "./board.utils";
import styled from "@emotion/styled";

const StyledDiv = styled.div({
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export function renderSquares(pieces: PieceRecord[]) {
  const squares = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const squareCoord: Coord = [row, col];

      const piece = pieces.find((piece) =>
        isEqualCoord(piece.location, squareCoord)
      );

      const isDark = (row + col) % 2 === 1;

      squares.push(
        <StyledDiv style={{ backgroundColor: isDark ? "lightgrey" : "white" }}>
          {piece && pieceLookup[piece.type]()}
        </StyledDiv>
      );
    }
  }
  return squares;
}
