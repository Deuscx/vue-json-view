<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { ItemData, PrimitiveTypes, SelectedData } from './types'
import { ItemType } from './types'
// import { then, when } from 'switch-ts'
export interface Props {
  data: ItemData
  maxDepth?: number
  canSelect?: boolean
}

defineOptions({
  name: 'JsonTreeViewItem',
})

const props = withDefaults(defineProps<Props>(), {
  maxDepth: 1,
  canSelect: false,
})

const emit = defineEmits<{
  (e: 'selected', value: SelectedData): void
}>()

const state = reactive({
  open: props.data.depth < props.maxDepth,
})

function toggleOpen(): void {
  state.open = !state.open
}

function onClick(data: ItemData): void {
  return emit('selected', {
    key: data.key,
    value: data.value,
    path: data.path,
  } as SelectedData)
}

const onSelected = (data: SelectedData): void => emit('selected', data)

function getKey(itemDate: ItemData): string {
  const keyValue = Number(itemDate.key)
  return !Number.isNaN(keyValue) ? `${itemDate.key}":` : `"${itemDate.key}":`
}

function getValueColor(value: PrimitiveTypes): string {
  if (typeof value === 'string') {
    return 'var(--jtv-string-color)'
  }
  else if (typeof value === 'number') {
    return 'var(--jtv-number-color)'
  }
  else if (typeof value === 'boolean') {
    return 'var(--jtv-boolean-color)'
  }
  else if (value === null) {
    return 'var(--jtv-null-color)'
  }
  else {
    return 'var(--jtv-valueKey-color)'
  }
}

const classes = computed((): unknown => {
  return {
    'i-carbon-chevron-right': true,
    'rotate-90': state.open,
  }
})

const valueClasses = computed((): unknown => {
  return {
    'value-key': true,
    'can-select': props.canSelect,
  }
})

const lengthString = computed((): string => {
  const length = props.data.length
  return length ? `{${length}}` : ''
})

const dataValue = computed((): string => JSON.stringify(props.data.value))
</script>

<template>
  <div class="json-view-item">
    <div v-if="data.type === ItemType.OBJECT || data.type === ItemType.ARRAY">
      <button
        v-if="data.depth > 0"
        class="data-key"
        :aria-expanded="state.open ? 'true' : 'false'"
        @click.stop="toggleOpen"
      >
        <div :class="classes" />
        {{ data.key }}
        <span v-if="!state.open" class="properties">:{{ lengthString }}</span>
      </button>
      <div v-if="state.open">
        <JsonTreeViewItem
          v-for="child in data.children"
          :key="getKey(child)"
          :data="child"
          :max-depth="maxDepth"
          :can-select="canSelect"
          @selected="onSelected"
        />
      </div>
    </div>
    <div
      v-if="data.type === ItemType.VALUE"
      :class="valueClasses"
      :role="canSelect ? 'button' : undefined"
      :tabindex="canSelect ? '0' : undefined"
      @click="onClick(data)"
      @keyup.enter="onClick(data)"
      @keyup.space="onClick(data)"
    >
      <span class="value-key">{{ data.key }}:</span>
      <span :style="{ color: getValueColor(data.value as PrimitiveTypes) }" class="whitespace-pre-wrap">
        {{ dataValue }}
      </span>
    </div>
  </div>
</template>

<style lang="scss">
.value-key {
  color: var(--jtv-valueKey-color);
  margin-left: 10px;
  border-radius: 2px;
  white-space: nowrap;
  padding: 2px 2px 2px 0px;
  overflow-wrap: anywhere;
  &.can-select {
    cursor: pointer;
  }
}
.data-key {
  font-size: 100%;
  font-family: inherit;
  background-color: transparent;
  width: 100%;
  color: var(--jtv-key-color);
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
  padding: 2px;

  .properties {
    font-weight: 300;
    opacity: 0.9;
    margin-left: 4px;
    user-select: none;
  }
}
</style>
