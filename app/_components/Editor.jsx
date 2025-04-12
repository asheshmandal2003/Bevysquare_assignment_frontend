"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  AlignCenterIcon,
  AlignLeftIcon,
  AlignJustifyIcon,
  ListIcon,
  ListOrderedIcon,
  PaintBucketIcon,
  RemoveFormattingIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import EditorHeader from "./EditorHeader";
import axios from "axios";
import { toast } from "sonner";

const MenuButton = ({ onClick, active, disabled, children, name }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-1 md:p-2 rounded-md ${
        active ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-100"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      aria-label={name}
      title={name}
    >
      {children}
    </button>
  );
};

export default function Editor({
  initialContent,
  onTitleChange,
  onDelete,
  deleting,
  setTodos,
}) {
  const [hasChanged, setHasChanged] = useState(false);
  const [content, setContent] = useState(() => "<p>Start typing here...</p>");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
      setHasChanged(true);
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && initialContent?.description) {
      editor.commands.setContent(initialContent.description);
    }
  }, [editor, initialContent]);

  useEffect(() => {
    if (!editor || !hasChanged || !initialContent?._id) return;

    const autoSvaveInterval = setInterval(() => {
      saveChanges();
    }, 5000);
    return () => clearInterval(autoSvaveInterval);
  }, [editor, hasChanged, initialContent]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  const clearFormatting = () => {
    editor
      .chain()
      .focus()
      .unsetAllMarks()
      .unsetHighlight()
      .setParagraph()
      .run();
  };

  const applyHighlight = () => {
    editor.chain().focus().toggleHighlight().run();
  };

  async function saveChanges() {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/todos/${initialContent._id}/description`,
        {
          description: editor.getHTML(),
        }
      );

      setHasChanged(false);
      setTodos((prev) =>
        prev.map((todo) => {
          return todo._id === initialContent._id
            ? { ...todo, description: editor.getHTML() }
            : todo;
        })
      );
      toast.success("Changes saved");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.warning("Changes not saved");
    }
  }

  return (
    <div className="rounded-lg overflow-hidden bg-white shadow p-4 md:p-10">
      <EditorHeader
        title={initialContent?.title}
        onTitleChange={onTitleChange}
        onDelete={onDelete}
        deleting={deleting}
      />
      <div className="flex flex-wrap gap-1 mt-8">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          name="Bold"
        >
          <BoldIcon className="w-4 h-4 md:w-5 md:h-5" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          name="Italic"
        >
          <ItalicIcon className="w-4 h-4 md:w-5 md:h-5" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleMark("underline").run()}
          active={editor.isActive("underline")}
          name="Underline"
        >
          <UnderlineIcon className="w-4 h-4 md:w-5 md:h-5" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          name="Center"
        >
          <AlignCenterIcon className="w-4 h-4 md:w-5 md:h-5" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          name="Left"
        >
          <AlignLeftIcon className="w-4 h-4 md:w-5 md:h-5" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive({ textAlign: "justify" })}
          name="Justify"
        >
          <AlignJustifyIcon className="w-4 h-4 md:w-5 md:h-5" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList") ? "is-active" : ""}
          name="Bullet List"
        >
          <ListIcon className="w-4 h-4 md:w-5 md:h-5" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          name="Ordered List"
        >
          <ListOrderedIcon className="w-4 h-4 md:w-5 md:h-5" />
        </MenuButton>

        <MenuButton
          onClick={applyHighlight}
          active={editor.isActive("highlight")}
          name="Highlight"
        >
          <PaintBucketIcon className="w-4 h-4 md:w-5 md:h-5" />
        </MenuButton>

        <MenuButton onClick={clearFormatting} name="Clear Formatting">
          <RemoveFormattingIcon className="w-4 h-4 md:w-5 md:h-5" />
        </MenuButton>
      </div>
      <div className="h-screen max-h-[800px]">
        <hr />
        <EditorContent
          editor={editor}
          className="prose max-w-none mt-8 mb-10"
        />
      </div>
    </div>
  );
}
