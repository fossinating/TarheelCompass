"use client"
import { Card, CardActionArea, CardContent, IconButton, Typography } from "@mui/material";
import * as React from 'react';
import { readableTime, titleCase } from "../Common";
import "./PaneSplit.css";
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';


/*
  Pane Split

  Utility hook providing a pre-built sidebar/side pane setup

  <PaneSplit main={<Content>} paneTitle={<Content>} paneDetails={<Content>} /> 
*/

export default function PaneSplit(props: {main: JSX.Element, paneTitle: JSX.Element, paneDetails: JSX.Element}) {
  const [paneExpanded, setPaneExpanded] = React.useState<boolean>(false);
  const expandPane = () => {
    setPaneExpanded(!paneExpanded);
  }
  return (
    <div className={"ps-container" + (paneExpanded ? " pane-expanded" : "")}>
      <div className="ps-main">
        {props.main}
      </div>
      <div className="ps-pane">
        <div className="ps-pane-topbar">
          {props.paneTitle}
          <IconButton className="ps-pane-expand-btn" onClick={expandPane}>
            <ExpandCircleDownIcon />
          </IconButton>
        </div>
        <div className="ps-pane-details">
          {props.paneDetails}
        </div>
      </div>
    </div>
  );
}