The "New page" button on `/pages` has a large empty blue space to the left of its label because the `IconPlus` is invisible.

**Root cause:** The CSS rule `button:not([disabled]) > svg { color: var(--color-primary); }` in `style-pack.css` has higher specificity than `.bg-primary svg { color: inherit; }`. Since the button background is also `var(--color-primary)`, the icon renders in the same color as the background and disappears, while `gap-2` still reserves the space.

**Fix:**
1. In `src/style-pack.css`, increase the specificity of the `.bg-primary svg` override so it reliably wins over `button:not([disabled]) > svg` for icons inside primary buttons.

**Verification:**
- Screenshot the `/pages` "New page" button — confirm the plus icon is visible in white against the blue button.
- Confirm no other button icons are regressed.