const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");

inquirer.prompt([{
    type: "input",
    message: "Enter your GitHub username",
    name: "username"
}, {
    type: "input",
    message: "Enter repo name",
    name: "repo"
}]).then(({ username, repo }) => {
    let installation;
    let usage;
    let tests;
    let faq;
    let credits;
    let license;

    axios.get(`https://api.github.com/repos/${username}/${repo}`)
        .then(res => {
            const writeReadMe = () => {
                // Forces it to wait until all the various functions are finished before writed the readme file.
                console.log(installation != undefined && usage != undefined && tests != undefined && faq != undefined && credits != undefined && license != undefined)
                if(installation != undefined && usage != undefined && tests != undefined && faq != undefined && credits != undefined && license != undefined)
                {
                    const readme =
`
# ${repo}
# Author: ${username}
![size](https://img.shields.io/github/repo-size/${username}/${repo})
        
# Table of Contents:
* [Installation](#Installation)
* [Usage](#Usage)
* [Tests](#Tests)
* [FAQ](#FAQ)
* [Credits](#Contributors)
* [License](#License)
        
## Installation
${installation}
        
## Usage
${usage}
        
## Tests
${tests}
        
## FAQ
${faq}
        
## Contributors
${credits}
        
## License
${license}
`
                    fs.writeFile(`${repo} README.md`, readme.trim(), err => { if (err) console.log(err) });
                }
            };
            const writeInstallation = () => {
                installation = "test";
                writeReadMe();
            }
            const writeUsage = () => {
                usage = "test";
                writeReadMe();
            }
            const writeTests = () => {
                tests = "test";
                writeReadMe();
            }
            const writeFAQ = () => {
                faq = "test";
                writeReadMe();
            }
            const parseCredits = contribUrl => {
                axios.get(contribUrl)
                    .then(contribs => {
                        let creds = "";
                        contribs.data.forEach(user => {
                            creds += `[${user.login}](${user.url})\n`;
                        });
                        credits = creds;
                        writeReadMe();
                    })
            }
            const parseLicense = lic => {
                if (lic === null) {
                    license = "This project is unlicensed."
                } else {
                    license = `This project is licensed with [${lic.name}](${lic.url})`
                }
                writeReadMe();
            }
            writeInstallation();
            writeUsage();
            writeTests();
            writeFAQ();
            parseCredits(res.data.contributors_url);
            parseLicense(res.data.license);
        });
})