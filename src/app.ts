import express from "express";
import uploadRoutes from "./routes/uploadRoutes";
import confirmRoutes from "./routes/confirmRoutes";
import listRoutes from "./routes/listRoutes";

const app = express();

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use("/", uploadRoutes);
app.use("/", confirmRoutes);
app.use("/", listRoutes);

const port = 80;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
