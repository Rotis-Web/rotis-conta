<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="isOpen = !isOpen"
      type="button"
      name="dropdownButton"
      id="dropdownButton"
      class="relative w-full cursor-pointer rounded-md border border-gray-200 bg-white py-2 pl-3 pr-10 text-center text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
    >
      <span class="block truncate text-gray-900">{{ displayValue }}</span>
      <span
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
      >
        <svg
          class="h-5 w-5 text-gray-400 transition-transform"
          :class="{ 'rotate-180': isOpen }"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          />
        </svg>
      </span>
    </button>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <ul
        v-if="isOpen"
        class="absolute z-10 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5"
      >
        <li
          v-for="option in options"
          :key="option.value"
          @click="selectOption(option)"
          class="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-indigo-50 transition-colors"
          :class="{ 'bg-indigo-100': modelValue === option.value }"
        >
          <span
            class="block truncate"
            :class="{ 'font-semibold': modelValue === option.value }"
          >
            {{ option.label }}
          </span>
          <span
            v-if="modelValue === option.value"
            class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              />
            </svg>
          </span>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
interface DropdownOption {
  value: any;
  label: string;
}

interface Props {
  modelValue: any;
  options: DropdownOption[];
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Selectează...",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "change", value: any): void;
}>();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const displayValue = computed(() => {
  const selected = props.options.find((opt) => opt.value === props.modelValue);
  return selected ? selected.label : props.placeholder;
});

const selectOption = (option: DropdownOption) => {
  emit("update:modelValue", option.value);
  emit("change", option.value);
  isOpen.value = false;
};

const closeDropdown = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>
