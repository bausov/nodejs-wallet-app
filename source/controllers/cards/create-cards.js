'use strict';

module.exports = async (ctx) => {
	let card = ctx.request.body;
    card = await ctx.CardsModel.create(card);
	ctx.status = 201;
	ctx.body = card;
};
