# Architecture Diagrams - Happy JS Farm Refactoring

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         UI Layer                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Field   │  │Warehouse │  │  Market  │  │  Orders  │   │
│  │ Renderer │  │ Renderer │  │ Renderer │  │ Renderer │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                      │
        ┌─────────────▼──────────────┐
        │        Event Bus            │
        │  (Decoupled Communication)  │
        └─────────────┬──────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
┌───────▼────────┐         ┌───────▼────────┐
│  Game Systems  │         │   Core Systems │
├────────────────┤         ├────────────────┤
│ PlayerSystem   │         │ SaveSystem     │
│ FieldSystem    │         │ GameLoop       │
│ WarehouseSystem│◄────────┤ EventBus       │
│ MarketSystem   │         │ Validators     │
│ OrderSystem    │         │                │
│ BuildingSystem │         │                │
│ UpgradeSystem  │         │                │
└────────┬───────┘         └────────────────┘
         │
         ▼
┌─────────────────┐
│   Data Layer    │
├─────────────────┤
│ cropTypes       │
│ buildings       │
│ upgrades        │
│ leveling        │
│ customers       │
└─────────────────┘
```

## 🔄 Data Flow (Old vs New)

### Old Architecture (Coupled)
```
┌─────────┐
│  User   │
│ Action  │
└────┬────┘
     │
     ▼
┌────────────┐     ┌──────────┐
│  game.js   │────►│   UI     │
│ (600 lines)│     │ Render   │
│            │     └──────────┘
│ • Logic    │
│ • State    │     ┌──────────┐
│ • Render   │────►│  State   │
│ • Save     │     │  Update  │
│ • Events   │     └──────────┘
└────────────┘
     │
     ▼
┌──────────┐
│  DOM     │
└──────────┘

Problems:
❌ Everything in one place
❌ Tight coupling
❌ Hard to test
❌ Hard to modify
```

### New Architecture (Decoupled)
```
┌─────────┐
│  User   │
│ Action  │
└────┬────┘
     │
     ▼
┌──────────┐
│    UI    │
│ Handler  │
└────┬─────┘
     │
     ▼
┌──────────────┐
│   System     │
│   Method     │
│              │
│ field.plant()│
└────┬─────────┘
     │
     ▼
┌──────────────┐
│  Validation  │
│  & Logic     │
└────┬─────────┘
     │
     ▼
┌──────────────┐
│  Event Bus   │
│   (emit)     │
└────┬─────────┘
     │
     ├────────────────┐
     │                │
     ▼                ▼
┌──────────┐    ┌──────────┐
│  UI      │    │  Other   │
│ Listener │    │ Systems  │
└──────────┘    └──────────┘

Benefits:
✅ Separated concerns
✅ Loose coupling
✅ Easy to test
✅ Easy to modify
```

## 🎯 Event Flow Example

### Harvesting a Crop

```
┌──────────────────────────────────────────────────────────┐
│  1. User clicks on mature crop                            │
└─────────────────┬────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────────┐
│  2. UI Handler calls fieldSystem.harvest(row, col)        │
└─────────────────┬────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────────┐
│  3. FieldSystem validates and harvests                    │
│     • Check if crop exists                                │
│     • Check if fully grown                                │
│     • Calculate yield                                     │
│     • Clear cell                                          │
│     • Return { crop, amount, xp }                         │
└─────────────────┬────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────────┐
│  4. FieldSystem emits CROP_HARVESTED event                │
│     eventBus.emit(CROP_HARVESTED, result)                 │
└─────────────────┬────────────────────────────────────────┘
                  │
      ┌───────────┴───────────┐
      │                       │
      ▼                       ▼
┌─────────────┐         ┌─────────────┐
│ 5a. UI      │         │ 5b. Game    │
│  Listener   │         │  Logic      │
│             │         │             │
│ • Update    │         │ • Add to    │
│   field     │         │   warehouse │
│   visual    │         │ • Add XP    │
│             │         │ • Check     │
│             │         │   level up  │
└─────────────┘         └─────────────┘
```

## 📦 System Dependencies

```
┌──────────────┐
│ PlayerSystem │
└──────┬───────┘
       │
       │ uses
       ▼
┌──────────────────┐
│   Validation     │
│   TimeUtils      │
│   MathUtils      │
│   EventBus       │
│   Constants      │
└──────────────────┘

┌──────────────┐
│ FieldSystem  │
└──────┬───────┘
       │
       │ uses
       ▼
┌──────────────────┐
│   Validation     │
│   TimeUtils      │
│   MathUtils      │
│   EventBus       │
│   CropTypes      │
└──────────────────┘

Benefits:
✅ Clear dependencies
✅ Easy to mock for testing
✅ Reusable utilities
✅ No circular dependencies
```

## 🔐 Validation Flow

```
┌──────────────────┐
│ External Input   │
│ (user, network)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Validation     │
│                  │
│ • Type check     │
│ • Range check    │
│ • State check    │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────┐   ┌──────────┐
│ OK  │   │  Error   │
└──┬──┘   │          │
   │      │ • Clear  │
   │      │   message│
   │      │ • Field  │
   │      │   name   │
   │      └────┬─────┘
   │           │
   │           ▼
   │      ┌──────────┐
   │      │   UI     │
   │      │ Shows    │
   │      │ Error    │
   │      └──────────┘
   │
   ▼
┌──────────────────┐
│  System Logic    │
│  (validated)     │
└──────────────────┘
```

## 🏃 Game Loop Architecture

```
┌─────────────────────────────────────────┐
│            Game Loop                     │
│   (runs every 100ms)                     │
└──────────────┬──────────────────────────┘
               │
               ├─────► Update Systems
               │       ├── fieldSystem.updateGrowth()
               │       ├── marketSystem.updatePrices()
               │       ├── orderSystem.updateOrders()
               │       └── buildingSystem.updateProduction()
               │
               ├─────► Check for Events
               │       └── Each system emits events
               │
               ├─────► Auto-save (every 5s)
               │       └── saveSystem.save()
               │
               └─────► Continue Loop
                       └── requestAnimationFrame(gameLoop)

Events trigger:
  │
  ├─► UI Updates (via event listeners)
  ├─► Sound Effects
  ├─► Notifications
  └─► Analytics
```

## 🧪 Testing Architecture

```
┌──────────────────────────────────────────────┐
│              Unit Tests                       │
│  (Test individual systems in isolation)       │
└──────────────┬───────────────────────────────┘
               │
               ├─► PlayerSystem Tests
               │   ├── test addXP()
               │   ├── test addMoney()
               │   ├── test applyUpgrade()
               │   └── test levelUp()
               │
               ├─► FieldSystem Tests
               │   ├── test plant()
               │   ├── test harvest()
               │   ├── test updateGrowth()
               │   └── test getStats()
               │
               └─► Other Systems...

┌──────────────────────────────────────────────┐
│           Integration Tests                   │
│  (Test system interactions)                   │
└──────────────┬───────────────────────────────┘
               │
               ├─► Harvest Flow
               │   └── field → warehouse → player
               │
               ├─► Purchase Flow
               │   └── player → upgrade → effect
               │
               └─► Order Flow
                   └── order → warehouse → player

┌──────────────────────────────────────────────┐
│               E2E Tests                       │
│  (Test complete user flows)                   │
└──────────────┬───────────────────────────────┘
               │
               ├─► Plant and Harvest Crop
               ├─► Buy and Use Upgrade
               ├─► Fulfill Order
               └─► Save and Load Game
```

## 📊 State Management

```
┌─────────────────────────────────────────────────┐
│             State Structure                      │
└──────────────┬──────────────────────────────────┘
               │
               ├── PlayerSystem.state
               │   ├── money
               │   ├── xp
               │   ├── level
               │   ├── upgrades
               │   └── npcBonuses
               │
               ├── FieldSystem.field
               │   └── [row][col]
               │       ├── crop
               │       ├── growthStage
               │       ├── stageStartTime
               │       └── autoCrop
               │
               ├── WarehouseSystem.items
               │   └── { itemName: quantity }
               │
               ├── MarketSystem.state
               │   └── { itemName: { price, sold } }
               │
               ├── OrderSystem.orders
               │   └── { customerId: order }
               │
               └── BuildingSystem.buildings
                   └── { buildingId: { purchased, production } }

State Access:
✅ Read: system.getState()
✅ Modify: system methods only
❌ Direct: state.property = value
```

## 🔄 Migration Path

```
┌──────────────┐
│  Old Code    │
│  (Working)   │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  Feature Toggle      │
│  if (useNewSystems) │
└──────┬───────────────┘
       │
   ┌───┴───┐
   │       │
   ▼       ▼
┌─────┐ ┌─────────┐
│Old  │ │  New    │
│Code │ │ Systems │
└─────┘ └────┬────┘
             │
             ▼
      ┌──────────────┐
      │   Testing    │
      │   & Fixing   │
      └──────┬───────┘
             │
             ▼
      ┌──────────────┐
      │ Gradually    │
      │ Migrate      │
      └──────┬───────┘
             │
             ▼
      ┌──────────────┐
      │  Remove Old  │
      │    Code      │
      └──────────────┘
```

## 🎨 Component Interaction Example

### Selling Items to Market

```
User clicks "Sell"
      │
      ▼
┌──────────────┐
│ UI Handler   │
└──────┬───────┘
       │
       │ calls
       ▼
┌─────────────────────┐
│ sellItem(crop, qty) │
└──────┬──────────────┘
       │
       ├──► 1. warehouseSystem.hasItem(crop, qty)?
       │              ↓ yes
       │
       ├──► 2. marketSystem.calculatePrice(crop, qty)
       │              ↓ returns price
       │
       ├──► 3. warehouseSystem.removeItem(crop, qty)
       │              ↓ emits ITEM_REMOVED
       │
       ├──► 4. playerSystem.addMoney(price)
       │              ↓ emits MONEY_CHANGED
       │
       └──► 5. marketSystem.recordSale(crop, qty)
                      ↓ emits ITEM_SOLD, PRICE_CHANGED

All events trigger appropriate UI updates automatically!
```

---

## 📚 Legend

```
┌─────┐
│ Box │  = Component/System
└─────┘

  │
  ▼      = Data/Control Flow

  ──►    = Method Call

  ═══►   = Event Emission

✅        = Good Practice
❌        = Anti-Pattern
```
