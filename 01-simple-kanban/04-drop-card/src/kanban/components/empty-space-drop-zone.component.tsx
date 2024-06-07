import React from "react";
import { useEffect, useRef } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

interface Props {
  columnId: number;
}

export const EmptySpaceDropZone: React.FC<Props> = (props) => {
  const { columnId } = props;
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({ columnId, cardId: -1 }),
    });
  }, []);

  return (
    <div
      ref={ref}
      style={{ flexGrow: 1, width: "100%", background: "transparent" }}
    />
  );
};
