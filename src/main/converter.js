const sharp = require('sharp');

module.exports = { 
    convert(fileDir, targetFormat, outputDir) {
        return new Promise((resolve, reject) => {
            sharp(fileDir)
                .toFormat(targetFormat)
                .toFile(outputDir, (err, info) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(info);
                    }
                });
        });
    }
}
