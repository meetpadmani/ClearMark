const youtubedl = require('youtube-dl-exec');

const testUrl = 'https://www.instagram.com/p/DBh8wF6o_mP/';

async function testAll() {
  console.log("1. Testing youtube-dl-exec for Instagram...");
  try {
    const res = await youtubedl(testUrl, { dumpJson: true, noWarnings: true });
    console.log("SUCCESS:");
    console.log("Title:", res.title);
    console.log("URL:", res.url);
    console.log("Thumbnail:", res.thumbnail);
    console.log("Ext:", res.ext);
  } catch (e) {
    console.error("FAILED:", e.message);
  }
}

testAll();
