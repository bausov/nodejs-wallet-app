'use strict';

const ApplicationError = require('libs/application-error');
const FileModel = require('./common/fileModel');
const luhn = require('luhn');

class Cards extends FileModel {
	constructor() {
		super('cards.json');
	}

    async get(id) {
        if (!!id) {
            return await this._dataSource.filter(function (el) {
                return el.cardId === id;
            });
        } else {
            throw new ApplicationError('No such card', 400);
        }
    }

	/**
	 * Добавляет карту
	 *
	 * @param {Object} cardData описание карты
	 * @returns {Promise.<Object>}
	 */
	async create(cardData) {
		const isDataValid = cardData &&
			cardData.hasOwnProperty('cardNumber') &&
			cardData.hasOwnProperty('balance') &&
			luhn.validate(cardData.cardNumber);

		if (isDataValid) {
			const card = {
                id: this._dataSource.reduce((max, item) => Math.max(max, item.id), 0) + 1,
				cardNumber: cardData.cardNumber,
				balance: cardData.balance
			};

			this._dataSource.push(card);
			await this._saveUpdates();
			return card;
		} else {
			throw new ApplicationError('Card data is invalid', 400);
		}
	}

	/**
	 * Удалет карту
	 * @param {Number} id идентификатор карты
	 */
	async remove(id) {
		const card = this._dataSource.find((item) => {
			return item.id === id;
		});

		if (!card) {
			throw new ApplicationError(`Card with ID=${id} not found`, 404);
		}
		const cardIndex = this._dataSource.indexOf(card);
		this._dataSource.splice(cardIndex, 1);
		await this._saveUpdates();
	}
}

module.exports = Cards;
