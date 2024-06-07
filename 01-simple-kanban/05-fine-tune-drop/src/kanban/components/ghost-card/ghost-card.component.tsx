import React from "react";
import classes from "./ghost-card.component.module.css";

interface Props {
  show: boolean;
}

export const GhostCard: React.FC<Props> = ({ show }) => {
  return show ? <div className={classes.card}></div> : null;
};
