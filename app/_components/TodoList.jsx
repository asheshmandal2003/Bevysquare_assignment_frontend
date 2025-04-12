"use client";

import TodosHead from "./TodosHead";
import Todos from "./Todos";
import Pagination from "./Pagination";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";

function TodoList({ todos, setTodos, pagination, handleClick, selectedTodo }) {
  const pathname = usePathname();
  const router = useRouter();

  const { page, limit, totalPages, total } = pagination;

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage < 1 || newPage > totalPages) return;

      const params = new URLSearchParams();
      params.set("page", newPage.toString());
      params.set("limit", limit.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, limit, totalPages]
  );

  const fetchTodosByName = async (query) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/todos/search/name?query=${query}`
      );
      setTodos(res.data?.data);
      toast.success(res.data?.message || "Todo fetched successfully");
    } catch (error) {
      console.error("Error fetching todo:", error);
      toast.error("Error", {
        description:
          error?.response?.data?.message ||
          error.message ||
          "Error fetching todo",
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 mb-16">
      <TodosHead fetchTodosByName={fetchTodosByName} />

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-semibold text-gray-700">
            No Todos Found
          </h2>
          <p className="text-gray-500">Try creating a new todo!</p>
        </div>
      ) : (
        <>
          <Todos
            todos={todos}
            handleClick={handleClick}
            selectedTodo={selectedTodo}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            handlePrevious={() => handlePageChange(page - 1)}
            handleNext={() => handlePageChange(page + 1)}
            handlePage={(newPage) => handlePageChange(newPage)}
          />
        </>
      )}
    </div>
  );
}

export default TodoList;
