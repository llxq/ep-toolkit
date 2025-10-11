export const ATTRS_OPTIONS = [
  {
    label: "option1",
    value: "option1",
    type: "long",
    placeholder: "请输入option1",
  },
  {
    label: "option2",
    value: "option2",
    maxlength: 10,
    placeholder: "请输入option2",
  },
];

export const CASCADER_OPTIONS = [
  {
    value: "zhinan",
    label: "指南",
    children: [
      {
        value: "shejiyuanze",
        label: "设计原则",
        children: [
          {
            value: "yizhi",
            label: "一致",
          },
          {
            value: "fankui",
            label: "反馈",
          },
          {
            value: "xiaolv",
            label: "效率",
          },
        ],
      },
    ],
  },
];
