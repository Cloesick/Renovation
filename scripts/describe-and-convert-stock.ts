import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// 1. Configure Environment Variables
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

// Validation: Check API Key
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Error: OPENAI_API_KEY is missing in .env.local");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const TARGET_DIR = path.join(process.cwd(), 'public/stock');
const DATA_FILE = path.join(TARGET_DIR, 'stock-data.json');

interface StockImage {
  filename: string;
  originalName: string;
  description: string;
  tokens: string[];
}

// Helper: Convert string to camelCase token
function toCamelCaseToken(raw: string): string {
  const cleaned = raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
  if (!cleaned) return "";
  const parts = cleaned.split(" ");
  return (
    parts[0] +
    parts.slice(1).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("")
  );
}

const encodeImage = (imagePath: string): string => {
  return fs.readFileSync(imagePath).toString('base64');
};

async function describeAndConvert() {
  console.log(`📂 Scanning directory: ${TARGET_DIR}`);

  if (!fs.existsSync(TARGET_DIR)) {
    console.error(`❌ Directory not found: ${TARGET_DIR}`);
    return;
  }

  const files = fs.readdirSync(TARGET_DIR);
  let stockData: StockImage[] = [];

  // Load existing data
  if (fs.existsSync(DATA_FILE)) {
    try {
      stockData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } catch (e) {
      console.warn("⚠️ Could not parse existing JSON.");
    }
  }

  for (const file of files) {
    const filePath = path.join(TARGET_DIR, file);
    const ext = path.extname(file).toLowerCase();
    
    // FIX: Allow .webp now so we can re-process existing files
    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext) === false) {
      continue;
    }

    console.log(`\nProcessing: ${file}...`);

    try {
      // --- Step A: Analyze with OpenAI ---
      const base64Image = encodeImage(filePath);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: `Analyze this interior design image. Return a JSON object with:
                1. "description": A concise sentence describing the room.
                2. "keywords": An array of 6 to 10 short strings identifying visual elements.` 
              },
              {
                type: "image_url",
                image_url: { url: `data:image/${ext.replace('.', '')};base64,${base64Image}` },
              },
            ],
          },
        ],
      });

      const aiContent = JSON.parse(response.choices[0].message.content || "{}");
      const description = aiContent.description || "Interior design stock image.";
      const keywords = Array.isArray(aiContent.keywords) ? aiContent.keywords : ["renovation"];

      console.log(`👁️  AI saw: ${keywords.join(", ")}`);

      // --- Step B: Generate Tokenized Filename ---
      let tokens = keywords.map((k: string) => toCamelCaseToken(k)).filter(Boolean);
      if (tokens.length < 3) tokens = [...tokens, "interior", "design"];

      const slug = tokens.slice(0, 10).join("_");
      const newFileName = `${slug}.webp`;
      const newFilePath = path.join(TARGET_DIR, newFileName);

      // --- Step C: Convert or Rename ---
      if (file === newFileName) {
        console.log(`✅ Filename already correct.`);
      } else if (fs.existsSync(newFilePath)) {
        console.log(`⚠️  Target ${newFileName} already exists. Skipping rename.`);
      } else {
        if (ext === '.webp') {
          // Just rename if already webp
          fs.renameSync(filePath, newFilePath);
          console.log(`✏️  Renamed to: ${newFileName}`);
        } else {
          // Convert if not webp
          await sharp(filePath).webp({ quality: 80 }).toFile(newFilePath);
          fs.unlinkSync(filePath);
          console.log(`✅ Converted to: ${newFileName}`);
        }
      }

      // --- Step D: Update Data ---
      // Remove any old entries referring to the OLD filename
      stockData = stockData.filter(i => i.filename !== file);
      
      // Update/Add the NEW entry
      const entryIndex = stockData.findIndex(i => i.filename === newFileName);
      const dataEntry = {
        filename: newFileName,
        originalName: file, // Keeps track of what it was before this run
        description: description,
        tokens: tokens
      };

      if (entryIndex > -1) {
        stockData[entryIndex] = dataEntry;
      } else {
        stockData.push(dataEntry);
      }

    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
    }
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(stockData, null, 2));
  console.log(`\n💾 Stock data saved to ${DATA_FILE}`);
}

describeAndConvert();