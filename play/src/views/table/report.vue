<script setup lang="tsx">
import { type ITableItem, useTableApi } from "@play/apis/table.ts";
import {
  createFormItem,
  EFormComponentType,
  useCreateFormBuilder,
  useCreateTableBuilder,
} from "ep-toolkit";

const { getTableList, updateTableItem, deleteTableItem } = useTableApi();

// 搜索表单配置
const { formBuilder } = useCreateFormBuilder([
  createFormItem({
    tag: EFormComponentType.INPUT,
    label: "报告标题",
    prop: "title",
    attrs: {
      placeholder: "请输入报告标题",
      clearable: true,
    },
    span: 6,
  }),
  createFormItem({
    tag: EFormComponentType.SELECT,
    label: "状态",
    prop: "status",
    attrs: {
      placeholder: "请选择状态",
      clearable: true,
      options: [
        { label: "已发布", value: "published" },
        { label: "草稿", value: "draft" },
        { label: "已删除", value: "deleted" },
      ],
    },
    span: 6,
  }),
  createFormItem({
    tag: EFormComponentType.DATE_RANGE,
    label: "创建时间",
    prop: "dateRange",
    span: 8,
  }),
]);

// 表格数据
const { tableBuilder, refresh } = useCreateTableBuilder<ITableItem>(
  [
    {
      type: "index",
      width: "60",
      label: "序号",
    },
    {
      label: "报告标题",
      prop: "title",
      showOverflowTooltip: true,
    },
    {
      label: "类型",
      prop: "type",
      width: "120",
    },
    {
      label: "状态",
      prop: "status",
      width: "120",
      contentRender: (_, row) => {
        const statusMap = {
          published: { type: "success", text: "已发布" },
          draft: { type: "warning", text: "草稿" },
          deleted: { type: "danger", text: "已删除" },
        };
        const status = statusMap[row.status] || {
          type: "info",
          text: row.status,
        };
        return <el-tag type={status.type}>{status.text}</el-tag>;
      },
    },
    {
      label: "作者",
      prop: "author",
      width: "120",
    },
    {
      label: "创建日期",
      prop: "date",
      width: "180",
    },
    {
      label: "操作",
      width: "200",
      fixed: "right",
      contentRender: (_, row) => (
        <div class="action-buttons">
          <el-button
            type="primary"
            link
            onClick={async () => {
              await updateTableItem(row.id, { status: "published" });
              refresh();
            }}
          >
            编辑
          </el-button>
          <el-button
            type="success"
            link
            onClick={async () => {
              await updateTableItem(row.id, { status: "published" });
              refresh(true);
            }}
          >
            {row.status === "published" ? "取消发布" : "发布"}
          </el-button>
          <el-button
            type="danger"
            link
            onClick={async () => {
              await deleteTableItem(row.id);
              refresh(true);
            }}
          >
            删除
          </el-button>
        </div>
      ),
    },
  ],
  {
    formBuilder,
    loadMethod: (pagination) =>
      getTableList({
        ...pagination,
        ...formBuilder.getFormatData(),
      }),
  },
);
</script>

<template>
  <div class="report__container">
    <CSearchForm :form-builder="formBuilder"></CSearchForm>
    <CTable :table-builder="tableBuilder"></CTable>
  </div>
</template>

<style scoped lang="scss">
.report__container {
  padding: 16px 24px;
}
</style>
