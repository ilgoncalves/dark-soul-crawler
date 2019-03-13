const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');
const ora = require('ora');
const cheerio = require('cheerio');



var email = '';
var password = '';

const lerVariaveis = async () => {
    console.log('|---------------------------------------------|')
    console.log('|                                             |')
    console.log('|          Sagres - Versão Console            |')
    console.log('|                                             |')
    console.log('|---------------------------------------------|')
    console.log('\n\n');

    email = await readlineSync.question('Digite seu email:');
    password = await readlineSync.question('Digite sua senha:', { hideEchoBack: true });

}

(async () => {
    await lerVariaveis();
    const spinner = await ora('Carregando...').start();


    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 720 });
    await page.goto('http://academico2.uefs.br/Portal/Acesso.aspx');
    await page.screenshot({ path: 'example.png' });


    await page.type('#ctl00_PageContent_LoginPanel_UserName', email);
    await page.type('#ctl00_PageContent_LoginPanel_Password', password);
    // click and wait for navigation
    await Promise.all([
        page.click('#ctl00_PageContent_LoginPanel_LoginButton'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    console.log('\n')

    await spinner.succeed('Login Efetuado com sucesso!');
    await page.screenshot({ path: 'deucerto.png' });
    let bodyHTML = await page.evaluate(() => document.body.innerHTML);

    const $ = await cheerio.load(bodyHTML);

    const nome = await $('.topo-info-login .usuario-nome')
        .text();

    const score = await $('.situacao-escore .destaque')
        .text();

    await $('#ctl00_MasterPlaceHolder_webPartManager_wp2092551192_wp1708213572_ucMuralRecados_ucListaRecados_conteudo article')
        .each((i, el) => {
            const mensagem = $(el)
                .find('.recado-texto span')
                .text()
            console.log(mensagem);
            console.log('------------------------------------------------------------------------------------')
        })

    // console.clear()

    console.log('Olá ' + nome);
    console.log('\nSeu score é: ' + score);
    console.log('\n\n\n\n\n');

    await browser.close();
})();

const clearConsole = () => {
    var lines = process.stdout.getWindowSize()[1];
    for (var i = 0; i < lines; i++) {
        console.log('\r\n');
    }
}