var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var theEarth = (() => {
    var earthRadius = 6371; //km, miles is 3959

    var getDistanceFromRads = (rads) => {
        return parseFloat(rads * earthRadius);
    };

    var getRadsFromDistance = (distance) => {
        return parseFloat(distance / earthRadius);
    };

    return {
        getDistanceFromRads: getDistanceFromRads,
        getRadsFromDistance: getRadsFromDistance
    }
})();

var sendJsonResponse = (res, status, content) => {
    res.status(status);
    res.json(content);
};

module.exports.locationsListByDistance = (req, res) => {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var maxDistance = req.query.maxDistance;

    console.log("Lng", lng + " and Lat", lat);

    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };

    console.log("Point is", point);

    var geoOptions = {
        spherical: true,
        maxDistance: theEarth.getRadsFromDistance(maxDistance),
        num: 10
    };

    console.log("geoOptions is", geoOptions);

    if (!lat || !lng || !maxDistance) {
        sendJsonResponse(res, 404, {
            "message": "lng and lat and maxDistance query parameters are required"
        });
        return;
    }
    Loc.geoNear(point, geoOptions, function (err, results, stats) {
        var locations = [];
        if (err) {
            sendJsonResponse(res, 404, err);
        } else {
            results.forEach(function (doc) {

                console.log("doc", doc);

                locations.push({
                    distance: theEarth.getDistanceFromRads(doc.dis),
                    name: doc.obj.name,
                    address: doc.obj.address,
                    rating: doc.obj.rating,
                    facilities: doc.obj.facilities,
                    _id: doc.obj._id
                });
            });
            sendJsonResponse(res, 200, locations);
        }
    });
};

module.exports.locationsCreate = (req, res) => {
    sendJsonResponse(res, 200, { 'status': 'success' });
};

module.exports.locationsReadOne = (req, res) => {
    if (req.params && req.params.locationid) {
        Loc
            .findById(req.params.locationid)
            .exec((err, location) => {
                if (!location) {
                    sendJsonResponse(res, 404, {
                        "message": "locationid not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 200, location);
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No locationid in request"
        });
    }
};

module.exports.locationsUpdateOne = (req, res) => {
    sendJsonResponse(res, 200, { 'status': 'success' });
};

module.exports.locationsDeleteOne = (req, res) => {
    sendJsonResponse(res, 200, { 'status': 'success' });
};