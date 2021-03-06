const _ = require('lodash');
const promiseLimit = require('promise-limit');
const AV = require('leanengine');

const ffmpeg = require('fluent-ffmpeg');

const txtsegment = require('./txtsegment');
const { play, getSpeakerList } = require('./core');
const fs = require('fs-extra');
const path = require('path');

AV.Cloud.define('tts', async function(request) {
	const { req, res, next } = request.params;
	const content = req.body.content;
	const vid = req.body.vid;
	let tempArray = txtsegment(content);
	let promiseArray = [],
		fileArray = [],
		txt = [];

	const limit = promiseLimit(50);
	const padLength = 5;

	const tempPath = fs.mkdtempSync('/tmp/task_');

	console.log(tempPath);
	//   if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath);

	const projectName = 'demo';
	const segmentDir = path.resolve(tempPath, './segment');

	fs.mkdir(segmentDir, { recursive: true }, err => {
		if (err) throw err;
	});

	for (let i in tempArray) {
		let itemIndex = _.padStart(i, padLength, 0);
		let file = `${projectName}-${itemIndex}.mp3`;
		let itemPath = path.resolve(segmentDir, `./${file}`);
		promiseArray.push(itemPath);
		fileArray.push(file);
		txt.push(`file '${file}'`);
	}

	console.log(txt);

	function job(itemPath, index) {
		var text = `job ${index}`;
		console.log('started', text);
		return new Promise(function(resolve) {
			if (fs.existsSync(itemPath)) {
				console.log(itemPath + '已存在，跳过');
				resolve(index);
				return;
			}
			play({ text: tempArray[index], vid }).then(req => {
				let stream = req.data;
				// console.log(req);
				stream.pipe(
					fs.createWriteStream(itemPath).on('finish', () => {
						console.log('       ', text, 'finished');
						resolve(index);
						return;
					}),
				);
			});
		});
	}

	Promise.all(
		promiseArray.map((itemPath, index) => {
			return limit(() => job(itemPath, index));
		}),
	).then(function(values) {
		//全部片段都已经下载好之后
		const outputPath = path.resolve(tempPath, './all.mp3');
		const listPath = path.resolve(segmentDir, './list.txt');
		fs.writeFileSync(listPath, txt.join('\n'));

		ffmpeg(listPath)
			.inputOptions('-f', 'concat')
			.outputOptions('-ar', '44100', '-ac', '1', '-ab', '320k')
			// .audioCodec("libmp3lame")
			.on('start', function(commandLine) {
				console.log('Spawned Ffmpeg with command: ' + commandLine);
			})
			.on('progress', function(progress) {
				console.log('Processing: ' + progress.percent + '% done');
			})
			.on('error', function(err, stdout, stderr) {
				console.error('Error:', err);
				console.error('ffmpeg stderr:', stderr);
			})
			.output(outputPath)
			.on('end', function() {
				res.download(outputPath, 'all.mp3', function(err) {
					if (err) {
						// Handle error, but keep in mind the response may be partially-sent
						// so check res.headersSent
						next();
					} else {
						fs.remove(tempPath, err => {
							if (err) return console.error(err);
							console.log(tempPath, '清理干净!'); // I just deleted my entire HOME directory.
						});
						next();
					}
				});
			})
			.run();

		// audioconcat(promiseArray, { options:{acodec: "mp3"} })
		//   .concat(path.resolve("./tmp/all.mp3"))
		//   .on("start", function(command) {
		//     console.log("ffmpeg process started:", command);
		//   })
		//   .on("error", function(err, stdout, stderr) {
		//     console.error("Error:", err);
		//     console.error("ffmpeg stderr:", stderr);
		//   })
		//   .on("end", function(output) {
		//     console.error("Audio created in:", output);
		//   });
	});
	// console.log(tempArray);
});
