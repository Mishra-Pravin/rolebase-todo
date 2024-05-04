
"use client"
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type TodoType = {
  id: number;
  task: string;
};

export default function Todo() {
  const [todos, setTodos] = useState<TodoType[] | null>(null);
  const [task, setTask] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("jwt"); // Get the token from local storage
      const response = await fetch("/api/getTodos", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      const data = await response.json();

      // Check if data is an array before setting todos
      if (Array.isArray(data)) {
        setTodos(data);
      } else {
        console.error("Error fetching todos:", data);
        setTodos([]);
      }
      setIsLoading(false);
    };

    fetchTodos();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("jwt"); // Get the token from local storage

    if (editId) {
      const response = await fetch("/api/updateTodo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({ id: editId, task }),
      });

      const updatedTodo = await response.json();
      setTodos(
        todos &&
          todos.map((todo: TodoType) =>
            todo.id === editId ? updatedTodo : todo
          )
      );
      setEditId(null);
    } else {
      const response = await fetch("/api/createTodo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({ task }),
      });

      const newTodo = await response.json();
      setTodos(todos ? [...todos, newTodo] : [newTodo]);
    }

    setTask("");
  };

  const handleEdit = async (id: number) => {
    const todoToEdit = todos && todos.find((todo: TodoType) => todo.id === id);

    if (todoToEdit) {
      setEditId(id);
      setTask(todoToEdit.task);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("jwt"); // Get the token from local storage

    await fetch("/api/deleteTodo", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify({ id }),
    });

    setTodos(todos && todos.filter((todo: TodoType) => todo.id !== id));
  };
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="flex items-center mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="flex-grow mr-2 p-2 border border-gray-300 rounded text-blue-500"
        />
        <Button type="submit">
          {editId ? "Update" : "Add"}
        </Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell>Task</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4}>
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
              </TableCell>
            </TableRow>
          ) : todos ? (
            todos.map((todo: TodoType, index) => (
              <TableRow key={todo.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{todo.task}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(todo.id)}>
                    Edit
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(todo.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>No todos yet.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}