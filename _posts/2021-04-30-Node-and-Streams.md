## What are streams?
Streams are used by Node to read or write input into output sequentially? The official documentation states: that a "stream"\
is an abstract interface for working for working with streaming data in Node.js. The stream module provides an API for implementing the stream interface.

### Why?
You are able to bring `chunks` of data one chunk at a time instead of filling up the memory space.
### What is an example?
Think about when you load a Youtube video and see that the video is in process; you notice that the video load one chunk at a time.
### ---


### Working Code 


```javascript

const{ PDFDocument} = require("pdf-lib");
const fetch = require('fetch');
const fs = require('fs');

async function runPdf(){

const uint8Array = await fs.readFileSync('output.pdf');
const pdfDoc = await PDFDocument.load(uint8Array);
	
const form = pdfDoc.getForm();

const fields = form.getFields();

fields.forEach( field => {
	const type = field.constructor.name
	const name = field.getName();

	console.log(`${type}: ${name}`)

})


	const field_1 = form.getField("form1[0].#subform[0].AttorneyStateBarNumber[0]");
	field_1.setText("11111111");
	const pdfSave = await pdfDoc.save();

fs.writeFileSync("output-1.pdf",pdfSave);
};
runPdf();



```
