import { useEffect, useRef, useState } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { PieceProps } from "../board.model";
import invariant from "tiny-invariant";
import king from "../../assets/king.png";
import pawn from "../../assets/pawn.png";
import styles from "./pieces.module.css";

function Piece({ image, alt }: PieceProps) {
  const [dragging, setDragging] = useState<boolean>(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, []);

  return (
    <img
      className={styles.piece}
      src={image}
      alt={alt}
      ref={ref}
      style={{ opacity: dragging ? 0.4 : 1 }}
    />
  ); // draggable set to false to prevent dragging of the images
}

export function King() {
  return <Piece image={king} alt="King" />;
}

export function Pawn() {
  return <Piece image={pawn} alt="Pawn" />;
}
