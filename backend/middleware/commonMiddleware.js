import bodyParser from "body-parser";
import cors from "cors";

const commonMiddleware = (app) => {
  app.use(cors());
  app.use(bodyParser.json());
};

export default commonMiddleware;
