export interface IStyle {
  style?: Partial<CSSStyleDeclaration> | string;
  className?: string;
}

export type TEvent = {
  // event 类型因为 vue 经过了处理不好定义暂时定义为 any
  [key in keyof DocumentEventMap]?: (event: TAllType) => void;
} & TObj<string, (event: TAllType) => void> & {
    suffixClick?: () => void;
  };

export type TOptions<T extends TObj = TObj> = ({
  value?: any;
  label?: string;
  disabled?: boolean;
  children?: TOptions<T>;
} & T)[];

export type TOptionsReturn<T extends TObj = TObj> =
  | TOptions<T>
  | (() => TOptions<T> | Promise<TOptions<T>>);
