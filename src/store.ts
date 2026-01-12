import { createSignal, createEffect } from 'solid-js';
import type { Task } from './types';

const STORAGE_KEY = 'checkoff_savedTasks';
const THEME_KEY = 'checkoff_prefersLight';

export function useTaskStorage() {
  const [tasks, setTasks] = createSignal<Task[]>([]);

  // Load tasks from localStorage on mount
  const loadTasks = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved tasks:', e);
        setTasks([]);
      }
    }
  };

  // Save tasks to localStorage whenever they change
  createEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks()));
  });

  const addTask = (title: string, dueDate: string) => {
    if (!title.trim()) return;
    
    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      dueDate,
      status: 'todo'
    };
    
    setTasks([...tasks(), newTask]);
  };

  const checkoffTask = (taskId: number) => {
    setTasks(tasks().map(task => 
      task.id === taskId ? { ...task, status: 'done' as const } : task
    ));
  };

  const clearCompleted = () => {
    setTasks(tasks().filter(task => task.status !== 'done'));
  };

  const importTasks = (importedTasks: Task[]) => {
    if (!Array.isArray(importedTasks)) return;
    
    const current = tasks();
    const combined = [...current, ...importedTasks];
    const unique = Array.from(new Map(combined.map(task => [task.id, task])).values());
    setTasks(unique);
  };

  return {
    tasks,
    loadTasks,
    addTask,
    checkoffTask,
    clearCompleted,
    importTasks
  };
}

export function useTheme() {
  const [isDark, setIsDark] = createSignal(false);

  const initTheme = () => {
    const saved = localStorage.getItem(THEME_KEY) ?? 'yes';
    const shouldBeDark = saved === 'no';
    setIsDark(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newDark = !isDark();
    setIsDark(newDark);
    
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'no');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'yes');
    }
  };

  return {
    isDark,
    initTheme,
    toggleTheme
  };
}
