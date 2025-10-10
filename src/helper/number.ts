/**
 * long 最大值
 */
export const LONG_MAX_VALUE = BigInt("9223372036854775807");

/**
 * 处理一个id是否大于long最大值，如果大于，则返回最大值-1，否者返回本身
 */
export const handleLongMaxValue = (id: string) => {
  const numberStringId = id.replace(/[^0-9]/g, "");
  if (numberStringId && BigInt(numberStringId) > LONG_MAX_VALUE) {
    return numberStringId.slice(0, -1);
  }
  return numberStringId;
};
