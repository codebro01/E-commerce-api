const whilelist = ['http://127.0.0.1:3500', 'https://localhost:3500']
const corsOptions = {
    origin: function(origin, callback) {
        if(whilelist.indexOf(origin) !== -1){
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"))
        }
    }
}

export default corsOptions;