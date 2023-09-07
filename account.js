const Transaction = require("./transaction");

class Account {
	constructor() {
		this.transactions = [];
	}

	deposit(amount, date) {
		this.validateDateAndAmount(date, amount);

		let balance = this.getBalance();
		balance += amount;

		const dateString = this.dateStringFormatter(date);
		const newTransaction = new Transaction(
			dateString,
			amount.toFixed(2),
			null,
			balance.toFixed(2)
		);
		this.transactions.push(newTransaction);
	}

	withdraw(amount, date) {
		this.validateDateAndAmount(date, amount);
		let balance = this.getBalance();
		if (balance < amount) {
			throw new Error(
				"You do not have enough balance to make this withdrawal"
			);
		}
		balance -= amount;
		const dateString = this.dateStringFormatter(date);
		const newTransaction = new Transaction(
			dateString,
			null,
			amount.toFixed(2),
			balance.toFixed(2)
		);
		this.transactions.push(newTransaction);
	}

	printStatement() {
		const statementHeader = "date || credit || debit || balance";
		let statement = statementHeader;
		if (!this.transactions.length) {
			return statement;
		}

		const statementTransactions = this.transactions.toReversed();
		statementTransactions.forEach((transaction) => {
			if (transaction.credit === null) {
				const stringTransaction = `\n${transaction.date} || || ${transaction.debit} || ${transaction.balance}`;
				statement += stringTransaction;
			} else {
				const stringTransaction = `\n${transaction.date} || ${transaction.credit} || || ${transaction.balance}`;
				statement += stringTransaction;
			}
		});
		console.log(statement);
		return statement;
	}

	getBalance() {
		let balance = 0;
		if (this.transactions.length) {
			const lastTransactionIndex = this.transactions.length - 1;
			balance = parseFloat(
				this.transactions[lastTransactionIndex].balance
			);
		}
		return balance;
	}

	dateStringFormatter(date) {
		const dateString = date.toLocaleString("en-GB");
		return dateString.split(",")[0];
	}

	validateDateAndAmount(date, amount) {
		if (!date instanceof Date || isNaN(date)) {
			throw new Error("Date must be provided as a date object");
		}
		if (typeof amount !== "number") {
			throw new Error("amount must be a number");
		}
		if (amount <= 0) {
			throw new Error("Amount must be greater than 0");
		}
	}
}

module.exports = Account;
