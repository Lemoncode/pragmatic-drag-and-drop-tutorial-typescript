export type Coord = [number, number];

export type PieceRecord = {
  type: PieceType;
  location: Coord;
};

export type PieceType = "king" | "pawn";

export type PieceProps = {
  image: string;
  alt: string;
};
