"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Search, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import TodoEditor from "@/components/editor";

export default function Home() {
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {  
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data } = await axios.get("/api/todo");
      if (data.success) {
        setTodos(data.data);
        toast.success("Todos loaded!");
      }
      setIsLoaded(true);
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast.error("Failed to fetch todos.");
    }
  };

  const handleCreateTodo = () => {
    setSelectedTodo(null);
    setIsEditorOpen(true);
  };
  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditTodo = (index) => {
    setSelectedTodo(index);
    setIsEditorOpen(true);
  };

  const handleSaveTodo = async (updatedTodo) => {
    try {
      if (selectedTodo === null) {
        const { data } = await axios.post("/api/todo", updatedTodo);
        if (data.success) {
          setTodos([...todos, data.data]);
          toast.success("Todo created!");
        }
      } else {
        const { data } = await axios.patch("/api/todo", {
          id: todos[selectedTodo]._id,
          ...updatedTodo,
        });
        if (data.success) {
          const newTodos = [...todos];
          newTodos[selectedTodo] = data.data;
          setTodos(newTodos);
          toast.success("Todo updated!");
        }
      }
      setIsEditorOpen(false);
    } catch (error) {
      console.error("Error saving todo:", error);
      toast.error("Failed to save todo.");
    }
  };

  const handleDeleteTodo = async (index) => {
    try {
      const { data } = await axios.delete("/api/todo", {
        data: { id: todos[index]._id },
      });
      if (data.success) {
        const newTodos = todos.filter((_, i) => i !== index);
        setTodos(newTodos);
        toast.success("Todo deleted!");
        if (selectedTodo === index) {
          setIsEditorOpen(false);
        }
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete todo.");
    }
  };

  const handleBack = () => {
    setIsEditorOpen(false);
    setSelectedTodo(null);
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      <nav className="w-full bg-white shadow-sm px-6 py-6 mb-4 h-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-full"></div>
            <h1 className="text-xl font-bold">TODO</h1>
          </div>
        </div>
      </nav>

      <div className="flex flex-row h-[calc(100vh-6rem)]">
        {/* Sidebar */}
        {(!isMobileView || (!isEditorOpen && selectedTodo === null)) && (
  <aside className={`${
    isMobileView ? 'w-full' : 'w-1/4'
  } bg-white p-4 border-r min-h-full overflow-y-auto`}>
    <div className="flex items-center bg-gray-200 p-2 rounded mb-2">
      <button
        className="px-3 py-1 bg-black text-white rounded flex items-center gap-2"
        onClick={handleCreateTodo}
      >
        <Plus size={16} />
        TODO
      </button>
      <div className="relative ml-auto flex items-center">
        <input
          type="text"
          placeholder="Search todos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 sm:pr-2  sm:py-1 text-sm rounded border border-gray-300 focus:outline-none focus:border-black"
        />
        <Search className="w-4 h-4 absolute left-2 text-gray-400" />
      </div>
    </div>
    <div className="space-y-2">
      {filteredTodos.length > 0 ? (
        filteredTodos.map((todo, index) => (
          <Card
            key={todo._id}
            className={`p-3 border ${
              selectedTodo === index ? "border-black" : "border-transparent"
            } hover:border-gray-200 cursor-pointer`}
            onClick={() => handleEditTodo(index)}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <h2 className="font-bold mb-1">{todo.title}</h2>
                <div className="flex justify-between text-sm text-gray-600">
                  <p className="truncate max-w-[120px]">
                    {todo.description?.replace(/<[^>]+>/g, "").slice(0, 40)}...
                  </p>
                  <p className="text-gray-400 text-xs">
                    {new Date(todo.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                className="text-gray-500 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTodo(index);
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
        ))
      ) : (
        <div className="text-center py-4 text-gray-500">
          No todos found matching "{searchQuery}"
        </div>
      )}
    </div>
  </aside>
)}
        {/* Main Content */}
        {(!isMobileView || isEditorOpen || selectedTodo !== null) && (
          <main className={`${
            isMobileView ? 'w-full' : 'flex-1'
          } p-6 overflow-y-auto`}>
            {isMobileView && (
              <button
                onClick={handleBack}
                className="mb-4 flex items-center gap-2 px-4 py-2 bg-gray-200 rounded"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            )}
            
            {isEditorOpen ? (
              <TodoEditor
                onSave={handleSaveTodo}
                onCancel={() => setIsEditorOpen(false)}
                todo={selectedTodo !== null ? todos[selectedTodo] : null}
              />
            ) : (
              selectedTodo !== null &&
              todos.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-2xl font-bold mb-4">{todos[selectedTodo].title}</h2>
                  <div
                    className="text-gray-600"
                    dangerouslySetInnerHTML={{ __html: todos[selectedTodo].description }}
                  />
                  <p className="text-sm text-gray-400 mt-4">
                    {new Date(todos[selectedTodo].date).toLocaleDateString()}
                  </p>
                </div>
              )
            )}
          </main>
        )}
      </div>
    </div>
  );
}