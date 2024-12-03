import bodyParser from "body-parser";
import cors from "cors";

const commonMiddleware = (app) => {
  app.use(cors({ origin: "http://localhost:5173" }));
  app.use(bodyParser.json());
};

export default commonMiddleware;
