"use client";

import dynamic from "next/dynamic";
import TodoList from "./TodoList";
import { useState, useEffect } from "react";
import { ArrowLeftIcon, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useTodoContext } from "../_contexts/TodoContext";
import { useRouter } from "next/navigation";

const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded p-4 h-screen max-h-[800px] flex items-center justify-center">
      <Loader2 className="animate-spin text-gray-500" />
      <div className="ml-2 text-gray-500">Loading Editor...</div>
    </div>
  ),
});

function TodoSection({ initialTodos, pagination }) {
  const { todos, setTodos } = useTodoContext();
  const [showEditor, setShowEditor] = useState(() => false);
  const [showModal, setShowModal] = useState(() => false);
  const [isMobile, setIsMobile] = useState(() => false);
  const [todo, setTodo] = useState(() => null);
  const [deleting, setDeleting] = useState(() => false);
  const router = useRouter();

  useEffect(() => {
    if (initialTodos) {
      setTodos(initialTodos);
    }
  }, [initialTodos, setTodos]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const closeEditorModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  const handleClick = (id) => {
    if (isMobile) {
      setShowModal(true);
      document.body.style.overflow = "hidden";
    } else {
      if (todo && todo._id === id) {
        setTodo(null);
        setShowEditor(false);
      } else {
        const selectedTodo = todos.find((todo) => todo._id === id);
        if (selectedTodo) {
          setTodo(selectedTodo);
          setShowEditor(true);
        }
      }
    }
  };

  const handleTitleChange = async (newTitle) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/todos/${todo._id}/title`,
        {
          title: newTitle,
        }
      );

      setTodos((prevTodos) => {
        return prevTodos.map((prevTodo) =>
          prevTodo._id === todo._id
            ? { ...prevTodo, title: newTitle }
            : prevTodo
        );
      });
      setTodo((prevTodo) => ({ ...prevTodo, title: newTitle }));
      toast.success("Title updated successfully");
    } catch (error) {
      console.error("Error updating title:", error);
      toast.error("Error", {
        description:
          error?.response?.data?.message ||
          error.message ||
          "Failed to update title",
      });
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/todos/${todo._id}`
      );
      setTodo(null);
      setShowEditor(false);
      setTodos((prevTodos) =>
        prevTodos.filter((prevTodo) => prevTodo._id !== todo._id)
      );
      router.refresh();
      toast.success("Todo deleted successfully");
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Error", {
        description:
          error?.response?.data?.message ||
          error.message ||
          "Failed to delete todo",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="w-11/12 max-w-7xl mx-auto mt-10 flex justify-center gap-10">
        <div className="w-full lg:w-1/3">
          <TodoList
            todos={todos}
            setTodos={setTodos}
            pagination={pagination}
            handleClick={handleClick}
            selectedTodo={todo ? todo._id : null}
          />
        </div>
        <div
          className={`hidden ${
            showEditor ? "lg:block" : "lg:hidden"
          } w-2/3 transition-transform duration-500 ease-in-out`}
        >
          <Editor
            initialContent={todo}
            onTitleChange={handleTitleChange}
            onDelete={handleDelete}
            deleting={deleting}
            setTodos={setTodos}
          />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-100 bg-opacity-50 p-4">
          <div className="w-full max-w-lg overflow-hidden flex flex-col h-screen">
            <button
              onClick={closeEditorModal}
              className="flex gap-2 mt-32 mb-8 cursor-pointer"
              aria-label="Close"
              title="Close"
            >
              <ArrowLeftIcon />
              <span className="text-lg font-semibold">Back</span>
            </button>
            <div className="flex-1 overflow-auto">
              <Editor
                initialContent={todo}
                onTitleChange={handleTitleChange}
                onDelete={handleDelete}
                deleting={deleting}
                setTodos={setTodos}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TodoSection;
