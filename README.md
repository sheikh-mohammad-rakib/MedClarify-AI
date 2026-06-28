# 💊 MedClarify AI

> **Translating complex prescription labels into plain-English, accessible daily schedules using Gemini 2.5 Flash.**

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/shadcn/ui-Latest-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
  <br />
  <img src="https://img.shields.io/badge/Gemini_API-2.5_Flash-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Gemini 2.5 Flash" />
  <img src="https://img.shields.io/badge/Google_Cloud-Firebase-FFCA28?style=for-the-badge&logo=google-cloud&logoColor=black" alt="Google Cloud / Firebase" />
  <img src="https://img.shields.io/badge/Architecture-Serverless-4285F4?style=for-the-badge&logo=firebase&logoColor=white" alt="Serverless" />
  <img src="https://img.shields.io/badge/Security-BYOK-34A853?style=for-the-badge&logo=lock&logoColor=white" alt="BYOK Security" />
  <br />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Hackathon-Google_AI_Build-4285F4?style=for-the-badge" alt="Hackathon" />
</p>

<p align="center">
  <strong>A secure, client-side web application that uses Gemini 2.5 Flash vision to instantly translate intimidating prescription labels into empathetic, jargon-free daily schedules.</strong>
</p>

---

## 💡 The Inspiration

Medical jargon is confusing, and **misinterpreting prescription labels is dangerous**. Every day, patients leave pharmacies clutching small bottles covered in tiny text, complex chemical names, and vague clinical shorthand like *"BID,"* *"PRN,"* and *"PO."* For the elderly, non-native English speakers, caregivers, and anyone managing multiple prescriptions, this information asymmetry can lead to missed doses, dangerous overdoses, or harmful drug interactions.

**MedClarify AI** was built to act as a digital patient advocate — a tool that instantly translates intimidating medical labels into empathetic, easy-to-understand daily schedules. By combining the multimodal vision capabilities of Gemini 2.5 Flash with strict, deterministic prompt engineering, we turn the moment of confusion at the medicine cabinet into a moment of clarity.

---

## 🚀 What It Does

MedClarify AI is a **secure, 100% client-side web application**. The user flow is intentionally frictionless:

1. 🔑 **Bring Your Own Key (BYOK):** On first visit, the user enters their personal Gemini API key. The key is stored only in browser memory — never transmitted to any backend we control.
2. 📸 **Snap or Upload:** The user captures a photo of a prescription bottle using their device camera, or uploads an image from their gallery.
3. 🧠 **Multimodal Vision Processing:** Gemini 2.5 Flash analyzes the image, extracting text, symbols, dosage instructions, and warning labels.
4. 📋 **Structured Translation:** The AI returns a deterministic JSON payload that is rendered directly into the React UI as:
   - **Medication name & purpose** — in plain English.
   - **Jargon-free instructions** — translated from clinical shorthand.
   - **Chronological Daily Schedule** — e.g., *"8:00 AM: Take 1 pill with food."*
   - **Warning labels & contraindications** — clearly surfaced.
   - **Built-in medical disclaimer** — explicit and unmissable.

The entire experience happens in seconds, with no server-side processing and no data persistence.

---

## 🏆 Hackathon Judging Tracks

This project was designed from the ground up to excel across three distinct hackathon judging categories.

### 🤖 Best Use of Gemini API

- **Multimodal Vision Routing:** We pipe base64-encoded image data directly from the user's camera or upload into `gemini-2.5-flash`, leveraging the model's native optical character recognition to extract complex medical text from real-world photographs under variable lighting and angles.
- **Deterministic Structured Output:** We bypass free-form text generation by configuring the SDK with `responseMimeType: "application/json"`. This forces Gemini to behave as a strict data parser, returning a typed JSON contract that maps 1:1 onto our TypeScript interfaces and populates React components without fragile string parsing.
- **Stable SDK, Modern Architecture:** We deliberately use the production-stable `@google/generative-ai` SDK to ensure reliable, CORS-compliant client-side invocation — making the AI integration feel native to the browser rather than bolted on.

### ☁️ Best App Deployed on Google Cloud

- **Serverless Scalability:** Deployed via **Firebase Hosting** on Google Cloud infrastructure. The application scales effortlessly to any traffic spike, with zero servers to provision and zero cold starts to manage.
- **Reliability on the Free Tier:** Built to run flawlessly on the Firebase Spark (free) plan, making the project accessible to anyone with a Gemini API key — no credit card required.
- **BYOK Security Model:** By requiring users to supply their own Gemini API key, we eliminate the need for API-key storage, rate-limit infrastructure, or a billing proxy. This keeps the app **100% static**, with **zero backend attack surface** and **no vendor lock-in**.
- **Global Edge Delivery:** Firebase Hosting serves the static bundle from Google's global CDN, ensuring sub-second load times anywhere in the world.

### 🛡️ Best Usage of Codex

- **Empathetic Persona via `AGENTS.md`:** Our `AGENTS.md` file defines a strict *Patient Education & Literacy Advocate* persona. The agent is constrained to operate strictly as an educational translator, always including a disclaimer that it is not providing medical advice or diagnosing conditions.
- **Modular Skills via `SKILL.md`:** Our `SKILL.md` defines two composable capabilities — `extract_and_translate_label` (vision OCR + jargon translation) and `build_dosage_schedule` (timeline structuring) — each with explicit input/output contracts.
- **Anti-Hallucination Guardrails:** When a label is unreadable, blurry, or incomplete, the AI is explicitly instructed to say *"Instructions for use are not visible"* rather than fabricate dosage instructions. This single rule prevents the most dangerous failure mode in medical AI: confident invention.
- **Hardcoded Medical Disclaimer:** Every response includes a non-negotiable disclaimer string, baked into the skill output schema.

---

## ⚙️ How We Built It

MedClarify AI leverages a modern, serverless stack optimized for speed, accessibility, and zero backend footprint:

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + Vite 8 | Lightning-fast development and HMR |
| **Language** | TypeScript 6 | End-to-end type safety |
| **Styling** | Tailwind CSS 4 + shadcn/ui | Accessible, polished component design |
| **AI Engine** | Google Gemini 2.5 Flash (`@google/generative-ai`) | Multimodal vision + structured JSON output |
| **Prompt Engineering** | `AGENTS.md` + `SKILL.md` | Persona and safety guardrails |
| **Hosting** | Firebase Hosting (Google Cloud) | Serverless static deployment |
| **Security** | BYOK (client-side API key) | Zero backend, zero key storage |

The architecture is intentionally simple: **a single static bundle, served from a CDN, that talks directly to the Gemini API from the browser.** There is no database, no authentication service, and no application server — which is precisely the point.

---

## 🚧 Challenges We Ran Into

- **CORS & Architectural Boundaries:** We initially attempted to use the brand-new `@google/genai` SDK with the `v1beta` Interactions API. We quickly discovered that endpoint enforces strict CORS policies that require a dedicated backend proxy. To preserve our serverless, free-tier, highly-accessible architecture, we strategically pivoted to the stable `@google/generative-ai` SDK, which safely supports direct client-side calls.
- **Model Versioning Mid-Build:** We encountered endpoint deprecation `404` errors with `gemini-1.5-flash` during development. Rather than downgrade, we migrated the entire application logic to the newer, more capable `gemini-2.5-flash` model in the final stretch before the deadline.
- **Hallucination Risk in Medical AI:** The most subtle — and most important — challenge was ensuring the AI never invents dosage instructions when a label is unreadable. We iterated on our system prompts and added an explicit *"unreadable"* path in the output schema, so the UI can render a safe, honest message instead of fabricated data.

---

## 🏅 Accomplishments That We're Proud Of

- ✅ Built and deployed a **fully functional, AI-powered computer vision application** to the public web entirely on a **free-tier stack**.
- ✅ Achieved **flawless structured JSON parsing** — every Gemini response maps cleanly to our typed UI components.
- ✅ Shipped a **polished, accessible UI** that feels like a real product, not a hackathon demo.
- ✅ Solved a **real-world healthcare accessibility problem** that affects millions of patients.
- ✅ Proved that **complex AI applications can be built without a backend**, given the right architecture and prompt engineering.

---

## 💻 How to Run It Locally

```bash
# 1. Clone the repository
git clone https://github.com/your-username/medclarify-ai.git
cd medclarify-ai

# 2. Install dependencies (we use pnpm)
pnpm install

# 3. Start the Vite development server
pnpm dev
```

Once the dev server is running:

1. Open [http://localhost:5173](http://localhost:5173) in your browser.
2. Enter your **Gemini API key** when prompted (get one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)).
3. Upload a prescription label image and receive a translated, scheduled breakdown instantly.

> **💡 Tip:** Your API key is stored only in browser memory and is never sent to any server other than Google's Gemini API.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built with empathy, deployed on Google Cloud, powered by Gemini.</strong>
  <br />
  <em>MedClarify AI — because everyone deserves to understand their medicine.</em>
</p>
