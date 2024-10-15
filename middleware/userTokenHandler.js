// import dependancies
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["token"];

  if (!token) {
    return res.status(403).json({
    	result:'false',
    	msg:'Authorization token missing'
    });
  }
  try {
  	const TOKEN_KEY = process.env.ACCESS_TOKEN_SECURITY;
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    console.log(err.message)
    return res.status(401).json({
    	result:'false',
    	msg:'Invalid Token..'
    });
  }
  
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, token');
  return next();
};

module.exports = verifyToken;