import { useEffect, useRef } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { PieceProps } from "../board.model";
import invariant from "tiny-invariant";
import king from "../../assets/king.png";
import pawn from "../../assets/pawn.png";
import styles from "./pieces.module.css";

function Piece({ image, alt }: PieceProps) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
    });
  }, []);

  return (
    <img
      className={styles.piece}
      src={image}
      alt={alt}
      draggable="false"
      ref={ref}
    />
  ); // draggable set to false to prevent dragging of the images
}

export function King() {
  return <Piece image={king} alt="King" />;
}

export function Pawn() {
  return <Piece image={pawn} alt="Pawn" />;
}
