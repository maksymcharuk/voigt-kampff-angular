# Voigt-Kampff Book Club

An immersive, real-time group experience inspired by “Do Androids Dream of Electric Sheep?”. One host screen on a TV controls the session while participants join on their phones to answer rapid, instinctive questions.

## Features

- Host console with session lifecycle: lobby → running → reveal
- Participant flow: join → play → result
- Firestore real-time sync
- Anonymous participant identity (local UUID)
- Dark, high-contrast UI with scanline/pulse effects

## Local setup

1) Update Firebase config placeholders in [src/environments/environment.ts](src/environments/environment.ts)
2) Install dependencies:
	- `npm install`
3) Start the dev server:
	- `npm run start`

## Routes

- /host
- /join/:sessionId
- /play/:sessionId
- /result/:sessionId

## Host controls

- Create session
- Start scan
- Advance question
- Reveal results
- Simulate participants (for dry runs)

## Notes

- Questions and scoring live in [src/app/data/questions.ts](src/app/data/questions.ts)
- Firebase config in [src/environments/environment.ts](src/environments/environment.ts) is a placeholder and must be replaced
