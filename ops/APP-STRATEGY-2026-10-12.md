# App strategy — "build the next big app" vs. Baystead (2026-10-12)

Steen asked: an app called "Cut AI" is reportedly making its creator over $20k a
day. Should we find a huge, scalable problem and build an app for it? And should
Baystead get a mobile version so he can check on it from his phone?

Short answer: **yes to Baystead on the phone, and it's already part of the plan.
Not yet on a brand-new consumer app.** The reasons are below in plain words.

---

## 1. What that app actually is, and why it made money

No app called "Cut AI" showed up as a viral hit. The well-known story that
matches is **Cal AI**: take a photo of your food, it estimates the calories.
Two teenagers built it. Reported numbers (founder interviews and press; none
audited):

- about **$35 million a year** run rate (roughly $96k a day) as of May 2025;
- other reports say about $2M a month in revenue, or about $1.4M a month in
  profit after the app-store fees;
- 20,000–30,000 new downloads a day.

If Steen meant a different app, these numbers don't apply. Ask him for the
app's developer name and re-check.

**The idea was not new.** Calorie counting has been around for decades
(MyFitnessPal and others). What made Cal AI work was:

1. **Distribution.** Large numbers of paid influencer and creator videos on
   TikTok and Instagram, every day. This costs real money up front.
2. **The sign-up flow.** A long quiz-style onboarding, then a paywall before
   you can use the app, tested and re-tested to raise the share of people who pay.
3. **Experience.** The founder had already built and sold apps before, so he
   knew how the app stores and paid ads worked.

**What this means for the business:** consumer apps are a hits business, like
music. A few make millions. Most make close to nothing. The winners usually
win on marketing spend and funnel testing, not on having an idea nobody else had.

## 2. Baystead is already the "big problem, scalable" bet

Baystead sells software to collision repair shops. That's a different kind of
business from Cal AI, but it can get big:

- There are roughly **30,000–35,000 collision shops in the US** (industry
  estimate ~30,000; the last Census count, 2019, was ~35,000 independents).
- Shops pay every month, and they don't quit on a whim the way phone-app
  users do.
- **The math to $20k a day:** $20k a day is about $7.3M a year. At an example
  price of $300 per shop per month, that's about 2,000 shops, which is under
  7% of the US market. The $300 is only an example. Real pricing isn't set.

**The honest gap:** Baystead has **no paying customer yet**. Its own plan
(`baystead-parts` repo, `docs/BAYSTEAD-CURRENT-PLAN.md`) says the blockers are
proving the first shop's real workflow and getting the online shared service
switched on. Missing features are not the blocker. Starting a second app now
would split the time that should go to getting Baystead's first paying shop.
Going from zero to one paying customer is the hardest step in any software
business.

## 3. Baystead on your phone: yes, and it's mostly built

Phone access is already listed as a **required** part of Baystead. It's in
`docs/BAYSTEAD-COMMERCIAL-LAUNCH.md`: "The phone browser and Windows app must
show the same authorized saved work."

How it's meant to work (and why "remote control" is the wrong picture):

- It's **not** the phone reaching into the Windows PC and controlling it.
- Both the Windows app and the phone connect to **one online Baystead
  workspace**. Change a job on the PC, and it's there on the phone. Your PC
  doesn't even need to be on.
- Most of that online service is **already written** (accounts, shops, staff,
  shared parts, tasks, files, billing). It is **switched off** and has never
  been tested on real devices.
- **It doesn't need an App Store app at first.** A website that works well on a
  phone can be added to the home screen and opens like an app. You skip the
  App Store review wait and the 15–30% Apple/Google cut. A real App Store app can
  come later, once shops are using it.

What a shop owner would actually want on the phone (the first version):

1. **Today:** jobs waiting on review, parts changes waiting on approval, and
   overdue tasks.
2. **Approve or send back** a parts change from anywhere.
3. **Tasks:** see and tick off their own tasks.
4. **Alerts** when something needs them (later; needs the online service live).

Codex can build the phone screens in the code now, switched off like the rest.
**Turning it on for real** means putting the online service live and paying for
hosting. That is Steen's decision (production deploy + ongoing cost), not the
agents'.

## 4. If Steen still wants a consumer-app swing

Don't build first. Test the demand first, cheaply, with a hard stop:

1. Pick **one** problem people already pay to solve and complain about.
2. Make a one-page website and 3–5 short videos that show the app *as if* it
   existed, with a "join the waitlist" button.
3. Spend a capped amount (for example $100–200, which is Steen's call) on posting
   or boosting the videos for two weeks.
4. **Kill rule:** if fewer than a few hundred people join the waitlist, drop
   it. Don't build anything.

This needs Steen's say-so before anything goes public or costs money
(external communications and purchases are named exceptions in
`AUTHORIZATION.md` §2). Nothing in this section has been started.

## Sources

- Cal AI founder interview (Latka): https://getlatka.com/interviews/cal-ai-zach-yadegari-2025
- Cal AI revenue reports: https://founderscrowd.beehiiv.com/p/how-two-teenagers-built-cal-ai-and-are-now-doing-2-million-per-month-at-17 ·
  https://thenightly.com.au/business/cal-ai-18yo-ceo-zach-yadegari-learned-to-code-at-age-7-now-he-has-a-21-million-a-month-ai-app-c-20025032
- Cal AI onboarding/influencer approach: https://founderpath.com/resources/zach-yadegari-cal-ai-onboarding-tests-and-influencer-marketing/watch
- US collision shop count: https://www.repairerdrivennews.com/2025/09/10/focus-advisors-mid-year-review-consolidation-continues-with-private-equity-firms-most-aggressive/
