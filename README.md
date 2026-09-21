# 🎧 Custom Music Playlist Generator

An interactive Next.js web application designed to gather music preferences and requests from users through a 5-step quiz. The submitted information is formatted into a readable message and sent directly to the owner's **Discord DM** via a Discord Bot.

---

## ✨ Features

* **5-Step Interactive Quiz (Slideshow)**
  1. **Name:** User enters their name.
  2. **Situation:** Select from preset situations (e.g., *Workout, Studying, Party, Roadtrip*) with the option to type a custom situation.
  3. **Genres & Subgenres:** Broad selection of popular genres and subgenres (*Hyperpop, Indiepop, Speed Garage, Bass House, Lofi, Synthwave, etc.*) along with a text field to add custom genres.
  4. **Inspiration Songs (Optional):** Users can list up to 3 specific songs with both **Song Title** and **Artist** — or skip this step entirely.
  5. **Summary & Send:** Overview of all entered preferences with a final "Send My Playlist" button.
* **Seamless Discord Integration**
  * Delivers the responses directly as a natural, well-formatted message to the owner's Discord DM via the Discord Web API v10.
* **Modern UI & Animations**
  * Built with Tailwind CSS and Framer Motion for smooth slide transitions and progress tracking.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://motion.dev/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Integration:** Discord API (Bot Integration)

---

## 📁 Project Structure

```text
├── app/
│   ├── api/
│   │   └── discord-dm/
│   │       └── route.js       # API route formatting and sending the DM to Discord
│   ├── globals.css            # Global CSS styling & custom dark scrollbar
│   ├── layout.js              # Root layout
│   └── page.js                # Landing page hosting the quiz component
├── components/
│   └── InteractiveQuiz.js     # Interactive 5-step quiz component
├── .env.local                 # Environment variables (git-ignored)
└── README.md