/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const { execSync } = require("child_process");
// eslint-disable-next-line import/no-extraneous-dependencies
const chalk = require("chalk");
const { Spinner } = require("cli-spinner");

const run = async (cmd) => {
  try {
    await execSync(cmd);
  } catch (err) {
    console.info(chalk.cyan(`Exec command:${cmd} running error! ⬇️⬇️⬇️\n`));
    console.error(chalk.red(err));
  }
};

let spinner;

function loading(text) {
  spinner = new Spinner(text);
  spinner.setSpinnerString("|/-\\");
  spinner.start();
}

function stopSpinner(clean = true) {
  if (spinner) {
    spinner.stop(clean);
  }
}

function setSpinner(text) {
  stopSpinner();
  loading(text);
}

const init = async () => {
  setSpinner(chalk.cyan(`cd public && touch CNAME`));
  await run(`cd public && touch CNAME`);
  setSpinner(chalk.cyan(`cd public && echo 'kwoks.me' > CNAME`));
  await run(`cd public && echo 'kwoks.me' > CNAME`);
  setSpinner(chalk.cyan(`cd public && git init`));
  await run(`cd public && git init`);
  setSpinner(chalk.cyan(`cd public && git add`));
  await run(`cd public && git add .`);
  setSpinner(chalk.cyan(`cd public && git config user.email`));
  await run(`cd public && git config user.email "rollawaypoint@gmail.com"`);
  setSpinner(chalk.cyan(`cd public && git config user.name`));
  await run(`cd public && git config user.name "christian"`);
  setSpinner(chalk.cyan(`cd public && git remote`));
  await run(
    `cd public && git remote add origin https://github.com/justwink/justwink.github.io.git`
  );
  setSpinner(chalk.cyan(`cd public && git commit`));
  await run(
    `cd public && git commit -m 'Site has been published! ${new Date().toString()}'`
  );
  setSpinner(chalk.cyan(`cd public && git push`));
  await run(`cd public && git push origin HEAD:master -f && cd ..`);
  setSpinner(chalk.cyan(`git add`));
  await run(`git add .`);
  setSpinner(chalk.cyan(`git commit`));
  await run(`git commit -am 'Update by publish! ${new Date().toString()}'`);
  setSpinner(chalk.cyan(`git push`));
  await run(`git push`);

  stopSpinner();

  console.log(chalk.green(`\n\nPublish successfully!\n`));
  console.log(chalk.cyan(`${new Date().toString()}`));
};

init();
