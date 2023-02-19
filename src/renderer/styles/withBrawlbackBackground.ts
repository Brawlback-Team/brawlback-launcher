import { css } from "@emotion/react";

import brawlbackLogo from "@/styles/images/brawlback-logo.svg";

export const withBrawlbackBackground = css`
  &::before {
    content: "";
    background-image: url("${brawlbackLogo}");
    background-size: 50%;
    background-position: 110% 120%;
    background-repeat: no-repeat;
    position: fixed;
    top: 0;
    height: 100%;
    width: 100%;
    opacity: 0.1;
    z-index: -1;
  }
`;
