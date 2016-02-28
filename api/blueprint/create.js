/**
 * Created by rsandoval on 21/01/16.
 */

var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

/**
 * Create Record
 *
 * post /:modelIdentity
 *
 * An API call to find and return a single model instance from the data adapter
 * using the specified criteria.  If an id was specified, just the instance with
 * that unique id will be returned.
 *
 * Optional:
 * @param {String} callback - default jsonp callback param (i.e. the name of the js function returned)
 * @param {*} * - other params will be used as `values` in the create
 */
module.exports = function createRecord(req, res) {

    var Model = actionUtil.parseModel(req);

    // Create data object (monolithic combination of all parameters)
    // Omit the blacklisted params (like JSONP callback param, etc.)
    var data = actionUtil.parseValues(req);


    // Create new instance of model using data from params
    Model.create(data).exec(function created(err, newInstance) {

        // Differentiate between waterline-originated validation errors
        // and serious underlying issues. Respond with badRequest if a
        // validation error is encountered, w/ validation info.
        if (err) return res.negotiate(err);

        // If we have the pubsub hook, use the model class's publish method
        // to notify all subscribers about the created item
        if (req._sails.hooks.pubsub) {
            if (req.isSocket) {
                Model.subscribe(req, newInstance);
                Model.introduce(newInstance);
            }
            Model.publishCreate(newInstance, !req.options.mirror && req);
        }
        // Send JSONP-friendly response if it's supported
        Model.findOne(newInstance.id).populateAll().exec(function found(err, matchingRecord) {
            if (err) return res.serverError(err);
            if (!matchingRecord) return res.notFound('No record found with the specified `id`.');

            if (sails.hooks.pubsub && req.isSocket) {
                Model.subscribe(req, matchingRecord);
                actionUtil.subscribeDeep(req, matchingRecord);
            }

            res.created(matchingRecord);
        });


    });
};
