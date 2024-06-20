<script setup lang="ts" generic="T extends any, O extends any">
import JsonTreeView from '~/components/JsonTreeView.vue'

defineOptions({
  name: 'IndexPage',
})

const json = ref(`{"bigint":124124124124124124124,"boolean":true,"number":123.456,"string":"Hello World!","null":null,"time":1575599819000,"longstring": "HelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorldHelloWorld","color":"#b0a4e3","array":[1,2],"record":{"a":"b","c":"d"}}`)
</script>

<template>
  <div class="grid grid-cols-2 gap-2">
    <JsonTreeView :json="json" />
    <textarea v-model="json" class="h-64 w-full" />
  </div>
</template>
