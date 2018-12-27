const path = require('path')
const pti = require('puppeteer-to-istanbul')

;(async () => {
  const puppeteer = require('puppeteer')
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Enable both JavaScript and CSS coverage
  await Promise.all([
    page.coverage.startJSCoverage(),
    page.coverage.startCSSCoverage()
  ])

  // Navigate to page
  let url = 'file:///' + path.resolve('./index.html')
  await page.goto(url)

  // Disable JavaScript coverage
  const jsCoverage = await page.coverage.stopJSCoverage()
  let totalBytes = 0;
  let usedBytes = 0;
  const coverage = [...jsCoverage];
  for (const entry of coverage) {
    totalBytes += entry.text.length;
    console.log(`js fileName= ${entry.url}`);
    for (const range of entry.ranges){
      usedBytes += range.end - range.start - 1;
    }
  }
  console.log(`Bytes used: ${usedBytes / totalBytes * 100}%`);
  pti.write(jsCoverage)
  await browser.close()
})()
