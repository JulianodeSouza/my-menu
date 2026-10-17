const { spawn } = require('node:child_process');
const readline = require('node:readline');

const options = {
  buildType: [
    { label: 'Produção', value: 'production' },
    { label: 'Desenvolvimento', value: 'development' },
  ],
  platform: [
    { label: 'Android', value: 'android' },
    { label: 'iOS', value: 'ios' },
    { label: 'Ambos', value: 'all' },
  ],
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function selectOption(title, choices) {
  console.log(`\n${title}`);
  choices.forEach((choice, index) => {
    console.log(`  ${index + 1}) ${choice.label}`);
  });

  while (true) {
    const answer = (await ask('Escolha uma opção: ')).trim();
    const selectedIndex = Number(answer) - 1;

    if (Number.isInteger(selectedIndex) && choices[selectedIndex]) {
      return choices[selectedIndex].value;
    }

    console.log('Opção inválida. Informe um dos números exibidos.');
  }
}

function runBuild(profile, platform) {
  const command = `npx eas-cli@24.8.0 build --platform ${platform} --profile ${profile}`;

  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      stdio: 'inherit',
      shell: true,
    });

    child.on('error', reject);
    child.on('close', (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          signal
            ? `O build foi encerrado pelo sinal ${signal}.`
            : `O build falhou com o código ${code}.`,
        ),
      );
    });
  });
}

async function main() {
  const profile = await selectOption('Tipo do build:', options.buildType);
  const platform = await selectOption('Plataforma:', options.platform);
  rl.close();

  console.log('\nIniciando o build...\n');
  await runBuild(profile, platform);
  console.log('\nBuild concluído com sucesso.');
}

main()
  .catch((error) => {
    console.error(`\nErro: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => {
    rl.close();
  });
