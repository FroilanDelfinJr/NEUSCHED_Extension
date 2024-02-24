document.getElementById("generateCSVButton").addEventListener('click', () => {
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;

    console.log({ startDate, endDate });

 
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          args: [startDate, endDate],
          function: generateCSVFile,
        });
      });
});
  