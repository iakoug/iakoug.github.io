/* eslint-disable no-console */
const { execSync } = require("child_process");
// eslint-disable-next-line import/no-extraneous-dependencies
const chalk = require("chalk");

const run = async (cmd) => {
  try {
    await execSync(cmd);
  } catch (err) {
    console.info(chalk.cyan(`Exec command:${cmd} running error! ⬇️⬇️⬇️\n`));
    console.error(chalk.red(err));
  }
};

const init = async () => {
  console.log(chalk.cyan(`\ncd public && touch CNAME\n`));
  await run(`cd public && touch CNAME`);
  console.log(chalk.cyan(`\ncd public && echo 'kwoks.me' > CNAME\n`));
  await run(`cd public && echo 'kwoks.me' > CNAME`);
  console.log(chalk.cyan(`\ncd public && git init\n`));
  await run(`cd public && git init`);
  console.log(chalk.cyan(`\ncd public && git add\n`));
  await run(`cd public && git add .`);
  console.log(chalk.cyan(`\ncd public && git config user.email\n`));
  await run(`cd public && git config user.email "rollawaypoint@gmail.com"`);
  console.log(chalk.cyan(`\ncd public && git config user.name\n`));
  await run(`cd public && git config user.name "christian"`);
  console.log(chalk.cyan(`\ncd public && git remote\n`));
  await run(
    `cd public && git remote add origin https://github.com/justwink/justwink.github.io.git`
  );
  console.log(chalk.cyan(`\ncd public && git commit\n`));
  await run(
    `cd public && git commit -m 'Site has been published! ${new Date().toString()}'`
  );
  console.log(chalk.cyan(`\ncd public && git push\n`));
  await run(`cd public && git push origin HEAD:master -f && cd ..`);
  console.log(chalk.cyan(`\ngit add\n`));
  await run(`git add .`);
  console.log(chalk.cyan(`\ngit commit\n`));
  await run(`git commit -am 'Update by publish! ${new Date().toString()}'`);
  console.log(chalk.cyan(`\ngit push\n`));
  await run(`git push`);

  console.log(
    chalk.green(`\n\nPublish successfully!\n${new Date().toString()}`)
  );
};

init();
