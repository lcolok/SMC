const requestJS = require("request");

function thisFunc(request) {
    return new Promise((resolve, reject) => {
        requestJS.post('https://shimo.im/api/upload/token', {
            json: true,
            headers: {
                'Cookie': process.env.shimoCookie,
            }
        }, (err, httpResponse, body) => {
            if (!err) {
                var token = body.data.accessToken.toString();
                // console.log(token);
                resolve(token)
            } else {
                reject(false);
            }
        })
    })
}
module.exports = thisFunc