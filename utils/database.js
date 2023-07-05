const NOTICE_EAN13 = "Номер, указанный ПОД штрих-кодом, НЕ номер карты. 13 цифр.";

function formatEan13(v) {
	if(v === "") return "";
	return v[0] + " " + 
		(v.substring(1).match(/.{1,6}/g) || []).join(" ");
}

function format3(v) {
	if(v === "") return "";
	return v.match(/.{1,3}/g).join(" ");
}

function format4(v) {
	if(v === "") return "";
	return v.match(/.{1,4}/g).join(" ");
}

function validateEAN13(v) {
	return v.length === 13;
}

export const CardTypes = {
	"5ka": {
		format: "EAN13",
		keyboard: ["numbers"],
		info: `${NOTICE_EAN13} Из приложения не подойдёт.`,
		displayFormat: formatEan13,
		inputValidate: validateEAN13
	},
	"auchan": {
		format: "EAN13",
		keyboard: ["numbers"],
		displayFormat: formatEan13,
		inputValidate: validateEAN13
	},
	"lenta": {
		format: "CODE128",
		keyboard: ["numbers"],
		displayFormat: format3
	},
	"metro": {
		format: "INT2OF5",
		keyboard: ["numbers"],
		displayFormat: format3,
		info: "Введите номер, указанный под штрих-кодом. 22 цифры",
		inputValidate: (v) => v.length === 22
	},
	"perekrestok": {
		format: "EAN13",
		keyboard: ["numbers"],
		info: NOTICE_EAN13,
		inputValidate: validateEAN13,
		displayFormat: formatEan13
	},
	"magnit": {
		format: "QR",
		keyboard: ["numbers"],
		displayFormat: format4,
		codePostProcessing: (v) => {
			return `E${v}`;
		},
		inputValidate: (v) => v.length == 16
	},
	"sportmaster": {
		format: "EAN13",
		keyboard: ["numbers"],
		displayFormat: formatEan13,
		inputValidate: validateEAN13
	},
	"okay": {
		format: "EAN13",
		keyboard: ["numbers"],
		inputValidate: validateEAN13,
		displayFormat: (v) => {
			if(v.length == 0) return "";
			return [
				v.substring(0,2), 
				v.substring(2,4), 
				...(v.substring(4).match(/.{1,3}/g) || "")
			].join(" ");
		}
	},
	"citilink": {
		format: "CODE39",
		keyboard: ["numbers"],
		displayFormat: format3
	},
	"fixprice": {
		format: "EAN13",
		keyboard: ["numbers"],
		info: "13 цифр, под штрих-кодом",
		displayFormat: formatEan13,
		inputValidate: (v) => v.length == 13,
	},
	"detmir": {
		format: "CODE128",
		keyboard: ["numbers"],
		displayFormat: format4
	},
	"ostin": {
		format: "EAN13",
		keyboard: ["numbers"],
		info: NOTICE_EAN13,
		inputValidate: validateEAN13,
		displayFormat: formatEan13
	},
	"covid": {
		format: "QR",
		keyboard: ["en"],
		info: "Отсканируйте ваш QR-код чем-нибудь, посмотрите ссылку. Наберите весь текст после \"status/\" и до \"?\".",
		codePostProcessing: (v) => {
			return `https://www.gosuslugi.ru/covid-cert/status/${v}?lang=ru`;
		}
	},
	"vernij": {
		format: "EAN13",
		keyboard: ["numbers"],
		inputValidate: validateEAN13,
		displayFormat: formatEan13
	},
	"selgros": {
		format: "CODE128",
		keyboard: ["numbers"],
		inputValidate: validateEAN13,
		displayFormat: format3,
		codePostProcessing: (v) => `20${v}0`
	},
	"agrokomplex": {
		format: "EAN13",
		keyboard: ["numbers"],
		inputValidate: validateEAN13,
		displayFormat: formatEan13
	},
	"farmlend": {
		format: "CODE128",
		keyboard: ["numbers"],
		codePostProcessing: (v) => {
			return `FLEND2012Y${v}`;
		}
	},
	"edelweis": {
		format: "EAN13",
		keyboard: ["numbers"],
		inputValidate: validateEAN13,
		displayFormat: formatEan13
	},
	"april": {
		format: "EAN13",
		keyboard: ["numbers"],
		info: "Код под штрих-кодом на пластиковой карте. Из приложеиния скорее всего работать не будет. 13 цифр",
		inputValidate: validateEAN13,
		displayFormat: formatEan13
	},
	"karusel": {
		format: "EAN13",
		keyboard: ["numbers"],
		info: NOTICE_EAN13,
		inputValidate: validateEAN13,
		displayFormat: formatEan13
	},
	"maksimdom": {
		format: "CODE39",
		keyboard: ["numbers"],
		info: "7 цифр, указанные под штрих-кодом. Буквы DK в начале писать не нужно",
		codePostProcessing: (v) => {
			return `DK${v}`;
		}
	},
	"euroopt": {
		format: "CODE128",
		keyboard: ["numbers"]
	},
	"spar": {
		format: "QR",
		keyboard: ["numbers"],
		displayFormat: format4
	},
};
