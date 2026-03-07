/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type NounSearch7640330SvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function NounSearch7640330SvgIcon(props: NounSearch7640330SvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      version={"1.1"}
      viewBox={"-5 -10 110 135"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M46.172 77.648a31.48 31.48 0 0 1-24.977-12.332 31.486 31.486 0 0 1 12.957-48.258 31.49 31.49 0 0 1 27.793 1.84 31.49 31.49 0 0 1 6.496 49.543 31.4 31.4 0 0 1-22.27 9.207zm0-58a26.52 26.52 0 0 0-21.035 10.375 26.52 26.52 0 0 0-4.574 23 26.51 26.51 0 0 0 51.89-3.41A26.51 26.51 0 0 0 64.91 27.41a26.4 26.4 0 0 0-18.738-7.75zm20.5 47"
        }
      ></path>

      <path
        d={
          "M82.84 85.34a2.52 2.52 0 0 1-1.77-.73L64.91 68.442a2.497 2.497 0 0 1 .098-3.434 2.497 2.497 0 0 1 3.434-.098L84.61 81.07a2.49 2.49 0 0 1 .543 2.727 2.49 2.49 0 0 1-2.313 1.543"
        }
      ></path>

      <text
        x={"0"}
        y={"117.5"}
        fill={"currentColor"}
        fontFamily={
          "Arbeit Regular, Helvetica, Arial-Unicode, Arial, Sans-serif"
        }
        fontSize={"5"}
        fontWeight={"bold"}
      >
        Created by MD KOWSAR ALI
      </text>

      <text
        x={"0"}
        y={"122.5"}
        fill={"currentColor"}
        fontFamily={
          "Arbeit Regular, Helvetica, Arial-Unicode, Arial, Sans-serif"
        }
        fontSize={"5"}
        fontWeight={"bold"}
      >
        from Noun Project
      </text>
    </svg>
  );
}

export default NounSearch7640330SvgIcon;
/* prettier-ignore-end */
