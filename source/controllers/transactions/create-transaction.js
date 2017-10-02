'use strict';

module.exports = async (ctx) => {
    let transaction = ctx.request.body;
    await ctx.CardsModel.get(transaction.cardId);
    transaction = await ctx.TransactionsModel.create(transaction);
    ctx.status = 201;
    ctx.body = transaction;
};
