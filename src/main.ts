import './style.css';
import { parseHtml, sessionToICAL } from './parse';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `

  <div padding: 2rem; text-align: center;">
  <h2>Engage 2024 Schedule To iCal</h2>
  <div class="card">
    <label for="html">Paste in the html from the Engage 2024 schedule page</label>
    <textarea id="html" rows="10" cols="50"></textarea>
    <button id="parse" type="button">Parse to iCal!</button>
  </div>
</div>
`;

async function handleParseButtonClick() {
  const html = document.querySelector<HTMLTextAreaElement>('#html')!.value;
  if (!html) {
    alert('Please paste in some html');
    return;
  }

  // call parse function
  const sessions = await parseHtml(html);
  console.log('sessions', sessions);
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    sessions.map(sessionToICAL).join('\n'),
    'END:VCALENDAR',
  ].join('\n');

  console.log('ical', ical);

  saveToFm(
    JSON.stringify({
      sessions,
      ical,
    })
  );
}

document
  .querySelector<HTMLButtonElement>('#parse')!
  .addEventListener('click', handleParseButtonClick);

function saveToFm(text: string) {
  window.FileMaker.PerformScript('Save File', text);
}

declare global {
  interface Window {
    FileMaker: {
      PerformScript(script: string, text: string): void;
    };
  }
}
