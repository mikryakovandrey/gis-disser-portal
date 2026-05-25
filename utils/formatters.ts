export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function formatTemperature(value: number) {
  return `${value.toFixed(1)} C`;
}

export function formatYield(value: number) {
  return `${value.toFixed(1)} t/ha`;
}

export function formatArea(value: number) {
  return `${value.toFixed(1)} ha`;
}
