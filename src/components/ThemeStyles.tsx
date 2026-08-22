import { buildFontFaceCss } from "@/constants/font";
import { buildLayoutCss } from "@/constants/layout";
import { buildThemeCss } from "@/constants/theme";

/** Injects font faces, layout tokens, and theme tokens as CSS custom properties. */
export function ThemeStyles(): React.ReactElement {
  const css = `${buildFontFaceCss()}\n\n${buildLayoutCss()}\n\n${buildThemeCss()}`;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
