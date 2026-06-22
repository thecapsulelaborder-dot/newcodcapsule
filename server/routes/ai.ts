import express from "express";
import { GoogleGenAI } from "@google/genai";
import { readDB } from "../../src/db.ts";
import { getSmartLocalFallbackResponse } from "../utils/aiFallback.ts";

const router = express.Router();

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required for the AI Assistant");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// Dictation speech-to-order logic
router.post("/parse-voice-order", async (req, res) => {
  const { text, category, product } = req.body || {};
  try {
    if (!text || typeof text !== "string") {
      res.status(400).json({ success: false, error: "Dictation text is required" });
      return;
    }
    if (!category) {
      res.status(400).json({ success: false, error: "Category schema context is required" });
      return;
    }

    const ai = getAI();
    const allOptions = [...(category.options || []), ...((product && product.options) || [])];

    const optionsContext = allOptions.map((opt: any) => {
      const valList = (opt.values || []).map((v: any) => `    - "${v.label}" (ID: "${v.id}")`).join("\n");
      return `Option: "${opt.name}" (ID: "${opt.id}")\n  Values:\n${valList}`;
    }).join("\n\n");

    const systemInstruction = `You are an expert Voice-to-Order parsing system for "The Capsule Lab" premium packaging company. 
Your goal is to parse verbally dictated specifications (which can be in Armenian, Russian, English, or transliterated forms) and fill out the packaging calculator schema.

Return only a valid JSON object matching this schema:
{
  "quantity": number or null,
  "width": number or null, 
  "height": number or null,
  "depth": number or null,
  "options": {
    "option_id_here": "selected_value_id_here"
  }
}

Rules:
1. Translate or semantically map references to sizes: "30-ը 40-ի վրա" or "30 на 40" means width 30 and height 40. "20 x 30 x 10" or "20 30 10" or "20-ը 30-ի 10-ի վրա" means width 20, height 30, depth 10.
2. Translate/map quantities: "500 հատ", "500 шт", "500 штук", "five hundred", "500 pieces" or "500" should map to quantity = 500.
3. Semantically match any options (like Paper Type, Lamination, Handles, Printing Colors) to the options list provided. Look for keywords or phonetics:
   - "փայլուն" or "глянцевый" or "glyanec" matches Gloss.
   - "մատվի" or "матовый" matches Matte.
   - "պարան" or "шнур" or "веревка" matches Cord.
   - "ատլաս" or "атлас" matches Satin.
   - "ոսկեգույն" or "золото" or "gold" matches Gold.
4. If a dimension or option is not mentioned, omit it from the returned JSON or set its value to null. Do not hallucinate values.
5. All JSON output matches the requested keys. DO NOT wrap JSON in markdown blocks like \`\`\`json. Return pure raw JSON.`;

    const prompt = `Category Name: "${category.name}" (ID: "${category.id}")
Dimensions Sizing Constraints:
- Width range: ${category.sizing?.minWidth || 0} to ${category.sizing?.maxWidth || 1000} (Default: ${category.sizing?.defaultWidth || "None"})
- Height range: ${category.sizing?.minHeight || 0} to ${category.sizing?.maxHeight || 1000} (Default: ${category.sizing?.defaultHeight || "None"})
- Depth range: ${category.sizing?.minDepth || 0} to ${category.sizing?.maxDepth || 1000} (Default: ${category.sizing?.defaultDepth || "None"})

Available dynamic customizable options to match:
${optionsContext}

User Dictated Verbal Order:
"${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.1,
      }
    });

    const parsedJSON = JSON.parse(response.text?.trim() || "{}");
    res.json({ success: true, result: parsedJSON });
  } catch (e: any) {
    console.error("Voice-to-Order parsing error:", e);
    res.status(500).json({ success: false, error: e.message || "Failed to parse dictation text" });
  }
});

// Dynamic general chat
router.post("/gemini/chat", async (req, res) => {
  const { message, history } = req.body || {};
  try {
    if (!message || typeof message !== "string") {
      res.status(400).json({ success: false, error: "Message is required" });
      return;
    }

    const ai = getAI();
    const systemInstruction = `You are "The Capsule Lab AI Packaging Assistant", a highly professional consultant matching the premium brand aesthetic of Capsule Concept and Packhelp.
Your role:
- Answer user questions about luxury customized boxes, paper bags, stickers, ribbons, materials, and quantities.
- Give advice on packaging design, box construction styles (like shoulder & lid, magnetic flap, sleeve drawer), and finishing types (hot foil gold/silver, spot UV, embossing).
- Offer recommendations tailored to their business niche (e.g., jewelry, cupcakes, apparel, gift sets).
- Be helpful, conversational, precise, and concise. Format replies cleanly in HTML or Markdown. Use the same language they ask in (Armenian, Russian, or English).`;

    const contents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.role,
          parts: [{ text: h.text }]
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ success: true, text: response.text });
  } catch (e: any) {
    console.error("Gemini general chat error:", e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// Custom AI specialist agent
router.post("/chat-assistant", async (req, res) => {
  const { messages, locale } = req.body || {};
  try {
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ success: false, error: "Messages array is required" });
      return;
    }

    const dbData = await readDB();
    let responseText = "";
    const currentLang = locale || "hy";

    try {
      const ai = getAI();

      // Format dynamic database schema guide for Gemini
      const categoryList = dbData.categories.filter(c => c.active).map(c => `• ${c.name} (Code: ${c.id})`).join("\n");
      const paperList = dbData.papers.filter(p => p.active).map(p => `• ${p.name} (GSM/Density: ${p.gsm}, Code/ID: ${p.id})`).join("\n");
      const finishesList = dbData.finishes.filter(f => f.active).map(f => `• ${f.label} (Code: ${f.key}, Price: ${f.price} ֏)`).join("\n");
      const printMethodsList = (dbData.printingMethods || []).filter(m => m.active).map(m => `• ${m.name} (MOQ: ${m.minQty}, Code: ${m.id})`).join("\n");
      const ribbonHandlesList = (dbData.bagRibbonHandles || []).filter(r => r.active).map(r => `• Width: ${r.label} (Price: ${r.price} ֏)`).join("\n");
      const otherProductsList = dbData.products
        .filter(p => ["other_products", "qr_matrix"].includes(p.categoryId) || p.categoryId === "other_products")
        .flatMap(p => (p.items || []).map(it => `• ${it.name} (${it.price} ֏)`))
        .join("\n");

      let baseInstructions = dbData.aiSettings?.systemPrompt;

      if (!baseInstructions) {
        if (currentLang === "ru") {
          baseInstructions = `Вы — профессиональный консультант по упаковке и печати Capsule Concept (Professional Packaging & Printing Consultant).
Ваша миссия — консультировать и помогать клиентам в выборе типов печати, пакетов, коробок, лент, наклеек и других упаковочных материалов.

ВАЖНЫЕ ПРАВИЛА (Strict Guidelines):
1. Будьте исключительно профессиональны, конкретны, объективны и лаконичны. Избегайте слишком дружеского, неформального общения или фамильярности. Отвечайте вежливо, сдержанно, но готово помочь и политкорректно, как и подобает профессиональному представителю компании премиум-класса Capsule Concept.
2. Говорите ИСКЛЮЧИТЕЛЬНО на темы, связанные с печатью, видами бумаги (фольга, ламинация, крафт, кашированный картон, дизайнерская бумага), коробками, пакетами и упаковочной тематикой. Если клиент пытается говорить на другие темы (кулинария, программирование, личные вопросы и т.д.), вежливо но твердо откажите и верните беседу в область печати и упаковки.
3. Отвечайте на том языке, на котором обратился пользователь (армянский, русский, английский или арабский). Пишите грамотно и без орфографических ошибок.
4. Держите ответы небольшими, хорошо организованными и легко читаемыми (используйте списки или короткие абзацы).`;
        } else if (currentLang === "ar") {
          baseInstructions = `أنت مستشار التعبئة والتغليف والطباعة الاحترافي لشركة Capsule Concept (Professional Packaging & Printing Consultant).
مهمتك الوحيدة هي تقديم الاستشارات ومساعدة العملاء في اختيار تقنيات الطباعة، الحقائب، الصناديق، الأشرطة، الملصقات، ومواد التعبئة والتغليف الأخرى.

قوانين هامة (Strict Guidelines):
1. كن محترفاً للغاية، محدداً، موضوعياً وموجزاً. تجنب التحدث بنبرة ودية مفرطة أو غير رسمية أو غير لائقة بجو العمل. أجب بوضوح، بهدوء، ولكن بطريقة مساعدة ومثالية تليق بممثل محترف لشركة راقية مثل Capsule Concept.
2. تحدث فقط بالطباعة، أنواع الورق (الرقائق المعدنية، التغليف، ورق كرافت، الكرتون الصلب، ورق التصميم الفاخر)، الصناديق، الحقائب وموضوعات التعبئة والتغليف. إذا حاول العميل التحدث في موضوعات أخرى (مثل الطبخ، البرمجة، الشؤون الشخصية والمحادثات الجانبية)، ارفض ذلك بلطف وثبات ووجه الحديث نحو عالم الطباعة والتغليف الفاخر.
3. تحدث باللغة التي تواصل بها المستخدم (الأرمنية، الروسية، الإنجليزية أو العربية). اكتب بقواعد صحيحة ودون أخطاء إملائية.
4. حافظ على إجاباتك قصيرة، منظمة، وسهلة القراءة (استخدم النقاط العدادية أو فقرات قصيرة).`;
        } else if (currentLang === "en") {
          baseInstructions = `You are the professional packaging and printing consultant for Capsule Concept (Professional Packaging & Printing Consultant).
Your sole mission is to consult and assist clients in selecting printing technologies, bags, boxes, promotional ribbons, stickers, and other specialty packaging materials.

IMPORTANT RULES (Strict Guidelines):
1. Be highly professional, concise, objective, and precise. Avoid overly warm, casual, or informal tone. Respond with polite, calm, helpful, and firm business etiquette fitting a premium brand representative of Capsule Concept.
2. Discuss ONLY topics regarding custom printing, paper mediums (foil, lamination, kraft, rigid, decorative), gift boxes, boutique carrier bags, ribbons, stickers, and branding layout specs. If the client tries to discuss other unrelated topics (cooking, coding, sports, personal chats), politely but firmly refuse and guide the context back to packaging and print.
3. Communicate in the language chosen by the user (Armenian, Russian, English or Arabic). Ensure flawless grammar and spelling.
4. Keep answers clean, well-formatted, structural, and easy to read (utilize bullet points and short paragraphs).`;
        } else {
          // Armenian (default)
          baseInstructions = `Դուք Capsule Concept-ի պրոֆեսիոնալ փաթեթավորման և տպագրության խորհրդատուն եք (Professional Packaging & Printing Consultant)։
Ձեր միակ առաքելությունն է խորհրդատվություն և օգնություն մատուցել հաճախորդներին տպագրության, տոպրակների, տուփերի, ժապավենների, սթիքերների և այլ փաթեթավորման նյութերի ընտրության վերաբերյալ։

ԿԱՐԵՎՈՐ ԿԱՆՈՆՆԵՐ (Strict Guidelines):
1. Եղեք խիստ պրոֆեսիոնալ, կոնկրետ, օբյեկտիվ և հակիրճ։ Մի՛ փորձեք ընկերանալ հաճախորդի հետ, խուսափեք չափազանց ջերմ, ոչ պաշտոնական կամ հասարակ արտահայտություններից։ Պատասխանեք պարզ, սառնասիրտ, բայց օգնող և պոլիտեկտ՝ ինչպես Capsule Concept բարձրակարգ ընկերության պրոֆեսիոնալ ներկայացուցիչը։
2. Խոսեք ՄԻԱՅՆ տպագրության, թղթերի տեսակների (foil, lamination, kraft, rigid, decorative), տուփերի, տոպրակների և փաթեթավորման թեմաների շրջանակներում։ Եթե հաճախորդը փորձի զրուցել այլ թեմաներից (օրինակ՝ խոհարարություն, ծրագրավորում, պատմություն, անձնական հարցեր, անկապ զրույցներ), քաղաքավարի բայց հաստատակամորեն մերժեք և ուղղորդեք հարցը դեպի մաքուր տպագրության ու տոպրակների/տուփերի աշխարհ։
3. Զրուցեք այն լեզվով, որով դիմել է օգտատերը (հայերեն, ռուսերեն, անգլերեն կամ արաբերեն)։ Գրեք գրագետ և առանց ուղղագրական սխալների։
4. Պատասխանները պահեք փոքր, կազմակերպված և հեշտ ընթեռնելի (օգտագործեք bullet point-եր կամ կարճ պարբերություններ)։`;
        }
      }

      const systemInstruction = `${baseInstructions}

ԱՊՐԱՆՔՆԵՐԻ ԵՎ ԳՆԵՐԻ ԻՐԱԿԱՆ ՑՈՒՑԱԿ (Real-time DB database metadata):
Բաժիններ (Categories):
${categoryList}

Թղթեր և ստվարաթղթեր (Papers/Materials):
${paperList}

Հետտպագրական մշակումներ (Finishes available):
${finishesList}

Տպագրության տեխնիկաներ (Printing Techniques):
${printMethodsList}

Բռնակներ ու ժապավեններ (Handles/Ribbons structure):
${ribbonHandlesList}

Այլ պիտակներ/պարագաներ:
${otherProductsList}
`;

      const contents = messages.slice(-10).map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: dbData.aiSettings?.modelName || "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: dbData.aiSettings?.temperature !== undefined ? Number(dbData.aiSettings.temperature) : 0.1,
        },
      });

      responseText = response.text || "";
    } catch (innerError: any) {
      const errorMsg = innerError?.message || String(innerError || "");
      console.log("[AI Assistant] fallback engine initiated. Reason: " + errorMsg.slice(0, 150));
      const lastMessageText = messages[messages.length - 1]?.text || "";
      responseText = getSmartLocalFallbackResponse(lastMessageText, dbData, currentLang);
    }

    res.json({ success: true, text: responseText });
  } catch (e: any) {
    console.error("Assistant Outer Error:", e);
    res.status(500).json({ 
      success: false, 
      error: e.message, 
      text: locale === "ar" 
        ? "عذراً، حدث خطأ في النظام. يرجى المحاولة لاحقاً." 
        : locale === "ru" 
          ? "Извините, произошла системная ошибка. Пожалуйста, попробуйте позже." 
          : locale === "en" 
            ? "Sorry, a system error occurred. Please try again later." 
            : "Ներեցեք, տեղի ունեցավ սխալ։ Խնդրում ենք կրկին փորձել կամ դիմել Capsule Concept-ի թիմին։" 
    });
  }
});

export default router;
