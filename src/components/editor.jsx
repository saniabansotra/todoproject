"use client";
import { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered,
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Trash2,
  ArrowUp
} from 'lucide-react';

export default function TodoEditor({ onSave, onCancel, todo }) {
  const [title, setTitle] = useState(todo ? todo.title : '');
  const [description, setDescription] = useState(todo ? todo.description : '');
  const editorRef = useRef(null);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
      if (editorRef.current) {
        editorRef.current.innerHTML = todo.description;
      }
    }
  }, [todo]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    const updatedTodo = {
      ...(todo || {}), 
      title: title.trim(),
      description: editorRef.current?.innerHTML || description,
    };
    
    onSave(updatedTodo);
    setTitle('');
    setDescription('');
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <input 
          type="text" 
          placeholder="New Todo Title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-semibold w-full focus:outline-none"
        />
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={onCancel}
        >
          <Trash2 size={20} />
        </button>
      </div>
      
      <div className="px-6 py-3 border-b flex space-x-3 overflow-x-auto bg-gray-50">
        <button 
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          onClick={() => formatText('bold')}
        >
          <Bold size={20} />
        </button>
        <button 
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          onClick={() => formatText('italic')}
        >
          <Italic size={20} />
        </button>
        <span className="text-gray-300 my-1">|</span>
        <button 
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          onClick={() => formatText('insertUnorderedList')}
        >
          <List size={20} />
        </button>
        <button 
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          onClick={() => formatText('insertOrderedList')}
        >
          <ListOrdered size={20} />
        </button>
        <span className="text-gray-300 my-1">|</span>
        <button 
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          onClick={() => formatText('justifyLeft')}
        >
          <AlignLeft size={20} />
        </button>
        <button 
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          onClick={() => formatText('justifyCenter')}
        >
          <AlignCenter size={20} />
        </button>
        <button 
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          onClick={() => formatText('justifyRight')}
        >
          <AlignRight size={20} />
        </button>
        <button 
          className="p-2 rounded hover:bg-gray-200 transition-colors ml-auto"
          onClick={handleSave}
        >
          <ArrowUp size={20} />
        </button>
      </div>
      
      <div className="p-6">
        <div
          ref={editorRef}
          className="w-full focus:outline-none"
          contentEditable
          onKeyDown={handleKeyDown}
          placeholder="Add description..."
          style={{
            minHeight: '300px',
            padding: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#ffffff'
          }}
          onInput={(e) => setDescription(e.currentTarget.innerHTML)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button 
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}