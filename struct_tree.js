const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');
const pdflocation = "https://bloccitdevdiego.s3.amazonaws.com/waste-harvest-dev/i-130.pdf"
const fs = require("fs");
function draw(object){
	console.log(object);


}
async function run (){
	const doc = await  pdfjs.getDocument(pdflocation).promise
	const page = await doc.getPage(1);
	const structTree = await page.getStructTree();
	draw(structTree);	
	traverse(structTree);
//	const text = await page.getTextContent({includeMarkedContent: true,combineTextItems:true});
//	draw(text);
//	fs.writeFileSync("./text.json",JSON.stringify(text));
	


}

function traverse(object){



	if(Array.isArray(object)){
	
		object.forEach( (e) => {
			draw(e);
			traverse(e.children);
		})



	}else{
		if(object == undefined){
			return 	
		}
		object.children && traverse(object.children);

	}


}
run()
