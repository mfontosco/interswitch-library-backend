function generateRandomOTP () {
    return `${Math.floor(Math.random() * 899999 + 100000)}`;
}

module.exports = generateRandomOTP;