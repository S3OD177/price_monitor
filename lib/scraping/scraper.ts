import * as cheerio from 'cheerio';

export interface ScrapedData {
    price: number;
    currency: string;
    title?: string;
    image?: string;
}

export async function scrapeProduct(url: string, selector?: string): Promise<ScrapedData | null> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch ${url}: ${response.statusText}`);
            return null;
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        let price = 0;
        let currency = 'SAR'; // Default
        let title = $('title').text().trim();
        let image = $('meta[property="og:image"]').attr('content') || '';

        // Heuristic for price if no selector provided
        if (!selector) {
            // Try common price selectors
            const priceText = $('.price, .product-price, [itemprop="price"]').first().text();
            if (priceText) {
                const match = priceText.match(/[\d,.]+/);
                if (match) {
                    price = parseFloat(match[0].replace(/,/g, ''));
                }
            }
        } else {
            const priceText = $(selector).text();
            const match = priceText.match(/[\d,.]+/);
            if (match) {
                price = parseFloat(match[0].replace(/,/g, ''));
            }
        }

        return {
            price,
            currency,
            title,
            image
        };

    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return null;
    }
}
