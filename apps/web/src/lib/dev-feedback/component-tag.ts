export function devComponentProps(name: string, file: string) {
  if (process.env.NODE_ENV !== 'development') {
    return {};
  }

  return { 'data-component': name, 'data-component-file': file };
}
