function formatDate(date) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return formattedDate;
}

function Todo({ todo, handleClick, selectedTodo }) {
  return (
    <div
      className={`w-full h-32 bg-white hover:bg-gray-200 p-4 rounded-lg shadow cursor-pointer border-2
        ${
          selectedTodo === todo._id ? "border-black" : "border-transparent"
        } transition-all duration-200 ease-in-out`}
      onClick={() => handleClick(todo._id)}
      aria-label={`Todo: ${todo?.title}`}
      title={`Todo: ${todo?.title}`}
      role="button"
      tabIndex={0}
    >
      <h2 className="text-lg font-semibold">{todo?.title}</h2>
      <div className="mt-2 flex justify-between gap-2">
        <div
          className="text-sm text-gray-700 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: todo?.description }}
        />
        <small className="text-xs text-gray-500 shrink-0">
          {todo?.createdAt && formatDate(todo.createdAt)}
        </small>
      </div>
    </div>
  );
}

export default Todo;
