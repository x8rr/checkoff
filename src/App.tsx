import { For, Show, onMount, createSignal, createMemo } from 'solid-js';
import type { Component } from 'solid-js';
import { useTaskStorage, useTheme } from './store';
import TaskItem from './components/TaskItem';
import NewTaskModal from './components/NewTaskModal';
import { Plus, PartyPopper, Github, SunMoon, Upload, Download, Trash2 } from 'lucide-solid';

const App: Component = () => {
  const { tasks, loadTasks, addTask, checkoffTask, clearCompleted, importTasks } = useTaskStorage();
  const { toggleTheme, initTheme } = useTheme();
  
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [taskTitle, setTaskTitle] = createSignal('');
  const [taskDate, setTaskDate] = createSignal('');

  onMount(() => {
    loadTasks();
    initTheme();
  });

  const today = () => new Date().setHours(0, 0, 0, 0);

  const overdueTasks = createMemo(() => 
    tasks().filter(task => {
      if (task.status === 'done') return false;
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate).setHours(0, 0, 0, 0);
      return taskDate < today();
    })
  );

  const todoTasks = createMemo(() => 
    tasks().filter(task => {
      if (task.status === 'done') return false;
      if (!task.dueDate) return true;
      const taskDate = new Date(task.dueDate).setHours(0, 0, 0, 0);
      return taskDate >= today();
    })
  );

  const doneTasks = createMemo(() => 
    tasks().filter(task => task.status === 'done')
  );

  const counts = createMemo(() => ({
    overdue: overdueTasks().length,
    todo: todoTasks().length,
    done: doneTasks().length,
    total: tasks().length
  }));

  const handleAddTask = () => {
    const title = taskTitle().trim();
    if (title) {
      addTask(title, taskDate());
      setTaskTitle('');
      setTaskDate('');
      setIsModalOpen(false);
    }
  };

  const handleCheckoff = (taskId: number) => {
    checkoffTask(taskId);
  };

  const handleExport = () => {
    const data = JSON.stringify(tasks());
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checkoff_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target?.result as string);
          importTasks(imported);
        } catch (error) {
          console.error('Failed to import tasks:', error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div class="transition-colors duration-200">
      <br /><br />
      <div class="hac" style="text-align: center;">
        <img src="/img/branding/logo.png" class="homelogo hac" style="position: relative;" alt="Checkoff Logo" />
        <h1 class="text-4xl mt-2 font-black text-transparent bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text p-2">
          Checkoff
        </h1>
        <p class="font-medium theme-text-sub">Keep your tasks moving forward.</p>
        <br />
        
        <div class="flex flex-row content-center">
          <div class="bg-red-400/25 p-4 w-1/4 shadow-md theme-ring ring text-red-800 dark:text-red-400 font-black mr-2 rounded-3xl">
            <span class="text-2xl">{counts().overdue}</span><br />
            <span class="text-xs opacity-75">OVERDUE</span>
          </div>
          <div class="bg-yellow-400/25 p-4 shadow-md theme-ring ring text-yellow-800 dark:text-yellow-400 font-black w-1/4 mr-2 ml-2 rounded-3xl">
            <span class="text-2xl">{counts().todo}</span><br />
            <span class="text-xs opacity-75">TO DO</span>
          </div>
          <div class="bg-green-400/25 p-4 shadow-md theme-ring ring text-green-800 dark:text-green-400 font-black w-1/4 mr-2 ml-2 rounded-3xl">
            <span class="text-2xl">{counts().done}</span><br />
            <span class="text-xs opacity-75">DONE</span>
          </div>
          <div class="bg-blue-400/25 p-4 w-1/4 shadow-md theme-ring ring text-blue-800 dark:text-blue-400 font-black ml-2 rounded-3xl">
            <span class="text-2xl">{counts().total}</span><br />
            <span class="text-xs opacity-75">TOTAL</span>
          </div>
        </div>
        
        <br />
        
        <div
          onClick={() => setIsModalOpen(true)}
          class="theme-card transition-all mb-10 relative duration-200 hover:opacity-80 cursor-pointer flex flex-row items-center content-center p-5 w-132 pt-10 pb-10 rounded-3xl theme-text-main h-fit shadow-2xl shadow-sky-500/50"
        >
          <div class="rounded-[15px] bg-sky-400/50 mr-4 cursor-pointer text-sky-500 h-12 w-12 p-[11px] -mt-4 -mb-4 flex items-center justify-center">
            <Plus />
          </div>
          <input
            style="pointer-events: none !important;"
            type="text"
            class="bg-none cursor-pointer outline-none border-none text-sky-600 font-bold w-3/4 -mt-2 -mb-2"
            placeholder="What are you doing today?"
          />
        </div>

        <Show when={counts().overdue > 0}>
          <div class="relative left-1/2 -translate-x-1/2 flex flex-col items-center w-132 content-center justify-center">
            <div class="flex flex-row items-left w-132">
              <div class="bg-red-500 w-2 h-8 rounded-md"></div>
              <span class="font-black text-lg theme-text-main mt-0.5 ml-4">Overdue Tasks</span>
              <span class="theme-card h-8 w-8 p-1 rounded-[12px] ml-4 font-bold text-red-400 shadow-lg shadow-red-500/15">
                {counts().overdue}
              </span>
            </div>
            <br />
            <div class="flex flex-col w-full">
              <For each={overdueTasks()}>
                {(task) => <TaskItem task={task} onCheckoff={handleCheckoff} />}
              </For>
            </div>
            <br /><br />
          </div>
        </Show>

        <div class="relative left-1/2 -translate-x-1/2 flex flex-col items-center w-132 content-center justify-center">
          <div class="flex flex-row items-left w-132">
            <div class="bg-blue-400 w-2 h-8 rounded-md"></div>
            <span class="font-black text-lg theme-text-main mt-0.5 ml-4">Remaining Tasks</span>
            <span class="theme-card h-8 w-8 p-1 rounded-[12px] ml-4 font-bold text-gray-400 shadow-lg shadow-sky-500/15">
              {counts().todo}
            </span>
          </div>
          <br />
          <div class="flex flex-col w-full">
            <Show
              when={counts().todo > 0 || counts().overdue > 0}
              fallback={
                <div class="w-full rounded-4xl bg-gray-100/25 p-5 border border-dashed theme-text-sub border-gray-300 h-45 relative">
                  <div class="center-xy items-center flex-col flex text-center">
                    <PartyPopper class="scale-150 mb-4" />
                    <h1 class="font-bold text-2xl theme-text-main">Nice!</h1>
                    <p class="font-medium theme-text-sub">You're all caught up.</p>
                  </div>
                </div>
              }
            >
              <For each={todoTasks()}>
                {(task) => <TaskItem task={task} onCheckoff={handleCheckoff} />}
              </For>
            </Show>
          </div>
        </div>
        
        <br /><br />
        
        <div class="relative left-1/2 -translate-x-1/2 flex flex-col items-center w-132 content-center justify-center">
          <div class="flex flex-row items-left w-132 relative">
            <div class="bg-green-400 w-2 h-8 rounded-md"></div>
            <span class="font-black text-lg theme-text-main mt-0.5 ml-4">Completed Tasks</span>
            <span class="theme-card h-8 w-8 p-1 rounded-[12px] ml-4 font-bold text-gray-400 shadow-lg shadow-sky-500/15">
              {counts().done}
            </span>
            <button
              onClick={clearCompleted}
              class="absolute right-0 cursor-pointer transition-all duration-200 hover:bg-red-200 hover:scale-105 hover:-translate-y-0.5 mt-0.5 text-sm flex bg-red-100/50 ring ring-red-400/75 text-red-800 font-semibold p-2 h-fit w-fit rounded-[15px] -mt-1"
            >
              <Trash2 class="mt-0.5" style="height: 16px;" /> Clear
            </button>
          </div>
          <br />
          <div class="flex flex-col w-full">
            <For each={doneTasks()}>
              {(task) => <TaskItem task={task} onCheckoff={handleCheckoff} />}
            </For>
          </div>
        </div>
      </div>

      <NewTaskModal
        isOpen={isModalOpen()}
        title={taskTitle()}
        date={taskDate()}
        onTitleChange={setTaskTitle}
        onDateChange={setTaskDate}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
      />

      <div class="flex fixed flex-row-reverse bottom-4 right-4">
        <a href="https://github.com/x8rr/checkoff" target="_blank">
          <button class="cursor-pointer border-none rounded-[15px] ml-2 theme-card shadow-xl transition-all duration-200 hover:-translate-y-1 shadow-sky-500/25 flex items-center justify-center ring ring-sky-500/20 h-10 w-10">
            <Github class="scale-75 text-blue-500" />
          </button>
        </a>
        <button
          onClick={toggleTheme}
          class="cursor-pointer border-none rounded-[15px] ml-2 theme-card shadow-xl transition-all duration-200 hover:-translate-y-1 shadow-sky-500/25 flex items-center justify-center ring ring-sky-500/20 h-10 w-10"
        >
          <SunMoon class="scale-75 text-blue-500" />
        </button>
        <button
          onClick={handleExport}
          class="cursor-pointer border-none rounded-[15px] ml-2 theme-card shadow-xl transition-all duration-200 hover:-translate-y-1 shadow-sky-500/25 flex items-center h-10 px-4 text-sm font-semibold text-sky-600 ring ring-sky-500/20"
        >
          <Upload class="scale-75 text-blue-500 mr-1" /> Export
        </button>
        <button
          onClick={handleImport}
          class="cursor-pointer border-none rounded-[15px] ml-2 theme-card shadow-xl transition-all duration-200 hover:-translate-y-1 shadow-sky-500/25 flex items-center h-10 px-4 text-sm font-semibold text-sky-600 ring ring-sky-500/20"
        >
          <Download class="scale-75 text-blue-500 mr-1" /> Import
        </button>
      </div>
    </div>
  );
};

export default App;
