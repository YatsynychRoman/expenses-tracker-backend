export default (prefix: string, path?: string) => {
  if (!path || path === '') {
    return new URLPattern({ pathname: `/${prefix}`});
  }
  return new URLPattern({ pathname: `/${prefix}/${path}`});
}
