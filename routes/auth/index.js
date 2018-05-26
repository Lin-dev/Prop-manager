const express = require('express')
const router = express.Router()
// const User = require('../db/models/user')
const passport = require('../../passport')

var googleAuthHandler = passport.authenticate('google', { scope: ['profile'] });
router.get('/google', (req, res, next) => {
    null;
    googleAuthHandler(req, res, next);
});
router.get(
	'/google/callback',
	passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/logerr'
	})
)

// this route is just used to get the user basic info
router.get('/user', (req, res, next) => {
	console.log('===== user!!======')
	console.log(req.user)
	if (req.user) {
		return res.json({ user: req.user })
	} else {
		return res.json({ user: null })
	}
})

router.post(
	'/login',
	function(req, res, next) {
		console.log(req.body)
		console.log('================')
		next()
	},
	passport.authenticate('local'),
	(req, res) => {
		console.log('POST to /login')
		const user = JSON.parse(JSON.stringify(req.user)) // hack
		const cleanUser = Object.assign({}, user)
		if (cleanUser.local) {
			console.log(`Deleting ${cleanUser.local.password}`)
			delete cleanUser.local.password
		}
		res.json({ user: cleanUser })
	}
)

router.post('/logout', (req, res) => {
	if (req.user) {
		req.session.destroy()
		res.clearCookie('connect.sid') // clean up!
		return res.json({ msg: 'logging you out' })
	} else {
		return res.json({ msg: 'no user to log out!' })
	}
})

router.post('/signup', (req, res) => {
	
	const username = req.body.username;
	const password = req.body.password;
	// ADD VALIDATION
	db.User.findOne({ activationCode: req.session.activationCode }).then(userMatch => {
		if (userMatch) {
			userMatch.updateAttributes({
				local_username: username,
				local_password: password
			});
		}
	})
})

module.exports = router