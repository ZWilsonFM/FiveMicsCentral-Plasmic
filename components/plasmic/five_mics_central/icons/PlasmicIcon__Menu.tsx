/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type MenuIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function MenuIcon(props: MenuIconProps) {
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
          "M228 128a12 12 0 0 1-12 12h-96a12 12 0 0 1 0-24h96a12 12 0 0 1 12 12M120 76h96a12 12 0 0 0 0-24h-96a12 12 0 0 0 0 24m96 104H40a12 12 0 0 0 0 24h176a12 12 0 0 0 0-24M72 148a12 12 0 0 0 8.49-20.49L49 96l31.49-31.52a12 12 0 0 0-17-17l-40 40a12 12 0 0 0 0 17l40 40A12 12 0 0 0 72 148"
        }
      ></path>
    </svg>
  );
}

export default MenuIcon;
/* prettier-ignore-end */
