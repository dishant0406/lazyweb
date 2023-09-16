// const axios = require('axios')

// const formatUrl = (url) => {

//   url = url?.toLowerCase()
//   url = url?.trim();
//   // Add http:// to the beginning of the string if it doesn't already exist
//   if (!/^https?:\/\//i.test(url)) {
//     url = 'http://' + url;
//   }

//   // Remove any www. that appears at the beginning of the string
//   url = url.replace('www.','');

//   //remove / from the last
//   if(url[url.length-1]==='/'){
//     url = url.slice(0,url.length-1)
//   }

//   return url;
// }




// const addWebsiteScreenshot = async () => {
//   const {data} = await axios.get('https://api.lazyweb.rocks/api/websites')
//   const {resources} = data
//   const urls = resources.map((resource)=>resource.url)
//   console.log(urls)

//   for(let i=0;i<urls.length;i++){
//     const url = urls[i]
//     console.log(formatUrl(url))
//     const {data} = await axios.post("https://api.lazyweb.rocks/ss", {url:formatUrl(url)})
//     console.log(data)
//   }
// }

// addWebsiteScreenshot()

// const axios = require('axios');
// const readline = require('readline');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// const formatUrl = (url) => {
//   url = url?.toLowerCase();
//   url = url?.trim();
  
//   // Add http:// to the beginning of the string if it doesn't already exist
//   if (!/^https?:\/\//i.test(url)) {
//     url = 'https://' + url;
//   }

//   // Remove any www. that appears at the beginning of the string
//   url = url.replace('www.', '');

//   // Remove / from the last
//   if (url[url.length - 1] === '/') {
//     url = url.slice(0, url.length - 1);
//   }

//   return url;
// };

// const addWebsiteScreenshot = async (url) => {
//   console.log(`Formatted URL: ${formatUrl(url)}`);
//   try {
//     const { data } = await axios.post('https://api.lazyweb.rocks/ss', { url: url });
//     console.log(data);
//   } catch (error) {
//     console.error(`Error while capturing screenshot for ${url}:`, error);
//   }
// };

// const promptForURL = () => {
//   rl.question('Please enter a URL (or type "exit" to quit): ', async (input) => {
//     if (input.toLowerCase() === 'exit') {
//       rl.close();
//       return;
//     }

//     await addWebsiteScreenshot(input);
//     promptForURL();
//   });
// };

// promptForURL();
