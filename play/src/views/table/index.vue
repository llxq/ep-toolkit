<script setup lang="tsx">
import {
  type ICTableColumn,
  STICKY_CONTAINER_CLASS,
  useCreateTableBuilder,
} from "ep-toolkit";

defineOptions({
  name: "PlayTable",
});

const updateData = (row: Record<string, string>) => {
  console.log(row);
};
const deleteData = (row: Record<string, string>) => {
  console.log(row);
};

const columns: ICTableColumn[] = [
  {
    type: "index",
  },
  {
    label: "自定义",
    contentRender: (_, row) => {
      return row.label + "-自定义";
    },
  },
  {
    label: "ID",
    prop: "id",
    draggable: true,
  },
  {
    label: "文本",
    prop: "label",
    /**
     * 支持 el-table-column 的所有属性
     */
    showOverflowTooltip: true,
  },
  {
    label: "操作",
    contentRender: (_, row) => [
      <el-button type="primary" link onClick={() => updateData(row)}>
        修改
      </el-button>,
      <el-button type="danger" link onClick={() => deleteData(row)}>
        删除
      </el-button>,
    ],
  },
];

const { tableBuilder, registerEvent } = useCreateTableBuilder(columns, {
  headerCellStyle: {
    background: "#fafafc",
  },
  loadMethod: (pagination) => {
    const data = Array.from({ length: 10 * pagination.current }).map(
      (_, index) => ({
        id: (index + 1).toString(),
        label: "文本",
      }),
    );
    return {
      data,
      total: 100,
    };
  },
});
registerEvent("pagination:change", (a: string) => {
  console.log("pagination trigger", a);
});
</script>

<template>
  <div :class="['play-table__container', STICKY_CONTAINER_CLASS]">
    <CTable :table-builder="tableBuilder" />
  </div>
</template>

<style scoped lang="scss">
.play-table__container {
  //
}
</style>
