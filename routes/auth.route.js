const {Router} = require('express');
const User = require('../models/User');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = Router();

router.post('/registration',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимум 4 символа').isLength({min: 4})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                });
            }

            const { email, password } = req.body;
            const isUsed = await User.findOne({email});

            if (isUsed) {
                return res.status(300).json({message: 'Данный email уже занят'});
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const user = new User({
                email, password: hashedPassword
            });

            await user.save();
            res.status(201).json({message: 'Пользователь создан'});
        } catch (err) {
            console.log(err);
        }
    });

router.post('/login',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Некорректный пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                });
            }

            const { email, password } = req.body;

            const user = await User.findOne({email});    

            if (!user) {
                return res.status(400).json({message: 'Такой email не зарегистрирован'});
            }

            const isMatched = bcrypt.compare(password, user.password);

            if (!isMatched) {
                return res.status(400).json({message: 'Неверный пароль'});
            }

            const jwtSecret = 'h4y688fvhjf0ajjf400v0f865f5kksllaoi4hsdt53klmv84rh';
            const token = jwt.sign(
                {userId: user.id},
                jwtSecret,
                {expiresIn: '1h'}
            );

            res.json({token, userId: user.id});
            
        } catch (err) {
            console.log(err);
        }
    });

module.exports = router;
