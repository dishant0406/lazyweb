//unformat the url remove https:// and www from the string if present
const unFormatUrl = (url:string) => {
  url = url.toLowerCase()
  // Remove any https:// that appears at the beginning of the string
  url = url.replace('https://','');
  url = url.replace('http://','');
  // Remove any www. that appears at the beginning of the string
  url = url.replace('www.','');

  url = url.split('/')[0]
  
  return url;
}

export {
  unFormatUrl
}