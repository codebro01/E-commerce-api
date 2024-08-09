import Product from '../models/products.js'
import { StatusCodes } from 'http-status-codes';
import { notFoundError, badRequestError} from '../errors/index.js';
const getAllStoreProducts =  (req, res) => {
    console.log(req.ip);
    
    Product.find({})
    .then(data => {
        res.status(StatusCodes.OK).json({products: data})
    })
    .catch(error => {
        res.status(500).json({message: 'An error has occured, please try again'})
    })  
}

const queryProducts = async (req, res) => {
    const {group, inStock, name, numericFilters, sort, fields} = req.query;
    const queryObject = {};
   
    if(group) queryObject.group = {$regex: group, $options: 'i'};
    if(inStock) queryObject.inStock = inStock ==='true' ? true : false;
    if(name) {
        const regexPattern = `\\b${name}\\b`; // Construct the regex pattern
        queryObject.name = { $regex: name,  $options: 'i'};
    }


    if(numericFilters) {
        const operatorMap = {
            '<' : '$lt',
            '>' : '$gt',
            '<=' : '$lte',
            '>=' : '$gte',
            '=' : '$eq',
        }

        const regex = /\b(<|>|<=|>=|=)\b/g

        let filters = numericFilters.replace(regex, (match) => `-${operatorMap[match]}-`);
            console.log(filters);
            const options = ['price', 'discount'];
        filters = filters.split(',').forEach(item => {
            const [field, operator, value] = item.split('-');
            if(options.includes(field)) {
                queryObject[field] = {[operator] : Number(value)}
            }

            // console.log(op);
        });
    }



    //  if(numericFilters) {
    //     const operatorMap = {
    //         '<' : '$lt',
    //         '>' : '$gt', 
    //         '=' : '$eq', 
    //         '<=' : '$lte', 
    //         '>=' : '$gte'
    //     }

    //     const regex = /\b(<|>|=|<=|>=)\b/g

    //     let filters = numericFilters.replace(regex, (match) => `-${operatorMap[match]}-`)
    //     const options = ['price'];
    //     filters = filters.split(',').forEach(item => { 
    //         const [field, operator, value] = item.split('-')
    //         if(options.includes(field)) {
    //             queryObject[field] = {[operator] : Number(value)}
    //         }
    //     })       
    // }

    let result = Product.find(queryObject)


    if(sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt')
    }

    if(fields) {
        const fieldList = fields.split(',').join(' ');
        result = result.select(fieldList);
    }

    const limit = Number(req.query.limit) || 5;
    const page = Number(req.query.page )|| 1;

    const skip = (page - 1 ) * limit

    result = result.skip(skip).limit(limit)
    

    // console.log(queryObject)
    // console.log(req.query.fields);

    const product = await result;
    res.status(200).json({result: product, nbHits: result.length});
}


export {getAllStoreProducts, queryProducts};