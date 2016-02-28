/**
 * Created by rsandoval on 20/02/16.
 */

module.exports = {

    calculateBandwidth: function (sniffers, model) {
        var bandwidth = {
            labels: [],
            bw: [[]]
        };
        var length = 0;

        for (var i = 0; i <= (model.start - model.end) / model.span; i++) {
            sniffers.filter(function (sniffer) {
                return sniffer.createdAt < new Date(sails.moment().subtract(model.start - i * model.span, model.criteria));
            }).forEach(function (sniffer) {
                length += sniffer.length;
            });
            bandwidth.bw[0].push(length);
            bandwidth.labels.push((sails.moment().subtract(model.start - i * model.span, model.criteria)).format('h:mm:ss a'));
            length = 0;
        }

        return bandwidth;
    }

};
