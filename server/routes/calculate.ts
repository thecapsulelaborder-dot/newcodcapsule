import express from "express";
import { readDB } from "../../src/db.ts";
import { 
  calculateBagsPrice, 
  calculateBoxesPrice,
  calculateRibbonsPrice,
  calculateStickersPrice,
  calculateGiftCardsPrice,
  calculateBusinessCardsPrice
} from "../../src/calculator.ts";

const router = express.Router();

router.get("/config", async (req, res) => {
  try {
    const db = await readDB();
    const { adminUsername, adminPassword, adminPin, adminPasswordHash, adminPinHash, ...publicConfig } = db as any;
    res.json({ success: true, ...publicConfig });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/calculate", async (req, res) => {
  const input = req.body;
  try {
    const db = await readDB();

    if (input.productKey === "boxes") {
      const result = await calculateBoxesPrice(input, db);
      res.json(Object.assign({ success: true }, result));
    } else if (input.productKey === "ribbons") {
      const result = await calculateRibbonsPrice(input, db);
      res.json(Object.assign({ success: true }, result));
    } else if (input.productKey === "stickers") {
      const result = await calculateStickersPrice(input, db);
      res.json(Object.assign({ success: true }, result));
    } else if (input.productKey === "giftcards") {
      const result = await calculateGiftCardsPrice(input, db);
      res.json(Object.assign({ success: true }, result));
    } else if (input.productKey === "businesscards") {
      const result = await calculateBusinessCardsPrice(input, db);
      res.json(Object.assign({ success: true }, result));
    } else if (input.productKey === "qr_matrix") {
      const itemsList = db.products
        .filter((p: any) => p.categoryId === "qr_matrix")
        .flatMap((p: any) => p.items || []);
      const matchedItem = itemsList.find((it: any) => it.id === input.itemId);
      if (matchedItem) {
        const rawItemPrice = matchedItem.price * input.qty;
        let finalPrice = rawItemPrice;
        let discountAmount = 0;
        if (input.appliedDiscountCode) {
          const matchedPromo = (db.discountCodes || []).find(
            (d: any) => d.code.toUpperCase() === input.appliedDiscountCode.toUpperCase() && d.active
          );
          if (matchedPromo) {
            if (matchedPromo.type === "percentage") {
              discountAmount = Math.ceil(finalPrice * (matchedPromo.value / 100));
            } else if (matchedPromo.type === "fixed") {
              discountAmount = Math.min(matchedPromo.value, finalPrice);
            }
            finalPrice = Math.max(0, finalPrice - discountAmount);
          }
        }
        res.json({
          success: true,
          itemName: matchedItem.name,
          qty: input.qty,
          unitPrice: matchedItem.price,
          rawTotal: rawItemPrice,
          totalPrice: finalPrice,
          discountAmount,
          materialType: matchedItem.unit || "հատ",
          dimensionsText: "անհատական",
          detailsText: `Ապրանք: ${matchedItem.name}\nՔանակ: ${input.qty} ${matchedItem.unit || "հատ"}`
        });
      } else {
        res.status(400).json({ success: false, error: "Ընտրեք ապրանքի տեսակը" });
      }
    } else if (input.productKey === "other_products") {
      const itemsList = db.products
        .filter((p: any) => p.categoryId === "other_products")
        .flatMap((p: any) => p.items || []);
      const matchedItem = itemsList.find((it: any) => it.id === input.itemId);
      if (matchedItem) {
        const rawItemPrice = matchedItem.price * input.qty;
        let finalPrice = rawItemPrice;
        let discountAmount = 0;
        if (input.appliedDiscountCode) {
          const matchedPromo = (db.discountCodes || []).find(
            (d: any) => d.code.toUpperCase() === input.appliedDiscountCode.toUpperCase() && d.active
          );
          if (matchedPromo) {
            if (matchedPromo.type === "percentage") {
              discountAmount = Math.ceil(finalPrice * (matchedPromo.value / 100));
            } else if (matchedPromo.type === "fixed") {
              discountAmount = Math.min(matchedPromo.value, finalPrice);
            }
            finalPrice = Math.max(0, finalPrice - discountAmount);
          }
        }
        res.json({
          success: true,
          itemName: matchedItem.name,
          qty: input.qty,
          unitPrice: matchedItem.price,
          rawTotal: rawItemPrice,
          totalPrice: finalPrice,
          discountAmount,
          materialType: matchedItem.unit || "հատ",
          dimensionsText: "անհատական",
          detailsText: `Ապրանք: ${matchedItem.name}\nՔանակ: ${input.qty} ${matchedItem.unit || "հատ"}`
        });
      } else {
        res.status(400).json({ success: false, error: "Ընտրեք ապրանքի տեսակը" });
      }
    } else if (input.itemId && input.itemId !== "") {
      const result = await calculateBoxesPrice(input, db);
      res.json(Object.assign({ success: true }, result));
    } else {
      const result = await calculateBagsPrice(input, db);
      res.json(Object.assign({ success: true }, result));
    }
  } catch (e: any) {
    console.error("Calculation Error:", e);
    res.status(400).json({ success: false, error: e.message });
  }
});

router.post("/bulk-calculate", async (req, res) => {
  try {
    const db = await readDB();
    const input = req.body;
    const categoryId = input.productKey || "bags";
    
    const results = [];
    const defaultQtys = [100, 200, 500, 1000, 2000, 5000, 10000];
    for (const q of defaultQtys) {
      try {
        let singleRes: any;
        if (categoryId === "boxes") {
          singleRes = await calculateBoxesPrice({ ...input, qty: q }, db);
        } else if (categoryId === "ribbons") {
          singleRes = await calculateRibbonsPrice({ ...input, qty: q }, db);
        } else if (categoryId === "stickers") {
          singleRes = await calculateStickersPrice({ ...input, qty: q }, db);
        } else if (categoryId === "giftcards") {
          singleRes = await calculateGiftCardsPrice({ ...input, qty: q }, db);
        } else if (categoryId === "businesscards") {
          singleRes = await calculateBusinessCardsPrice({ ...input, qty: q }, db);
        } else {
          singleRes = await calculateBagsPrice({ ...input, qty: q }, db);
        }
        results.push({
          qty: q,
          unitPrice: Math.ceil(singleRes.totalPrice / q),
          totalPrice: singleRes.totalPrice,
          success: true
        });
      } catch (err: any) {
        results.push({
          qty: q,
          success: false,
          error: err.message
        });
      }
    }
    res.json({ success: true, categoryId, results });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
