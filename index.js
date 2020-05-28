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
    let description;
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
                if(description != undefined && installation != undefined && usage != undefined && tests != undefined && faq != undefined && credits != undefined && license != undefined)
                {
                    const readme =
`
# ${repo}
#### Author: ${username}

${description}

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
            const writeDescription = (des) => {
                if (des != null) {
                    description = des;
                    writeInstallation();
                } else {
                    inquirer.prompt({
                        message: "Write a short description about your project.",
                        name: "desc" 
                    }).then(({desc}) => {
                        description = desc;
                        writeInstallation();
                    })
                }       
            }
            const writeInstallation = () => {
                inquirer.prompt({
                    message: "Tell users how to install your file.", 
                    name: "inst"
                }).then(({inst}) => {
                    installation = inst;
                    writeUsage();
                });
            }
            const writeUsage = () => {
                inquirer.prompt({
                    message: "Describe some use cases for your project",
                    name: "use"
                }).then(({use}) =>{
                    usage = use
                    writeTests();
                })
            }
            const writeTests = () => {
                inquirer.prompt({
                    message: "Describe a test case for your project",
                    name: "testing"
                }).then(({testing}) => {
                    tests = testing;
                    writeFAQ();
                });
            }
            const writeFAQ = () => {
                const askQuestion = () => {
                    inquirer.prompt({
                        message:  "Enter a question",
                        name: "question"
                    }).then(({question}) => {
                        inquirer.prompt({
                            message: "Enter an answer",
                            name: "answer"
                        }).then(({answer}) => {
                            faqs += 
`* Q: ${question}
    * A: ${answer}
`;
                            inquirer.prompt({
                                type: "confirm",
                                message: "Add another question?",
                                name: "another"
                            }).then(({another}) => {
                                if (another) {
                                    askQuestion();
                                } else {
                                    faq = faqs;
                                    parseCredits(res.data.contributors_url);
                                }
                            })
                        })  
                    })
                }
                let faqs = "";
                console.log("Write a FAQ(Frequently Asked Questions) for your project.");
                askQuestion();
            }
            const parseCredits = contribUrl => {
                axios.get(contribUrl)
                    .then(contribs => {
                        let creds = "";
                        contribs.data.forEach(user => {
                            creds += `<img src="${user.avatar_url}" width="30" style="border-radius: 15px"> [${user.login}](${user.html_url})<br>`;
                        });
                        credits = creds;
                        parseLicense(res.data.license);
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
            writeDescription(res.data.description);
        });
})