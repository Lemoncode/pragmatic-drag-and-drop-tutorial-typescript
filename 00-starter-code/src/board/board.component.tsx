import styled from "@emotion/styled/macro";
import { PieceRecord } from "./board.model";
import { renderSquares } from "./squares.component";

const StyledDiv = styled.div`
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gridTemplateRows: 'repeat(8, 1fr)',
    width: '500px',
    height: '500px',
    border: '3px solid lightgrey',
  `;

export function Chessboard() {
  const pieces: PieceRecord[] = [
    { type: "king", location: [3, 2] },
    { type: "pawn", location: [1, 6] },
  ];

  return <StyledDiv>{renderSquares(pieces)}</StyledDiv>;
}
