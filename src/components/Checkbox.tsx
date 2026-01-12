import type { Component } from 'solid-js';

interface CheckboxProps {
  checked: boolean;
  disabled?: boolean;
  onChange?: () => void;
}

const Checkbox: Component<CheckboxProps> = (props) => {
  return (
    <label class="ios-checkbox top-1/2 translate-y-1/4 blue relative mr-1 mt-1">
      <input
        type="checkbox"
        checked={props.checked}
        disabled={props.disabled}
        onChange={props.onChange}
      />
      <div class="checkbox-wrapper">
        <div class="checkbox-bg"></div>
        <svg class="checkbox-icon" viewBox="0 0 24 24" fill="none">
          <path
            class="check-path"
            d="M4 12L10 18L20 6"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </div>
    </label>
  );
};

export default Checkbox;
