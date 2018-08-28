const fs = require('fs');
const cheerio = require('cheerio');
let $ = cheerio;
const folders = ['our', 'parcels', 'reports'];

let outputBuffer = $(`<div><div class="left-pane"></div><iframe name="main-pane" class="main-pane"></iframe></div>`);

let skeleton = {};

folders.forEach((folder) => {
    let files = fs.readdirSync(__dirname + "/" + folder, {encoding: 'utf-8'});
    skeleton[folder] = files;
});


Object.keys(skeleton).forEach((folder) => {
    let folderBlock = $('<div class="folder-block"></div>')
    let header = $('<h3>' + folder + '</h3>');
    let body = $('<div class="folder-body"></div>');
    folderBlock.append(header);
    folderBlock.append(body);
    outputBuffer.find('.left-pane').append(folderBlock);
    let files = skeleton[folder];
    files.forEach((file) => {
        let fileView = file.replace(".html","");
        if (folder !== "parcels") {
            fileView = file.split("-")[2];
        }
        let fileLink = `<a target="main-pane" href="${folder}/${file}">${fileView}</a><br/>`;
        body.append(fileLink);
    });
});

let styles = `
<style>
.left-pane {
    width: 20%;
    display: inline-block;
    vertical-align: top;
}

iframe.main-pane {
    width: 78%;
    display: inline-block;
    height: 100%;
}
</style>
`;

let outputFileName = `./index2.html`;
fs.writeFile(outputFileName, styles + outputBuffer.html(), "utf8", (err) => {
    if (err) throw err;
    console.log(`The file ${outputFileName} has been saved!`);
});

/*
fs.readdir(__dirname + "/data", {encoding: 'utf-8'}, (eventType, files) => {
    files.forEach((file) => {
        if (file.includes('.htm')) {
            let data = {};
            let activeShop = '';

            shops.forEach((shop) => {
                if (!file.includes(shop)) {
                    //console.log(`${file} is not ${shop}`);
                    return true;
                }

                console.log(`${file} matches ${shop}!`);

                const proc = require(`./${shop}`);
                data = fs.readFileSync("./data/" + file, {encoding: 'utf8'});
                data = proc.Main.process(cheerio.load(data));
                // console.dir(data);
                activeShop = shop;
                return false;
            });

            let outputBuffer = "";
            if (!data.orderItems) {
                console.log("no order items!");
                return true;
            }
            data.orderItems.forEach((orderItem) => {
                for (q = 0; q < orderItem.quantity; q++) {
                    outputBuffer += "" + orderItem.id;
                    outputBuffer += "\t'" + orderItem.size;
                    outputBuffer += "\t'" + orderItem.color;
                    outputBuffer += "\t" + orderItem.price;
                    outputBuffer += "\t" + orderItem.cost;
                    outputBuffer += "\t" + orderItem.orderNumber;
                    outputBuffer += "\t" + orderItem.who;
                    outputBuffer += "\t" + orderItem.category;
                    outputBuffer += "\t" + orderItem.title;
                    outputBuffer += "\t" + orderItem.srcSmall;
                    outputBuffer += "\t" + orderItem.srcBig;
                    outputBuffer += "\t" + orderItem.trackNumber;
                    outputBuffer += "\n";
                }
            });

            let outputFileName = `./data/${data.orderNumber}-${activeShop}`;
            fs.writeFile(outputFileName, outputBuffer, "utf8", (err) => {
                if (err) throw err;
                console.log(`The file ${outputFileName} has been saved!`);
            });
        }

    })
});

*/

console.log("Done!");
