import express from "express";
import fs from "fs/promises";
import path from "path";
import defaultPad from "../defaultPad";

type Cell = {
  id: string;
  content: string;
  type: "text" | "code";
};

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);
  router.get("/cells", async (_, res) => {
    try {
      const result = await fs.readFile(fullPath, { encoding: "utf-8" });
      res.send(JSON.parse(result));
    } catch (err: any) {
      if ("code" in err && err.code === "ENOENT") {
        await fs.writeFile(
          fullPath,
          JSON.stringify(defaultPad, null, 2),
          "utf-8"
        );
        res.send(defaultPad);
      } else {
        throw err;
      }
    }
  });

  router.post<any, any, { status: string }, { cells: Cell[] }>(
    "/cells",
    async (req, res) => {
      const cells = req.body.cells;
      await fs.writeFile(fullPath, JSON.stringify(cells, null, 2), "utf-8");

      res.send({ status: "ok" });
    }
  );

  return router;
};
