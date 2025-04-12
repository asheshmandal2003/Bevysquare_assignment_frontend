import axios from "axios";
import Header from "./_components/Header";
import TodoSection from "./_components/TodoSection";

export async function fetchTodos(page, limit) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/todos`,
      {
        params: {
          page,
          limit,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default async function Home({ searchParams }) {
  const search = await searchParams;
  const page = parseInt(search?.page || "1", 10);
  const limit = parseInt(search?.limit || "6", 10);

  const data = await fetchTodos(page, limit);
  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Failed to fetch todos</h1>
      </div>
    );
  }
  const { todos, pagination } = data;

  return (
    <>
      <Header />
      <TodoSection initialTodos={todos} pagination={pagination} />
    </>
  );
}
