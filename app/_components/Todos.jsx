import Todo from "./Todo";

function Todos({ todos, handleClick, selectedTodo }) {
  return todos.map((todo) => (
    <Todo
      key={todo._id}
      todo={todo}
      handleClick={handleClick}
      selectedTodo={selectedTodo}
    />
  ));
}

export default Todos;
