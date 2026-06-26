export function countWords(value) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function limitWords(value, limit) {
  const words = value.trimStart().split(/\s+/).filter(Boolean);

  if (words.length <= limit) {
    return value;
  }

  return words.slice(0, limit).join(" ");
}
