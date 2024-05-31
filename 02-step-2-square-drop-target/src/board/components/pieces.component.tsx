import { useEffect, useRef, useState } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";
import king from "../../assets/king.png";
import pawn from "../../assets/pawn.png";
import styles from "./pieces.module.css";
import { Coord } from "../board.model";

export type PieceProps = {
  image: string;
  alt: string;
  pieceType: string;
  location: Coord;
};

function Piece({ image, alt, pieceType, location }: PieceProps) {
  const [dragging, setDragging] = useState<boolean>(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

     

    const cleanup = draggable({
      element: el,
      getInitialData: () => ({ location, pieceType }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });

    return cleanup;
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

interface KingProps {
  location: Coord;
}

export function King({ location }: KingProps) {
  return <Piece image={king} alt="King" pieceType="king" location={location} />;
}

interface PawnProps {
  location: Coord;
}

export function Pawn({ location }: PawnProps) {
  return <Piece image={pawn} alt="Pawn" pieceType="pawn" location={location} />;
}
