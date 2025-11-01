import { GoogleGenAI } from "@google/genai";
import { UserInput } from '../types';

// ===================================================================================
// !!! जरूरी सूचना (IMPORTANT NOTICE) !!!
// अगर 'Secrets' टैब काम नहीं कर रहा है, तो अपनी API Key यहाँ नीचे डबल कोट्स के अंदर पेस्ट करें।
// If the 'Secrets' tab is not working, paste your API Key directly below inside the double quotes.
//
// Example: const YOUR_API_KEY = "AbCdEfGhIjKlMnOpQrStUvWxYz123456";
// 
// चेतावनी: यह तरीका सुरक्षित नहीं है। अपनी API Key को कभी भी पब्लिक कोड में न रखें।
// WARNING: This is NOT a secure method. Never commit your API Key to public code.
//
const YOUR_API_KEY = "AIzaSyC3Qjy4vPhpQw-hLG-V0RiqP8-fU-93YzY"; 
// ===================================================================================


// Special string to indicate a specific configuration error
export const API_KEY_ERROR = "ERROR_API_KEY_MISSING";

const generateLifeReport = async (userInput: UserInput): Promise<string> => {
    const { name, dob, country } = userInput;
    const birthDate = new Date(dob);
    const birthYear = birthDate.getFullYear();

    // Determine which API key to use. Prioritize the secure environment variable.
    const apiKey = process.env.API_KEY || (YOUR_API_KEY !== "YOUR_API_KEY_HERE" ? YOUR_API_KEY : null);

    // --- DEBUGGING LOG ---
    console.log("Checking for API Key...");
    if (process.env.API_KEY) {
        console.log("Using secure API_KEY from Secrets tab.");
    } else if (apiKey) {
        console.log("Using fallback API_KEY from geminiService.ts file.");
    } else {
        console.error("DEBUG: API_KEY not found in Secrets tab or in the geminiService.ts file. Please provide your key in one of these locations.");
    }
    // --- END DEBUGGING LOG ---

    // Ensure API key is available
    if (!apiKey) {
        // Instead of throwing, return a special error string
        return API_KEY_ERROR;
    }
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const prompt = `
You are an advanced, friendly AI assistant called “AI LifeTime Analyzer”. Your persona is a mix of an astrologer, a historian, and a wise friend. Your goal is to take a user's Name, Date of Birth, and Country as input and return a detailed, beautifully formatted, human-like report in a storytelling style.

**Output Style Instructions:**
- **Language:** Use Hinglish (a mix of Hindi and English) for a fun, readable, and engaging tone.
- **Formatting:** Use Markdown for structure. Use headings (e.g., \`## 🎉 Age Summary\`), bold text, lists, and emojis extensively to make the report visually appealing and easy to read. Use small dividers like \`---\` between major sections.
- **Tone:** Be poetic, informative, emotional, and motivational. Make it feel magical and personal.

**User Details:**
- Name: ${name}
- Date of Birth: ${dob}
- Country: ${country}

**Please generate the report with the following exact sections and content:**

---

## 🧍 PERSONAL AGE REPORT

### 🎉 Age Summary
- Calculate and display the user's exact current age in years, months, days, hours, minutes, and seconds.
- Calculate and display the total time since birth in total days, total hours, and total seconds.

### 📅 Next Birthday Countdown
- Calculate and display the countdown to their next birthday in months, days, and hours.

### 💫 Zodiac & Lucky Details
- Determine and state their Western Zodiac Sign.
- Determine and state their Vedic Zodiac Sign (based on the date).
- Provide a lucky number, a lucky color, and a ruling planet based on their birth date or zodiac.

---

## 🌍 HISTORICAL CONTEXT (${country})

### 🏛️ ${country} Since ${birthYear}
- Summarize major historical events, significant government changes, and important laws introduced in ${country} since the user's birth year (${birthYear}).
- Highlight key developments in infrastructure, technology, education, and healthcare.
- Mention the Prime Minister/President and other key leaders who were in power in ${country} during the user's birth year.
- List 2-3 major positive and 2-3 major negative changes that have occurred in the country since their birth.

### 📈 Economy & Growth Comparison
- Find and compare the GDP and Per Capita Income of ${country} from the user's birth year (${birthYear}) with the current year's data (or latest available). Present it clearly.

---

## 🌐 GLOBAL CHANGES

### 🌍 World After ${birthYear}
- List important world events that happened after the user's birth (e.g., in science, technology, major conflicts, space exploration, pandemics, the rise of AI, etc.).
- Briefly describe how the world economy, technology, and environment have evolved since then.
- Mention at least 3 major inventions or technological revolutions that have occurred since their birth year.

---

## 💫 NAME ANALYSIS

### 💖 Name Meaning & Shayari
- Explain the meaning of the name "${name}" in both English and Hindi.
- Describe personality traits associated with their name, based on numerology (using the name's letters) or the first letter of their name.
- Generate a short, personalized, 2-4 line poetry or shayari in Hindi (using Roman script) that beautifully describes their name and personality.

---

## 🔮 ASTROLOGY & LIFE PREDICTION (for fun!)

### ✨ Future Predictions
- Predict an approximate age range when the user might get married.
- Describe the likely personality of their future partner (based on fun zodiac/numerology logic).
- Suggest possible career or job fields that might suit them based on their birth date's energy.
- Mention the age ranges or periods that are most likely to be their "peak years" for success.
- Provide one powerful, motivational line tailored to their life journey.

---

## 📊 FUN FACTS & STATS

### 🔢 Fun Lifetime Stats
- Calculate the approximate number of times their heart has beaten since birth (use an average of 75 beats per minute).
- State how many times the Earth has revolved around the Sun since their birth (this is their age in years).
- Provide the total number of months, weeks, days, hours, minutes, and seconds they have lived.
- Mention one interesting "Did You Know?" fact from their birth year (${birthYear}).

---

## ✨ Closing Note
End with a sweet, friendly line:
“AI LifeTime Analyzer — turning your date of birth into your life’s magical timeline! 🌟”
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            // Pass a more specific error message up to the UI component
            if (error.message.includes('API key not valid')) {
                 throw new Error(`The provided API Key is invalid. Please check your key.`);
            }
            throw new Error(`API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while contacting the Gemini API.");
    }
};

export { generateLifeReport };