"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, Trash2Icon } from "lucide-react";

function EditorHeader({ title, onTitleChange, onDelete, deleting }) {
  const [isEditing, setIsEditing] = useState(() => false);
  const [currentTitle, setCurrentTitle] = useState(() => title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (title !== currentTitle) {
      setCurrentTitle(title);
    }
  }, [title]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e) => {
    setCurrentTitle(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleSaveTitle = () => {
    setIsEditing(false);
    const trimmedTitle = currentTitle.trim();
    if (trimmedTitle === "") {
      setCurrentTitle(title);
    } else {
      onTitleChange(trimmedTitle);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentTitle(title);
  };

  const handleBlur = () => {
    handleSaveTitle();
  };

  return (
    <div className="flex items-center justify-between">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={currentTitle}
          onChange={handleTitleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="text-xl md:text-3xl font-semibold border-b-2 border-gray-300 outline-none focus:border-none bg-transparent w-full mr-4"
          aria-label="Edit title"
          title="Edit title"
          maxLength={50}
        />
      ) : (
        <h1
          className="text-xl md:text-3xl font-semibold cursor-pointer"
          onClick={handleTitleClick}
          aria-label="Todo Title (click to edit)"
          title="Click to edit title"
        >
          {title}
        </h1>
      )}
      <button
        onClick={onDelete}
        className="p-2 rounded-md hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer"
        disabled={deleting}
        aria-label="Delete"
        title="Delete"
      >
        {deleting ? (
          <>
            <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-gray-600 animate-spin" />
          </>
        ) : (
          <>
            <Trash2Icon className="w-4 h-4 md:w-5 md:h-5 text-gray-600 hover:text-red-500 transition duration-300 ease-in-out" />
          </>
        )}
      </button>
    </div>
  );
}

export default EditorHeader;
