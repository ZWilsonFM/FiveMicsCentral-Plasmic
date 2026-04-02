/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type PercentIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function PercentIcon(props: PercentIconProps) {
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
          "m205.66 61.64-144 144a8 8 0 0 1-11.32-11.32l144-144a8 8 0 0 1 11.32 11.31Zm-155.12 39.8a36 36 0 0 1 50.92-50.91 36 36 0 0 1-50.92 50.91M56 76a20 20 0 1 0 34.14-14.16A20 20 0 0 0 56 76m160 104a36 36 0 1 1-10.54-25.46A35.76 35.76 0 0 1 216 180m-16 0a20 20 0 1 0-5.86 14.14A19.87 19.87 0 0 0 200 180"
        }
      ></path>
    </svg>
  );
}

export default PercentIcon;
/* prettier-ignore-end */
