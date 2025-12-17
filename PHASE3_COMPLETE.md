# ✅ Фаза 3: Нові типи замовлень - ЗАВЕРШЕНО

## Що було зроблено

### 1. Створено модульну систему типів замовлень

**Новий файл:** `src/modules/orderTypes.js`

Додано 3 типи замовлень:

#### 📦 Standard Order (Стандартне)
```javascript
{
    duration: 480000,        // 8 хвилин (як раніше)
    rewardMultiplier: 1.0,   // Базова винагорода
    amountMultiplier: 1.0,   // Базова кількість
    spawnWeight: 1.0         // Найчастіший тип
}
```

#### ⚡ Express Order (Експрес)
```javascript
{
    duration: 120000,        // 2 хвилини! ⏱️
    rewardMultiplier: 1.5,   // +50% винагорода 💰
    amountMultiplier: 1.0,   // Звичайна кількість
    spawnWeight: 0.3,        // 30% шанс появи
    requiredLevel: 3         // Розблоковується на рівні 3
}
```

#### 📦📦📦 Bulk Order (Оптове)
```javascript
{
    duration: 600000,        // 10 хвилин
    rewardMultiplier: 1.3,   // +30% винагорода
    amountMultiplier: 3.0,   // × 3 товарів! 📦📦📦
    spawnWeight: 0.2,        // 20% шанс появи
    requiredLevel: 3
}
```

### 2. Інтеграція в систему генерації замовлень

**Модифіковано:** `src/modules/game.js`

#### Додано імпорт:
```javascript
import { 
    determineOrderType, 
    calculateOrderReward, 
    calculateOrderAmount, 
    ORDER_TYPES 
} from './orderTypes.js';
```

#### Оновлено `generateOrder()`:
- Визначає тип замовлення базуючись на рівні гравця
- Обчислює кількість з урахуванням `amountMultiplier`
- Обчислює винагороду з урахуванням `rewardMultiplier`
- Зберігає `order.type` для використання в UI
- Використовує `orderType.duration` замість глобального `orderLifetime`

### 3. Система зважених імовірностей

**Функція `determineOrderType(playerLevel)`:**

- До рівня 3: тільки стандартні замовлення
- Рівень 3+: зважений випадковий вибір
  - Standard: 100% ваги (найчастіший)
  - Express: 30% ваги
  - Bulk: 20% ваги

**Розподіл ймовірностей на рівні 3+:**
- Standard: ~67% (1.0 / 1.5)
- Express: ~20% (0.3 / 1.5)
- Bulk: ~13% (0.2 / 1.5)

### 4. Допоміжні функції

```javascript
// Отримати конфіг типу за ID
getOrderType(typeId)

// Обчислити фінальну винагороду
calculateOrderReward(baseReward, orderTypeId)

// Обчислити фінальну кількість
calculateOrderAmount(baseAmount, orderTypeId)

// Визначити рівень терміновості для UI
getOrderUrgencyClass(timeLeft, orderTypeId)
```

### 5. Локалізація

**Модифіковано:** `src/modules/localization.js`

Додано переклади англійською та українською:
- `order_type_standard` - "Standard Order" / "Стандартне замовлення"
- `order_type_express` - "⚡ EXPRESS ORDER" / "⚡ ЕКСПРЕС-ЗАМОВЛЕННЯ"
- `order_type_bulk` - "Bulk Order" / "Оптове замовлення"
- `order_expiring` - "EXPIRING SOON!" / "ЗАКІНЧУЄТЬСЯ!"
- `tokens` - "tokens" / "токенів"

---

## Приклади замовлень

### Scenario 1: Trust Level 1, Пшениця

**Базові дані:**
- 10 пшениці
- Ринкова ціна: $8
- Trust tier multiplier: 1.8x

#### Standard Order:
```
Кількість: 10
Винагорода: $8 × 10 × 1.8 × 1.0 = $144
Час: 8 хвилин
Токени: +1
```

#### Express Order:
```
Кількість: 10
Винагорода: $8 × 10 × 1.8 × 1.5 = $216 (+50%!)
Час: 2 хвилини ⚡
Токени: +1
Benefit: Майже × 3 швидше!
```

#### Bulk Order:
```
Кількість: 30 (× 3)
Винагорода: $8 × 30 × 1.8 × 1.3 = $561.6 ≈ $562
Час: 10 хвилин
Токени: +1
Benefit: Чудовий спосіб звільнити склад!
```

### Scenario 2: Trust Level 3, Помідори

**Базові дані:**
- 15 помідорів
- Ринкова ціна: $28
- Trust tier multiplier: 2.2x

#### Standard Order:
```
Кількість: 15
Винагорода: $28 × 15 × 2.2 × 1.0 = $924
Час: 8 хвилин
Токени: +3
```

#### Express Order:
```
Кількість: 15
Винагорода: $28 × 15 × 2.2 × 1.5 = $1386 🔥
Час: 2 хвилини ⚡
Токени: +3
ROI: $693/хв (insane!)
```

#### Bulk Order:
```
Кількість: 45 (× 3)
Винагорода: $28 × 45 × 2.2 × 1.3 = $3607.2 ≈ $3607
Час: 10 хвилин
Токени: +3
ROI: $360/хв (чудово для масового продажу)
```

---

## Порівняння з ринком

### Приклад: 10 пшениці

| Метод | Дохід | Час | Дохід/хв | Бонуси |
|-------|-------|-----|----------|--------|
| **Ринок** | $80 | миттєво | $80/хв+ | Немає |
| **Standard** | $144 | 8 хв | $18/хв | +1 token, +50 XP |
| **Express** | $216 | 2 хв | $108/хв ⚡ | +1 token, +50 XP |
| **Bulk (30)** | $562 | 10 хв | $56/хв | +1 token, +50 XP |

### Висновки:
✅ **Express Order** - найвигідніший за співвідношенням час/винагорода
✅ **Bulk Order** - ідеально для звільнення складу
✅ **Standard Order** - золота середина
⚠️ **Ринок** - все ще швидкий для emergency cash

---

## Геймплейні імплікації

### Нові стратегії для гравців:

1. **Express Farming** 🏃‍♂️
   - Фокус на швидкоростучі культури (пшениця, морква)
   - Чекати на express orders
   - Максимальний дохід за мінімальний час

2. **Bulk Clearing** 📦
   - Коли склад переповнений
   - Bulk order = швидкий спосіб заробити і звільнити місце
   - Особливо корисно для auto-farmed plots

3. **Balanced Approach** ⚖️
   - Брати будь-які замовлення
   - Express = priority
   - Standard/Bulk = залежно від inventory

### Progression incentive:

- Рівень 1-2: Тільки standard orders (повільніше, навчання)
- Рівень 3+: Розблокуються express/bulk (більше варіативності)
- Це створює відчуття прогресії!

---

## Технічні деталі

### Структура order object:

```javascript
{
    crop: 'wheat',
    amount: 10,
    reward: 216,
    type: 'express',    // НОВИЙ
    expiresAt: Date.now() + 120000  // ОНОВЛЕНО
}
```

### Backward compatibility:

Старі збереження без `order.type` автоматично працюватимуть як standard orders через fallback в `getOrderType()`.

---

## Файли змінено

1. ✅ `src/modules/orderTypes.js` (новий)
   - Визначення ORDER_TYPES
   - determineOrderType()
   - calculateOrderReward()
   - calculateOrderAmount()
   - getOrderUrgencyClass()

2. ✅ `src/modules/game.js`
   - Додано import orderTypes
   - Оновлено generateOrder()
   - Підтримка різних типів замовлень

3. ✅ `src/modules/localization.js`
   - Додано переклади для order types
   - Англійська та українська мови

---

## Тестування (TODO)

### Базові тести
- [ ] Рівень 1-2: генеруються тільки standard orders
- [ ] Рівень 3+: генеруються всі типи
- [ ] Express order закінчується через 2 хвилини
- [ ] Bulk order вимагає × 3 товарів
- [ ] Винагороди обчислюються правильно

### Probability тести
- [ ] Згенерувати 100 замовлень на рівні 3
- [ ] Перевірити розподіл: ~67% standard, ~20% express, ~13% bulk
- [ ] Немає crashes при різних типах

### Balance тести
- [ ] Express order дає значущу перевагу в $/хв
- [ ] Bulk order корисний для clearing inventory
- [ ] Всі типи залишаються конкурентоспроможними відносно ринку

---

## Наступні кроки

✅ Фаза 3 завершена → Переходимо до **Фази 4: Особливі насіння**

Або можна спочатку зробити **Фазу 6: UI/UX покращення** для візуалізації нових типів замовлень!

Рекомендую: **Спочатку UI (Фаза 6)**, щоб побачити як виглядають нові типи, потім Фази 4-5.

---

**Статус:** ✅ READY FOR TESTING & UI
**Час виконання:** ~40 хвилин
**Ризик:** LOW (модульна архітектура, fallbacks на місці)
