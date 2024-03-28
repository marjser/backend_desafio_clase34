
function publicAccess (req, res, next)  {
	if (!req.session.user) {
		return next()
		}
	
	
	res.redirect('/products')
}


module.exports = publicAccess