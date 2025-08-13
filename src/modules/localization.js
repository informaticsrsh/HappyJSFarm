const locales = {
    "en": {
        "title": "My Farm Game",
        "store_title": "Store",
        "seeds_tab": "Seeds",
        "upgrades_tab": "Upgrades",
        "market_title": "Market",
        "reference_title": "Reference",
        "warehouse_title": "Warehouse",
        "field_title": "Field",
        "btn_store": "Store",
        "btn_market": "Market",
        "btn_reference": "Reference",
        "btn_sell_one": "Sell 1",
        "wheat_seed": "wheat seed",
        "carrot_seed": "carrot seed",
        "tomato_seed": "tomato seed",
        "potato_seed": "potato seed",
        "wheat": "wheat",
        "carrot": "carrot",
        "tomato": "tomato",
        "potato": "potato",
        "buy_item": "Buy {icon} {itemName} (${price})",
        "warehouse_item": "{icon} {itemName}: {amount}",
        "market_item_price": "(Price: ${price})",
        "ref_seed_price": "Seed Price:",
        "ref_growth_time": "Growth Time:",
        "ref_yield": "Yield:",
        "ref_market_price": "Market Price:",
        "ref_stages": "Stages:",
        "ref_per_stage": "{time}s per stage",
        "ref_yield_range": "{min} to {max}",
        "alert_select_seed": "Select a seed from the warehouse first!",
        "alert_not_ready_harvest": "Not ready to harvest yet!",
        "alert_no_crop_to_sell": "You don't have any to sell!",
        "alert_not_enough_money": "Not enough money!"
    },
    "uk": {
        "title": "Моя Ферма",
        "store_title": "Крамниця",
        "seeds_tab": "Насіння",
        "upgrades_tab": "Покращення",
        "market_title": "Ринок",
        "reference_title": "Довідник",
        "warehouse_title": "Склад",
        "field_title": "Поле",
        "btn_store": "Крамниця",
        "btn_market": "Ринок",
        "btn_reference": "Довідник",
        "btn_sell_one": "Продати 1",
        "wheat_seed": "насіння пшениці",
        "carrot_seed": "насіння моркви",
        "tomato_seed": "насіння томатів",
        "potato_seed": "насіння картоплі",
        "wheat": "пшениця",
        "carrot": "морква",
        "tomato": "томат",
        "potato": "картопля",
        "buy_item": "Купити {icon} {itemName} (${price})",
        "warehouse_item": "{icon} {itemName}: {amount}",
        "market_item_price": "(Ціна: ${price})",
        "ref_seed_price": "Ціна насіння:",
        "ref_growth_time": "Час росту:",
        "ref_yield": "Урожай:",
        "ref_market_price": "Ринкова ціна:",
        "ref_stages": "Стадії:",
        "ref_per_stage": "{time}с за стадію",
        "ref_yield_range": "від {min} до {max}",
        "alert_select_seed": "Спочатку виберіть насіння зі складу!",
        "alert_not_ready_harvest": "Ще не готово для збору!",
        "alert_no_crop_to_sell": "У вас немає нічого для продажу!",
        "alert_not_enough_money": "Недостатньо грошей!"
    }
};

let currentLang = 'en';
let translations = locales[currentLang];

export function t(key, options = {}) {
    let text = translations[key] || key;
    for (const option in options) {
        text = text.replace(`{${option}}`, options[option]);
    }
    return text;
}

export function setLanguage(lang) {
    currentLang = lang;
    translations = locales[lang];
}
