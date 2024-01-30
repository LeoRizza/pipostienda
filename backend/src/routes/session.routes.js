import { Router } from "express";
import passport from "passport";
import { passportError, authorization } from "../utils/messagesError.js";
import { getCurrent, getGithubCallback, getLogout, postLogin, postRegister } from "../controllers/session.controller.js";

const sessionRouter = Router()

sessionRouter.post('/login', passport.authenticate('login'), postLogin)
sessionRouter.get('/logout', getLogout)
sessionRouter.post('/register', passport.authenticate('register'), postRegister)
sessionRouter.get('/current', passportError('jwt'), getCurrent)
sessionRouter.get('/githubCallback', passport.authenticate('github'), getGithubCallback)
sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {

})

export default sessionRouter