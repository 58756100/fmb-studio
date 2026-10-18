# Production standards (Wayne, 2026-10-15). Every lane, every agent.

These override older notes in skills, lab files and past scripts wherever they disagree.

## Finished video
- **No on-screen labels like "Illustrative example" / "Illustrative story" / "demo URL".** Use fictional names and records, keep every claim true to live features, and let it look like a real product film.
- **No burned-in captions or subtitles by default.** On-screen headlines and story text stay. Subtitles are only for internal review copies or when Wayne asks for a captioned test.
- **Length 30–60 s, set by the concept.** Write to what the story needs: a one-turn idea runs 30–35 s; a story with a setup, a twist and a payoff can take 45–60 s. Never squeeze a 60 s story into 30 or pad a 30 s idea to 60. State the target length and why at the top of each script.

## Voice: conversational, not robotic
- Write how people actually talk: full flowing sentences that connect ("so", "and then", "which is why", "honestly"), natural fillers used sparingly ("look,", "okay so", "right?"), contractions, and a little personality. No stacks of three-word fragments.
- Each line hands off to the next. A viewer who only hears the audio should understand the story.
- Within the first 3–5 s the viewer must know what the video is about and who it's for.
- ElevenLabs: eleven_v4 (latest; same credit cost as v2). Keep stability lower for liveliness and let the voice breathe; don't over-tighten pauses.

## Visual flow: transitions that mean something
- Every transition carries the story: the object we talk about becomes the next scene (match cuts, morphs, a card that opens into the next idea, the camera following an action). No cut-to-unrelated-layout.
- Text moves with the voice and with the scene: it enters from where the action is and leaves into the next beat. Nothing just pops on and sits there.
- Always alive (motion skill): no still half-second.
- You may bring in new animation assets (Lottie, SVG packs, open-licence motion libraries, new remocn pieces) when they lift the work. Log the source and licence in the project.

## Call to action: rotate, push to fuelmybuild.com
Use a different CTA family on consecutive posts. Each CTA fits the story's audience:
- **Done-for-you:** "Comment BUILD and we'll set up your build page for you. No setup on your end." / "DM us your car and we'll build the page." (needs comment/DM replies, see the 2-week plan)
- **Link:** "Your build page is waiting at fuelmybuild.com. Link's in the bio." / "Start your car's record at fuelmybuild.com."
- **Audience-specific:** shops "DM 'SHOP' and we'll load your first builds for you"; brands "DM 'PARTS' and we'll show you where your parts end up" (no supplier-page promise until it's live).
- **Share/save:** "Send this to the friend who still keeps receipts in a glovebox."
Never stack two CTAs. The CTA sits over the final story frame.

## Uniqueness across all lanes
- One shared registry: `state/visual-bank.md` (premises, devices, props, car+part pairings, looks) covers lane 0, A, B and C. Every lane checks it before writing and adds to it once made.
- ChatGPT lanes get the list of premises already taken (premise lines only for lane A, so it stays blind to our style; the full bank for lane B).
- The same premise never ships twice across lanes. Hook variants of one body count as one premise.

## ChatGPT lanes (A and B)
- ChatGPT owns the concept, story, script and hooks. Claude owns the build and may upgrade its UI, layout, motion and transitions to production level (it should never look "AI" next to the other lanes). For lane A, keep ChatGPT's concept and its broad look (palette, mood) but craft the execution properly.

## Images
- Build from the image bank (`kit/remotion/public/img/bank/`, see `lab/image-requests/image-bank-v2.md`). Prefer real-looking photos and clean cutouts over code-drawn stand-ins. If a scene needs an image the bank lacks, add a prompt to the next image request rather than faking it.

## Collector reels (Wayne, 2026-10-18)
- About a third of collector-audience reels open by naming the audience in the first 2 seconds ("Car collectors…", "If you collect cars…", "Every collector knows…"), so the right viewer knows it's for them.
- Collector reels may use the high-end collector bank (`lab/image-requests/image-bank-collectors.md`: $1M–$20M-class cars, auction, concours and private-garage settings). Never name the maker or model on screen or in the voiceover, never show a badge, and never imply a brand's endorsement. Owners and collections are fictional.
- Stakes for this audience are provenance, matching numbers, documented ownership history, restoration records and auction value. Don't invent prices or claim the record changes a valuation.

## Names (Wayne, 2026-10-18)
- Never use placeholder names like "Shop A", "Garage B", "Brand B" or "Supplier C", on screen or in the voiceover. Make up believable names: garages and shops like "Benny's Garage", "Ridgeline Auto", "Pell Street Motors"; parts brands and suppliers like "Halden Brakes", "Arden Turbo", "Northline Auto Parts". The names are fictional, so check they aren't a real, well-known company, and don't reuse a name another reel has already made its hero. The used names are listed in `state/visual-bank.md`.
