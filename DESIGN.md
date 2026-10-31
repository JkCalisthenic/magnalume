---
name: Magnalume
description: Sports chalk that glows under UV, shown as a blackout mineral room the visitor lights by hand.
colors:
  emission-lime: "#9dff12"
  lime-deep: "#7fdc00"
  uv-violet: "#5b3bff"
  blackout: "#030304"
  blackout-scrim: "#040406"
  daylight: "#eceded"
  bone: "#eceadf"
  ink: "#121214"
  soft-uv: "#e2e0e4"
  soft-white: "#2a2a2e"
  dim-uv: "#b5b3c2"
  dim-white: "#45454d"
  line-uv: "#70717c"
  line-white: "#77777f"
  paper-uv: "#cdd1ff"
  paper-white: "#ece8dc"
  paper-ink: "#15142a"
  chalk-pale: "#cfdfca"
  band-ink: "#070a02"
  action-ink: "#050505"
  switch-housing: "#111214"
  switch-edge: "#34353a"
  ok-white: "#2c6500"
  bad-uv: "#ffb19a"
  bad-white: "#a32a00"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.7rem, 7vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.022em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 4.9vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.022em"
    fontVariation: "'wdth' 125"
  headline-route:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5.6vw, 5.4rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.022em"
    fontVariation: "'wdth' 125"
  route-line:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 2.9vw, 2.7rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.012em"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 3.8vw, 3.4rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 125"
  lead:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.4vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
  body-large:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.5
  support:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  action:
    fontFamily: "Archivo, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 800
    lineHeight: 1
    fontVariation: "'wdth' 112"
  action-small:
    fontFamily: "Archivo, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 800
    lineHeight: 1
    fontVariation: "'wdth' 112"
  switch:
    fontFamily: "Archivo, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.02em"
    fontVariation: "'wdth' 110"
  label-title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: 1.25
    fontVariation: "'wdth' 100"
  label-note:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.25
    fontVariation: "'wdth' 88"
  label-number:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "0.04em"
    fontVariation: "'wdth' 88"
rounded:
  none: "0px"
  pin: "50%"
spacing:
  gutter: "clamp(1.25rem, 4vw, 3.5rem)"
  section: "clamp(5rem, 10vw, 8rem)"
  band-cut: "3.5vw"
  copy-gap: "1.4rem"
components:
  button-primary:
    backgroundColor: "{colors.emission-lime}"
    textColor: "{colors.action-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.none}"
    padding: "0.92rem 1.7rem"
  button-primary-hover:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.action-ink}"
  button-primary-small:
    backgroundColor: "{colors.emission-lime}"
    textColor: "{colors.action-ink}"
    typography: "{typography.action-small}"
    rounded: "{rounded.none}"
    padding: "0.62rem 1.05rem"
  lamp-switch:
    backgroundColor: "{colors.switch-housing}"
    textColor: "{colors.dim-uv}"
    typography: "{typography.switch}"
    rounded: "{rounded.none}"
    padding: "3px"
  lamp-switch-thumb-uv:
    backgroundColor: "{colors.uv-violet}"
    textColor: "#ffffff"
    padding: "0.46rem 0.72rem"
  lamp-switch-thumb-white:
    backgroundColor: "{colors.bone}"
    textColor: "#000000"
    padding: "0.46rem 0.72rem"
  specimen-label-uv:
    backgroundColor: "{colors.paper-uv}"
    textColor: "{colors.paper-ink}"
    typography: "{typography.label-note}"
    rounded: "{rounded.none}"
    padding: "0.55rem 0.75rem 0.6rem"
  specimen-label-white:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.paper-ink}"
    typography: "{typography.label-note}"
    rounded: "{rounded.none}"
    padding: "0.55rem 0.75rem 0.6rem"
  choice-chip:
    textColor: "{colors.bone}"
    typography: "{typography.support}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0.85rem"
  choice-chip-selected:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.blackout}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0.85rem"
  underline-input:
    textColor: "{colors.bone}"
    typography: "{typography.body-large}"
    rounded: "{rounded.none}"
    padding: "0.72rem 0.1rem"
  nav-link:
    textColor: "{colors.bone}"
    typography: "{typography.support}"
  scroll-line:
    textColor: "{colors.bone}"
    typography: "{typography.route-line}"
  drench-band:
    backgroundColor: "{colors.emission-lime}"
    textColor: "{colors.band-ink}"
  drench-band-white:
    backgroundColor: "{colors.chalk-pale}"
    textColor: "{colors.band-ink}"
---

# Design System: Magnalume

## Overview

**Creative North Star: "The Mineral Room"**

Magnalume is a room for looking at fluorescent minerals, with the lights off. The screen is a blackout ground; a violet lamp rakes across the scene and whatever carries chalk answers in lime. Colour is not applied to this system, it is emitted. The lamp is already on when the visitor arrives. The opening stage holds that moment still as a photograph; below it the lamp is theirs: they steer it, narrow it, walk it up a wall by scrolling, or strike it over to white light. Everything on the page, type included, stands in that same room.

The room travels. A stage can be a rock face, a wall carrying a fingerprint, or a calisthenics park at night, and the same two lights and the same paper labels go with it. The direction asked for specimens waiting in blackout until the switch is thrown; the build rests with the UV on, and that is the behaviour recorded here. It also asked for a live chalk cloud and a clap on the opening stage; the build dropped both for a composed photograph.

The system has exactly two conditions, UV and white light, and one wall switch moves between them. White light does not reskin the page into a light theme: it is the same room with the tube on, so the rock shows its grey stain, the chalk goes pale, the specimen paper goes from optical blue back to bone. A night photograph stays a night photograph, so what stands on it stays light on dark. The transition is a strike, a fluorescent tube stuttering and catching, never a fade.

Density is low and the voice is loud in a single register: expanded heavy italics on the same lean as the wordmark, against very little else. Small print lives on paper specimen labels, the only furniture the room owns.

**Key Characteristics:**
- Two lighting states driven by one number, never a light and dark theme.
- Colour as emission: violet is the lamp, lime is the response.
- UV is the rest state; nothing depends on the visitor finding the switch.
- The visitor drives the lamp, by pointer, finger or scroll.
- Sharp, oblique geometry on one slant, set by the lean of the wordmark.
- Paper appears only at specimen-label scale.
- One lime drench is the only flat field of colour; lit scenes may carry far more lime, as light.
- Everything reads correctly with WebGL or the lamp unavailable.

## Colors

A near-black ground carrying two physically motivated colours, with every neutral defined twice, once for each lighting state.

### Primary
- **Emission Lime** (#9dff12): what chalk gives off. It is the glow in the lit scenes and on the chalked hands and bar of the opening photograph, the logo slash and final e, the one action plate, the drench band, and the interaction marks (caret, selection, nav underline, and focus and confirmation text under UV).
- **Deep Lime** (#7fdc00): browser chrome only, the scrollbar thumb. It never appears in the page itself.

### Secondary
- **UV Violet** (#5b3bff): the lamp itself. Almost all violet in the system arrives as light in the WebGL scenes and relit imagery. On flat interface it appears only as the lit thumb of the lamp switch.

### Neutral
- **Blackout** (#030304) and **Daylight** (#eceded): the room's ground in each state. **Blackout Scrim** (#040406) is the dark end of the gradients that hold copy over lit scenes; those scrims end on Daylight in white light.
- **Bone** (#eceadf) and **Ink** (#121214): primary text. Bone also fills the white-light switch thumb and the hover wipe on the action.
- **Soft** (#e2e0e4 under UV, #2a2a2e under white): paragraph copy beside headlines.
- **Dim** (#b5b3c2 under UV, #45454d under white): the note beside the large switch, legends, field labels, the footer note.
- **Line** (#70717c under UV, #77777f under white): the footer divider, chip outlines, input underlines. It holds at least 3:1 against the ground in both lights (4.26:1 and 3.79:1), because it bounds controls.
- **Specimen Paper** (#cdd1ff under UV, #ece8dc under white) with **Paper Ink** (#15142a): paper with optical brightener. It goes blue under the lamp and returns to bone under the tube.
- **Pale Chalk** (#cfdfca): the drench band with the tube on, carrying **Band Ink** (#070a02) in both states.
- **Switch Housing** (#111214) and **Switch Edge** (#34353a): the fixed hardware of the switch. It stays dark in both states because it is an object on the wall, not a surface of the room.
- **Focus**: Emission Lime under UV, Ink under white, because lime on Daylight is 1.07:1. It marks the focus ring and the focused input underline.
- **Status**: Ok (Emission Lime under UV, #2c6500 under white), Bad (#ffb19a under UV, #a32a00 under white).

### Named Rules
**The Emission Rule.** Violet is the lamp and lime is the answer. Neither is a decorative fill: a colour on this page needs a physical reason to be lit. Chalked hands and a chalked bar blazing in a photograph have that reason; a lime panel behind a paragraph does not.

**The One Variable Rule.** Every room colour is a mix between its UV and white value, driven by a single `--white` number from 0 to 1. Anything that must react to the room joins that mix. There is no separate theme and no `prefers-color-scheme` branch; the visitor's hand decides. The Night Photograph Rule is the one exception.

**The Action Survives the Tube Rule.** Emission Lime on the action plate holds in white light, because it is pigment on a button. The drench band, which is chalk glowing, drops to Pale Chalk.

**The Night Photograph Rule.** A stage built on a photograph that stays night in both lights holds its foreground, soft, dim and scrim colours at their UV values, and so does the nav while it sits over that stage. White light changes the picture, never what can be read on it.

## Typography

**Display Font:** Archivo variable, italic, expanded (with system-ui, sans-serif)
**Body Font:** Archivo variable, roman (with system-ui, sans-serif)

**Character:** One family pulled to both ends of its axes. Headlines run expanded, heavy and italic, like a wordmark sliding off the wall; everything that explains runs upright and quiet; label print condenses like a catalogue.

Italic and width are load-bearing. Display, headline, title, route line, action and switch roles are all italic, as is the English tagline in the footer (700, width 112%); width comes from `font-stretch` on the self-hosted variable files (62% to 125%, weight 100 to 900). The frontmatter's `fontVariation` carries width; italic is recorded here and in the sidecar because the token schema has no slot for it.

### Hierarchy
- **Display** (italic 800, clamp(2.7rem, 7vw, 6rem), 0.98, width 125%): the one page statement. Second clause drops to its own line.
- **Headline** (italic 800, clamp(2.1rem, 4.9vw, 4.5rem), 0.98, width 125%): section statements, balanced, at most a few short lines. This is the full size; the product heading caps lower at 3.75rem and the closing heading at 3.9rem, on about the same floor. The two headings on the pinned wall rise past it (clamp(2.4rem, 5.6vw, 5.4rem)), because each stands alone on the stage.
- **Route Line** (italic 700, clamp(1.6rem, 2.9vw, 2.7rem), 1.12, width 112%, -0.012em): the sentences that travel over the pinned wall, one at a time, held to 21ch. It shares the footer tagline's register, a step below a headline.
- **Title** (italic 800, clamp(1.9rem, 3.8vw, 3.4rem), 1.02, width 125%): numbered steps inside the drench band; the numerals match it.
- **Lead** (400, clamp(1.0625rem, 1.4vw, 1.25rem), 1.5): the paragraph under the display line, up to 31rem wide.
- **Body** (400, 1.0625rem, 1.5; 1rem at 760px and under): paragraphs, held to 24 to 34rem.
- **Body Large** (400, 1.125rem, 1.5): the input text, and the line under each step in the drench band, where it rises to weight 500.
- **Support** (400 to 500, 0.9375rem): nav links, the note beside the large switch, legends, field labels, chips, status text. The footer note drops to 0.8125rem in Dim.
- **Action** (italic 800, 1.0625rem or 0.9375rem, 1, width 112%): the action plate only.
- **Switch** (italic 700, 0.8125rem or 1.0625rem, 1, width 110%, 0.02em, uppercase): the two words on the lamp switch, the only uppercase in the system.
- **Label** (0.75rem 800 number with 0.04em tracking, 0.9375rem 700 title, 0.8125rem note at width 88%, all 1.25): specimen print.

### Named Rules
**The Slanted Voice Rule.** Anything that speaks loudly is italic expanded Archivo; anything that explains is upright. A sentence alone on a stage speaks even when it explains, so it stays italic. A heavy upright headline does not exist here.

**The Short Sentence Rule.** Display and headline text are short full sentences ending in a full stop, or a question mark when they ask one. They carry the page without a line above them.

## Layout

The page is a sequence of full-bleed stages, most of them a full viewport tall (100svh) on the blackout ground. Copy anchors to the left gutter and the lit subject takes the right; the opening stage sets its copy at the foot, and the pinned wall breaks the anchor on purpose, landing its lines left and right in turn. Where copy crosses a lit scene a scrim carries it without boxing it: on the opening stage a pool of 92% scrim colour in the lower left corner over a 95deg wash starting at 58%, clearing by 44% of the width; 88% at the left edge of the closing stage, clearing by 58%; 78% on the pinned wall, clearing by 46%. The bar stage needs none, because its copy sits on night sky above the bar. Those numbers describe the build and are not a recipe; what counts is the contrast at the end of the longest line, over the brightest thing behind it.

Horizontal rhythm is one gutter, clamp(1.25rem, 4vw, 3.5rem), shared by the nav, sections, and footer. Text blocks have measures, not columns: headline blocks 27 to 56rem, paragraphs 24 to 34rem. The one true grid is a 7fr / 5fr split where a headline meets its explanation. Vertical gaps are generous and stated per pairing: about 1.1rem to 1.4rem from statement to paragraph, about 2rem to the action or form.

A stage may be pinned while scrolling (the wall runs 340vh) so the lamp walks a path, the copy takes turns, and the visitor stays still. The drench band overlaps its neighbours by the same 3.5vw it cuts from its top and bottom edges, so the join reads as a slanted slice.

Responsive behaviour has two steps. At 1060px the nav links go and the two-column heading stacks. At 760px copy moves to the bottom of scrimmed stages, scrims rotate to rise from the bottom edge, and the lit subject takes the top of the screen; the bar stage keeps its copy at the top, with the bar below it. The opening photograph swaps to a tall crop of the same scene, the wall's lines drop to 66% of the stage over a rising scrim, pin callouts become a plain list under the image, the opening label steps into the flow above the copy, and the field stacks over its button.

## Elevation & Depth

Depth comes from light, not stacking. Scene stages are flat canvases whose relief is computed: surfaces are relit per frame from a height map, so they rise as the lamp rakes across them. Interface elements sit directly on that scene with no panels between. Only two kinds of object cast anything, and both are physical: the action plate glows because it is lime, the paper label casts a soft shadow because it is paper held off a wall. Lines crossing the pinned wall carry a soft breath of scrim colour, which is a scrim shaped to the letters, not elevation.

### Shadow Vocabulary
- **Action glow** (`box-shadow: 0 .6rem 2rem -.6rem rgba(157, 255, 18, .55)`): under the action plate; widens to `0 .8rem 2.8rem -.5rem rgba(157, 255, 18, .8)` on hover.
- **Paper drop** (`box-shadow: 0 .75rem 1.5rem -.5rem rgba(0, 0, 0, .8)`): under labels and pin callouts.
- **Paper halo** (`box-shadow: 0 0 1.6rem -.6rem #7c7dff`, fading to transparent as `--white` reaches 1): the optical brightener answering the lamp, on specimen labels only.
- **Lamp glow** (`box-shadow: 0 0 1.1rem rgba(91, 59, 255, .75)`): the lit switch thumb.
- **Scroll line breath** (`text-shadow: 0 .1em .9em`, scrim colour at 80%): scroll lines only.

### Named Rules
**The Light Is the Elevation Rule.** Depth is what a lamp reveals. A shadow is allowed only where a real object or a real glow would make one, and all of them are soft.

## Shapes

Corners are square everywhere: buttons, switch, labels, chips, inputs, pin callouts (0px). The system's signature form is the oblique: the action plate and the switch are skewed by -14deg, just under the 15 to 17deg lean of the wordmark's stems, while their text is counter-skewed or set italic so it stays readable. The lime slash through the M is a far steeper stroke (about 54deg off vertical) and is not the system's angle. The drench band has its own cut: both edges climb 3.5vw across the full width, a parallel slice of about 2deg.

Softness belongs to the world, not the interface. Chalk marks, drips, handprints and dust are organic and irregular, and the rock is fractured. The fingerprint is the one recurring mark: dark ink on the drench band, lime emission on the closing wall. It is procedural, never a real person's print. Paper labels sit slightly off true (about -1.4deg to 1.2deg), as if pinned by hand. The single true circle is the small ring at the end of a pin leader.

## Components

### Buttons
Heavy, oblique, and rare: one action in one colour.
- **Shape:** a skewed plate at -14deg with square corners (0px). The skew is on pseudo-layers, so the label stays in place.
- **Primary:** Emission Lime with near-black italic text, 0.92rem by 1.7rem, with action glow.
- **Hover / Focus:** Bone wipes across from the left over 0.45s while the glow widens over 0.4s. The label drops 1px on press. Focus is the global 2px ring in the Focus colour, offset 3px.
- **Disabled:** 45% opacity, no wipe.
- **Small:** 0.62rem by 1.05rem at 0.9375rem, in the nav, with the same wipe.

### Choice Chips
- **Style:** square outlined tags, 1px Line, Support type, 0.5rem gap.
- **State:** hover takes the foreground colour on the outline; checked fills with the foreground colour, flips text to the ground colour, and rises to weight 600. These are real radios, visually hidden, with the focus ring on the chip.

### Inputs / Fields
- **Style:** no box. A 2px Line underline on transparent, with 1.125rem text and a Dim label above.
- **Focus:** the underline takes the Focus colour over 0.2s.
- **Error:** the underline and status line take Bad, with a sentence saying what to fix. Confirmation takes Ok.

### Navigation
- **Style:** fixed, gutter-wide bar: logo left, links, switch, small action. Over scenes it sits on a scrim gradient; from the product heading until the drench band has passed it turns solid ground, so lime never runs under the logo. Over the opening stage it follows the Night Photograph Rule.
- **Links:** Support at weight 500; hover draws a 2px lime underline offset 0.3em.
- **Mobile:** links leave at 1060px, the small action at 760px; logo and switch stay.

### Lamp Stage
The signature. A full-bleed WebGL2 scene, relit every frame by a violet lamp with lime emission where chalk lies. Three exist: the fractured rock wall with holds, the free bar in a night park with liquid chalk running off it and bare grip marks showing violet through, and the wall carrying the fingerprint.
- **Holding:** the pointer or finger is the lamp, followed with an exponential ease at rate 9. A tall stage may pin and let scroll walk the lamp along a path instead, at the firmer rate of 12.
- **Idle:** after about 3 seconds the lamp drifts on its own at a slower rate (1.8 to 3), so a still screen is never dead. With reduced motion the drift is removed.
- **Fallback:** without WebGL, canvases hide, stages fall back to relit imagery or a dim violet radial (#1a1050) on ground, and the pinned wall stops pinning. Copy must never depend on the canvas.
- **White light:** the scene moves to its room render through the same `white` value as the page.

### Lit Image Pair
How a photograph or render stands in the room, used by both the opening stage and the product plate.
- **Structure:** the white-light image, a dim layer (92%, removed by white light), and the relit UV image on top, masked to a soft radial circle. The two images are the same frame, the UV one derived from the white one, so a fixed point in the picture holds in both.
- **Lamp:** on the product plate the circle closes to 34vw at the pointer over 0.8s and opens to the full frame when the pointer leaves, so UV is the rest state, never a blank one. Everything outside the circle falls dark, which is how the hand reads as a lamp. Touch does not track the mask. The opening stage has no lamp; its mask stays open.
- **Lighting:** a pair answers only to the room's white value. Lamp power flicker reaches WebGL layers, not photographs, so a strike to UV shows on the photo as one cut.
- **White light:** the white image is shown as it is. On the opening stage that image is the night photograph itself, and the Night Photograph Rule holds its scrim and text. A pair is the same picture in two lights, not a day shot.

### Opening Stage
A composed night photograph, held still.
- **Image:** a full-bleed Lit Image Pair, 7:4 wide with a 9:16 crop of the same scene below 760px, composited from separate renders so its people and bar sit where the copy leaves room.
- **Behaviour:** no canvas, no pointer response and no animated layer. Only the switch changes it, so it needs no WebGL fallback.
- **Copy:** Display, Lead and the action at the foot of the left side, with a specimen label in the lower right corner.

### Scroll Lines
The pinned wall's copy, one line at a time, driven by scroll alone.
- **Structure:** headings and Route Line sentences, each assigned a side, alternating left and right.
- **Motion:** each line owns an equal share of the pinned scroll. It enters from its side over the first 28% (9vw, cubic ease-out), holds, and leaves upward over the last 28% (11vh), fading both ways. The first line starts in place, the last never leaves, and scrolling back replays them.
- **Placement:** 42% down the stage, up to 34rem or 46vw wide, right-side lines set flush right; 66% down at 760px and under.
- **Legibility:** right-side lines fall past the scrim and rely on the scroll line breath, so test them at the lamp's brightest point.
- **Reduced motion:** the lines rest as one static stack centred in the stage, with no travel.

### Lamp Switch
A physical rocker, the only control over the room.
- **Shape:** a skewed two-position housing with Switch Housing fill and a 1px Switch Edge, 3px inset, thumb sliding over 0.28s. Two words, Luz and UV, counter-skewed upright into the italic.
- **State:** UV position has the violet thumb with Lamp glow and white text; white position has the Bone thumb and black text. Exposed as `role="switch"` with `aria-checked`.
- **Strike:** switching runs stepped power keyframes instead of a transition, about 380ms to white and 460ms to UV, with a short synthesized click. Reduced motion jumps to the final frame.
- **Large:** 1.0625rem with 0.8rem by 1.35rem positions, used beside the product. While it is in view the nav instance hides, so one switch is visible at a time, and both always show the same state.

### Specimen Label
Paper from the mineral cabinet.
- **Structure:** catalogue number (Nº 001), name, and a dry field note, at most 13.5rem wide, on Specimen Paper with Paper Drop and Paper Halo.
- **Placement:** in the lower corner of a stage, slightly rotated, in both lights.

### Pinned Plate
The product held still for inspection: a Lit Image Pair with annotations.
- **Image:** 16:9, 1:1 on mobile.
- **Pin callouts:** a 1px white leader ending in a small ring, with a square paper callout up to 13.5rem wide.

### Drench Band
The one flat field of colour, chalk everywhere.
- **Style:** full-bleed Emission Lime with Band Ink, top and bottom cut by the band-cut slant. A single huge dark fingerprint bleeds off the right edge and turns about 30deg across the scroll; it holds still with reduced motion, and under 760px it drops to the foot of the band.
- **Content:** few words per step, with oversized numerals counted in the title style.
- **White light:** the field drops to Pale Chalk.

## Do's and Don'ts

### Do:
- **Do** set every new surface on the blackout ground (#030304) and give the visitor's hand something to light.
- **Do** route every colour that must react to the room through the single `--white` mix, with a UV and a white value.
- **Do** cut new oblique forms to -14deg, the system's slant, and keep corners square (0px).
- **Do** set anything loud in italic expanded Archivo (weight 800, width 125%) and anything explanatory upright.
- **Do** make the lamp state change with stepped flicker keyframes, ending on the same final frame for reduced motion.
- **Do** keep small print on specimen paper, at label scale, with a number and a dry note.
- **Do** disclose computer-made imagery on the page, keep a provenance record beside every shipped raster, and give every image a UV and a white-light version of the same frame when it lives in the room.
- **Do** test copy over a lit image at the end of its longest line, against the brightest thing behind it, in both lights.
- **Do** give every WebGL stage a static fallback that keeps all copy and the action.
- **Do** hold text on a night photograph to its UV values in both lights.
- **Do** let scroll-driven copy enter from a side and leave upward, and rest as a static stack under reduced motion.

### Don't:
- **Don't** fill interface surfaces with violet; beyond the lit switch thumb it exists only as lamp light in scenes and relit imagery.
- **Don't** use lime as decoration. It marks emission, the logo, the one action, and interaction state.
- **Don't** add a second flat drench field, or give the lime plate to a second, different action; every plate leads to the same list. Lime light in a scene or photograph is emission and does not count as a drench.
- **Don't** treat white light as a light theme with its own layout; only the light changes, nothing moves.
- **Don't** fade between lighting states; a tube stutters and catches.
- **Don't** enlarge paper into cards or panels; 13.5rem is its scale.
- **Don't** lift the Nº catalogue number out of a label to sit above a headline as an eyebrow.
- **Don't** show two lamp switches at once, or let two switches disagree.
- **Don't** add hard offset shadows; every shadow here is soft and motivated by a real object or glow.
