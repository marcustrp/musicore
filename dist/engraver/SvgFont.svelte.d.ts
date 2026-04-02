import type { Glyph } from '../../routes/tools/font/font.js';
type SvgData = {
    setChar: (char: string) => void;
    svgSetName: string;
    svgData: Glyph[];
};
declare const SvgFont: import("svelte").Component<SvgData, {}, "">;
type SvgFont = ReturnType<typeof SvgFont>;
export default SvgFont;
//# sourceMappingURL=SvgFont.svelte.d.ts.map