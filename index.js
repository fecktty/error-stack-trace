const source_map_1 = require("source-map");
const request = require("request");
const colors = require("colors");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
function printSourceTrace(sourceUri) {
    getOriginalSourceTrace(sourceUri, (err, originalSource) => {
        if (err) {
            return console.error(err);
        }
        console.log(`source: ${originalSource.sourcePath}, line: ${originalSource.sourceLine}, col: ${originalSource.sourceColumn}`);
        var rows = originalSource.sourceCode.split('\n');
        rows.forEach((item, index) => {
            if (index < originalSource.sourceLine - 1 && index > originalSource.sourceLine - 10) {
                console.log(`${index} ${rows[index]}`);
            }
            else if (index === originalSource.sourceLine - 1) {
                console.log(colors.inverse(`${index} ${rows[index]}`));
            }
            else if (index > originalSource.sourceLine && index < originalSource.sourceLine + 10) {
                console.log(`${index} ${rows[index]}`);
            }
        });
        console.log(`source: ${originalSource.sourcePath}, line: ${originalSource.sourceLine}, col: ${originalSource.sourceColumn}`);
    });
}
exports.printSourceTrace = printSourceTrace;
function getOriginalSourceTrace(sourceUri, callback) {
    var regExp = /(.+?)(?:\:(\d+))?(?:\:(\d+))?$/;
    var parts = regExp.exec(sourceUri);
    var url = parts[1].replace(/\?.*/, '') + ".map", line = parseInt(parts[2]), column = parseInt(parts[3]);
    request.get(url, (err, res, body) => {
        if (err) {
            return callback(err, undefined);
        }
        else if (res.statusCode !== 200) {
            let errMsg = `${res.statusCode} ${body}`;
            return callback(errMsg, undefined);
        }
        else {
            var smc = new source_map_1.SourceMapConsumer(body);
            var originalPosition = smc.originalPositionFor({ line: line, column: column });
            var originalSource = smc.sourceContentFor(originalPosition.source, true);
            var originalSourceTrace = {
                sourcePath: originalPosition.source,
                sourceLine: originalPosition.line,
                sourceColumn: originalPosition.column,
                sourceCode: originalSource
            };
            callback(undefined, originalSourceTrace);
        }
    });
}
exports.getOriginalSourceTrace = getOriginalSourceTrace;
