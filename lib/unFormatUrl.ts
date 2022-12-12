//unformat the url remove https:// and www from the string if present
const unFormatUrl = (url:string) => {
  url = url.toLowerCase()
  // Remove any https:// that appears at the beginning of the string
  url = url.replace('https://','');
  // Remove any www. that appears at the beginning of the string
  url = url.replace('www.','');
  return url;
}

export {
  unFormatUrl
}