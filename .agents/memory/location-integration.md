---
name: Location integration rules
description: Constraints from the supplied GreenPower API handoff and customer location request.
---

Use GreenPower's backend proxy for all location operations; never send a provider key from the browser.

**Why:** The supplied integration guide requires server-only credentials and separates stateless geocoding from onboarding persistence.

**How to apply:** Reuse the existing API client. Do not introduce direct StratopEdge or Geoapify browser requests.

Keep original GPS capture metadata separate from a manually selected address pin.

**Why:** The user wants manual address correction with coordinates, while the authoritative handoff prohibits silently replacing captured GPS with geocoded coordinates.

**How to apply:** Replace the selected address and selected coordinates together, label their source, and retain device capture independently.

Do not assume onboarding persists location metadata merely because geocoding works or a POST accepts extra fields.

**Why:** The handoff states that the backend uses DTO whitelisting, which can discard unknown fields, and requires confirmation of the save contract.

**How to apply:** The user explicitly directed the frontend to send the address and longitude/latitude during onboarding. Send the confirmed selection's three values together. Do not block frontend submission on obtaining another DTO; backend persistence still needs separate verification before claiming end-to-end storage.
