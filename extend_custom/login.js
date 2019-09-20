const LOGIN_INPUT = 'input[type="text"]';
const PASSWORD_INPUT = 'input[type="password"]';
const SUBMIT = '#submit';

module.exports = async (page, logInfo) => {
    const login = 'your telephone';
    const password = 'your password';
    const loginUrl = 'https://mubu.com/login/password';

    logInfo(`Loading ${loginUrl}`);

    // Go to the login page url, and wait for the selector to be ready.
    await page.goto(loginUrl);
    await page.waitForSelector(LOGIN_INPUT);

    logInfo('Logging in...');

    // Type creditentials.
    await page.type(LOGIN_INPUT, login);
    await page.type(PASSWORD_INPUT, password);
    await page.click(SUBMIT)

    logInfo('Redirecting');

    // The process will continue once the redirect is resolved.
    return page.waitForNavigation();
};