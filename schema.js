const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),

        description: joi.string().required(),

        location: joi.string().required(),

        country: joi.string().required(),

        price: joi.number().required().min(0),

        image: joi.object({
            filename: joi.string().allow("", null),
            url: joi.string().allow("", null)
        }).allow(null)

    }).required()
});

module.exports.reviewsSchema = joi.object({
    review: joi.object({
        rating: joi.number().required(),

        comment: joi.string().required()
    }).required()
});