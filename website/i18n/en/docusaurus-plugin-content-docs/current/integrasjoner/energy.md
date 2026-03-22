---
sidebar_position: 2
title: Electricity Price
description: Connect to Tibber or Nordpool for live hourly prices, price history, and price alerts
---

# Electricity Price

The electricity price integration fetches live electricity prices from Tibber or Nordpool to provide accurate electricity cost calculations per print and alerts about good or bad times for printing.

Go to: **https://localhost:3443/#settings** → **Integrations → Electricity Price**

## Tibber integration

Tibber is a Nordic electricity provider with an open API for spot prices.

### Setup

1. Log in at [developer.tibber.com](https://developer.tibber.com)
2. Generate a **Personal Access Token**
3. In Bambu Dashboard: paste the token under **Tibber API Token**
4. Select **Home** (where prices should be fetched from, if you have multiple homes)
5. Click **Test connection**
6. Click **Save**

### Available data from Tibber

- **Spot price now** — instant price incl. taxes (currency/kWh)
- **Prices next 24 hours** — Tibber delivers tomorrow's prices from approx. 13:00
- **Price history** — up to 30 days back
- **Cost per print** — calculated from actual print time × hourly prices

## Nordpool integration

Nordpool is the energy exchange delivering raw spot prices for the Nordic region.

### Setup

1. Go to **Integrations → Nordpool**
2. Select **Price area**: NO1 (Oslo) / NO2 (Kristiansand) / NO3 (Trondheim) / NO4 (Tromsø) / NO5 (Bergen)
3. Select **Currency**: NOK / EUR
4. Select **Taxes and fees**:
   - Check **Include VAT** (25%)
   - Fill in **Grid tariff** (currency/kWh) — see invoice from your grid operator
   - Fill in **Energy tax** (Elavgift, currency/kWh)
5. Click **Save**

:::info Grid tariff
The grid tariff varies by grid operator and pricing model. Check your latest electricity bill for the correct rate.
:::

## Hourly prices

Hourly prices are shown as a bar chart for the next 24–48 hours:

- **Green** — cheap hours (below average)
- **Yellow** — average price
- **Red** — expensive hours (above average)
- **Grey** — hours without available price forecast

Hover over an hour to see the exact price (currency/kWh).

## Price history

Go to **Electricity Price → History** to see:

- Daily average price for the last 30 days
- Most expensive and cheapest hour per day
- Total electricity cost for prints per day

## Price alerts

Set up automatic alerts based on electricity price:

1. Go to **Electricity Price → Price alerts**
2. Click **New alert**
3. Choose alert type:
   - **Price below threshold** — alert when electricity price falls below X currency/kWh
   - **Price above threshold** — alert when price rises above X currency/kWh
   - **Cheapest hour today** — alert when today's cheapest hour starts
4. Choose notification channel
5. Click **Save**

:::tip Smart scheduling
Combine price alerts with the print queue: set up an automation that dispatches queue jobs automatically when the electricity price is low (requires webhook integration or Home Assistant).
:::

## Electricity price in cost calculator

Activated electricity price integration provides accurate electricity costs in the [Cost Calculator](../analyse/costestimator). Select **Live price** instead of fixed price to use the current Tibber/Nordpool price.
