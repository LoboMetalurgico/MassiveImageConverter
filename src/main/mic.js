const converter = require('./converter');
const path = require('path');
const fs = require('fs');

async function run(args) {
    var targetFormat;
    var outputPath;
    var inputPath;

    if (args && args.inputPath) {
        if (!fs.existsSync(args.inputPath)) {
            try {
                console.error('Input path does not exist: ' + args.inputPath + '. Creating...');
                fs.mkdirSync(args.inputPath, { recursive: true });
            } catch (e) {
                console.error('Error creating input path: ' + args.inputPath);
                process.exit(1);
            }
        }
        inputPath = args.inputPath;
    } else {
        try {
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', 'input'))) {
                fs.mkdirSync(path.resolve(__dirname, '..', '..', 'input'));
            }
            inputPath = path.resolve(__dirname, '..', '..', 'input');
        } catch (e) {
            console.error('Error while creating input path: ' + path.resolve(__dirname, '..', '..', 'input'));
            process.exit(1);
        }
    }

    if (args && args.outputPath) {
        if (!fs.existsSync(args.outputPath)) {
            try {
                console.error('Output path does not exist: ' + args.outputPath + '. Creating...');
                fs.mkdirSync(args.outputPath, { recursive: true });
            } catch (e) {
                console.error('Error creating output path: ' + args.outputPath);
                process.exit(1);
            }
        }
        outputPath = args.outputPath;
    } else {
        try {
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', 'output'))) {
                fs.mkdirSync(path.resolve(__dirname, '..', '..', 'output'));
            }
            outputPath = path.resolve(__dirname, '..', '..', 'output');
        } catch (e) {
            console.error('Error while creating output path: ' + path.resolve(__dirname, '..', '..', 'output'));
            process.exit(1);
        }
    }

    if (args && args.targetFormat) {
        targetFormat = args.targetFormat;
    } else {
        targetFormat = 'webp';
    }

    const inputFiles = [];

    fs.readdirSync(inputPath).forEach(file => {
        inputFiles.push(file);
    });

    if (inputFiles.length <= 0) {
        console.error('No input files found in: ' + inputPath + '. Exiting...');
        process.exit(0);
    }

    const amount = inputFiles.length;
    var current = 1;
    var errors = 0;

    for (file of inputFiles) {
        console.log('[' + current +  ' / ' + amount + '] Converting: ' + file);
        const inputFile = path.join(inputPath, file);
        const outputFile = path.join(outputPath, file.replace(/\.(.*)/, '.' + targetFormat));
        try {
            await converter.convert(inputFile, targetFormat, outputFile);
            console.log('[' + current +  ' / ' + amount + '] Converted: ' + file);
        } catch (e) {
            console.error(e);
            console.error('Error while converting: ' + inputFile + '. Skipping...');
            errors++;
        } finally {
            current++;
        }
    }

    if (errors <= 0) {
        console.log('Conversion complete!');
    } else {
        console.error('Conversion complete with ' + errors + ' errors!');
    }
}

run();
