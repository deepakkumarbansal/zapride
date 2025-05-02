import { verifyJWT } from "./auth.middleware";
import { upload } from "./multer.middleware";

export { verifyJWT, upload as uploadToServer };
