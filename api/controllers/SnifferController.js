/**
 * SnifferController
 *
 * @description :: Server-side logic for managing sniffers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

"use strict";
module.exports = {

    bw: (req, res) => {

        let model = req.allParams();
        let username = req.user;
        let query = `SELECT * FROM (SELECT date_trunc('${model.criteria}', s."createdAt") as date, 
            (SUM(s.length)/1000) as totalbw 
            FROM sniffer s 
            INNER JOIN "user" u 
            ON u.id = s."user" 
            WHERE u.username = '${username}'
            GROUP BY date_trunc('${model.criteria}', s."createdAt") 
            ORDER BY date_trunc('${model.criteria}', s."createdAt") DESC
            LIMIT 60) n
            ORDER BY  date 
            `;
        Sniffer.query(query, (err, result) => {
            if (err)
                return res.serverError(err);


            let response = {
                labels: [],
                data: []
            };

            for (let data of result.rows) {
                response.data.push(data.totalbw);
                response.labels.push(sails.moment(data.date).format('HH:mm:ss'));
            }
            //
            // for (let data of result.rows) {
            //     response.push([data.date, data.totalbw]);
            // }

            return res.ok(response);
        });
    },

    top10pages: (req, res) => {
        let username = req.user;

        let query = `SELECT s.host, 
            100*(count(s.host)::NUMERIC(18,2) / (SELECT COUNT(host) 
                FROM sniffer WHERE host IS NOT NULL 
                AND sip NOT LIKE  '127.%' ))::NUMERIC(18,2) as count 
            FROM sniffer s 
            INNER JOIN "user" u 
            on s."user" = u.id 
            WHERE u.username = '${username}' AND s.sip NOT LIKE  '127.%' AND s.sip NOT LIKE '192.168.%'
            AND s.host IS NOT NULL 
            GROUP BY s."user", s.host 
            ORDER BY COUNT(host) DESC 
            LIMIT 5`;

        Sniffer.query(query, (err, result) => {

            if (err)
                return res.serverError(err);

            let response = {
                labels: [],
                data: []
            };

            for (let data of result.rows) {
                response.data.push(data.count);
                response.labels.push(data.host);
            }

            return res.ok(response);
        });
    },

    topConversation: (req, res) => {
        let username = req.user;


        let query = `SELECT DISTINCT MAX(u.username) as username, 
            s.dip, s.sip, 
            (100*COUNT(s.dip)::NUMERIC(18,2)/(SELECT COUNT(*) 
                FROM sniffer WHERE sip NOT LIKE '127%' AND dip NOT LIKE '127%'))::NUMERIC(18,2) AS percent 
            FROM sniffer s  
            INNER JOIN "user" u 
            ON s."user" = u.id 
            WHERE s.dip <> s.sip AND s.dip NOT LIKE '127.%' AND s.sip NOT LIKE '127.%' AND u.username = '${username}' 
            GROUP BY s."user", s.dip, s.sip 
            ORDER BY percent DESC 
            LIMIT 5`;

        Sniffer.query(query, (err, result) => {

            if (err)
                return res.serverError(err);

            let response = {
                labels: [],
                data: []
            };

            for (let data of result.rows) {
                response.labels.push(`${data.dip} - ${data.sip}`);
                response.data.push(data.percent);
            }

            return res.ok(response);
        })
    },

    topProtocol: (req, res) => {
        let username = req.user;

        let query = `SELECT s.stcp, (sum(length)::NUMERIC(18,2)/1000000)::NUMERIC(18,2) AS sum
             FROM sniffer s
             INNER JOIN "user" u
             ON s."user" = u.id
             WHERE s.stcp < 1024 AND u.username = '${username}'
             GROUP BY s.stcp
             ORDER BY sum(length) DESC
             LIMIT 5`;

        Sniffer.query(query, (err, result) => {
            if (err)
                return res.serverError(err);

            let response = {
                labels: [],
                data: []
            };

            for (let data of result.rows) {
                response.labels.push(data.stcp);
                response.data.push(data.sum);
            }

            return res.ok(response);
        })
    },

    isTcp: (req, res) => {
        let username = req.user;

        let query = `SELECT CASE s.istcp
            WHEN True THEN 'TCP'
            WHEN False THEN 'UDP' end as type,
            (SUM(s.length)::NUMERIC(18,2)/1000000)::NUMERIC(18,2) as sum
            FROM sniffer s
            INNER JOIN "user" u
            ON u.id = s."user"
            WHERE u.username = '${username}'
            GROUP BY s.istcp`;

        Sniffer.query(query, (err, result) => {
            if (err)
                return res.serverError(err);

            let response = {
                labels: [],
                data: []
            };

            for (let data of result.rows) {
                response.labels.push(data.type);
                response.data.push(data.sum);
            }

            return res.ok(response);
        })
    },

    avg: function (req, res) {
        let username = req.user;

        let query = `select avg(totalbw)::INT, sum(totalbw)
            from (SELECT date_trunc('day', s."createdAt") as date, 
            (SUM(s.length)/1000) as totalbw 
            FROM sniffer s 
            INNER JOIN "user" u 
            ON u.id = s."user" 
            WHERE u.username = '${username}'
            GROUP BY date_trunc('day', s."createdAt") 
            ORDER BY date_trunc('day', s."createdAt")) n`;

        Sniffer.query(query, (err, result)=> {
            if (err)
                return res.serverError(err);

            return res.ok(result.rows[0]);
        });
    },


    maxtime: function (req, res) {
        let username = req.user;

        let query = `select totalbw, MAX(date) from (SELECT date_trunc('minute', s."createdAt") as date, 
          (SUM(s.length)/1000) as totalbw 
          FROM sniffer s 
          INNER JOIN "user" u 
          ON u.id = s."user" 
          WHERE u.username = '${username}'
          GROUP BY date_trunc('minute', s."createdAt") 
          ORDER BY date_trunc('minute', s."createdAt")) n
          group by totalbw
          order by totalbw desc
          limit 1`;

        Sniffer.query(query, (err, result)=> {
            if (err)
                return res.serverError(err);

            return res.ok(result.rows[0]);
        });
    },

    actualbw: function (req, res) {
        let username = req.user;
        let query = `select avg(totalbw)::INT as totalbw,
          MAX(date) FROM (SELECT date_trunc('minute', s."createdAt") as date, 
          (SUM(s.length)/1000) as totalbw 
          FROM sniffer s 
          INNER JOIN "user" u 
          ON u.id = s."user" 
          WHERE u.username = '${username}'
          GROUP BY date_trunc('minute', s."createdAt") 
          ORDER BY date_trunc('minute', s."createdAt") DESC
          LIMIT 2) n`;


        Sniffer.query(query, (err, result)=> {
            if (err)
                return res.serverError(err);

            return res.ok(result.rows[0]);
        });
    },

    topSIP: (req, res) => {
        let username = req.user;
        let query = `select u.username , sip, sum(length)/1000 as sum 
          from sniffer s
          inner join  "user" u
          on s."user" = u.id
          where sip not like '127.%' and u.username = '${username}'
          group by sip, u.username
          order by sum desc
          limit 5`;

        Sniffer.query(query, (err, result)=> {
            if (err)
                return res.serverError(err);

            let response = {
                labels: [],
                data: []
            };

            for (let data of result.rows) {
                response.labels.push(data.sip);
                response.data.push(data.sum);
            }

            return res.ok(response);
        });
    },

    topDIP: (req, res) => {
        let username = req.user;
        let query = `select u.username , dip, sum(length)/1000 as sum 
          from sniffer s
          inner join  "user" u
          on s."user" = u.id
          where dip not like '127.%' and u.username = '${username}'
          group by dip, u.username
          order by sum desc
          limit 5`;

        Sniffer.query(query, (err, result)=> {
            if (err)
                return res.serverError(err);

            let response = {
                labels: [],
                data: []
            };

            for (let data of result.rows) {
                response.labels.push(data.dip);
                response.data.push(data.sum);
            }

            return res.ok(response);
        });
    },

    topMAC: (req, res) => {
        let username = req.user;
        let query = `select u.username , dmac, sum(length)/1000 as sum 
          from sniffer s
          inner join  "user" u
          on s."user" = u.id
          where dmac not like '00:00:00:00:00:00%' and dmac not like 'ff:ff:ff:ff:ff:ff%' and u.username = '${username}'
          group by dmac, u.username
          order by sum desc
          limit 5`;

        Sniffer.query(query, (err, result)=> {
            if (err)
                return res.serverError(err);

            let response = {
                labels: [],
                data: []
            };

            for (let data of result.rows) {
                response.labels.push(data.dmac);
                response.data.push(data.sum);
            }

            return res.ok(response);
        });
    },

    analysisBw: (req, res) => {
        let username = req.user;
        let model = req.allParams();

        /**
         * {
            sourceIp: $scope.sourceIp,
            destIP: $scope.destIP,
            sourcePost: $scope.sourcePost,
            destPort: $scope.destPort,
            startDate: $scope.startDate,
            endDate: $scope.endDate
        }
         **/
        let q = 'GROUP BY ', q2 = '';

        Object.keys(model).map((key) => {
            if (key !== 'startDate' && key != 'endDate') {
                q += ` s.${key}, `;
                q2 += ` AND s.${key} = '${model[key]}'`;
            }
        });
        if (q != 'GROUP BY ')
            q = q.substring(0, q.length - 2);
        else
            q = '';


        let query = `SELECT (SUM(s.length)::NUMERIC(18,2)/10000)::NUMERIC(18,2) as totalbw  
            FROM sniffer s 
            INNER JOIN "user" u 
            ON u.id = s."user" 
            WHERE u.username = '${username}'
            ${q2}
            AND s."createdAt" BETWEEN '${model.startDate}' AND '${model.endDate}'
            ${q}`;

        Sniffer.query(query, (err, result) => {
            if (err)
                return res.serverError(err);
            return res.ok(result.rows[0]);
        });


    },


    topIPDest: (req, res) => {
        let username = req.user;
        let model = req.allParams();

        /**
         * {
            sourceIp: $scope.sourceIp,
            destIP: $scope.destIP,
            sourcePost: $scope.sourcePost,
            destPort: $scope.destPort,
            startDate: $scope.startDate,
            endDate: $scope.endDate
        }
         **/
        let q = 'GROUP BY ', q2 = '';

        Object.keys(model).map((key) => {
            if (key !== 'startDate' && key != 'endDate') {
                q += ` s.${key}, `;
                q2 += ` AND s.${key} = '${model[key]}'`;
            }
        });
        if (q != 'GROUP BY ')
            q = q.substring(0, q.length - 2);
        else
            q = '';


        let query = `SELECT DISTINCT s.dip , (SUM(s.length)::NUMERIC(18,2)/10000)::NUMERIC(18,2) as totalbw  
            FROM sniffer s
            INNER JOIN "user" u 
            ON u.id = s."user" 
            WHERE u.username = '${username}'
            ${q2} AND s.dip not like '127.%'
            AND s."createdAt" BETWEEN '${model.startDate}' AND '${model.endDate}'
            GROUP BY s.dip
            ORDER BY (SUM(s.length)::NUMERIC(18,2)/10000)::NUMERIC(18,2) DESC
            LIMIT 5`;

        Sniffer.query(query, (err, result) => {
            if (err)
                return res.serverError(err);
            return res.ok(result.rows);
        });
    },

    topIPRep: (req, res) => {
        let username = req.user;
        let model = req.allParams();

        /**
         * {
            sourceIp: $scope.sourceIp,
            destIP: $scope.destIP,
            sourcePost: $scope.sourcePost,
            destPort: $scope.destPort,
            startDate: $scope.startDate,
            endDate: $scope.endDate
        }
         **/
        let q = 'GROUP BY ', q2 = '';

        Object.keys(model).map((key) => {
            if (key !== 'startDate' && key != 'endDate') {
                q += ` s.${key}, `;
                q2 += ` AND s.${key} = '${model[key]}'`;
            }
        });
        if (q != 'GROUP BY ')
            q = q.substring(0, q.length - 2);
        else
            q = '';


        let query = `SELECT DISTINCT s.sip , (SUM(s.length)::NUMERIC(18,2)/10000)::NUMERIC(18,2) as totalbw  
            FROM sniffer s
            INNER JOIN "user" u 
            ON u.id = s."user" 
            WHERE u.username = '${username}'
            ${q2} AND s.sip not like '127.%'
            AND s."createdAt" BETWEEN '${model.startDate}' AND '${model.endDate}'
            GROUP BY s.sip
            ORDER BY (SUM(s.length)::NUMERIC(18,2)/10000)::NUMERIC(18,2) DESC
            LIMIT 5`;


        Sniffer.query(query, (err, result) => {
            if (err)
                return res.serverError(err);
            return res.ok(result.rows);
        });
    },

    tophost: (req, res) => {
        let username = req.user;
        let model = req.allParams();

        /**
         * {
            sourceIp: $scope.sourceIp,
            destIP: $scope.destIP,
            sourcePost: $scope.sourcePost,
            destPort: $scope.destPort,
            startDate: $scope.startDate,
            endDate: $scope.endDate
        }
         **/
        let q = 'GROUP BY ', q2 = '';

        Object.keys(model).map((key) => {
            if (key !== 'startDate' && key != 'endDate') {
                q += ` s.${key}, `;
                q2 += ` AND s.${key} = '${model[key]}'`;
            }
        });
        if (q != 'GROUP BY ')
            q = q.substring(0, q.length - 2);
        else
            q = '';


        let query = `SELECT DISTINCT s.host , COUNT(s.host) as total  
            FROM sniffer s
            INNER JOIN "user" u 
            ON u.id = s."user" 
            WHERE u.username = '${username}'
            ${q2} AND s.host not like '%local%' and s.host not like '%rsandoval%'
            AND s."createdAt" BETWEEN '${model.startDate}' AND '${model.endDate}'
            GROUP BY s.host
            ORDER BY COUNT(s.host) DESC
            LIMIT 5`;

        console.log(query);

        Sniffer.query(query, (err, result) => {
            if (err)
                return res.serverError(err);
            return res.ok(result.rows);
        });
    },

    topservice: (req, res) => {
        let username = req.user;
        let model = req.allParams();

        /**
         * {
            sourceIp: $scope.sourceIp,
            destIP: $scope.destIP,
            sourcePost: $scope.sourcePost,
            destPort: $scope.destPort,
            startDate: $scope.startDate,
            endDate: $scope.endDate
        }
         **/
        let q = 'GROUP BY ', q2 = '';

        Object.keys(model).map((key) => {
            if (key !== 'startDate' && key != 'endDate') {
                q += ` s.${key}, `;
                q2 += ` AND s.${key} = '${model[key]}'`;
            }
        });
        if (q != 'GROUP BY ')
            q = q.substring(0, q.length - 2);
        else
            q = '';


        let query = `SELECT DISTINCT s.stcp , (SUM(s.length)::NUMERIC(18,2)/10000)::NUMERIC(18,2) as totalbw  
            FROM sniffer s
            INNER JOIN "user" u 
            ON u.id = s."user" 
            WHERE u.username = '${username}'
            ${q2} AND s.stcp is not null and s.stcp < 1024
            AND s."createdAt" BETWEEN '${model.startDate}' AND '${model.endDate}'
            GROUP BY s.stcp
            ORDER BY (SUM(s.length)::NUMERIC(18,2)/10000)::NUMERIC(18,2) DESC
            LIMIT 5`;

        Sniffer.query(query, (err, result) => {
            if (err)
                return res.serverError(err);
            console.log(result.rows);
            return res.ok(result.rows);
        });
    },

    bwconsumed: (req, res) => {
        let username = req.user;
        let model = req.allParams();

        /**
         * {
            sourceIp: $scope.sourceIp,
            destIP: $scope.destIP,
            sourcePost: $scope.sourcePost,
            destPort: $scope.destPort,
            startDate: $scope.startDate,
            endDate: $scope.endDate
        }
         **/
        let q = 'GROUP BY ', q2 = '';

        Object.keys(model).map((key) => {
            if (key !== 'startDate' && key != 'endDate') {
                q += ` s.${key}, `;
                q2 += ` AND s.${key} = '${model[key]}'`;
            }
        });
        if (q != 'GROUP BY ')
            q = q.substring(0, q.length - 2);
        else
            q = '';


        let query = `SELECT DISTINCT s.istcp ,
            ((SUM(s.length))::NUMERIC(18,2)*100 /(select SUM(length) from sniffer)::NUMERIC(18,2))::NUMERIC(18,2) as total
            FROM sniffer s
            INNER JOIN "user" u 
            ON u.id = s."user" 
            WHERE u.username = '${username}'
            ${q2} 
            AND s."createdAt" BETWEEN '${model.startDate}' AND '${model.endDate}'
            GROUP BY s.istcp
            ORDER BY s.istcp DESC
            LIMIT 5`;

        console.log(query);

        Sniffer.query(query, (err, result) => {
            if (err)
                return res.serverError(err);
            //
            // let sum = result.rows[0].total;
            //
            // let isTCPTotal = result.rows[0].totalbw/sum;

            return res.ok(result.rows[0]);
        });
    }

};


