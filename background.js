const DOMAIN = 'console.cloud.google.com';
chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: DOMAIN},
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

let user = 1;

const redirectWithParam = (details) => {
    console.log('redirect', user);
    let url = details.url;
    if (!url.includes('authuser=')) {
        const punctuation = url.includes('?') ? '&' : '?';
        url = url + punctuation + 'authuser=' + user
    } else {
        url = url.replace(/authuser=\d/, 'authuser=' + user)
    }
    return {redirectUrl: url};
};


chrome.storage.sync.get('authuser', (data) => {
    user = data.authuser ? data.authuser : 1;
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if ('authuser' in changes) {
        user = changes['authuser'].newValue;
    }
});

chrome.webRequest.onBeforeRequest.addListener(redirectWithParam,
    {urls: [`http://${DOMAIN}/*`, `https://${DOMAIN}/*`]},
    ["blocking"]
);

