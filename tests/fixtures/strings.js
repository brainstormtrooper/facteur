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
var connsStr = `[{
	"ID": "abc123",
	"NAME": "test connection 1",
	"USER": "bob",
	"HOST": "proto.domain.ext:1234",
	"DELAY": "500",
	"IPv4": "1",
	"HEADERS": [
		"x-api-key: 123abc"
	]
}]`;

var connStr = `{
	"ID": "abc123",
	"NAME": "test connection 1",
	"USER": "bob",
	"HOST": "proto.domain.ext:1234",
	"DELAY": "500",
	"IPv4": "1",
	"HEADERS": [
		"x-api-key: 123abc"
	]
}`;

var fileWithConn = `{
	"CONN": "55f99a8b-a531-46f5-be51-e4bed128e673",
	"SUBJECT": "Test Mailing",
	"HTML": "test html",
	"TEXT": "test text",
	"TO": [
		"recipient1@email.com",
		"recipient2@yahoo.com",
		"recipient3@gmail.com",
		""
	],
	"CSVA": [
		[
			"recipient1@email.com",
			"rick",
			"red cars"
		],
		[
			"recipient2@yahoo.com",
			"Ricky",
			"fast"
		],
		[
			"recipient3@gmail.com",
			"Bob",
			"luxury"
		],
		[
			""
		]
	],
	"VARS": [
		"address",
		"name",
		"likes"
	],
	"FILEID": "b487c267-75fa-4394-a2be-0206aa62c5a7",
	"SENT": ""
}`;


// base64 from JSON string
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
	"CSVA": "JTVCJTVCJTIycmVjaXBpZW50MUBlbWFpbC5jb20lMjIsJTIycmljayUyMiwlMjJyZWQlMjBjYXJzJTIyJTVELCU1QiUyMnJlY2lwaWVudDJAb3RoZXJlbWFpbC5jb20lMjIsJTIyUmlja3klMjIsJTIyZmFzdCUyMiU1RCwlNUIlMjJyZWNpcGllbnQzQGVtYWlsLmNvbSUyMiwlMjJCb2IlMjIsJTIybHV4dXJ5JTIyJTVEJTVE",
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
