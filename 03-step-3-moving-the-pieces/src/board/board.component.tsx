import { useEffect, useState } from "react";
import { PieceRecord } from "./board.model";
import { renderSquares } from "./components";
import styles from "./board.module.css";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { canMove, isCoord, isEqualCoord, isPieceType } from "./board.utils";

export function Chessboard() {
  const [pieces, setPieces] = useState<PieceRecord[]>([
    { type: "king", location: [3, 2] },
    { type: "pawn", location: [1, 6] },
  ]);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) {
          // if dropped outside of any drop targets
          return;
        }
        const destinationLocation = destination.data.location;
        const sourceLocation = source.data.location;
        const pieceType = source.data.pieceType;

        if (
          // type guarding
          !isCoord(destinationLocation) ||
          !isCoord(sourceLocation) ||
          !isPieceType(pieceType)
        ) {
          return;
        }

        const piece = pieces.find((p) =>
          isEqualCoord(p.location, sourceLocation)
        );
        const restOfPieces = pieces.filter((p) => p !== piece);

        if (
          canMove(sourceLocation, destinationLocation, pieceType, pieces) &&
          piece !== undefined
        ) {
          // moving the piece!
          setPieces([
            { type: piece.type, location: destinationLocation },
            ...restOfPieces,
          ]);
        }
      },
    });
  }, [pieces]);

  return <div className={styles.board}>{renderSquares(pieces)}</div>;
}
