export const firstUppercase = (str: string) => {
  if (!str) return ''
  return `${str.substr(0, 1).toUpperCase()}${str.substr(1).toLowerCase()}`
}
