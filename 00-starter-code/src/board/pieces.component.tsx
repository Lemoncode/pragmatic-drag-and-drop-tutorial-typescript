import { PieceProps } from "./board.model";
import king from "/king.png";
import pawn from "/pawn.png";
import styled from "@emotion/styled";

const StyledImg = styled.img`
  width: 45,
  height: 45,
  padding: 4,
  borderRadius: 6,
  boxShadow:
    "1px 3px 3px rgba(9, 30, 66, 0.25),0px 0px 1px rgba(9, 30, 66, 0.31)",
  "&:hover": {
    backgroundColor: "rgba(168, 168, 168, 0.25)",
`;

function Piece({ image, alt }: PieceProps) {
  return <StyledImg src={image} alt={alt} draggable="false" />; // draggable set to false to prevent dragging of the images
}

export function King() {
  return <Piece image={king} alt="King" />;
}

export function Pawn() {
  return <Piece image={pawn} alt="Pawn" />;
}
