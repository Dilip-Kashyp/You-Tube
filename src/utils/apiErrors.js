class apiError extends Error {
    constructor(
        statusCode,
        message= "Something want wrong!!",
        errors = [],
        stack = ''
    ){
        super(message) //the parent class (Error) constructor with the message parameter
        this.statusCode = statusCode,
        this.data = null,
        this.message = message,
        this.success = false,
        this.errors = errors

        if (stack){
            this.stack = stack; // stack If a stack trace is provided, use it. Otherwise, capture the current stack trace.
        }else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

module.exports = apiError