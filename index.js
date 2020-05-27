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
    const readme = 
`
# ${repo}
# Author: ${username}
![size](https://img.shields.io/github/repo-size/${username}/${repo})

#Table of Contents:
* [Installation](#Installation)
* [Usage](#Usage)
* [Tests](#Tests)
* [FAQ](#FAQ)
* [Credits](#Credits)
* [License](#License)

## Installation
${installation}

## Usage
${usage}

## Tests
${tests}

## FAQ
${faq}

## Credits
${credits}

## License
${license}
`

    axios.get(`https://api.github.com/repos/${username}/${repo}`)
        .then(res => {
            const writeInstallation = () => {

            }
            const writeUsage = () => {

            }
            const writeTests = () => {

            }
            const writeFAQ = () => {

            }
            const parseCredits = res => {

            }
            const parseLicense = res => {

            }
            installation = writeInstallation();
            usage = writeUsage();
            test = writeTests();
            faq = writeFAQ();
            credits = parseCredits(res);
            license = parseLicense(res);
        });

    fs.writeFile(`${repo} README.md`, readme.trim(), err => {if (err) console.log(err)});
})