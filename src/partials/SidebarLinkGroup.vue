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
    const expanded = ref(props.activeCondition);

    const handleClick = () => {
      expanded.value = !expanded.value;
    };

    return {
      expanded,
      handleClick,
    };
  },
};
</script>
