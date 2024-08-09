import multer, { memoryStorage } from 'multer';

const storage = multer.diskStorage({
    // dest: function(req, file, cb) {
    //     cb(null, '../productsImages');
    // },
    // filename: function(req, file, cb) {
    //     cb(null, `${Date.now()}_${file.originalname}`)
    // }
});
const upload = multer({storage: storage})


export {upload}
