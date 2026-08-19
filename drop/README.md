# `drop/` — put your stuff in here

This is the front door for anything you already have. Logo, photographs, brand
colours, fonts, your old menu, a phone photo of a sketch on paper, screenshots of
sites you like. Drag it into the folder that fits and carry on.

**You do not need a build first.** Drop things in, then tell your agent to build
you a website — the material is picked up as part of opening the build. If a build
is already open, the agent runs `node assets.mjs <slug> scan` and everything here
moves into `builds/<slug>/_intake/`, where the rest of the pipeline reads it.

| Folder | What goes in it |
|---|---|
| [`logo/`](logo/) | the actual logo files — the vector one if it exists |
| [`photos/`](photos/) | your photographs: premises, work, team, product |
| [`brand/`](brand/) | colours, brand guidelines, anything that pins the palette — a photo of your van counts |
| [`fonts/`](fonts/) | brand font files, **and** the licence that allows web use |
| [`docs/`](docs/) | menus, price lists, leaflets, certificates, an export of your old site |
| [`reference/`](reference/) | sites you love, the one you hate, screenshots, sketches — studied, never shipped |

Not sure which folder? Drop it in `drop/` itself. It still gets picked up; the
guess about what it is just gets made from the filename instead of the folder.

## What happens to it

1. It moves to `builds/<slug>/_intake/`, keeping the folder you put it in.
   Moves, not copies — so the next build does not silently inherit the last
   client's material. Nothing is deleted; use `--keep` on the scan to copy instead.
2. Every file gets a row in `builds/<slug>/assets/MANIFEST.md`: what it shows,
   where it came from, whether it is yours to publish, where it is used, its alt text.
3. That manifest is a gate, not a note. `checks/rules/assets.mjs` refuses to ship an
   image with no row, no source, or no answer on rights.

Two questions get asked about anything here, and they are worth thinking about
before you are asked: **where did this come from**, and **is it yours to publish?**
A photograph you paid a photographer for is very often still the photographer's
copyright, and "probably fine" is a real answer that is not the same as yes.

## It stays yours

Everything you put here is git-ignored. Only these README files are tracked, so
your material cannot land in a public fork by accident — and neither can the
client's. The same is true of `builds/`.

## Why this folder exists at all

The pipeline always asked for your material first, because one dropped sketch
answers twenty interview questions and a site built from nothing you own is a site
built from the model's defaults. But the folder it asked you to use only existed
*after* a build was opened, inside a git-ignored directory — so anyone who
downloaded this repo found nowhere to put anything. This is that nowhere, fixed.
