import React, { useEffect, useRef, useState } from "react";
import { CardContent } from "../../model";
import classes from "./card.component.module.css";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";
import { GhostCard } from "../ghost-card/ghost-card.component";

interface Props {
  columnId: number;
  content: CardContent;
}

export const Card: React.FC<Props> = (props) => {
  const { content, columnId } = props;
  const [dragging, setDragging] = useState<boolean>(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    // Add this to avoid typescript in strict mode complaining about null
    // on draggable({ element: el }); call
    invariant(el);

    return draggable({
      element: el,
      getInitialData: () => ({ card: content }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({ columnId, cardId: content.id }),
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, []);

  return (
    <>
      <GhostCard show={isDraggedOver} />
      <div
        ref={ref}
        className={classes.card}
        style={{
          opacity: dragging ? 0.4 : 1,
          background: isDraggedOver ? "lightblue" : "white",
        }}
      >
        {content.title}
      </div>
    </>
  );
};
