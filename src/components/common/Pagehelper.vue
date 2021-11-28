<template>
  <div>
    <Page
      :total="total"
      size="small"
      :page-size="pageSize"
      @on-change="pageChange"
    />
  </div>
</template>

<script>
export default {
  name: "Pagehelper",
  props: {
    total: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 5,
    },
  },
  methods: {
    pageChange(page) {
      this.$emit("pageChanged",page)
    },
  },
};
</script>

<style scoped>
.pageStyle {
  font-size: 15px;
}
</style>
