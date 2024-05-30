# Step 1: Making the pieces draggable

The first step to make our chess board functional is to allow the pieces to be dragged around.

Pragmatic drag and drop provides a draggable function that you attach to an element to enable the draggable behavior. When using React this is done in an effect:

```tsx
function Piece({ image, alt }: PieceProps) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
    });
  }, []);

  return <img css={imageStyles} src={image} alt={alt} ref={ref} />;
}
```
