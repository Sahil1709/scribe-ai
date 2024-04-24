document.addEventListener('DOMContentLoaded', async function () {
    const responseContainer = document.getElementById('responseContainer');
    const inputBox = document.getElementById('inputBox');
    const submitButton = document.getElementById('submitButton');
    const resultContainer = document.getElementById('result');
  
    // Fetch data from backend when popup is opened
    /*const responseData = await fetchBackendData();
    if (responseData) {
      // Display input box and button
      responseContainer.style.display = 'block';
    } else {
      console.error('Error fetching data from backend');
    }*/
  
    submitButton.addEventListener('click', async function () {
      const userInput = inputBox.value;
      if (userInput.trim() !== '') {
        // Make backend call with user input
        const backendResponse = await sendUserInputToBackend(userInput);
        console.log(backendResponse);
        if (backendResponse) {
          // Display backend response
          const transcriptArray = backendResponse.llm_output;
      //const transcriptText = transcriptArray.map(segment => segment.text).join(' ');
      console.log(transcriptArray);
      addOutgoingMessage(transcriptArray);
      //resultContainer.textContent = transcriptArray;
        } else {
          console.error('Error sending user input to backend');
        }
      } else {
        console.error('Please enter something in the input box');
      }
    });
  });
  
  async function fetchBackendData() {
    // Get active tab information
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    // Log active tab information
    console.log('Active Tab:', tab);
  
    // Fetch data from Reddit endpoint
    const url = 'https://www.reddit.com/r/worldnews.json';
  
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error('Error fetching data from backend:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching data from backend:', error);
      return null;
    }
  }
  
  /*async function sendUserInputToBackend(userInput) {
    try{
    const response = await fetch('http://192.168.4.25:5000/load', {
      method: 'POST',
      body: JSON.stringify({ video_id : userInput }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
        const data = await response.json();
        console.log('Backend Response:', data); // Log the backend response
        return data;
      } else {
        console.error('Error sending user input to backend:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error sending user input to backend:', error);
      return null;
    }
  }*/

  async function sendUserInputToBackend(userInput) {
    try{
    const response = await fetch('http://192.168.4.25:5000/get_response', {
      method: 'POST',
      body: JSON.stringify({ user_query : userInput }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
        const data = await response.json();
        console.log('Backend Response:', data); // Log the backend response
        return data;
      } else {
        console.error('Error sending user input to backend:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error sending user input to backend:', error);
      return null;
    }
  }

  function addOutgoingMessage(jsonResponse) {
    var msgPage = document.querySelector(".msg-page");
    if (msgPage) {
        var outgoingChats = document.createElement("div");
        outgoingChats.classList.add("outgoing-chats");

        var outgoingChatsImg = document.createElement("div");
        outgoingChatsImg.classList.add("outgoing-chats-img");
        outgoingChatsImg.innerHTML = '<img src="user1.png" />';

        var outgoingMsg = document.createElement("div");
        outgoingMsg.classList.add("outgoing-msg");

        var outgoingChatsMsg = document.createElement("div");
        outgoingChatsMsg.classList.add("outgoing-chats-msg");
        outgoingChatsMsg.innerHTML = '<p>' + jsonResponse + '</p>';
                                     

        outgoingMsg.appendChild(outgoingChatsImg);
        outgoingMsg.appendChild(outgoingChatsMsg);
        outgoingChats.appendChild(outgoingMsg);
        msgPage.appendChild(outgoingChats);

        // Scroll smoothly to the bottom of the message page
        msgPage.scrollTo({
            top: msgPage.scrollHeight,
            behavior: 'smooth'
        });
    } else {
        console.error("Message page container not found.");
    }
}
  