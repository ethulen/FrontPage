//index.js
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const axios = require("axios");
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


async function requestAPI(url) {
	let result = await axios({
		url:
			"https://api.zenrows.com/v1/?apikey=f53912d65154c6a743ec78009cb38332a05d6744&url=" +
			encodeURLComponent(url),
		method: "GET",
	})
	return result
}


app.post("/api/url", (req, res) => {
    const { url } = req.body;

    (async () => {
        let scrape = await requestAPI(url)
        console.log(scrape)
        // const browser = await puppeteer.launch();
        // const page = await browser.newPage();
        // await page.goto(url);
        // const websiteContent = await page.evaluate(() => {
        //     return document.documentElement.innerText.trim();
        // });
        // const websiteOgImage = await page.evaluate(() => {
        //     const metas = document.getElementsByTagName("meta");
        //     for (let i = 0; i < metas.length; i++) {
        //         if (metas[i].getAttribute("property") === "og:image") {
        //             return metas[i].getAttribute("content");
        //         }
        //     }
        // });
        // //accepts the website content as a parameter
        // let result = await chatgptFunction(websiteContent);
        // //adds the brand image and ID to the result
        // result.brandImage = websiteOgImage;
        // result.id = generateID();
        // //adds the result to the array
        // database.push(result);
        // //returns the results
        // return res.json({
        //     message: "Request successful!",
        //     database,
        // });

        // await browser.close();
    })();
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});