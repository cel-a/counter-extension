
chrome.contextMenus.create({
    id: "openCounterPopup",
    title: "Count Characters",
    contexts: ["all"]
});
  

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "openCounterPopup") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: popupExists
        }, (res) => {
            if (!res[0].result) {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: injectPopup
                  }).catch((err) => {
                    console.error('Error executing script:', err);
                });
        }});
    }
});

function popupExists() {
    return document.getElementById('character-counter-popup') !== null;
}
  
function injectPopup() {
    const selectedText = window.getSelection().toString();

    if (selectedText != '') {
        const length = selectedText.length;

        const modalHtml = `
        <div id="character-counter-popup" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background-color: white; border: 1px solid #7d7d7d; padding: 20px; z-index: 2147483647 !important;">
            <h3>Selected characters: ` + length + `</h3>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('character-counter-popup');
        document.addEventListener('click', handleClickOutside);

        function handleClickOutside(event) {
            if (!modal.contains(event.target)) {
                modal.remove();
                document.removeEventListener('click', handleClickOutside);
            }
          }
    }
}