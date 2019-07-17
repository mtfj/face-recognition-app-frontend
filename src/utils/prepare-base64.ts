export default (base64Str: string) => {
  base64Str = 'data:image/jpg;' + base64Str;
  base64Str = base64Str.replace('base64:', 'base64,');
  return base64Str;
};
