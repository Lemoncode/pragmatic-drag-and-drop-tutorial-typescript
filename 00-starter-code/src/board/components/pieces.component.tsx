import { PieceProps } from "../board.model";
import king from "../../assets/king.png";
import pawn from "../../assets/pawn.png";
import styles from "./pieces.module.css";

function Piece({ image, alt }: PieceProps) {
  return (
    <img className={styles.piece} src={image} alt={alt} draggable="false" />
  ); // draggable set to false to prevent dragging of the images
}

export function King() {
  return <Piece image={king} alt="King" />;
}

export function Pawn() {
  return <Piece image={pawn} alt="Pawn" />;
}
