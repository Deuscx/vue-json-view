<script setup lang="ts">
import { computed } from 'vue'
import type { ItemData, PrimitiveTypes, SelectedData } from './types'
import { ItemType } from './types'

type ColorScheme = 'light' | 'dark'

interface Props {
  json: string
  rootKey?: string
  maxDepth?: number
  colorScheme?: ColorScheme
}

defineOptions({
  name: 'JsonTreeView',
})

const props = withDefaults(defineProps<Props>(), {
  rootKey: '/',
  maxDepth: 1,
  colorScheme: 'light',
})

const emit = defineEmits<{
  (e: 'selected', value: SelectedData): void
}>()

const onSelected = (selectedData: SelectedData): void => emit('selected', selectedData)

function build(key: string, value: PrimitiveTypes | Record<string, any>, depth: number, path: string, includeKey: boolean): ItemData {
  if (value instanceof Object) {
    if (Array.isArray(value)) {
      const children = value.map((element, index) =>
        build(
          index.toString(),
          element,
          depth + 1,
          includeKey ? `${path}${key}[${index}].` : `${path}`,
          false,
        ),
      )
      return {
        key,
        type: ItemType.ARRAY,
        depth,
        path,
        length: children.length,
        children,
      }
    }

    const children = Object.entries(value).map(([childKey, childValue]) =>
      build(childKey, childValue, depth + 1, includeKey ? `${path}${key}.` : `${path}`, true),
    )
    return {
      key,
      type: ItemType.OBJECT,
      depth,
      path,
      length: children.length,
      children,
    }
  }
  else {
    return {
      key,
      type: ItemType.VALUE,
      path: includeKey ? `${path}${key}` : path.slice(0, -1),
      depth,
      value,
    }
  }
}

const parsed = computed((): ItemData => {
  const data = JSON.parse(props.json)
  if (data instanceof Object) {
    return build(props.rootKey, { ...data }, 0, '', true)
  }
  return {
    key: props.rootKey,
    type: ItemType.VALUE,
    path: '',
    depth: 0,
    value: props.json,
  }
})
</script>

<template>
  <JsonTreeViewItem
    class="root-item" :class="[{ dark: colorScheme === 'dark' }]" :data="parsed" :max-depth="maxDepth"
    @selected="onSelected"
  />
</template>

<style lang="scss" scoped>
.root-item {
  --jtv-key-color: #0977e6;
  --jtv-valueKey-color: #073642;
  --jtv-string-color: #268bd2;
  --jtv-number-color: #2aa198;
  --jtv-boolean-color: #cb4b16;
  --jtv-null-color: #6c71c4;
  --jtv-arrow-size: 6px;
  --jtv-arrow-color: #444;
  --jtv-hover-color: rgba(0, 0, 0, 0.1);
  margin-left: 0;
  width: 100%;
  height: auto;
  background: rgba(46, 46, 56, 0.04);
  border: 1px solid rgba(29, 28, 35, 0.08);
  border-radius: 8px;
  font-size: 14px;
  padding: 4px 8px;
}

.root-item.dark {
  --jtv-key-color: #80d8ff;
  --jtv-valueKey-color: #fdf6e3;
  --jtv-hover-color: rgba(255, 255, 255, 0.1);
  --jtv-arrow-color: #fdf6e3;
}
</style>
