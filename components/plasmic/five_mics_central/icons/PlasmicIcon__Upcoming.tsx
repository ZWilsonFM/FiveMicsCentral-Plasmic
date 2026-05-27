/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type UpcomingIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function UpcomingIcon(props: UpcomingIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      viewBox={"0 0 256 256"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M72 48v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24v32H48V48Zm136 160H48V96h160zm-68-76a12 12 0 1 1-12-12 12 12 0 0 1 12 12m44 0a12 12 0 1 1-12-12 12 12 0 0 1 12 12m-88 40a12 12 0 1 1-12-12 12 12 0 0 1 12 12m44 0a12 12 0 1 1-12-12 12 12 0 0 1 12 12m44 0a12 12 0 1 1-12-12 12 12 0 0 1 12 12"
        }
      ></path>
    </svg>
  );
}

export default UpcomingIcon;
/* prettier-ignore-end */
