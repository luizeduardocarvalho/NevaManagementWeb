const { exec } = require('child_process');

let command;

if (process.env.ENV === 'production') {
    command = exec('ng build --configuration=production');
} else if (process.env.ENV === 'staging') {
    command = exec('ng build --configuration=staging');
}

if (command != undefined) {
    command.stdout.on('data', (data) => {
        console.log(data);
    });

    command.stderr.on('data', (data) => {
        console.error(data);
    });
} else {
    console.error('process.env.ENV: ' + process.env.ENV);
}