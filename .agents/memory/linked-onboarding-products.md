---
name: Linked onboarding products
description: Product meaning and flow constraints for the productModelId onboarding query parameter.
---

In onboarding links, `productModelId` means a predefined **device category**, not an individual device or a separate product entity.

**Why:** The user explicitly defined this parameter and wants customers receiving such links to choose how to pay for the already selected category.

**How to apply:** When present, show that category's Device Details and Payment Plan without class/group/model browsing. Without it, preserve the existing device-selection flow. Do not silently fall back to another device if the linked category cannot be loaded.
