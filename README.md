# Rutuja Jabras — Portfolio

Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Run locally
Open this folder in VS Code, install the **Live Server** extension, right-click `index.html` → *Open with Live Server*.
Or in a terminal inside this folder: `npx serve .`
(Open it through a server — double-clicking `index.html` will not load the images and styles.)

## Deploy
Drag this folder into vercel.com/new. `vercel.json` already enables clean URLs.

## Pages
`/` (single scrolling page: Home, About, Skills, Projects, Hackathons, Events, Psychology, Experience, Contact)
`/projects/ip-sakti/` `/projects/burnout-attrition/` `/projects/auditx/` `/projects/kisaansaathi/` `/projects/civiccare-ai/`
`/hackathons/ai-grand-challenge/` `/hackathons/qai-lead/` `/psychology/`

## Replace a picture
Overwrite the file in `assets/img/...` keeping the same name. Key ones:
- `profile/profile.jpg` hero portrait · `profile/garden.jpg` About photo
- `psychology/green-bg.jpg` background of the Psychology section · `psychology/glimpse.jpg`
- `projects/<project>/cover.jpg` and `shot-1.jpg …` screenshots
- `hackathons/…`, `events/…` photos

## Edit text
Text lives directly in the `.html` files (home content is in `index.html`).
