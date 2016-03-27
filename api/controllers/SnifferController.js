/**
 * SnifferController
 *
 * @description :: Server-side logic for managing sniffers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var format = require('string-format');
format.extend(String.prototype, {});

module.exports = {

    bw: function (req, res) {
        var model = req.allParams();
        var username = req.headers.username;
        var query = 'SELECT date_trunc(\'{0}\', s."createdAt") as date, ' +
            'SUM(s.length) as totalbw ' +
            'FROM sniffer s ' +
            'INNER JOIN "user" u ' +
            'ON u.id = s."user" ' +
            'WHERE u.username = \'{1}\' ' +
            'GROUP BY date_trunc(\'{0}\', s."createdAt") ' +
            'ORDER BY date_trunc(\'{0}\', s."createdAt") ';

        query = query.format(model.criteria, username);
        Sniffer.query(query, function (err, result) {
            if (err)
                return res.serverError(err);

            var response = [];

            result.rows.forEach(function (data) {
                var d = [data.date, data.totalbw];
                response.push(d);
            });

            return res.ok(response);
        });
    },

    top10pages: function (req, res) {
        var model = req.allParams();
        var username = req.headers.username;

        var query = 'SELECT s.host, ' +
            '100*(count(s.host)::NUMERIC(18,2) / (SELECT COUNT(host) ' +
            '   FROM sniffer WHERE host IS NOT NULL ' +
            '   AND sip NOT LIKE  \'127.%\' ))::NUMERIC(18,2) as count ' +
            'FROM sniffer s ' +
            'INNER JOIN "user" u ' +
            'on s."user" = u.id ' +
            'WHERE u.username = \'{0}\' AND s.sip NOT LIKE  \'127.%\' ' +
            'AND s.host IS NOT NULL ' +
            'GROUP BY s."user", s.host ' +
            'ORDER BY COUNT(host) DESC ' +
            'LIMIT 10';

        query = query.format(username);

        Sniffer.query(query, function (err, result) {

            if (err)
                return res.serverError(err);

            var response = {
                labels: [],
                data: []
            };

            result.rows.forEach(function (data) {
                response.data.push(data.count);
                response.labels.push(data.host);
            });

            return res.ok(response);
        });
    },

    topConversation: function (req, res) {
        var username = req.headers.username;


        var query = 'SELECT DISTINCT MAX(u.username) as username, ' +
            's.dip, s.sip, ' +
            '(100*COUNT(s.dip)::NUMERIC(18,2)/(SELECT COUNT(*) FROM sniffer WHERE sip NOT LIKE \'127%\' AND dip NOT LIKE \'127%\'))::NUMERIC(18,2) AS percent ' +
            'FROM sniffer s  ' +
            'INNER JOIN "user" u ' +
            'ON s."user" = u.id ' +
            'WHERE s.dip <> s.sip AND s.dip NOT LIKE \'127.%\' AND s.sip NOT LIKE \'127.%\' AND u.username = \'{0}\' ' +
            'GROUP BY s."user", s.dip, s.sip ' +
            'ORDER BY percent DESC ' +
            'LIMIT 10';

        query = query.format(username);

        Sniffer.query(query, function (err, result) {

            if (err)
                return res.serverError(err);

            var response = {
                labels: [],
                data: []
            };

            result.rows.forEach(function (data) {
                response.labels.push("{0} - {1}".format(data.dip, data.sip));
                response.data.push(data.percent);
            });


            return res.ok(response);
        })
    },

    topProtocol: function (req, res) {
        var username = req.headers.username;

        var query = 'SELECT s.stcp, (sum(length)::NUMERIC(18,2)/1000000)::NUMERIC(18,2) AS sum' +
            ' FROM sniffer s' +
            ' INNER JOIN "user" u' +
            ' ON s."user" = u.id' +
            ' WHERE s.stcp < 1024 AND u.username = \'{0}\'' +
            ' GROUP BY s.stcp' +
            ' ORDER BY sum(length) DESC' +
            ' LIMIT 10';

        query = query.format(username);

        Sniffer.query(query, function (err, result) {
            if (err)
                return res.serverError(err);

            var response = {
                labels: [],
                data: []
            };

            result.rows.forEach(function (data) {
                response.labels.push(data.stcp);
                response.data.push(data.sum);
            });

            return res.ok(response);
        })
    },

    isTcp : function (req, res) {
        var username = req.headers.username;

        var query = 'SELECT CASE s.istcp'+
            ' WHEN True THEN \'TCP\'' +
            ' WHEN False THEN \'UDP\' end as type,'+
            ' (SUM(s.length)::NUMERIC(18,2)/1000000)::NUMERIC(18,2) as sum'+
            ' FROM sniffer s'+
            ' INNER JOIN "user" u'+
            ' ON u.id = s."user"'+
            ' WHERE u.username = \'{0}\''+
            ' GROUP BY s.istcp';

        query = query.format(username);

        Sniffer.query(query, function (err, result) {
            if (err)
                return res.serverError(err);

            var response = {
                labels: [],
                data: []
            };

            result.rows.forEach(function (data) {
                response.labels.push(data.type);
                response.data.push(data.sum);
            });

            return res.ok(response);
        })

    }


};

