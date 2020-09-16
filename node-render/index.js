const fs = require('fs'),
      path = require('path'),
      playwright = require('playwright'),
      commander = require('commander'), // include commander in git clone of commander repo
      program = new commander.Command();
      
program
  .option('-f, --json-file-link <dir>' , 'json file')  
  .option('-j , --json-data-string <JSON>', 'json data-string')
  .option('-o , --output-img <dir>', 'image save to directory')
  .option('-w, --width <size>', 'image width')
  .option('-h, --height <size>', 'image height')
  .option('-p , --save-to-png', 'save to .png') 
  .parse(process.argv);
// -w 50 --> 50 // -w=50 --> =50 // --width=50 --> 50 //
// -p --> true //

const { jsonFileLink, jsonDataString, outputImg, width, height, saveToPng} = program;

var fileName = new Date().getTime();


(async () => {
  const browser = await playwright['chromium'].launch({headless:true}); //false --> will open browser page
  const context = await browser.newContext({
    viewport: {
      width: +width || 1280, 
      height: +height || 720,
    }
  });
  const page = await context.newPage();
  await context.addInitScript({
    content: `var responceData = []`
  });
  await page.goto(`file://${__dirname}/public/index.html`);   
  await page.screenshot({
    path: outputImg || `${__dirname}/renderedImg/${fileName}.jpg`,
    type: saveToPng ? 'png' : "jpeg"
 });
  await browser.close();
})();

outputImg || console.log(`output : ${__dirname}/renderedImg/${fileName}.jpg`);
