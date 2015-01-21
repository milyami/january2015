/**
 * Created by Milya on 10.12.2014.
 */
var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var WebpageSchema = new Schema({
    //videos: [{type: Schema.Types.ObjectId, ref: 'Video'}],
    name: { type: String, trim: true},
    url: { type: String, unique: true, lowercase: true, trim: true},
    token: String,
    active: Boolean
});

WebpageSchema.path('name').validate(function (value) {
    return /^\w+$/i.test(value);
}, 'Invalid name');

WebpageSchema.path('url').validate(function (value) {
    return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value);
}, 'Invalid url');

//WebpageSchema.path('url').validate(function(value, done) {
//    this.model('Page').count({ url: value }, function(err, count) {
//        if (err) {
//            return done(err);
//        }
//        done(!count);
//    });
//}, 'Url already exists');

module.exports = mongoose.model('Page', WebpageSchema);