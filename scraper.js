const puppeteer = require('puppeteer');
const fs = require('fs');
const UTH_URL = 'http://www.mie.uth.gr/';

async function getINFO(type, message) {
    console.log(`getting ${type} nigga`);

    // Initiate puppeteer browser
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(UTH_URL, { waitUntil: 'networkidle0' });

    if (type == 'nea') {
        await page.click('#news_table > tbody > tr > td:nth-child(1) > div > div > ul > li:nth-child(1) > a');
        await page.setViewport({ width: 412, height: 892 });
        await page.screenshot({
            path: "./nea.jpg",
            type: "jpeg",
            fullPage: true
        });
    }
    else if (type == 'ekd') {
        await page.click('#news_table > tbody > tr > td:nth-child(2) > div > div > ul > li:nth-child(1) > a');
        await page.setViewport({ width: 412, height: 892 });
        await page.screenshot({
            path: "./ekd.jpg",
            type: "jpeg",
            fullPage: true
        });
    }
    else if (type == 'ana') {
        await page.click('#news_table > tbody > tr > td:nth-child(3) > div > div > ul > li:nth-child(1) > a');
        await page.setViewport({ width: 412, height: 892 });
        await page.screenshot({
            path: "./ana.jpg",
            type: "jpeg",
            fullPage: true
        });
    }

    await browser.close();

    await message.channel.send('Nea: ' + UTH_URL, { files: [`./${type}.jpg`] });
    await fs.unlink(`./${type}.jpg`, err => {
        if (err) {
            console.log(err);
            return;
        }
    })
}

module.exports.getINFO = getINFO;