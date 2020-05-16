const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;

const favDishSchema = new Schema({
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dishes'
    }
});

const fovoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    dishes: [favDishSchema]
}, {
        timestamps: true

});

var Favorites =mongoose.model('favorite', favoriteSchema);
module.exports = Favorites;