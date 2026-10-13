---
name: thorsound
description: >
  Continue the ThorSound app: a Norwegian Bondø / Bondova product that gets a
  musician from the gear they already own to a working home studio. Use this
  whenever the user mentions ThorSound, Thor, Bondø, Bondova, hjemmestudio,
  utstyr, mikrofon, lydkort, tilkobling, AI-DJ, sang, rap, musikkvideo, loops,
  sangtekst, støy, transkribering, or asks to change this music app. Also use
  it when editing studio, rig, make, video, or lyric screens in this repo,
  even if they do not say "skill".
metadata:
  short-description: "How to keep building ThorSound without breaking the product"
---

# ThorSound

ThorSound is not a toy DAW and not a joke app. The person using it owns microphones, interfaces, and cameras, and gets stuck connecting them. The useful product is the short path from that gear to sound that works. Recording, mixing, and AI come after that path, and they stay.

Read this before adding a screen, rewriting copy, or calling an AI API.

## Who it is for

Thor has autism and ADHD. That changes the interface more than the feature list.

- One task on a screen. One primary button.
- Short, literal Norwegian. Say what the control does.
- Nothing starts by itself. No auto-open panel, no generation on load.
- Do not overwrite a title, lyric, or take unless the button says that it will.
- No jokes, teasing, or metaphors. Do not mention frisbee golf, joints, or asthma in the interface. Those belong only in the existing crest, not in sentences.
- Motion stays small and always stops under `prefers-reduced-motion`. The living crystal line, the light on the gear path, a 0.96 press on buttons, a short panel fade, and a chevron nudge are the motion. Do not add bounce, shake, or a second animation system.

## Look

Stay inside the tokens in [src/styles.css](src/styles.css). Marine `#0a1128`, sand `#f4efea`, crystal `#2ec8e6`, gold `#d4a24a`, violet `#6c4dff`. Text is sand on marine. The mark is already in `public/` (crest, `logo.svg`, `favicon.svg`). Do not redraw the logo and do not restyle the app into cards, gradients, or a playful toy.

The name on screen is **ThorSound**. Older names (Lydvenn, Thorøisjen Jakkobbsen) are gone.

## Order of the product

The home screen is the rig: catalog, connection guides, setup builder, troubleshooting, and notes from people who tried a guide with their own gear. That is [src/lib/studio/rig.ts](src/lib/studio/rig.ts) and [src/components/studio/rig-screen.tsx](src/components/studio/rig-screen.tsx). New gear or a new goal belongs there, as a concrete setup with steps, not as a new essay.

The studio is the second door, labeled as what you do once the sound works. Jobs live in [src/components/studio/jobs.tsx](src/components/studio/jobs.tsx). Until a song has audio, only the **Start** group is open: record, gear, monitor, clean, AI-DJ. Other groups appear after audio exists, or when the user asks to see every tool. Do not put a new job in Start unless the user can use it before they have a recording.

## Copy

User-facing strings are Norwegian, present tense, one idea.

Good: "Last opp minst én kort lyd."
Bad: "La oss spinne en magisk låt av vibe-en din."

Say the limit in the same sentence as the promise. If a film is 6 seconds, the button's explanation says 6 seconds. If a voice speaks and does not sing, say that before they press.

## Features that already have a contract

Keep these honest. Extending them is fine. Replacing them with a fake result is not.

| Job | What it really does | Where |
|---|---|---|
| Utstyr | Match owned gear to a goal and a step list | `rig.ts` |
| Rens | High-pass, EQ, compressor, gate. Then optional transcription | `clean.ts`, `/api/transcribe` |
| AI-DJ | Up to 4 short clips, arranged with beat and bass, plus lyrics. Rap adds a spoken voice. A song does not get a sung vocal | `dj-mix.ts`, `make-panel.tsx` |
| Musikkvideo | Two photos (you, and the person you play with). 6 second vertical film. Both faces should follow the photos | `make.server.ts` |
| Forside | One picture from text, or from one uploaded image | `make.server.ts` |
| Loop | A region that repeats, including drums | `audio.ts`, `loop-panel.tsx` |
| Filmklipp | Trim, and split a long video for TikTok, Instagram, Shorts | `video.ts` |
| Lagre | WAV and MP3 always. Other formats only if the browser can write them | `formats.ts` |
| Rådgiver | Listens to the song in the browser. Sends nothing out | `advisor-panel.tsx` |
| Koble | Text and title for OBS, Prism, or a video call. ThorSound does not stream | `connect-panel.tsx` |

AI calls go through `createServerFn` in [src/lib/studio/make.ts](src/lib/studio/make.ts), which imports [src/lib/studio/make.server.ts](src/lib/studio/make.server.ts) inside the handler. Follow the `xai-api` skill: user presses a button, cap the size, do not mock a reply, do not put the key in the client. Chat is `grok-4.5`. A music video with two photos uses `grok-imagine-video-1.5` and `reference_images`. One photo or none uses the lite model. Spoken rap uses `POST /v1/tts` with `voice_id: "eve"`.

There is no API here that sings or that turns pocket audio into a finished commercial song. Do not describe the mix as that.

## How to add something

1. Put it on the existing screen that already does that job. A new route is a last resort.
2. Add the job id to the `JobId` union and to one group in `jobs.tsx`, then a `case` in `panels.tsx`.
3. If it needs files from the user, accept them in the panel they are already standing on. Do not invent a second upload flow.
4. If it spends the API key, the button label is the only trigger.
5. Keep the empty state usable. A song with no audio still shows Start.

## Do not

- Open the app on a blank DAW and hide the gear path.
- Auto-start recording, playback, or generation.
- Flatten every job into one long list.
- Promise a sung vocal, a full-length music video, or a stream that leaves the phone.
- Write a new visual system, a new logo, or English UI copy.
- Store personal recordings in a shared database. Songs stay in the browser.
- Replace `make.server.ts` or `make.ts` with a partial file. Those two files hold every AI entry point. Edit them in place.

## Checks

After a change, the home screen still explains gear before songs, Start is the only studio group before audio exists, and any new sentence can be read once and followed. `npm run typecheck` passes. For anything a person clicks, open the screen and read the new words. Do not claim a control works because the file saved.
