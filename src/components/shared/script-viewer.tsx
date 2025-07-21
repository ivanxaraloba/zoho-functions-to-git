import React, { useMemo, useRef } from 'react';



import { cn } from '@/lib/utils';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';
import { monokai } from '@uiw/codemirror-theme-monokai';
import CodeMirror, { Decoration, MatchDecorator, Prec, ReactCodeMirrorProps, ViewPlugin } from '@uiw/react-codemirror';
import { useTheme } from 'next-themes';
import { createTheme } from 'thememirror';






import '@/assets/styles/code-viewer.css';





interface ScriptViewerProps extends ReactCodeMirrorProps {
  value?: string;
  search?: string;
  onChange?: (value: string, viewUpdate: any) => void;
  className?: string;
  editable?: boolean;
  highlightWord?: string;
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createHighlightPlugin(word: string) {
  if (!word) return null;

  const safeWord = escapeRegExp(word);
  const decorator = new MatchDecorator({
    regexp: new RegExp(safeWord, 'gi'),
    decoration: Decoration.mark({
      attributes: {
        style: `
          color: #000;
          font-weight: 800;
          background: #FFFF00;
        `,
      },
    }),
  });

  return ViewPlugin.fromClass(
    class {
      decorations: any;
      constructor(view: EditorView) {
        // @ts-ignore
        this.decorations = decorator.createDeco(view);
      }
      update(update: any) {
        // @ts-ignore
        this.decorations = decorator.updateDeco(update, this.decorations);
      }
    },
    {
      decorations: (v: any) => v.decorations,
    },
  );
}

function ScriptViewer({
  value,
  onChange,
  className,
  editable = false,
  highlightWord = '',
  ...props
}: ScriptViewerProps) {
  const { theme } = useTheme();
  const editorRef = useRef<EditorView | null>(null);

  const myTheme = createTheme({
    variant: 'light',
    settings: {
      background: 'none',
      foreground: '#5e57b5',
      caret: '#5d00ff',
      selection: '#d8d8d8',
      lineHighlight: '#f0f0f0',
      gutterBackground: '#ffffff',
      gutterForeground: '#666666',
    },
    styles: [
      { tag: t.comment, color: '#9c9b96' },
      { tag: t.keyword, color: '#c69060' },
      { tag: t.string, color: '#d10000' },
      { tag: [t.number, t.bool], color: '#c6607c' },
      { tag: [t.operator, t.punctuation], color: '#666666' },
      { tag: t.function(t.variableName), color: '#c69060' },
      { tag: t.variableName, color: '#5e57b5' },
      { tag: t.definition(t.variableName), color: '#5e57b5' },
      { tag: t.special(t.variableName), color: '#ffff00' },
      { tag: t.brace, color: '#5e57b5' },
      { tag: t.literal, color: '#d10000' },
    ],
  });

  // Memoize the highlight plugin so it updates only when highlightWord changes
  const highlightPlugin = useMemo(() => {
    const plugin = createHighlightPlugin(highlightWord);
    return plugin ? [Prec.highest(plugin)] : [];
  }, [highlightWord]);

  return (
    <div>
      <CodeMirror
        ref={(instance) => {
          if (instance && !editorRef.current) {
            // @ts-ignore
            editorRef.current = instance.view;
          }
        }}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
        }}
        className={cn('border-none! outline-hidden!', className)}
        value={value || ''}
        theme={theme === 'light' ? myTheme : monokai}
        extensions={[javascript({ jsx: true }), ...highlightPlugin]}
        onChange={onChange}
        editable={editable}
        {...props}
      />
    </div>
  );
}

export default ScriptViewer;