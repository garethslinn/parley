document.addEventListener('keydown', (event) => {
    let synth = window.speechSynthesis;
    let utterance = new SpeechSynthesisUtterance();
    let speechRate = 1;  // Default speech rate

    const readElement = (element) => {
        let text = '';
        if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
            text = element.tagName.toLowerCase() + ' ' + (element.labels ? element.labels[0].textContent : '') + ' ' + (element.value || element.textContent);
        } else {
            text = element.textContent || element.alt || 'Empty element';
        }

        // Add title and longdesc attributes if available
        if (element.title) {
            text += ' Title: ' + element.title;
        }
        if (element.longDesc) {
            text += ' Description: ' + element.longDesc;
        }

        utterance.text = text;
        utterance.rate = speechRate;
        synth.speak(utterance);
    };

    const handleKeydown = (event) => {
        let currentElement = document.activeElement;
        removeHighlight(currentElement);
        if (event.key === 'Tab' && !event.shiftKey) {
            event.preventDefault();
            let focusableElements = getFocusableElements();
            let index = Array.prototype.indexOf.call(focusableElements, currentElement);
            index = (index + 1) % focusableElements.length;
            focusableElements[index].focus();
            addHighlight(focusableElements[index]);
            readElement(focusableElements[index]);
        } else if (event.key === 'Tab' && event.shiftKey) {
            event.preventDefault();
            let focusableElements = getFocusableElements();
            let index = Array.prototype.indexOf.call(focusableElements, currentElement);
            index = (index - 1 + focusableElements.length) % focusableElements.length;
            focusableElements[index].focus();
            addHighlight(focusableElements[index]);
            readElement(focusableElements[index]);
        } else if (event.key === 'H') {
            navigateByTag('H1, H2, H3, H4, H5, H6');
        } else if (event.key === 'L') {
            navigateByTag('A');
        } else if (event.key === 'P') {
            navigateByTag('P');
        } else if (event.key === 'F') {
            navigateByTag('INPUT, BUTTON, SELECT, TEXTAREA');
        } else if (event.key === 'M') {
            navigateByLandmark('main, [role="main"]');
        } else if (event.key === 'N') {
            navigateByLandmark('nav, [role="navigation"]');
        } else if (event.key === 'B') {
            navigateByLandmark('header, [role="banner"]');
        } else if (event.key === 'C') {
            navigateByLandmark('aside, [role="complementary"]');
        } else if (event.key === 'F') {
            navigateByLandmark('footer, [role="contentinfo"]');
        } else if (event.key === 'Enter' || event.key === ' ') {
            if (currentElement.tagName === 'BUTTON' || currentElement.tagName === 'A' || currentElement.onclick) {
                currentElement.click();
            }
        } else if (event.key === '+') {
            if (event.shiftKey && currentElement.tagName === 'VIDEO') {
                currentElement.volume = Math.min(currentElement.volume + 0.1, 1); // Increase volume, max 1
                utterance.text = `Volume increased to ${(currentElement.volume * 100).toFixed(0)}%`;
                synth.speak(utterance);
            } else {
                speechRate = Math.min(speechRate + 0.1, 2); // Increase speech rate, max 2
                utterance.text = `Speech rate increased to ${speechRate.toFixed(1)}`;
                synth.speak(utterance);
            }
        } else if (event.key === '-') {
            if (event.shiftKey && currentElement.tagName === 'VIDEO') {
                currentElement.volume = Math.max(currentElement.volume - 0.1, 0); // Decrease volume, min 0
                utterance.text = `Volume decreased to ${(currentElement.volume * 100).toFixed(0)}%`;
                synth.speak(utterance);
            } else {
                speechRate = Math.max(speechRate - 0.1, 0.5); // Decrease speech rate, min 0.5
                utterance.text = `Speech rate decreased to ${speechRate.toFixed(1)}`;
                synth.speak(utterance);
            }
        }
    };

    const getFocusableElements = () => {
        return document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [tabindex="0"], video');
    };

    const navigateByTag = (tag) => {
        let elements = document.querySelectorAll(tag);
        let index = Array.prototype.indexOf.call(elements, document.activeElement);
        index = (index + 1) % elements.length;
        elements[index].focus();
        addHighlight(elements[index]);
        readElement(elements[index]);
    };

    const navigateByLandmark = (landmark) => {
        let elements = document.querySelectorAll(landmark);
        let index = Array.prototype.indexOf.call(elements, document.activeElement);
        index = (index + 1) % elements.length;
        elements[index].focus();
        addHighlight(elements[index]);
        readElement(elements[index]);
    };

    const addHighlight = (element) => {
        element.classList.add('highlight-focus');
    };

    const removeHighlight = (element) => {
        element.classList.remove('highlight-focus');
    };

    // Add styles for highlight
    const style = document.createElement('style');
    style.innerHTML = `
    .highlight-focus {
      outline: 2px solid green !important;
    }
  `;
    document.head.appendChild(style);

    readElement(document.body);
    document.addEventListener('keydown', handleKeydown);
});
