const { Builder, By, Key, until } = require('selenium-webdriver');
const readline = require('readline');

const driver = new Builder().forBrowser('firefox').build();
const blogUrl = 'https://cfi.iitm.ac.in/blog';
const searchInputSelector = '#search';
const tagFilterSelector = '#tag-filter';
const clubFilterSelector = '#club-filter';

async function performCFIBlogSearch(searchQuery, tagFilter, clubFilter) {
  try {
    await driver.get(blogUrl);
    
    const searchInput = await driver.findElement(By.css(searchInputSelector));
    const tagFilterInput = await driver.findElement(By.css(tagFilterSelector));
    const clubFilterInput = await driver.findElement(By.css(clubFilterSelector));

    await searchInput.sendKeys(searchQuery, Key.RETURN);

    await driver.wait(until.titleIs('Search Results - CFI IITM'), 10000);

    if (tagFilter) {
      await tagFilterInput.sendKeys(tagFilter);
    }

    if (clubFilter) {
      await clubFilterInput.sendKeys(clubFilter);
    }
    const results = await driver.findElements(By.css('.search-results-list-item'));
    if (results.length > 0) {
      await results[0].click();
    } else {
      console.log('No search results found.');
    }

    await driver.quit();
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter your blog search query: ', (searchQuery) => {
  rl.question('Enter the tag filter (leave empty if none): ', (tagFilter) => {
    rl.question('Enter the club filter (leave empty if none): ', (clubFilter) => {
      performCFIBlogSearch(searchQuery, tagFilter, clubFilter);
      rl.close();
    });
  });
});

