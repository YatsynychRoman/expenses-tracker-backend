export default (prefix: string, path: string) => {
  return new URLPattern({ pathname: `/${prefix}/${path}`});
}
