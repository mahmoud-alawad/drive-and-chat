import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, path.resolve(__dirname, "..", "uploads"));
  },
  
  filename: function (req, file, cb) {
    console.log(file);
    const fileName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);
    // const fileFormat =(file.originalname).split("."); 
    // cb(null, file.fieldname + "." + fileFormat[fileFormat.length - 1]);
    // cb(
    //   null,
    //   file.fieldname +
    //     "-" +
    //     file.originalname.toLocaleLowerCase() +
    //     path.extname(file.originalname)
    // );
  },
});

const upload = multer({
  storage: storage,
  preservePath: true,
});

export { upload, storage };
