export type ColumnEditorEvent = {
    editorIndex: number;
    barIndex: number;
    index: number;
    position: number;
    data?: string;
};
import type { ColumnEditorLayout } from '../layout/LColumnEditor.js';
/** Should be merged with ColumnEditor */
type MyProps = {
    columnEditor: ColumnEditorLayout;
    editorIndex: number;
    event: (arg0: ColumnEditorEvent) => void;
};
declare const EColumnEditor: import("svelte").Component<MyProps, {}, "">;
type EColumnEditor = ReturnType<typeof EColumnEditor>;
export default EColumnEditor;
//# sourceMappingURL=EColumnEditor.svelte.d.ts.map