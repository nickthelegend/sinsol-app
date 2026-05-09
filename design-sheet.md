# SinSol — Design Sheet

Living reference for visual language, voice, and UI patterns. Align all new work with the **logo** (`public/logo.png`): **gloss crimson Solana “S”**, **devil horns / trident / tail**, **pure black field** — bold, adult, crypto-native, seductive without looking cheap.

---

## 1. Product & audience

| | |
|---|---|
| **What it is** | Premium **on-chain** social for **creators** and fans — exclusive content, DMs, tips/tributes, tokens, communities. Positioned like **OnlyFans-class** intimacy + **Solana** ownership. |
| **Who uses it** | Creators monetising; fans paying for access and closeness; crypto-comfortable users. |
| **Design job** | Feel **late-night, confident, expensive** — not startup-grey, not meme-casino, not clinical health UI. |

---

## 2. Brand pillars

1. **Sin / temptation** — devil motif is intentional; UI can be provocative but **controlled** (one red story, not rainbow chaos).
2. **Solana premium** — fast, modern, glossy highlights (echo the **3D sheen** on the mark).
3. **Trust for money** — payments, unlocks, and identity must read **clear and serious** even when the brand is flirty.

---

## 3. Logo usage

| Rule | Detail |
|------|--------|
| **Primary mark** | Full-colour `logo.png` on **dark** backgrounds only (black / near-black). |
| **Container** | Optional: subtle tile `bg-white/5`, `border-white/10`, radius **~24px** — matches current shell. |
| **Minimum clear space** | ~0.5× logo height on all sides. |
| **Don’t** | Recolour the mark to unrelated hues; flatten onto busy photos without a scrim; stretch or crop horns/tail. |
| **Wordmark** | **SINSOL** in **Bebas Neue** / `font-premium-headline` — all-caps, tracked, pairs with the mark. |

**Manager line:** “Keep the same look as the logo” = **black void + wet red + highlight sheen + sharp devil energy**, not unrelated palettes (e.g. cold blue SaaS).

---

## 4. Colour system

### 4.1 Core (aligned with codebase tokens)

| Role | CSS / token | Notes |
|------|-------------|--------|
| **Canvas** | `hsl(0 0% 4%)` / `#0A0A0A` | Page bg; matches logo field. |
| **Surface** | `hsl(0 0% 8%)` — card | Glass overlays often `rgba(20,20,20,0.8)`. |
| **Elevated** | `hsl(0 0% 12%)` | Inputs, raised chips. |
| **Text primary** | `hsl(0 0% 98%)` | Body + headlines on dark. |
| **Text secondary** | `hsl(0 0% 60%)` | Meta, timestamps, hints. |
| **Text muted** | `hsl(0 0% 40%)` | Disabled, tertiary. |
| **Border** | `hsl(0 0% 18%)` | Default dividers. |
| **Primary / accent** | `hsl(0 72% 51%)` — Tailwind **red-600** family | CTAs, active nav, rings — **logo red**. |
| **Secondary red** | `hsl(0 63% 31%)` | Depth, secondary buttons. |
| **Destructive** | `hsl(0 84% 60%)` | Errors; use sparingly vs primary. |
| **Success** | `hsl(142 71% 45%)` | Paid, confirmed, encrypted OK — **semantic only**, not brand fill. |
| **Warning** | `hsl(38 92% 50%)` | Paid-post banners, caution — keep off hero brand moments if possible. |

### 4.2 Logo-matched reds (reference)

Use **gradient / gloss** on primary buttons to echo the mark: `#DC2626` → `#B91C1C` (see `.premium-button`, `.btn-primary-red` in `globals.css`). Highlights: `#EF4444`, `#F87171` for hover / glow.

### 4.3 Atmosphere

- **Red blobs** — soft, blurred, low-opacity; **supporting** layer, never compete with content legibility.
- **Glow** — `rgba(220, 38, 38, 0.15–0.4)` on CTAs and focus; suggests neon / club without full cyberpunk palette.

---

## 5. Typography

| Role | Font | Weights | Usage |
|------|------|---------|--------|
| **Display / titles** | **Bebas Neue** (`--font-bebas`, `font-premium-headline`) | 400 | Section titles, marketing headlines, nav titles (e.g. TIMELINE). Letterspace slightly wide. |
| **UI body** | **Outfit** (`font-premium-body`) | 300–700 | Paragraphs, labels, inputs. |
| **Accent / emphasis** | **Montserrat** (`font-premium-accent`) | 600–700 | Badges, small caps, numeric emphasis. |

**Scale (suggested)**

- Hero / page title: `text-3xl`–`text-5xl` Bebas, tight line-height.
- Card title: `text-lg`–`text-xl` semibold Outfit or Bebas for punch.
- Body: `text-sm`–`text-[15px]` Outfit, relaxed line-height (~1.5).
- Meta: `text-xs` uppercase tracking (nav labels, overlines).

**Voice (UK-leaning, seductive)** — copy can be **dry, confident, witty**; avoid American hype stacks (“insane”, “literally fire”) unless ironic. Prefer **direct, adult** clarity for money and consent.

---

## 6. Layout & shape

| Token | Value | Use |
|-------|--------|-----|
| **Radius base** | `20px` (`--radius`) | Cards, modals. |
| **Radius XL** | `28px` (`--clay-radius-xl`) | Hero panels, logo wells. |
| **Radius full** | pill | Badges, primary buttons. |
| **Nav / icon wells** | ~`20px`–`24px` rounded square | Sidebar / mobile tabs. |

**Grid**

- Main feed: `max-w-2xl`–`max-w-5xl` centred; sidebar only desktop.
- **Breathing room** — dark UI needs padding; avoid cramming edge-to-edge text.

---

## 7. Elevation & materials

- **Glass** — `backdrop-blur-xl`, semi-transparent dark fill, **thin** red or white border at low opacity.
- **Cards** — `.premium-card` / `.card-premium`: soft red outer glow, **inset** highlight for “wet” finish (matches logo gloss).
- **Buttons** — Primary: red gradient + red shadow; hover **lift** `-translate-y-0.5` to `-translate-y-1`; active slight **squish** `scale-0.96`.

**Motion**

- Transitions **200–300ms**; easing `--clay-squish` for UI, `--clay-bounce` for playful micro-interactions only.
- Respect `prefers-reduced-motion` (already in `globals.css`).

---

## 8. Navigation vocabulary (keep consistent)

| ID | Label | Feel |
|----|-------|------|
| feed | **Timeline** | Social core |
| chat | **Whispers** | Intimate, private |
| friends | **Souls** | Follow graph |
| tokens | **Coins** | Creator economy |
| communities | **Circle** | In-group |
| payments | **Tribute** | Money as ritual |
| dashboard | **Studio** | Creator control |
| profile | **Identity** | On-chain self |

Icons: simple line icons (Lucide); **active** state = red fill or red glow, not rainbow per tab.

---

## 9. Component patterns

### 9.1 Primary CTA (unlock, subscribe, post)

- Large tap target, **red glow**, short imperative copy (“Unlock”, “Send tribute”, “View”).
- Loading: dim + spinner; don’t remove button shell.

### 9.2 Creator content cards

- Author row: avatar, display name, meta.
- Media: rounded corners; **NSFW / paywalled** — blur + overlay + single strong CTA (brand red).
- Reactions: emoji row; keep contrast on dark.

### 9.3 Composer

- Prefer **same dark surfaces** as the rest of the app for cohesion with logo-forward shell (light grey composer is a known drift — tighten when touching that file).

### 9.4 Empty & error

- Empty: minimal copy, one red secondary action, no clutter.
- Error: destructive hue + **specific** fix (“Add SOL”, “Reconnect wallet”).

---

## 10. Imagery & content

- **Photography** — high contrast; colour grade compatible with **red UI** (avoid clashing magentas).
- **Thumbnails** — consistent aspect ratios; rounded corners match cards.
- **18+** — use clear labels where required by policy; design **badge** style: small, uppercase, red or neutral border — not playful cartoon.

---

## 11. Accessibility & trust

- **Contrast** — body text on `#0A0A0A` must meet WCAG for primary copy; red-on-black for **small text** often fails — use **white/neutral** for long reading, red for emphasis.
- **Focus** — visible focus ring (`--ring` / red glow); keyboard nav for pay flows.
- **Payments** — always show **amount + recipient + consequence** before confirm.

---

## 12. Do / don’t (quick)

**Do**

- Lean into **one** dominant accent (logo red).
- Use **black** and **deep grey** as negative space.
- Mirror **rounded, glossy** language of the mark.
- Keep **Solana** cues subtle (icon, copy) unless marketing screen.

**Don’t**

- Introduce a second bright brand colour without intent.
- Default to **light grey SaaS cards** in the middle of a dark-red app without transition.
- Overuse **emoji** in chrome (fine in user content).
- Make unlock / pay flows **cute** — they should feel **decisive and clear**.

---

## 13. File map (implementation)

| Asset / area | Location |
|--------------|----------|
| Tokens, utilities | `src/app/globals.css` |
| Fonts | `src/app/layout.tsx` |
| Logo | `public/logo.png` |
| App shell | `src/app/page.tsx`, `Sidebar`, `Header`, `MobileNav` |

---

## 14. Versioning

- **v1.0** — Initial sheet from current codebase + logo + product positioning.  
- Update when **logo** or **primary palette** changes; bump version + date here.

---

*SinSol — Premium on-chain social. Design like the logo: **dark, sharp, red, unforgettable**.*
