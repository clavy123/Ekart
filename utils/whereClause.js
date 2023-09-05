const Product = require("../models/productModel")

class WhereClause{
    constructor(base,bigQ){
        this.base = base;
        this.bigQ = bigQ;
    }

    search(){
      const searchWord = this.bigQ.search ? {
        name: {
            $regex: this.bigQ.search,
            $options: "i",
          },
      } :{}

      this.base = this.base.find({...searchWord})
      return this;
    }
    
    filter(){
        const copyQ = {...this.bigQ}
        delete copyQ["search"]
        delete copyQ["page"]
        delete copyQ["limit"]

        //convert bigQ into  string
        let stringOfCopy = JSON.stringify(copyQ)
        stringOfCopy = stringOfCopy.replace(/\b(gte|lte|gt|lt)\b/g,(m) =>`$${m}`)
        let jsonOfCopyQ = JSON.parse(stringOfCopy)
        this.base  = this.base.find(jsonOfCopyQ)
        return this; 

    }

    pagination(resultPerPage){
        let currentPage = 1
        if(this.bigQ.page){
            currentPage = this.bigQ.page
        }
        const skipPage = (currentPage-1) * resultPerPage;
        this.base = this.base.limit(resultPerPage).skip(skipPage)
        return this;
    }
}

module.exports = WhereClause