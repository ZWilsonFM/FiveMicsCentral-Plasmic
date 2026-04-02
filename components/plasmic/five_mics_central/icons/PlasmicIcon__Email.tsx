/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type EmailIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function EmailIcon(props: EmailIconProps) {
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
          "M224 44H32a12 12 0 0 0-12 12v136a20 20 0 0 0 20 20h176a20 20 0 0 0 20-20V56a12 12 0 0 0-12-12m-96 83.72L62.85 68h130.3Zm-35.21.28L44 172.72V83.28Zm17.76 16.28 9.34 8.57a12 12 0 0 0 16.22 0l9.34-8.57 47.7 43.72H62.85ZM163.21 128 212 83.28v89.44Z"
        }
      ></path>
    </svg>
  );
}

export default EmailIcon;
/* prettier-ignore-end */
