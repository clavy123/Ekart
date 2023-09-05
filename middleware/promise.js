//either we use try-catch and async  || use promise

module.exports = (func) => (req,res,next) => {
    return Promise.resolve(func(req,res,next)).catch(next)
}
