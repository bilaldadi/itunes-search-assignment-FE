export function debounce<Args extends unknown[], ReturnType>(
  func: (...args: Args) => ReturnType,
  delay: number
): (...args: Args) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

