const router = require('express').Router();
const auth = require('../../../middleware/auth')
const CtrlMain = require('../../../controllers/main/main-users/main-users')
var multer = require('multer')
var upload = multer()

router.post('/getmainallusers/', auth.isAuth, function(req, res, next) {

    CtrlMain.getMainAllUser(req, res, (err, resp) => {

        if (err) next(err)
        return res.json(resp)
    })
})

router.post('/getlocationperson/', auth.isAuth, function(req, res, next) {

    CtrlMain.getUsersLocation(req, res, (err, resp) => {
        if (err) next(err)
        return res.json(resp)
    })
})

router.post('/updateuser/', auth.isAuth, function(req, res, next) {

    CtrlMain.updateMainUser(req, res, (err, resp) => {
        if (err) next(err)
        return res.json(resp)
    })
})



router.post('/putuserimage', upload.array('images[]', 2), auth.isAuth, function(req, res, next) {

    CtrlMain.saveMediaUserImages(2, req, res, (err, resp) => {
        if (err) next(err)

        return res.json(resp)
    })
})

/*router.post('/putuserdata', auth.isAuth, function(req, res, next) {
    CtrlMain.saveMediaUserImages(1, req, res, (err, resp) => {
        if (err) next(err)

        return res.json(resp)
    })
})*/


router.post('/userbyid/', auth.isAuth, function(req, res, next) {

    CtrlMain.getUserById(req, res, (err, resp) => {

        if (err) next(err)
        return res.json(resp)
    })
})

module.exports = router;