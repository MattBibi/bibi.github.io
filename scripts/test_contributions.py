from datetime import date, timedelta
import unittest
from update_contributions import calendar_data


class CalendarTests(unittest.TestCase):
    def calendar_html(self, missing_count=False):
        today = date(2026, 11, 6)
        parts = []
        for offset in range(365):
            day = today - timedelta(days=offset)
            count = 1234 if offset == 0 else offset % 3
            count_text = 'No contributions' if count == 0 else f"{count:,} contribution{'s' if count != 1 else ''}"
            if missing_count and offset == 0:
                count_text = 'Activity unavailable'
            parts.append(f'<td id="day-{offset}" data-date="{day.isoformat()}" data-level="{min(count, 4)}"></td>')
            parts.append(f'<tool-tip for="day-{offset}">{count_text} on this day.</tool-tip>')
        return ''.join(parts)

    def test_real_counts_and_future_padding(self):
        result = calendar_data(self.calendar_html(), date(2026, 11, 6))
        self.assertEqual(len(result['days']), 147)
        self.assertEqual(result['days'][-2]['count'], 1234)
        self.assertTrue(result['days'][-1]['future'])
        self.assertNotIn('count', result['days'][-1])
        self.assertEqual(result['period_total'], sum(day.get('count', 0) for day in result['days']))
        self.assertTrue(any(day.get('count') == 0 for day in result['days']))
        self.assertTrue(any(day.get('count') == 1 for day in result['days']))

    def test_missing_count_is_not_fabricated(self):
        with self.assertRaises(ValueError):
            calendar_data(self.calendar_html(missing_count=True), date(2026, 11, 6))

    def test_incomplete_response_is_rejected(self):
        with self.assertRaises(ValueError):
            calendar_data('<html>Error</html>', date(2026, 11, 6))


if __name__ == '__main__':
    unittest.main()
