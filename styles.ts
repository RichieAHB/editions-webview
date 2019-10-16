import { createStyleContext } from "./lib";
import { Theme } from "./headers/Theme";

const { getStyles, styled, injectGlobal } = createStyleContext<Theme>();

const render = (str: string, theme: Theme) =>
  `<style>${getStyles(theme)}</style>${str}`;

export { render, styled, injectGlobal };
