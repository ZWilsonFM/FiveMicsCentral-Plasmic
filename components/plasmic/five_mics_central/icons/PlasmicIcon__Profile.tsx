/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ProfileIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ProfileIcon(props: ProfileIconProps) {
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
          "M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24M74.08 197.5a64 64 0 0 1 107.84 0 87.83 87.83 0 0 1-107.84 0M96 120a32 32 0 1 1 32 32 32 32 0 0 1-32-32m97.76 66.41a79.66 79.66 0 0 0-36.06-28.75 48 48 0 1 0-59.4 0 79.66 79.66 0 0 0-36.06 28.75 88 88 0 1 1 131.52 0"
        }
      ></path>
    </svg>
  );
}

export default ProfileIcon;
/* prettier-ignore-end */
