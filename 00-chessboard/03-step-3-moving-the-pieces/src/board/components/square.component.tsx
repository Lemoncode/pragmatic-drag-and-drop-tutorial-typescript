import { ReactNode, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { Coord, PieceRecord } from "../board.model";
import styles from "./square.module.css";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { canMove, isCoord, isEqualCoord, isPieceType } from "../board.utils";

type HoveredState = "idle" | "validMove" | "invalidMove";

function getColor(state: HoveredState, isDark: boolean): string {
  if (state === "validMove") {
    return "lightgreen";
  } else if (state === "invalidMove") {
    return "pink";
  }
  return isDark ? "lightgrey" : "white";
}

interface SquareProps {
  location: Coord;
  children: ReactNode;
  pieces: PieceRecord[];
}

export function Square({ location, children, pieces }: SquareProps) {
  const ref = useRef(null);
  const [state, setState] = useState<HoveredState>("idle");

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({ location }),
      canDrop: ({ source }) => {
        if (!isCoord(source.data.location)) {
          return false;
        }

        return !isEqualCoord(source.data.location, location);
      },
      onDragEnter: ({ source }) => {
        // source is the piece being dragged over the drop target
        if (
          // type guards
          !isCoord(source.data.location) ||
          !isPieceType(source.data.pieceType)
        ) {
          return;
        }

        if (
          canMove(source.data.location, location, source.data.pieceType, pieces)
        ) {
          setState("validMove");
        } else {
          setState("invalidMove");
        }
      },
      onDragLeave: () => setState("idle"),
      onDrop: () => setState("idle"),
    });
    // Adding 'pieces' as dependencies ensures the effect is re-run
    // whenever the location or pieces change, keeping the drop target logic updated.
  }, [pieces]);

  const isDark = (location[0] + location[1]) % 2 === 1;

  return (
    <div
      className={styles.square}
      style={{ backgroundColor: getColor(state, isDark) }}
      ref={ref}
    >
      {children}
    </div>
  );
}
