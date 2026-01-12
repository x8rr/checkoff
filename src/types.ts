export interface Task {
  id: number;
  title: string;
  dueDate: string;
  status: 'todo' | 'done';
}

export interface TaskCounts {
  todo: number;
  done: number;
  overdue: number;
}
