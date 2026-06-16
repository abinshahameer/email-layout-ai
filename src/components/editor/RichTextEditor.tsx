import { useEffect, useReducer, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold as BoldIcon, Italic as ItalicIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Classes applied to the editable area (font size, color, alignment...). */
  className?: string;
  /** "dark" renders the toolbar for use on dark backgrounds (e.g. the hero subtitle). */
  variant?: "light" | "dark";
}

/**
 * The editor works with a single paragraph internally but the rest of the app
 * stores/exports inline HTML (no <p> wrapper). These helpers bridge the two:
 * paragraph breaks become <br>, and the outer <p> tags are removed.
 */
const fromEditorHTML = (html: string): string => {
  if (!html) return "";
  return html
    .replace(/<p[^>]*>\s*<\/p>/g, "")
    .replace(/<\/p>\s*<p[^>]*>/g, "<br>")
    .replace(/^\s*<p[^>]*>/, "")
    .replace(/<\/p>\s*$/, "")
    .replace(/<p[^>]*>/g, "")
    .replace(/<\/p>/g, "")
    .trim();
};

export const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  className,
  variant = "light",
}: RichTextEditorProps) => {
  const [focused, setFocused] = useState(false);
  // Force a re-render on every transaction so the toolbar reflects the
  // active bold/italic state at the cursor.
  const [, forceRender] = useReducer((x) => x + 1, 0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Keep only paragraph/text/bold/italic/hard-break/undo-redo.
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        listKeymap: false,
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        underline: false,
        link: false,
        trailingNode: false,
      }),
      Placeholder.configure({ placeholder: placeholder ?? "Type here..." }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: cn("outline-none min-h-[1.5rem]", className),
      },
    },
    onUpdate: ({ editor }) => onChange(fromEditorHTML(editor.getHTML())),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  });

  // Reflect external value changes (switching sections, loading saved data)
  // without clobbering what the user is actively typing.
  useEffect(() => {
    if (!editor) return;
    const current = fromEditorHTML(editor.getHTML());
    if (value !== current && !editor.isFocused) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.on("transaction", forceRender);
    return () => {
      editor.off("transaction", forceRender);
    };
  }, [editor]);

  if (!editor) return null;

  const toolbarBase =
    "inline-flex items-center gap-0.5 rounded-md p-0.5 mb-1.5 shadow-sm";
  const toolbarTheme =
    variant === "dark"
      ? "bg-black/50 border border-white/15"
      : "bg-white border border-gray-200";

  const buttonClass = (active: boolean) =>
    cn(
      "h-7 w-7 flex items-center justify-center rounded transition-colors",
      variant === "dark"
        ? active
          ? "bg-white/25 text-white"
          : "text-white/80 hover:bg-white/10"
        : active
        ? "bg-gray-200 text-gray-900"
        : "text-gray-600 hover:bg-gray-100"
    );

  return (
    <div className={cn("relative", variant === "dark" && "rte-dark")}>
      {focused && (
        <div className={cn(toolbarBase, toolbarTheme)}>
          <button
            type="button"
            title="Bold (Ctrl+B)"
            // Prevent the editor from losing focus/selection on click.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={buttonClass(editor.isActive("bold"))}
          >
            <BoldIcon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Italic (Ctrl+I)"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={buttonClass(editor.isActive("italic"))}
          >
            <ItalicIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};
