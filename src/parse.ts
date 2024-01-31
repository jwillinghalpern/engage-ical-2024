export interface Session {
  category?: string;
  title?: string;
  date?: string;
  location?: string;
}

export function parseHtml(html: string) {
  // create a new html element and set its innerHTML to the html string
  const div = document.createElement('div');
  div.innerHTML = html;

  const sessionNodes = div.querySelectorAll(
    'div[class^="SessionCard_sessionInfoColumn"]'
  );

  const sessions: Session[] = [];
  sessionNodes.forEach((sessionNode) => {
    let category = sessionNode
      .querySelector('div[class^="SessionCard_sessionCategory"]')
      ?.textContent?.replace(/\s+/g, ' ')
      .trim();

    const title = sessionNode
      .querySelector('div[class^="session-title"]')
      ?.textContent?.replace(/\s+/g, ' ')
      ?.trim();

    const dateNode = sessionNode.querySelector('div[id^="session-date-time"]');
    const date = dateNode?.textContent?.trim();

    const location = dateNode?.nextElementSibling?.textContent?.trim();

    const session = {
      category,
      title,
      date,
      location,
    };
    sessions.push(session);
  });
  return sessions;
}

export function sessionToICAL(session: Session) {
  const dateObj = convertToDate(session.date!);
  console.log('dateObj', dateObj);
  const date = toICal(dateObj);
  const datePlusOneHour = toICal(new Date(dateObj.getTime() + 60 * 60 * 1000));

  return `
BEGIN:VEVENT
SUMMARY:${session.title}
DTSTART:${date}
DTEND:${datePlusOneHour}
LOCATION:${session.location}
END:VEVENT
`;
}

// convert format February 6, 2024 | 7:00 PM (CST)
// into valid JS date
function convertToDate(input: string): Date {
  const split = input.split('|').map((s) => s.trim());
  const datePart = split[0];
  const timePart = split[1];
  // const date = new Date(datePart);
  const timeSplit = timePart.split(' ');
  const timeString = timeSplit[0];
  const ampm = timeSplit[1];
  // combine datepart and time components set timezone to CST
  const date = new Date(`${datePart} ${timeString} ${ampm} CST`);

  // const date = new Date(`${datePart} ${timeString} ${ampm}`);
  console.log('date', date);
  return date;
}

function toICal(date: Date) {
  function pad(num: number) {
    return num < 10 ? '0' + num : num;
  }
  var dt =
    // @ts-ignore
    date.getUTCFullYear() +
    // @ts-ignore
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z';

  return dt;
}
