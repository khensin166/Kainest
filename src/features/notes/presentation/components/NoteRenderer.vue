<template>
  <div class="note-content prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200" v-html="renderedHtml">
  </div>
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

  try {
    // Clone to remove Vue Proxies which might confuse editorjs-html
    const cleanContent = JSON.parse(JSON.stringify(props.content));

    // Parse JSON dari Editor.js
    const parsed = parser.parse(cleanContent);

    // Handle response if it's an array (standard) or string (edge case)
    if (Array.isArray(parsed)) {
      return parsed.join('');
    } else if (typeof parsed === 'string') {
      return parsed;
    } else {
      console.warn("Unexpected parser output:", parsed);
      return '<p>Format konten tidak dikenali.</p>';
    }
  } catch (err) {
    console.error("NoteRenderer parsing error:", err);
    return '<p>Error rendering content.</p>';
  }
});
</script>

<style>
/* Style tambahan untuk blok yang tidak ditangani 'prose', 
  seperti gambar dari Editor.js
*/
.image-tool__image-picture {
  max-width: 100%;
  border-radius: 0.5rem;
  /* 8px */
  margin-left: auto;
  margin-right: auto;
}

.image-tool__caption {
  text-align: center;
  font-style: italic;
  color: #6b7280;
  /* gray-500 */
}

/* Style tambahan untuk blok yang tidak ditangani 'prose' atau jika plugin tidak ada */
.note-content h1 {
  font-size: 2.25em;
  font-weight: 800;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.1;
}

.note-content h2 {
  font-size: 1.875em;
  font-weight: 700;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.3;
}

.note-content h3 {
  font-size: 1.5em;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.4;
}

.note-content p {
  margin-top: 1em;
  margin-bottom: 1em;
  line-height: 1.75;
}

.note-content ul {
  list-style-type: disc;
  padding-left: 1.625em;
  margin-top: 1em;
  margin-bottom: 1em;
}

.note-content ol {
  list-style-type: decimal;
  padding-left: 1.625em;
  margin-top: 1em;
  margin-bottom: 1em;
}

.note-content li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding-left: 0.375em;
}

.note-content a {
  color: #7c3aed;
  /* violet-600 */
  text-decoration: underline;
}

.note-content blockquote {
  font-weight: 500;
  font-style: italic;
  border-left-width: 0.25rem;
  border-left-color: #e5e7eb;
  /* gray-200 */
  margin-top: 1.6em;
  margin-bottom: 1.6em;
  padding-left: 1em;
}

.dark .note-content blockquote {
  border-left-color: #374151;
  /* gray-700 */
}

.image-tool__image-picture {
  max-width: 100%;
  border-radius: 0.5rem;
  /* 8px */
  margin-left: auto;
  margin-right: auto;
  margin-top: 2em;
}

.image-tool__caption {
  text-align: center;
  font-style: italic;
  color: #6b7280;
  /* gray-500 */
  margin-top: 0.5em;
  margin-bottom: 2em;
}

/* Dark mode adjustments applied via parent 'dark' class */
.dark .note-content h1,
.dark .note-content h2,
.dark .note-content h3,
.dark .note-content strong,
.dark .note-content b {
  color: #f3f4f6;
  /* gray-100 */
}

.dark .note-content p,
.dark .note-content ul,
.dark .note-content ol,
.dark .note-content li {
  color: #d1d5db;
  /* gray-300 */
}
</style>