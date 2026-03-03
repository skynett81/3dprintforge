import https from 'node:https';
import http from 'node:http';

export async function extractPriceFromUrl(url) {
  try {
    const html = await _fetchPage(url);

    // Try JSON-LD
    const jsonLdMatches = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
    if (jsonLdMatches) {
      for (const match of jsonLdMatches) {
        const content = match.replace(/<\/?script[^>]*>/gi, '');
        try {
          const data = JSON.parse(content);
          const price = _extractPriceFromJsonLd(data);
          if (price) return { price: price.price, currency: price.currency, source: 'json-ld' };
        } catch { /* skip malformed JSON-LD */ }
      }
    }

    // Try Open Graph / meta tags
    const ogPrice = _extractMetaContent(html, 'product:price:amount') ||
                    _extractMetaContent(html, 'og:price:amount');
    const ogCurrency = _extractMetaContent(html, 'product:price:currency') ||
                       _extractMetaContent(html, 'og:price:currency');
    if (ogPrice) {
      return { price: parseFloat(ogPrice), currency: ogCurrency || 'USD', source: 'og-meta' };
    }

    // Try common price patterns in HTML
    const pricePattern = /(?:price|cost|pris)[^<]{0,50}?[\$\u20AC\u00A3\u00A5kr]\s*(\d+[.,]\d{2})/i;
    const priceMatch = html.match(pricePattern);
    if (priceMatch) {
      return { price: parseFloat(priceMatch[1].replace(',', '.')), currency: 'USD', source: 'html-pattern' };
    }

    return { price: null, error: 'no_price_found' };
  } catch (e) {
    return { price: null, error: e.message };
  }
}

function _fetchPage(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BambuDashboard/1.0)' },
      timeout
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirect = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        return resolve(_fetchPage(redirect, timeout));
      }
      let data = '';
      res.on('data', chunk => { data += chunk; if (data.length > 500_000) req.destroy(); });
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function _extractPriceFromJsonLd(data) {
  if (Array.isArray(data)) {
    for (const item of data) {
      const r = _extractPriceFromJsonLd(item);
      if (r) return r;
    }
    return null;
  }
  if (data?.['@type'] === 'Product' || data?.['@type'] === 'Offer') {
    const offers = data.offers || data;
    const price = offers?.price || offers?.lowPrice;
    const currency = offers?.priceCurrency || 'USD';
    if (price) return { price: parseFloat(price), currency };
    if (Array.isArray(offers)) {
      for (const o of offers) {
        if (o.price) return { price: parseFloat(o.price), currency: o.priceCurrency || 'USD' };
      }
    }
  }
  return null;
}

function _extractMetaContent(html, property) {
  const re = new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i');
  const altRe = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`, 'i');
  return html.match(re)?.[1] || html.match(altRe)?.[1] || null;
}
