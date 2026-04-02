/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type LeaderboardIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function LeaderboardIcon(props: LeaderboardIconProps) {
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
          "M108.62 103.79a12 12 0 0 1 7.59-15.17l12-4A12 12 0 0 1 144 96v40a12 12 0 0 1-24 0v-24a12 12 0 0 1-11.38-8.21M252 208a12 12 0 0 1-12 12H16a12 12 0 0 1 0-24h4v-92a20 20 0 0 1 20-20h36V56a20 20 0 0 1 20-20h64a20 20 0 0 1 20 20v68h36a20 20 0 0 1 20 20v52h4a12 12 0 0 1 12 12m-72-60v48h32v-48Zm-80 48h56V60h-56Zm-56 0h32v-88H44Z"
        }
      ></path>
    </svg>
  );
}

export default LeaderboardIcon;
/* prettier-ignore-end */
