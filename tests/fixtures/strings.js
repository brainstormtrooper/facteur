/* eslint-disable no-unused-vars, no-var, no-tabs */

var testCsv = `address,name,likes
  recipient1@email.com,Bob,red cars
  recipient2@otheremail.com,Tom,fast cars
  recipient3@email.com,Sam,luxury cars`;

var testCsv2 = `"address","name","likes"
  "recipient1@email.com","Bob","red cars"
  "recipient2@otheremail.com","Tom","Porches, and Ferraris"
  "recipient3@email.com","Sam","Trucks, and SUVs"`;

var templateTxt = '{{name}}, {{likes}}';

var templateHtml = '<h2>{{name}},</h2><p>{{likes}}</p>';

var msgHtml = '<h2>Bob,</h2><p>red cars</p>';

var msgTxt = 'Bob, red cars';

// eslint-disable-next-line max-len
var subBlock = `Subject: test\nMIME-Version: 1.0\nContent-Type: multipart/alternative; boundary=BOUNDARY\n\n`;

// eslint-disable-next-line max-len
var msgBlock = `--BOUNDARY\nContent-Type: text/plain; charset=utf-8\nBob, red cars\n--BOUNDARY\nContent-Type: text/html; charset=utf-8\n<h2>Bob,</h2><p>red cars</p>\n--BOUNDARY--`;

var password = 'password';

// var hash = 'facteur';

var fileStr64 = `{
	"FROM": "sender@email.com",
	"USER": "username",
	"HOST": "smtps://smtp.mail.domain.com:465",
	"SUBJECT": "test",
	"HTML": "<h2>{{name}},</h2><p>{{likes}}</p>",
	"TEXT": "{{name}}, {{likes}}.",
	"TO": [
		"recipient1@email.com",
		"recipient2@otheremail.com",
		"recipient3@email.com"
	],
	"CSVA": "WwoJCVsKCQkJInJlY2lwaWVudDFAZW1haWwuY29tIiwKCQkJInJpY2siLAoJCQkicmVkIGNhcnMiCgkJXSwKCQlbCgkJCSJyZWNpcGllbnQyQG90aGVyZW1haWwuY29tIiwKCQkJIlJpY2t5IiwKCQkJImZhc3QiCgkJXSwKCQlbCgkJCSJyZWNpcGllbnQzQGVtYWlsLmNvbSIsCgkJCSJCb2IiLAoJCQkibHV4dXJ5IgoJCV0KCV0=",
	"VARS": [
		"address",
		"name",
		"likes"
	],
	"DELAY": "500",
	"FILEID": "123"
}`;

var fileStr = `{
	"FROM": "sender@email.com",
	"USER": "username",
	"HOST": "smtps://smtp.mail.domain.com:465",
	"SUBJECT": "test",
	"HTML": "<h2>{{name}},</h2><p>{{likes}}</p>",
	"TEXT": "{{name}}, {{likes}}.",
	"TO": [
		"recipient1@email.com",
		"recipient2@otheremail.com",
		"recipient3@email.com"
	],
	"CSVA": [
		[
			"recipient1@email.com",
			"rick",
			"red cars"
		],
		[
			"recipient2@otheremail.com",
			"Ricky",
			"fast"
		],
		[
			"recipient3@email.com",
			"Bob",
			"luxury"
		]
	],
	"VARS": [
		"address",
		"name",
		"likes"
	],
	"DELAY": "500",
	"FILEID": "123"
}`;
