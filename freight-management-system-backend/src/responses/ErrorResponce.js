const errorResponce =  (res, errorCOde ,error, errorMessage ) => {
    const Data = {}
    if(error) Data.error = error
    if(errorMessage)  Data.errorMessage = errorMessage
     return res.status(errorCOde).json({
        success : false ,
        Data 
    })
}
module.exports = errorResponce