const jwt = require('express-jwt');
const { secret } = require('app/conf/config.json');
const db = require('app/model/db');

module.exports = authorize;

function authorize(roles = []) {
    // параметр роли может быть записан строкой (Role.User или 'User')
    // или в виде массива ([Role.Admin, Role.User] или ['Admin', 'User'])
    
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [

        // Проверяем подлиность JWT токена и прикрепляем пользователя к обьекту (req.user)
        jwt({ secret, algorithms: ['HS256'] }),

        // авторизация на основе роли пользователя
        async (req, res, next) => {
            const user = await db.User.findById(req.user.id);

            if (!user || (roles.length && !roles.includes(user.role))) {
                // пользователь больше не существует или роль не авторизована
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // успешная аутентификация и авторизация
            req.user.role = user.role;
            const refreshTokens = await db.RefreshToken.find({ user: user.id });
            req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
            next();
        }
    ];
}