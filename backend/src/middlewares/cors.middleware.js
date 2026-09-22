import cors from "cors";

const corsMiddleware = cors({
  origin: "https://voxly-frontend-teal.vercel.app/",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

export default corsMiddleware;
