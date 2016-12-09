'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Document = new Schema({
    local: {
        title: {
            type: String
        },
        link: {
            type: String,
            index: true
        },
        category: {
            type: String
        },
        keywords: {
            type: String
        },
        addedBy: {
            type:String
        }  
   
   
    }
});

module.exports = mongoose.model('Document', Document);
