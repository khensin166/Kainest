<template>
  <div>
    <slot :expanded="expanded" :handleClick="handleClick"></slot>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "SidebarLinkGroup",
  props: {
    activeCondition: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    console.log("SidebarLinkGroup loaded"); // Debugging
    const expanded = ref(props.activeCondition);

    const handleClick = () => {
      console.log("handleClick called, expanded:", expanded.value); // Debugging
      expanded.value = !expanded.value;
    };

    return {
      expanded,
      handleClick,
    };
  },
};
</script>
