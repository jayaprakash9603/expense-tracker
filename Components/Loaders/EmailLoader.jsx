import React from "react";
import "../../Styles/Loaders/EmailLoader.css"; // Place your CSS here

const EmailLoader = () => {
  return (
    <svg
      className="ping-pong"
      viewBox="0 0 128 128"
      width="128px"
      height="128px"
    >
      <defs>
        <linearGradient id="ping-pong-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#000" />
          <stop offset="100%" stopColor="#fff" />
        </linearGradient>
        <mask id="ping-pong-mask">
          <rect
            x="0"
            y="0"
            width="128"
            height="128"
            fill="url(#ping-pong-grad)"
          />
        </mask>
      </defs>
      <g fill="var(--primary)">
        <g className="ping-pong__ball-x">
          <circle className="ping-pong__ball-y" r="10" />
        </g>
        <g className="ping-pong__paddle-x">
          <rect
            className="ping-pong__paddle-y"
            x="-30"
            y="-2"
            rx="1"
            ry="1"
            width="60"
            height="4"
          />
        </g>
      </g>
      <g fill="hsl(163,90%,40%)" mask="url(#ping-pong-mask)">
        <g className="ping-pong__ball-x">
          <circle className="ping-pong__ball-y" r="10" />
        </g>
        <g className="ping-pong__paddle-x">
          <rect
            className="ping-pong__paddle-y"
            x="-30"
            y="-2"
            rx="1"
            ry="1"
            width="60"
            height="4"
          />
        </g>
      </g>
    </svg>
  );
};

export default EmailLoader;
