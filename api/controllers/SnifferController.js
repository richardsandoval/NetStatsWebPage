/**
 * SnifferController
 *
 * @description :: Server-side logic for managing sniffers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    bwRange: function (req, res) {

        var model = req.allParams();
        var username = req.headers.username;

        Data.find({
            user: username
        }, {fields: ['id']}).then(function (data) {

            var array = [];

            data.forEach(function (d) {
                array.push(d.id)
            });

            return array;
        }).then(function (data) {

            var sniffer = Sniffer.find({
                    data: data,
                    createdAt: {'>=': new Date(sails.moment().subtract(model.start, model.criteria))},
                }, {fields: ['length', 'createdAt']})
                .sort('createdAt ASC')
                .populateAll()
                .then(function (sniffer) {
                    return sniffer
                });

            return [data, sniffer];
        }).spread(function (data, sniffer) {
            return SnifferService.calculateBandwidth(sniffer, model);
        }).then(function (bandWith) {
            return res.send(bandWith);
        });

    }

};

