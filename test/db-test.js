var expect = require("chai").expect;
var mongoose = require("mongoose");

var gracefulShutdown = require("../app_server/models/db");

var dbURI = "mongodb://localhost/Loc8r";
if (process.env.NODE_ENV === "production") {
    dbURI = process.env.MONGODB_URI;
}

describe('DB connection tests', () => {
    it('should be able to connect to the database', () => {
        expect(mongoose.Connection.STATES.connected === mongoose.connection.readyState).to.be.true;
    });
});

describe('DB helper function tests', () => {
    it('should check gracefulShutdown for message and callback', () => {
        gracefulShutdown("test", () => { console.log("should log after db closes") });
        expect(mongoose.Connection.STATES.connected === mongoose.connection.readyState).to.be.false;
    })
});


