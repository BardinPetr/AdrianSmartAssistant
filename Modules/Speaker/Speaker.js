// load file hander lib
var fs = require('fs');

//load cripto lib
var _hash = require('crypto-toolkit').Hash('hex');

// get the constants
var constants = require(__dirname + "/../../constants.js");

// load child process hander
const execSync = require('child_process').execSync;

// Chalk for coloring console messages
var chalk = require('../../node_modules/chalk');

var baseModel = require(constants.BASE_MODULE);

/*
 * Speak Function using Ivona Library
 */

function Speak(ModuleParams) {

    var text = ModuleParams["text"]
    var mode = ModuleParams["mode"]

    //speak on facebook
    if (mode == "facebook") {

        baseModel.LeaveQueueMsg("Facebook", "Message", {
            "message": text,
            "threadId": ModuleParams["threadId"]
        })

    }

    // speak on speaker
    if (mode == "natural") {

        //console.log(ModuleParams["text"])
        var textHash = _hash.sha256(text);
        let filePath = constants.POLLY_TEMP_DIR + textHash + '.mp3';

        console.log(filePath)

        if (fs.existsSync(filePath)) {

            var ModulExec = execSync('play ' + filePath, {
                stdio: "ignore"
            }); //hide it with ignore

        } else {

            let fs = require('fs');
            let Polly = require('polly-tts');
            let polly = new Polly({
                accessKeyId: constants.POLLY_ACCESSKEY,
                secretAccessKey: constants.POLLY_SECRETKEY
            });

            let options = {
                text: text,
                textType: "text",
                region: constants.POLLY_AWS_REGION,
                voiceId: constants.POLLY_VOICE,
                sampleRate: 22050,
                outputFormat: "mp3"
            };

            let fileStream = fs.createWriteStream(filePath);
            polly.textToSpeech(options, (err, audioStream) => {
                if (err) {
                    return console.log(chalk.red("SPEAKER MODULE : TTS ERROR: " + err.message))
                }
                audioStream.pipe(fileStream);    
                audioStream.on('end', () => {
                    console.log(chalk.red("SPEAKER MODULE : SPEAK STARTED"))
                    var ModulExec = execSync('play ' + filePath, {
                        stdio: "ignore"
                    }); //hide it with ignore
                });
            });
        }

    }



}

/* Expose Module */
module.exports.Speak = Speak;

//Good news, You are online again.
//You have lost Internet connectivity
//Yes
//Sorry, I cannot connect to the Internet