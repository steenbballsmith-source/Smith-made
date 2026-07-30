# Putting Claude on your computer

For Steen. Written 2026-07-30. Roughly 15 minutes, most of it waiting.

**Short answer to your question: yes.** The thing you've been talking to in a
browser also runs directly on your Windows PC, the same way Codex does. It's
called **Claude Code**. Same assistant, but with your actual files in front of
it instead of a copy of one GitHub repo.

You are not downloading a second, different Claude. It's the same one — it just
stops being locked in a box.

---

## ⚡ If you just want to get it done — two pastes

Steen approved this on 2026-07-30 while away from the machine. When you sit
down at the PC: Start → type `powershell` → Enter, then paste these.

**Paste 1** — installs Claude Code and Git, then close the window and open a
new PowerShell so it picks them up:

```powershell
irm https://claude.ai/install.ps1 | iex
winget install --id Git.Git -e --accept-package-agreements --accept-source-agreements
```

**Paste 2** — in the new window:

```powershell
cd C:\Users\SJ
claude
```

It opens your browser. Log in with the Claude account you already pay for.
That login is yours to do — no agent can do it for you, here or anywhere.

Then type this as your first message, which proves the whole thing works:

```
read C:\Users\SJ\.claude\ops and tell me what Codex has set up
```

If it reads those files back, you're done. Everything below is the longer
explanation if you want it.

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

## Before you start

You need a **Claude Pro or Max subscription** — the same login you already use.
If you're paying for Claude now, you're set.

## Installing it

1. Click Start, type `powershell`, press Enter. A blue window opens.
2. Paste this and press Enter:

   ```powershell
   irm https://claude.ai/install.ps1 | iex
   ```

3. Wait for it to finish. Then check it worked:

   ```powershell
   claude --version
   ```

   You should see a number and the words `(Claude Code)`.

**Also install Git for Windows** — https://git-scm.com/downloads/win. Click
through with the defaults. Without it Claude falls back to PowerShell and can do
less. It's a two-minute install and worth doing.

## First run

In the same window:

```powershell
cd C:\Users\SJ
claude
```

It opens your browser to log in. Do that once and it remembers.

Then just type. Try this first, since it proves the whole point:

```
read C:\Users\SJ\.claude\ops and tell me what Codex has set up
```

If it reads those files back to you, it's working, and it now knows things I
never could.

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
