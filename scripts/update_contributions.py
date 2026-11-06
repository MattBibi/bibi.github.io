"""Refresh the public GitHub contribution calendar without exposing credentials."""
from datetime import datetime, timedelta, timezone
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import urllib.request


class ContributionCalendar(HTMLParser):
    def __init__(self):
        super().__init__()
        self.cells = {}
        self.counts = {}
        self.tooltip_for = None
        self.tooltip_text = []

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == 'td' and attrs.get('data-date') and attrs.get('data-level'):
            self.cells[attrs['id']] = {'date': attrs['data-date'], 'level': int(attrs['data-level'])}
        if tag == 'tool-tip' and attrs.get('for'):
            self.tooltip_for = attrs['for']
            self.tooltip_text = []

    def handle_data(self, text):
        if self.tooltip_for is not None:
            self.tooltip_text.append(text)

    def handle_endtag(self, tag):
        if tag == 'tool-tip' and self.tooltip_for is not None:
            text = ''.join(self.tooltip_text).strip()
            count = re.match(r'(No|[\d,]+) contributions?\b', text)
            if count:
                self.counts[self.tooltip_for] = 0 if count[1] == 'No' else int(count[1].replace(',', ''))
            self.tooltip_for = None


def calendar_data(html, today):
    calendar = ContributionCalendar()
    calendar.feed(html)
    records = {cell['date']: dict(cell, count=calendar.counts[key])
               for key, cell in calendar.cells.items() if key in calendar.counts}
    if len(records) < 300:
        raise ValueError('GitHub calendar response was incomplete; keeping the existing snapshot.')
    end = today + timedelta(days=(5 - today.weekday()) % 7)
    start = end - timedelta(days=146)
    days = []
    for offset in range(147):
        date = start + timedelta(days=offset)
        if date > today:
            days.append({'level': 0, 'future': True})
        else:
            if date.isoformat() not in records:
                raise ValueError(f'No verified contribution count for {date}; keeping the existing snapshot.')
            days.append(records[date.isoformat()])
    return {
        'source': 'https://github.com/bibschan',
        'updated': f'{today:%b} {today.day}, {today.year}',
        'updated_date': today.isoformat(),
        'period_total': sum(day.get('count', 0) for day in days),
        'days': days,
    }


if __name__ == '__main__':
    request = urllib.request.Request('https://github.com/users/bibschan/contributions',
                                     headers={'User-Agent': 'BibiPortfolio-ContributionRefresh/1.0'})
    with urllib.request.urlopen(request, timeout=30) as response:
        html = response.read().decode('utf-8')
    data = calendar_data(html, datetime.now(timezone.utc).date())
    destination = Path(__file__).resolve().parents[1] / 'assets' / 'contributions.json'
    temporary = destination.with_suffix('.tmp')
    temporary.write_text(json.dumps(data, separators=(',', ':')) + '\n', encoding='utf-8')
    temporary.replace(destination)
    print(f"Updated {len(data['days'])} calendar cells from verified public GitHub counts.")
