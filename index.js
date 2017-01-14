#!/usr/bin/env node
'use strict';

var parse_json = function(callback)
{
    var readline = require('readline');
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    var input = "";
    rl.on('line', function(line)
    {
        input += line;
    });

    rl.on('close', function()
    {
        var json;
        try
        {
            json = JSON.parse(input);
        }
        catch(err)
        {
            console.error();
            console.error("Fatal error: Piped input is not valid JSON!");
            console.error();
            console.error(err);
            process.exit(1);
        }

        callback(json);
    });
};

parse_json(function(json)
{
    var res = json.reduce(function(acc, task)
    {
        var res = task.query.reduce(function(acc, query)
        {
            var hostname = query.hostname;
            if(hostname)
            {
                acc["work"] = (acc["work"] || {});
                acc["work"][hostname] = (acc["work"][hostname] || 0);
                if(query.timer == null)
                {
                    acc["work"][hostname] += 1;
                }
                else
                {
                    acc["Working"] = (acc["Working"] || 0);
                    acc["Working"] += 1;
                }
            }
            else
            {
                acc["Unfinished"] = (acc["Unfinished"] || 0);
                acc["Unfinished"] += 1;
            }
            
            return acc;
        }, {});
        acc[task.name] = res;
        return acc;
    }, {});
    console.log(JSON.stringify(res));
});
