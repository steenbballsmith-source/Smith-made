# Putting Claude on your computer

For Steen. Written 2026-07-30, updated **2026-08-01** after you asked again.

**Short answer: yes, and you are two minutes away.** The thing you've been
talking to in a browser also runs directly on your Windows PC, the same way
Codex does. It's called **Claude Code**. Same assistant, but with your actual
files in front of it instead of a copy of one GitHub repo.

---

## ⚡ READ THIS FIRST — the install is ALREADY DONE. One step left, and it's yours.

**There is nothing to download and nothing for Codex to do.** Codex installed
Claude Code on Thursday July 30 and verified it works: the command answers
`2.1.220 (Claude Code)` from a fresh window. The "not recognized" error you hit
was from *before* that install — it's fixed. The board entry is `OPS-LOCAL-001`
if you want the proof.

The one remaining step is the login, and it stalled for two days only because
it needs **you at the PC** — no agent is allowed to log in as you, anywhere,
ever. That's not a setting; it's the line that keeps an agent from being able
to impersonate you.

**The whole thing, at the computer:**

1. Click **Start**, type `powershell`, press **Enter**. Blue window opens.
   (Must be a *new* window — an old one that was open since before Thursday
   won't know the command exists.)
2. Paste this and press Enter:

   ```powershell
   cd C:\Users\SJ
   claude
   ```

3. Your **browser opens**. Log in with the same Claude account you already pay
   for — the one you're reading this with. Approve it. Done. It remembers
   forever; you never do this again.

4. Back in the blue window, type this as your first message:

   ```
   Read C:\Users\SJ\CLAUDE.md and C:\Users\SJ\.claude\ops\, then pull the
   claude/codex-team-coordination-shomkq branch of the Smith-made repo and
   read ops/AGENT_BOARD.md and ops/HANDOFF-TO-CODEX.md. Tell me the three
   most useful things you can do from this machine that cloud Claude can't.
   ```

If it answers with real specifics — the ops files Codex wrote, the open board
tasks — then you have what you asked for: Claude with your actual computer.

---

## What "as much freedom as possible" looks like — honestly

You've said it plainly, so here is the honest map of the dial, from cautious
to maximum:

1. **Default:** it asks before every file change. Safe, chatty.
2. **`acceptEdits`** *(press **Shift+Tab** inside Claude to switch)*: it stops
   asking about file edits, still asks before commands. **This is the setting I
   recommend for you.** You can also tell it *"set up permissions so you stop
   asking about git commands"* and it will pre-approve the routine stuff.
3. **Maximum:** there is a full-bypass switch — start it as
   `claude --dangerously-skip-permissions` and it never asks about anything.
   You asked for maximum freedom, so I'm telling you it exists rather than
   hiding it. **I'd wait a few days before using it.** The name is honest: on
   your machine there is no draft-PR safety net between a mistake and your live
   business. Watch it work on setting 2 first; move to 3 when you've seen
   enough to trust it. It's your machine and your call.

**What stays true on every setting:** it won't use your passwords, won't get
past 2FA or CAPTCHAs, and stops for your say-so before money, deletions,
sending things to real people, and publishing to production. Those aren't
dials.

---

## What actually changes for you

Right now, from the cloud, I can't see:

- `C:\Users\SJ\.claude\ops\` — every file Codex built. All eight. I've never
  read one.
- `C:\Users\SJ\Smith-Digital-Site\index.html` — the file with the broken audit
  form in it.
- Your live websites. The network here blocks them.
- Anything else on your machine.

Installed locally, all of that opens up. Concretely, for the job that's open
right now: **local Claude could fix the Smith Digital form itself** — open the
file, find the missing bit, fix it, redeploy — instead of writing Codex a note
asking it to.

It also gets a memory. This cloud container is deleted when the session ends and
I keep nothing. On your PC, it remembers between sessions.

And Claude and Codex would finally share a filesystem. They still can't talk —
that stays true — but the ops folder becomes instant instead of needing a push
to GitHub and a pull back down.

## Installing it — SKIP. Already done.

<details>
<summary>Kept only for the record — Codex ran all of this on 2026-07-30.
Running the installer again is harmless but pointless. Git was already
installed too.</summary>

The installer was `irm https://claude.ai/install.ps1 | iex`, verified with
`claude --version` returning `2.1.220 (Claude Code)` from a fresh shell, with
the PATH entry `C:\Users\SJ\.local\bin` added. Log: `2026-07-30-C19`.

</details>

## If you'd rather not use a terminal

There's a desktop app — a normal window, no typing commands:
https://code.claude.com/docs/en/desktop

Same assistant. The terminal version is more capable and is what Codex-style
work needs, but if the blue window puts you off, start with the app. You can
have both.

---

## "Less limitations" — what's real and what isn't

Some of what stops me is a setting. Some isn't. Worth knowing which is which
before you go looking for a switch that doesn't exist.

**Genuinely adjustable:**

- **How often it asks permission.** By default it asks before every file change.
  Press **Shift+Tab** inside Claude to cycle modes — `acceptEdits` stops asking
  about edits, `plan` makes it propose without touching anything.
- **Pre-approving specific commands**, so it stops asking about the ones you
  always say yes to. Ask it: *"set up my permissions so you stop asking about
  git commands."* It'll do it.
- **What it can reach.** Point it at a folder and that's its world. Point it at
  `C:\Users\SJ` and it has the lot.

**Not a setting, and won't be:**

- **It won't use your password or log in as you.** Not a restriction I can
  loosen — it's the line that keeps an agent from being able to impersonate you.
  When something needs a login, it stops and hands it to you.
- **It asks before things that are hard to undo** — sending an email, publishing
  a page, spending money, deleting files. You can tell it "go ahead" once and it
  won't re-ask for that thing. But it won't send three venue emails on its own
  initiative because it seemed like a good idea.
- **It still won't claim it talked to Codex.** Two agents on one machine share
  files, not thoughts.

Fair warning on the first one: `acceptEdits` is genuinely useful and also
genuinely how you end up with changes you didn't read. On your own machine
there's no PR sitting between a mistake and your live site. Keep the default
until you've watched it work a few times.

## What to do the day you install it

1. `cd C:\Users\SJ` and run `claude`.
2. Ask it to read `C:\Users\SJ\.claude\ops` — the files I've never seen.
3. Ask it to read `ops/HANDOFF-TO-CODEX.md` in your Smith-made repo — the
   Netlify form fix.
4. Then hand it the job directly: *"the audit form on smithdigitalco.com isn't
   capturing anything — find out why and fix it."* It has the file. It can.
