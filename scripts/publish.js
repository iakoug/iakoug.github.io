const { execSync } = require("child_process");
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
  await run(`cd public && touch CNAME`);
  await run(`cd public && echo 'kwoks.me' > CNAME`);
  await run(`cd public && git init`);
  await run(`cd public && git add .`);
  await run(`cd public && git config user.email "rollawaypoint@gmail.com"`);
  await run(`cd public && git config user.name "christian"`);
  await run(
    `cd public && git remote add origin https://github.com/justwink/justwink.github.io.git`
  );
  await run(`cd public && git commit -m 'Site has been published!'`);
  await run(`cd public && git push origin HEAD:master -f && cd ..`);
  await run(`git add .`);
  await run(`git commit -am 'Update by publish!'`);
  await run(`git push`);

  console.log(chalk.green(`\n\nPublish successfully!\n`));
};

init();
