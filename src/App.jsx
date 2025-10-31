// Complete React Task Manager Application
// Copy this ENTIRE file and replace everything in src/App.jsx

import React, { useState, useEffect, useContext, createContext } from 'react';

// Theme Context
const ThemeContext = createContext();

// Custom Hook: useLocalStorage
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }, [key, value]);

  return [value, setValue];
};

// Button Component
const Button = ({ children, variant = 'primary', onClick, className = '' }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Card Component
const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl ${className}`}>
      {children}
    </div>
  );
};

// Navbar Component
const Navbar = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('tasks');

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-800 dark:to-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">TaskMaster Pro</h1>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`hover:text-blue-200 transition-colors ${activeTab === 'tasks' ? 'border-b-2 border-white' : ''}`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`hover:text-blue-200 transition-colors ${activeTab === 'users' ? 'border-b-2 border-white' : ''}`}
            >
              Users
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="hover:text-blue-400 transition-colors">About</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
        </div>
        <p className="text-gray-400">© 2025 TaskMaster Pro. All rights reserved.</p>
      </div>
    </footer>
  );
};

// Task Manager Component
const TaskManager = () => {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [taskInput, setTaskInput] = useState('');
  const [filter, setFilter] = useState('all');

  const addTask = () => {
    if (taskInput.trim()) {
      setTasks([...tasks, { id: Date.now(), text: taskInput, completed: false }]);
      setTaskInput('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">My Tasks</h2>
      
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
        />
        <Button onClick={addTask}>Add Task</Button>
      </div>

      <div className="flex gap-2 mb-6">
        <Button 
          variant={filter === 'all' ? 'primary' : 'secondary'} 
          onClick={() => setFilter('all')}
          className="flex-1"
        >
          All ({tasks.length})
        </Button>
        <Button 
          variant={filter === 'active' ? 'primary' : 'secondary'} 
          onClick={() => setFilter('active')}
          className="flex-1"
        >
          Active ({tasks.filter(t => !t.completed).length})
        </Button>
        <Button 
          variant={filter === 'completed' ? 'primary' : 'secondary'} 
          onClick={() => setFilter('completed')}
          className="flex-1"
        >
          Completed ({tasks.filter(t => t.completed).length})
        </Button>
      </div>

      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No tasks found. Add one above!</p>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-5 h-5 cursor-pointer"
              />
              <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-white'}`}>
                {task.text}
              </span>
              <Button variant="danger" onClick={() => deleteTask(task.id)} className="px-3 py-1">
                Delete
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

// API Integration Component
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto text-center">
        <p className="text-red-600 dark:text-red-400 text-xl">Error: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">User Directory</h2>
      
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users by name or email..."
        className="w-full px-4 py-3 mb-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentUsers.map(user => (
          <Card key={user.id} className="hover:transform hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{user.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600 dark:text-gray-400">📧 {user.email}</p>
              <p className="text-gray-600 dark:text-gray-400">📱 {user.phone}</p>
              <p className="text-gray-600 dark:text-gray-400">🌐 {user.website}</p>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="secondary"
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="secondary"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [currentView, setCurrentView] = useState('tasks');

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="mb-8 flex justify-center gap-4">
            <Button 
              onClick={() => setCurrentView('tasks')}
              variant={currentView === 'tasks' ? 'primary' : 'secondary'}
            >
              Task Manager
            </Button>
            <Button 
              onClick={() => setCurrentView('users')}
              variant={currentView === 'users' ? 'primary' : 'secondary'}
            >
              User Directory
            </Button>
          </div>
          {currentView === 'tasks' ? <TaskManager /> : <UserList />}
        </main>
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
};

export default App;