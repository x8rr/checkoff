import type { Component } from 'solid-js';
import type { Task } from '../types';
import Checkbox from './Checkbox';
import { Calendar } from 'lucide-solid';

interface TaskItemProps {
  task: Task;
  onCheckoff: (taskId: number) => void;
}

const TaskItem: Component<TaskItemProps> = (props) => {
  const isDone = () => props.task.status === 'done';
  
  const taskDate = () => 
    props.task.dueDate ? new Date(props.task.dueDate).setHours(0, 0, 0, 0) : null;
  
  const isOverdue = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    return !isDone() && taskDate() && taskDate()! < today;
  };

  const dateColor = () => isOverdue() ? 'text-red-500' : 'theme-text-sub';

  return (
    <div class={`theme-card shadow-2xl flex flex-row items-start mb-4 shadow-sky-500/25 w-full p-5 rounded-3xl ${isDone() ? 'opacity-25' : ''}`}>
      <Checkbox
        checked={isDone()}
        disabled={isDone()}
        onChange={() => !isDone() && props.onCheckoff(props.task.id)}
      />
      <div class="flex flex-col ml-3 text-left">
        <span class="font-bold theme-text-main text-[17px] mt-0.5">{props.task.title}</span>
        {props.task.dueDate && (
          <div class={`text-xs ${dateColor()} font-bold flex items-center mt-1`}>
            <Calendar class="w-3 h-3 mr-1" />
            {props.task.dueDate}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
