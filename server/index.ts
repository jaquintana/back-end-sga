import "reflect-metadata";
import express, { Request, Response } from "express";

const app = express();
const port=3000

app.use(express.json());

app.get("/", (req: Request, res: Response): Response => {
  return res.json({ message: "Sequelize Example 🤟" });
});

const start = async (): Promise<void> => {
  try {
    app.listen(port, () => {
      console.log("Server started on port 3000");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};