const fs = require('fs'),
      playwright = require('playwright'),
      commander = require('commander'), // include commander in git clone of commander repo
      program = new commander.Command();

program
  .option('-f, --json-file-link <dir>' , 'json file')
  .option('-j , --json-data-string <JSON>', 'json data-string')
  .option('-o , --output-renderedImg <dir>', 'image save to directory')
  .option('-w, --width <size>', 'image width')
  .option('-h, --height <size>', 'image height')
  .option('-z, --zoom <value>', 'zoom in')
  .option('-p , --save-to-png', 'save to .png')
  .parse(process.argv);
// -w 50 --> 50 // -w=50 --> =50 // --width=50 --> 50 //
// -p --> true //

const { jsonFileLink, jsonDataString, outputImg, width, height, saveToPng,zoom} = program;

var fileName = new Date().getTime();

let responceData

if(jsonFileLink || jsonDataString ){

  if (jsonFileLink) {
    fs.readFile(`${jsonFileLink}`, 'utf8', function (err, data) {
      if (err) throw err;
      responceData = data;
    });
  }
  if(jsonDataString){
    responceData = jsonDataString;
  }

  (async () => {
    const browser = await playwright['chromium'].launch({headless: true}); //false --> will open browser page // for debug
    const context = await browser.newContext({
      viewport: {
        width: +width || 1200,
        height: +height || 768,
      }
    });
    const page = await context.newPage();
    await context.addInitScript({
      content: `var responceData = ${responceData};
                var zoomIn = ${zoom ? zoom : 0}`
    });
    await page.goto(`file://${__dirname}/public/index.html`);
    await page.screenshot({
      path: outputImg || `${__dirname}/renderedImg/${fileName}.${saveToPng ? 'png' : 'jpg'}`
    });
    await browser.close();//remove in case of error
  })(); 
}
outputImg || console.log(`output : ${__dirname}/renderedImg/${fileName}.jpg`);
