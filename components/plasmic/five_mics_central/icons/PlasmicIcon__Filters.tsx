/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type FiltersIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function FiltersIcon(props: FiltersIconProps) {
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
          "M40 92h30.06a36 36 0 0 0 67.88 0H216a12 12 0 0 0 0-24h-78.06a36 36 0 0 0-67.88 0H40a12 12 0 0 0 0 24m64-24a12 12 0 1 1-12 12 12 12 0 0 1 12-12m112 96h-14.06a36 36 0 0 0-67.88 0H40a12 12 0 0 0 0 24h94.06a36 36 0 0 0 67.88 0H216a12 12 0 0 0 0-24m-48 24a12 12 0 1 1 12-12 12 12 0 0 1-12 12"
        }
      ></path>
    </svg>
  );
}

export default FiltersIcon;
/* prettier-ignore-end */
