# Hero image brief

Drop the final file at `public/hero-dawn.jpg`. That path is the only thing the
code knows about (`HERO_IMAGE` in `src/components/Hero.tsx`), so swapping the
image is a one-file change.

The file in place now is a generated forest corridor, and the scrim is tuned
to it.

Two registers to choose between:

- **§7 — rendered brand asset.** 3D, volumetric light, abstract form. The
  language Linear, Stripe, Raycast and Vercel actually use. Start here.
- **§8 — photograph.** Atmospheric, natural, closer to the BridgeAI / Haven /
  Harmoniq references you started from.

They are mutually exclusive looks. Pick one and commit — a page that mixes
rendered abstraction with landscape photography reads as indecisive.

---

## 1. Non-negotiables

These are not aesthetic preferences. The layout will break if the frame
ignores them.

| Constraint | Why |
|---|---|
| **Dark overall.** Average luminance under ~22%. | Bone `#DAD4A7` text sits on top. The scrim buys headroom, it does not rescue a bright frame. |
| **Centre 60% × 55% must be low-detail.** Fog, haze, empty air — no branches, no bark texture, no busy foliage. | The headline, sub-copy and both buttons live there. Detail behind them reads as dirt. |
| **No bright spot above the horizontal middle.** | The nav pill and badge sit in the top third. A blown highlight there kills them. |
| **Brightest area, if any, sits low and slightly right of centre.** | It draws the eye down toward the CTAs and into the page. |
| **Landscape, minimum 3840 × 2160.** | `object-cover` on a 100svh section crops hard on tall viewports. |
| **No people, no animals, no text, no signage, no watermark.** | Any of these dates the page and pulls focus from the message. |

**Safe zone:** imagine a rectangle from 20% to 80% horizontally and 22% to 78%
vertically. Everything inside it should be almost featureless.

---

## 2. Primary prompt

> Cinematic still photograph looking down a corridor of an ancient temperate
> rainforest at civil twilight, roughly twenty minutes before sunrise. Two
> massive dark tree trunks anchor the extreme left and right edges of the
> frame in near-silhouette, forming a natural vignette; between them the
> forest recedes into thick, still, volumetric fog, with rows of progressively
> fainter trunks dissolving into the haze. The centre of the frame is almost
> entirely soft fog and empty air — no branches, no foliage detail, no
> texture — just luminous grey-green atmosphere. A faint, diffuse opening in
> the mist glows softly in the lower-right third, the only bright area in the
> image, suggesting a clearing beyond the trees. The canopy overhead is a
> heavy unbroken dark mass, nearly black-green, letting no direct sunlight
> through. Ground plane barely visible: moss, leaf litter and low ferns
> fading into fog at the bottom edge, with a few muted rust-brown fallen
> leaves as the single note of warmth. The entire scene is deeply
> desaturated toward a dark forest green, olive rather than emerald,
> low-contrast, misty, silent, and utterly still. Shot on Hasselblad X2D 100C
> with XCD 38V f/2.5 lens at f/5.6, 1/125s, ISO 200, tripod-mounted at chest
> height, sensor plane perfectly level, no lens tilt. Kodak Portra 400
> underexposed one stop and pushed in development: lifted matte blacks,
> gentle highlight roll-off, low micro-contrast, fine natural grain.
> Ultra-wide 16:9 landscape, deep atmospheric perspective, photorealistic,
> editorial quality.

### Negative prompt

> people, person, human, silhouette of a person, animals, birds, deer, text,
> letters, watermark, signature, logo, signage, path, trail, road, fence,
> building, cabin, sunbeams through leaves, harsh god rays, lens flare, sun
> disc, bright sky, blue sky, blue hour colour cast, teal and orange grade,
> HDR, oversaturated, vivid green, emerald, neon, high contrast, crushed
> blacks, sharp foreground foliage, macro detail, bokeh balls, tilt-shift,
> fisheye, vertical orientation, portrait, busy composition, autumn colours,
> snow, rain

---

## 3. Camera and optics, spelled out

| | Primary | Alternative |
|---|---|---|
| **Body** | Hasselblad X2D 100C (100MP medium format) | Sony A7R V (61MP full frame) |
| **Lens** | XCD 38V f/2.5 (≈30mm equiv) | FE 35mm f/1.4 GM |
| **Aperture** | f/5.6 | f/4 |
| **Shutter** | 1/125s | 1/100s |
| **ISO** | 200 | 250 |
| **Focus** | Midground trunks, ~15m. Foreground trunks slightly soft, background lost to fog. | same |
| **Height / angle** | Chest height, ~1.4m. Sensor plane **level** — no upward tilt. | same |
| **Support** | Tripod, cable release | same |

Medium format is the right call over full frame here: the tonal separation in
close-valued greens and fog is exactly what it's for, and this image is almost
entirely close-valued greens and fog.

**Level camera matters.** Tilting up gives converging verticals and a "looking
up at the canopy" feel, which fights the calm the page needs and pushes the
bright sky into the top third where the nav lives.

---

## 4. Light

- **Time:** civil twilight, 15–25 min before sunrise.
- **Sky:** fully overcast or heavy marine layer. No direct sun anywhere.
- **Quality:** completely diffuse. The fog *is* the light source — it scatters
  skylight evenly, which is what kills contrast and gives depth by distance
  rather than by shadow.
- **Direction:** faint gradient from upper-right, never a defined beam.
- **What to avoid:** dramatic god rays. They're beautiful and wrong — they add
  high-contrast diagonals straight through the safe zone.

---

## 5. Colour and grade

Target the existing palette:

- Shadows toward **Ancient Moss `#1E3120`**
- Midtones toward **Deep Forest `#2F4F2F`**
- Fog highlights lifting toward a desaturated **Fern `#556B2F`**, never above
  ~60% luminance
- One warm note only: **Wildwood Bark `#A0522D`** in the leaf litter at the
  very bottom edge

Grade notes: saturation roughly −35% from native. Lift blacks to RGB 10–16 so
nothing clips (this reads as film and keeps the scrim from banding). Highlight
roll-off soft, no clipped whites. Slight green bias in the midtones, and pull
any magenta out of the shadows. **No blue cast** — blue hour colour science
will fight the palette badly.

---

## 6. Delivery and drop-in

1. Export **3840 × 2160**, sRGB, quality 85–90 progressive JPEG.
2. Downscale to **2560 px wide** before committing — `next/image` handles
   responsive sizes from there, and it keeps the repo sane. Aim under ~600 KB.
3. Save as `public/hero-dawn.jpg`, overwriting the placeholder.
4. Nothing else to change. If the new frame is brighter than expected, deepen
   the first `radial-gradient` in `.hero-scrim` (`globals.css`) from 80% to
   ~88% and re-measure.

**Always re-measure contrast after swapping the image**, per element, not per
region — measuring "the background" over empty space tells you nothing about
whether the words are readable. Get each text node's bounding box from the
DOM, sample the dim half of the pixels inside it as background, and compare
against the glyph colour composited at its own alpha.

Two things that are easy to get wrong:

- **WCAG large text is 24px here, not 18.66px.** The 18.66px threshold only
  applies to *bold*, and none of these faces has a bold cut. The hero's lead
  paragraph is capped at exactly 24px for this reason.
- **Next caches optimised images for 4 hours by default** (`minimumCacheTTL`).
  Replacing a file without changing its name will keep serving the old one.
  Clear `.next/dev/cache/images` and restart, or the measurements are fiction.

Current worst case: **4.47:1** (desktop lead paragraph, needs 3.0 at 24px) and
**5.75:1** on mobile. The scrim exposes `--scrim-w/-h/-core/-mid` so it can be
strengthened per breakpoint without touching the rest.

---

## 7. SaaS register — rendered brand assets

Everything above produces a *photograph*. Linear, Stripe, Raycast and Vercel
don't use photographs — they use **rendered assets**: 3D form, volumetric
light, abstract geometry, made not found. Different medium, different prompt
language. Instead of film stock and shutter speed you specify render engine,
shader, lighting rig and virtual camera.

The §1 non-negotiables still apply — dark, empty centre, bright area low.
Abstract renders make them *easier* to hit, because you can direct the
composition instead of hoping a photograph cooperates.

The palette does not change. Deep forest greens with one restrained lime
accent is what keeps this recognisably FounderFlow rather than another dark
gradient SaaS page.

### A. Converging filaments — recommended

The MoE pipeline as light. Many threads in, one out. Linear/Stripe register.

> Abstract 3D render for a premium SaaS hero. Dozens of fine luminous
> filaments enter from the upper edges of the frame — thin, silk-like,
> slightly translucent ribbons of light in muted deep green — drifting
> downward and inward through a dark, near-black volumetric haze. As they
> descend they braid together, merging progressively into fewer and thicker
> strands, until in the lower third they resolve into one single broad,
> smooth, confident ribbon of pale luminous green-white that sweeps
> horizontally and exits the right edge of the frame. The convergence point
> glows softly and is the only bright area in the image. The upper half and
> the exact centre of the frame are almost pure dark atmospheric void — soft
> black-green fog with no detail — so the composition breathes. Rendered in
> Cinema 4D with Octane, physically based: the filaments are thin translucent
> subsurface-scattering glass with faint internal emission; the background is
> deep matte volumetric fog with realistic light falloff, no visible floor and
> no horizon line. Lighting: one large soft area light from behind and above
> the convergence, a faint cool rim from the upper left, volumetric light
> scattering through the haze. Virtual camera: 50mm, f/2.0, shallow depth of
> field, foreground filaments falling softly out of focus, convergence point
> tack sharp. Colour: deeply desaturated dark forest green field (#1E3120 to
> #2F4F2F), muted fern green filaments (#556B2F), a single restrained electric
> lime accent (#9CFC00) only where the strands merge. Subtle bloom, very fine
> film grain, gentle vignette, no chromatic aberration. Ultra-wide 16:9, 8K,
> photoreal product-launch quality.

### B. Volumetric field — safest

Stripe/Raycast register. No literal subject, so nothing can land badly. The
one to pick if A comes back cluttered.

> Abstract volumetric gradient render for a premium SaaS hero. Vast soft
> billowing clouds of luminous mist suspended in a near-black void, lit from
> deep within so the light appears to come from inside the volume rather than
> from any visible source. The form is smooth, slow, and organic — like ink
> diffusing in still water, or a nebula rendered with restraint — with no hard
> edges, no particles and no geometry. The upper two thirds are deep and
> nearly empty; the volume gathers and brightens gently toward the lower
> third, slightly right of centre, then falls away to darkness at every edge.
> Rendered in Houdini with Redshift, physically based volumetric shading, high
> sample count, no visible noise. Colour: deep forest green core (#1E3120)
> through mid green (#2F4F2F) to a soft desaturated fern glow (#556B2F) at the
> brightest point, with the faintest possible lime (#9CFC00) bloom at the very
> centre of the light. Deeply desaturated, low contrast, matte lifted blacks.
> Virtual camera: 85mm, f/2.8, slight depth falloff. Fine film grain, soft
> bloom, vignette. Ultra-wide 16:9, 8K, editorial product-launch quality.

### C. Floating panels — most literal

Vercel/Arc register. Reads as "briefings" without faking a screenshot. Use
this only if you want the hero to hint at the product surface.

> Abstract 3D render for a premium SaaS hero. A loose constellation of thin
> frosted-glass rectangular panels floating in dark volumetric fog, each one
> softly rounded, slightly rotated on different axes, receding into depth and
> dissolving into haze toward the top of the frame. The panels are blank — no
> text, no interface, no icons — reading only as clean translucent surfaces
> catching light on their edges. In the lower third, one single panel sits
> nearer the camera, larger, and lit noticeably brighter than the rest, as
> though selected. The centre and upper half of the frame are dark, open and
> almost empty. Rendered in Blender with Cycles, physically based: frosted
> glass with heavy roughness and thin-film edge highlights, deep matte
> volumetric fog, no visible floor or horizon. Lighting: large soft key from
> upper right, faint rim light along every panel edge, volumetric scatter.
> Virtual camera: 35mm, f/2.2, shallow depth of field, the bright panel sharp
> and everything else falling off. Colour: near-black forest green environment
> (#1E3120), panels tinted deep green-grey, edge highlights in muted fern
> (#556B2F), one restrained lime edge glow (#9CFC00) on the selected panel
> only. Desaturated, low contrast, matte lifted blacks. Subtle bloom, fine
> film grain, vignette. Ultra-wide 16:9, 8K, photoreal product-launch quality.

### Negative prompt — all three

> text, letters, numbers, logo, watermark, signature, UI, user interface,
> buttons, icons, screenshot, dashboard, chart, graph, product mockup, phone,
> laptop, device, people, person, hands, face, cluttered, busy centre, bright
> centre, rainbow, iridescent, holographic, neon pink, magenta, purple, blue,
> cyan, orange, gold, teal and orange grade, oversaturated, high contrast,
> crushed blacks, low-poly, cartoon, illustration, flat vector, 2D, clip art,
> stock art, noisy, grainy artefacts, banding, lens flare, chromatic
> aberration, fisheye, tilt-shift, vertical orientation, portrait

### What to watch

1. **Keep lime rare.** One accent, at the convergence only. Renderers love to
   flood a scene with the accent colour; the moment lime is everywhere it
   stops being a signal and the CTA loses its job.
2. **No blue, no purple.** Every dark-SaaS render drifts toward indigo because
   that is what the training data is full of. It will fight the palette badly.
   Blue and purple are in the negative prompt for exactly this reason.
3. **Empty centre is the whole game.** With a render you can insist on this,
   so insist. Regenerate rather than compensate with scrim.
4. **Watch for banding** in the volumetric gradients — large smooth dark
   gradients band badly after JPEG compression. If it appears, export PNG,
   add a touch of grain, then convert.

Swapping to any of these means retuning `.hero-scrim`. A render with a
genuinely dark empty centre will need *less* scrim than the current
photograph, not more — pull `--scrim-core` down and re-measure.

---

## 8. Photographic register — "The Turn"

The strongest *photographic* option. If you want a photo rather than a
render, this is the one - everything else in this document is a good forest
picture, this one is a picture of the product.

### What it has to say

| The brand | The picture |
|---|---|
| **Founder** — alone, up first, carrying the decisions | First person, standing eye height. No one else in frame. You are the one about to walk it. |
| **Flow** (the stream coming at you) | A dozen scattered rivulets threading everywhere in the foreground |
| **Flow** (the state you never reach) | Those rivulets resolving into one single calm channel |
| Six experts, one conductor, one verdict | Many becoming one, step by step, as it recedes |
| Noise becoming signal | Fog becoming light |
| "before you wake" | Twenty minutes before sunrise |

The emotional beat is the **turn** — the moment scattered becomes single. Not
calm as a backdrop; calm as something arriving. That is the difference between
a forest that looks nice behind a headline and a forest that argues for the
product.

### The prompt

> Cinematic first-person photograph taken at standing eye height on the floor
> of an ancient temperate rainforest, twenty minutes before sunrise. In the
> immediate foreground a dozen shallow braided rivulets thread through dark
> moss and leaf litter in every direction, scattered and aimless, catching
> only the faintest light. As they run away from the camera they gather and
> simplify, merging step by step, until in the middle distance they have
> become one single calm unbroken channel of water leading straight away from
> the viewer and disappearing into a soft luminous opening in the fog.
> Enormous dark trunks stand close on both left and right edges of the frame
> in near-silhouette, framing the view like a doorway. The entire upper half
> of the image is unbroken dark canopy and motionless fog, soft and
> textureless, with no branches and no foliage detail. The only bright area in
> the whole frame is the diffuse glow of first light at the far end of the
> channel, sitting low in the lower third and very slightly right of centre.
> Ferns, moss and a scattering of muted rust-brown fallen leaves edge the near
> water. Absolutely still, silent, no wind, no ripples, no people. Deeply
> desaturated toward dark forest green, olive rather than emerald, very low
> contrast, heavy atmospheric haze, enormous depth. Shot on Hasselblad X2D
> 100C with XCD 38V f/2.5 lens at f/9, 6 seconds, ISO 64, tripod at 1.6m,
> sensor plane perfectly level with no upward tilt, water rendered
> glass-smooth by the long exposure. Kodak Portra 400 underexposed one stop
> and pushed in development: lifted matte blacks that never reach pure black,
> gentle highlight roll-off, low micro-contrast, fine natural grain.
> Ultra-wide 16:9 landscape, deep atmospheric perspective, photorealistic,
> editorial quality.

### Negative prompt

> people, person, human, figure, silhouette of a person, footprints, animals,
> birds, fish, text, letters, watermark, signature, logo, signage, path,
> trail, boardwalk, bridge, stepping stones, handrail, building, cabin, boat,
> harsh god rays, sunbeams through leaves, lens flare, sun disc, bright sky,
> blue sky, blue hour colour cast, teal and orange grade, HDR, oversaturated,
> vivid green, emerald, neon, high contrast, crushed blacks, ripples, choppy
> water, waterfall, rapids, sharp foreground foliage, macro detail, bokeh
> balls, tilt-shift, fisheye, vertical orientation, portrait, busy
> composition, autumn colours, snow, rain

### What to watch when it comes back

1. **The glow must stay in the lower third.** It is the brightest thing in the
   frame and the CTAs sit at roughly 66% height. If the generator floats it to
   the middle it will land behind the headline — regenerate rather than fix it
   in CSS.
2. **Keep the braided foreground in the bottom ~18%.** That is where the
   scrim's bottom gradient is strongest and where the MoE paragraph sits
   bottom-left. Detail creeping higher will start eating contrast.
3. **Glow slightly right of centre**, as specified. Dead centre puts it
   directly behind the button pair; hard right puts it under the scroll rail.
4. **Reject any frame with a visible trail or boardwalk.** Generators love
   adding a path to a forest scene. The water *is* the path here; a second one
   makes the metaphor mush.

---

## 9. Other photographic options

The forest is atmosphere. These three carry *meaning* — each one is a picture
of what the product actually does. All keep the same palette, camera package,
grade and safe zone; only the subject changes.

### A. Confluence — many streams becoming one

The strongest of the three. Six tributaries merging into a single clear
channel *is* the Mixture-of-Experts pipeline, and "Flow" is the name on the
door. Use this one if you only try one.

> Cinematic aerial photograph looking straight down at a braided river
> confluence in dense temperate forest at first light. Six or seven narrow
> tributaries wind in from the upper edges of the frame through dark
> moss-green woodland, each one a thin pale thread of water, and they merge
> progressively toward the lower third into one single wide, calm, silver-green
> channel that exits the bottom of the frame. The upper half of the image is
> almost entirely dark forest canopy and low mist — soft, unbroken, textureless
> — while the water threads read as faint bright lines against it. Thin ground
> fog lies in the valley, softening every edge. A few rust-brown gravel banks
> at the water's edge are the only warmth. Deeply desaturated toward dark
> forest green, olive rather than emerald, very low contrast, silent, still.
> Shot on Hasselblad X2D 100C with XCD 55V f/2.5 lens at f/8, 1/250s, ISO 200,
> drone-mounted, camera perfectly nadir, no perspective distortion. Kodak
> Portra 400 underexposed one stop: lifted matte blacks, gentle highlight
> roll-off, fine natural grain. Ultra-wide 16:9 landscape, photorealistic,
> editorial quality, no people, no boats, no bridges, no text.

**Why it composes well:** the merge point sits low, the confluence lines lead
the eye downward into the page, and the top half is empty canopy — which is
exactly where the headline goes.

### B. First light — "before you wake"

Reads the headline back to you. The moment before the day starts.

> Cinematic photograph taken from a high ridge looking out over an endless
> forested valley completely filled with a flat sea of low cloud at dawn, shot
> twenty minutes before sunrise. The mist sits like still water, absolutely
> level, with only the dark tips of the tallest conifers breaking through it
> in the middle distance. The sky above is a soft graded wash from deep
> blue-green at the top to pale luminous grey-green at the horizon, with no
> sun visible and no cloud detail. The lower third holds the dark silhouette
> of the ridge foreground: wet rock, moss, and low scrub, with a few muted
> rust-brown leaves. Enormously deep, calm, quiet, empty. Deeply desaturated
> toward dark forest green, low contrast, no blue-hour cast. Shot on
> Hasselblad X2D 100C with XCD 38V f/2.5 at f/8, 1/60s, ISO 100, tripod, level
> horizon on the lower third line. Kodak Portra 400 underexposed one stop,
> lifted matte blacks, fine grain. Ultra-wide 16:9 landscape, photorealistic,
> no people, no birds, no sun disc, no text.

**Careful with this one:** the horizon band is the brightest part of the
frame and it sits mid-height. Push the horizon down to the lower third as
specified, or it will collide with the headline.

### C. The clear channel — flow, resolved

Quietest of the three. A single calm river as a natural leading line.

> Cinematic photograph of a wide, absolutely still, mirror-flat river winding
> away from the camera through dense old-growth temperate rainforest at civil
> twilight. The water occupies the lower centre of the frame and reflects the
> pale fog above it perfectly, forming a soft luminous path that narrows as it
> recedes and disappears into mist at the far bend. Dark mossy banks and
> heavy overhanging trees frame both edges in near-silhouette. Thick still fog
> fills the middle distance so the far forest dissolves entirely. The canopy
> above is a dark unbroken mass. Ferns and a few rust-brown fallen leaves on
> the near bank are the only warmth. Deeply desaturated toward dark forest
> green, olive not emerald, very low contrast, glassy, silent. Shot on
> Hasselblad X2D 100C with XCD 38V f/2.5 at f/9, 4 seconds on a tripod, ISO
> 64, sensor plane level, water rendered completely smooth by the long
> exposure. Kodak Portra 400 underexposed one stop, lifted matte blacks, fine
> grain. Ultra-wide 16:9 landscape, photorealistic, no people, no boats, no
> text, no reflections of sky detail.

All three use the same negative prompt as §2.

---

## 10. Non-branded fallback

A quieter, more abstract alternative that is easier to keep out of the safe
zone — swap the first two sentences of the prompt for:

> Cinematic still photograph of dense fog rolling through a stand of tall,
> straight, widely-spaced conifers at civil twilight, shot from far enough
> back that the trunks read as thin vertical dark bars against an almost
> featureless field of pale grey-green mist. The trunks cluster toward the
> left and right thirds, leaving the centre of the frame as open fog.

Keep everything from *"The canopy overhead"* onward unchanged.
