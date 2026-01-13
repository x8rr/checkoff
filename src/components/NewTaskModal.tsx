import { Show, onMount, onCleanup, createEffect } from 'solid-js';
import flatpickr from 'flatpickr';
import type { Component } from 'solid-js';
import type { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';
import 'flatpickr/dist/flatpickr.css';

interface NewTaskModalProps {
  isOpen: boolean;
  title: string;
  date: string;
  onTitleChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const NewTaskModal: Component<NewTaskModalProps> = (props) => {
  let dateInputRef: HTMLInputElement | undefined;
  let picker: FlatpickrInstance | undefined;

  onMount(() => {
    if (!dateInputRef) return;
    picker = flatpickr(dateInputRef, {
      altInput: true,
      altFormat: 'F j, Y',
      altInputClass:
        'w-full h-14 p-4 rounded-2xl mb-4 bg-transparent border theme-border theme-text-main font-semibold shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-500/20 flatpickr-alt-input',
      dateFormat: 'Y-m-d',
      defaultDate: props.date || undefined,
      disableMobile: true,
      onChange: (_sel, str) => props.onDateChange(str),
    });
  });

  createEffect(() => {
    if (!picker) return;
    if (props.date) {
      picker.setDate(props.date, false);
    } else {
      picker.clear();
    }
  });

  onCleanup(() => {
    picker?.destroy();
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit();
  };

  return (
    <>
      <Show when={props.isOpen}>
        <div
          id="overlay"
          class="w-full h-full fixed left-0 top-0 bg-black/80 backdrop-blur-sm"
          style="z-index: 9;"
          onClick={props.onClose}
        ></div>
      </Show>
      <div
        class={`theme-card transition-all duration-200 shadow-2xl shadow-sky-500/25 p-10 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-4xl h-fit w-96 ${
          props.isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
        style="z-index: 10;"
      >
        <h1 class="text-2xl font-extrabold theme-text-main">New Task</h1>
        <br />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={props.title}
            onInput={(e) => props.onTitleChange(e.currentTarget.value)}
            class="w-full h-14 p-4 rounded-2xl mb-4 bg-transparent border theme-border theme-text-main font-semibold placeholder:font-semibold placeholder:text-slate-400 shadow-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sky-500/20"
            placeholder="What needs to be done?"
          />
          <input
            ref={(el) => (dateInputRef = el)}
            type="text"
            value={props.date}
            class="w-full h-14 p-4 rounded-2xl mb-4 bg-transparent border theme-border theme-text-main font-semibold shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-500/20"
            placeholder="Select a date (optional)"
            readonly
          />
          <div class="flex flex-row items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={props.onClose}
              class="px-5 py-2.5 rounded-[15px] ring-[1.5px] ring-gray-300/50 cursor-pointer theme-text-sub font-medium hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-2.5 rounded-[15px] cursor-pointer bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-lg shadow-sky-200"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewTaskModal;
