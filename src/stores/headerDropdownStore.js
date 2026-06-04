// src/stores/headerDropdownStore.js
// Store ringan untuk mengkoordinasikan dropdown di Header agar saling menutup
import { ref } from 'vue';

// ID dropdown yang sedang terbuka. null = semuanya tertutup.
const activeDropdown = ref(null);

export function useHeaderDropdown(id) {
  const isOpen = () => activeDropdown.value === id;

  const open = () => {
    activeDropdown.value = id;
  };

  const close = () => {
    if (activeDropdown.value === id) {
      activeDropdown.value = null;
    }
  };

  const toggle = () => {
    if (activeDropdown.value === id) {
      activeDropdown.value = null;
    } else {
      activeDropdown.value = id;
    }
  };

  const closeAll = () => {
    activeDropdown.value = null;
  };

  return { activeDropdown, isOpen, open, close, toggle, closeAll };
}
