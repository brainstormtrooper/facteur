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

var templateHtml = '<p><h2>{{name}},</h2> {{likes}}</p>';

var msgHtml = '<p><h2>Bob,</h2> red cars</p>';

var msgTxt = 'Bob, red cars';

// eslint-disable-next-line max-len
var subBlock = `Subject: test\nMIME-Version: 1.0\nContent-Type: multipart/alternative; boundary=BOUNDARY\n\n`;

// eslint-disable-next-line max-len
var msgBlock = `--BOUNDARY\nContent-Type: text/plain; charset=utf-8\nBob, red cars\n--BOUNDARY\nContent-Type: text/html; charset=utf-8\n<p><h2>Bob,</h2> red cars</p>\n--BOUNDARY--`;

var password = 'password';

var hash = 'gnome-emailer';

var fileStr = `{
	"FROM": "sender@email.com",
	"USER": "username",
	"PASS": "U2FsdGVkX19Lhn94BJI7n21YOM71UaJfKPGyUFAifL0=",
	"HOST": "smtps://smtp.mail.domain.com:465",
	"SUBJECT": "test",
	"HTML": "<p>{{name}}, {{likes}}.</p>",
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
	"DELAY": "500"
}`;
