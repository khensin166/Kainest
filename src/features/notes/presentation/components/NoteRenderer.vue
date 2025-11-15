<template>
  <div class="prose dark:prose-invert max-w-none" v-html="renderedHtml"></div>
</template>

<script setup>
import { computed } from 'vue';
import edjsHTML from 'editorjs-html';

const props = defineProps({
  content: {
    type: Object,
    required: true,
    default: () => ({ blocks: [] })
  }
});

// Inisialisasi parser. Anda bisa mengonfigurasinya
// untuk me-render tools kustom jika perlu.
const parser = edjsHTML();

const renderedHtml = computed(() => {
  if (!props.content || !props.content.blocks || props.content.blocks.length === 0) {
    return '<p>Konten tidak tersedia.</p>';
  }
  
  // Parse JSON dari Editor.js menjadi array string HTML
  const htmlBlocks = parser.parse(props.content);
  
  // Gabungkan semua blok HTML menjadi satu string
  return htmlBlocks.join('');
});
</script>

<style>
/* Style tambahan untuk blok yang tidak ditangani 'prose', 
  seperti gambar dari Editor.js
*/
.image-tool__image-picture {
  max-width: 100%;
  border-radius: 0.5rem; /* 8px */
  margin-left: auto;
  margin-right: auto;
}
.image-tool__caption {
  text-align: center;
  font-style: italic;
  color: #6b7280; /* gray-500 */
}
</style>