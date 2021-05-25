<template>
  <div class="autocomplete">
    <div
      @click="chooseValue(item)"
      class="autocomplete_item"
      v-for="(item, i) of items"
      :key="i"
    >
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array
    },
    chooseValue: { type: Function }
  },
  name: 'Autocompete'
}
</script>
