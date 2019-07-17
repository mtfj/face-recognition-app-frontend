export default (base64String: string) => {
  base64String = base64String.replace('data:image/jpeg;', '');
  base64String = base64String.replace('base64,', 'base64:');
  return base64String;
};
