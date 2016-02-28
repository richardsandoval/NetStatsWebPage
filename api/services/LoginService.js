/**
 * Created by rsandoval on 24/01/16.
 */

module.exports = {

    wrongPassword: function (user) {
        User.update({username: user.username}, {
            counter: ++user.counter,
            status: (user.counter >= 3) ? -1 : user.status
        }).exec(function (err, updated) {
            if (err)
                console.log(err);
        });
    },

    correctSignIn: function (user) {
        User.update({username: user.username}, {counter: 0}).exec(function (err, updated) {
            if (err)
                console.log(err);
        });
    }

};
