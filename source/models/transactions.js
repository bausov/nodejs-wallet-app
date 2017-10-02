'use strict';

const ApplicationError = require('libs/application-error');
const FileModel = require('./common/fileModel');


class Transactions extends FileModel {
    constructor() {
        super('transactions.json');
    }

    /**
     * Returns all transactions for card with id in param
     * @param cardId
     */
    async getAllByCardId(cardId) {
        if (!!cardId) {
            return await this._dataSource.filter(function (el) {
                return el.cardId === cardId;
            });
        } else {
            throw new ApplicationError('No card data', 400);
        }
    }

    async create(transactionData) {
        const isDataValid = transactionData &&
            transactionData.hasOwnProperty('cardId') &&
            transactionData.hasOwnProperty('type') &&
            transactionData.hasOwnProperty('sum');

        if (isDataValid) {
            const transaction = {
                id: this._dataSource.reduce((max, item) => Math.max(max, item.id), 0) + 1,
                cardId: parseInt(transactionData.cardId),
                type: transactionData.type,
                data: transactionData.data,
                time: new Date().toDateString(),
                sum: transactionData.sum
            };

            this._dataSource.push(transaction);
            await this._saveUpdates();
            return transaction;
        } else {
            throw new ApplicationError('Transaction data is invalid', 400);
        }
    }

    async remove(id) {
        throw new ApplicationError('Invalid operation: Remove Transaction', 400);
    }
}

module.exports = Transactions;