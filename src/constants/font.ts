/** Self-hosted fonts under `public/fonts/`. */
export const fontPaths = {
  googleSansFlex: "/fonts/GoogleSans.ttf",
  stackSansHeadline: "/fonts/StackSans.ttf",
} as const;

export const fontFamilies = {
  body: "'Google Sans Flex', system-ui, sans-serif",
  heading: "'Stack Sans Headline', 'Google Sans Flex', system-ui, sans-serif",
} as const;

/** Injects font faces once at app root so paths stay in sync with fontPaths. */
export function buildFontFaceCss(): string {
  return `
@font-face {
  font-family: "Google Sans Flex";
  src: url("${fontPaths.googleSansFlex}") format("truetype");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Stack Sans Headline";
  src: url("${fontPaths.stackSansHeadline}") format("truetype");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
`.trim();
}
