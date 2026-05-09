import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Mock Mandi Prices Endpoint (simulating AMIS data)
  app.get("/api/mandi-rates", (req, res) => {
    const mockRates = [
      { city: "Multan", variety: "Sindhri", price: 280, trend: "up" },
      { city: "Lahore", variety: "Chaunsa", price: 320, trend: "stable" },
      { city: "Karachi", variety: "Sindhri", price: 310, trend: "down" },
      { city: "Faisalabad", variety: "Anwar Ratool", price: 450, trend: "up" },
      { city: "Sukkur", variety: "Aseel Dates", price: 210, trend: "stable" }
    ];
    res.json(mockRates);
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MangoPalm Server running on http://localhost:${PORT}`);
  });
}

startServer();
