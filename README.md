# Happy JS Farm

A simple farming simulation game built with vanilla JavaScript, HTML, and CSS.

## How to Run

This project uses modern JavaScript modules, which require it to be run from a web server to function correctly due to browser security policies.

A Python script is included to make this easy.

### Prerequisites

-   Python 3 must be installed on your system.

### Instructions

1.  Open your terminal or command prompt.
2.  Navigate to the root directory of this project.
3.  Run the server script:
    ```sh
    python serve.py
    ```
4.  The script will automatically open the game in your default web browser at `http://localhost:8000`.
5.  To stop the server, go back to your terminal and press `Ctrl+C`.

Enjoy the game!

## Gameplay

Welcome to Happy JS Farm! This is an incremental farming simulation game where you build and grow your own farm from a small plot of land into a bustling agricultural enterprise.

### The Farm: Your Core Operations

The heart of the game is the cycle of planting, growing, and harvesting crops.

-   **Planting:** Start by purchasing seeds from the Store. Select a seed from your warehouse and click on an empty plot in your field to plant it.
-   **Growing:** Each crop takes time to grow through several stages. Keep an eye on them as they mature!
-   **Harvesting:** Once a crop is fully grown, click on it to harvest. The harvested crops are added to your warehouse, and you'll gain valuable Experience Points (XP).

### The Market: Sell Your Goods

Your warehouse holds all your harvested crops and produced goods. You can sell these items in the Market.

-   **Dynamic Prices:** The market is dynamic! The more of a specific item you sell, the lower its price will drop. Prices will slowly recover over time, so sell strategically to maximize your profits.
-   **Making Money:** Selling goods is your primary way to earn money, which you'll need for seeds, buildings, and upgrades.

### Buildings & Production: From Farm to Factory

Don't just sell raw crops! You can purchase a variety of buildings to process your crops into more advanced (and profitable) goods.

-   **Purchase Buildings:** Go to the "Production" tab in the Store to buy buildings like the **Bakery** (to turn wheat into bread) or the **Dairy** (to produce milk).
-   **Start Production:** Once you own a building, you can start a production cycle. This requires specific ingredients from your warehouse.
-   **Crafted Goods:** Production takes time, but the resulting products, like `bread`, `cheese`, or `jam`, sell for much more in the market.

### Leveling & Upgrades: Grow Your Skills

Every action on the farm helps you grow.

-   **Experience Points (XP):** You gain XP for harvesting crops, crafting goods, and fulfilling orders.
-   **Leveling Up:** When you earn enough XP, you'll level up! Leveling up unlocks:
    -   New types of seeds and crops.
    -   New buildings and production recipes.
    -   New, powerful upgrades in the store.
    -   Expansions to your farm, giving you more land to plant on.
-   **Upgrades:** Spend your money on a wide variety of upgrades in the "Upgrades" tab of the Store. These can:
    -   Speed up crop growth.
    -   Increase the yield from your harvests.
    -   Lower the cost of seeds.
    -   Increase the sale price of your goods.
    -   Improve the efficiency and speed of your production buildings.
    -   Automate farming plots and buildings.

### Orders & Customers: Fulfilling a Need

Local customers will place orders for specific crops and goods.

-   **Fulfill Orders:** Check the "Orders" board to see what customers want. If you have the items in your warehouse, you can fulfill the order to receive money, XP, and increase your **Trust** with that customer.
-   **Build Trust:** Earning trust with customers is important! As your trust level with a customer increases, they will provide you with powerful, permanent bonuses, such as faster crop growth, higher yields, or better market prices.

Good luck, and happy farming!
