module.exports = validateRequest;

function validateRequest(req, next, schema) {
    const options = {
        abortEarly: false, // отображать все ошибки
        allowUnknown: true, // игнор незнакомых реквизитов
        stripUnknown: true // удалять незнакомые реквизиты
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        req.body = value;
        next();
    }
}