class MotivationalQuotes {
  static final List<Map<String, String>> quotes = [
    {
      'quote': '"What hurts today makes you stronger tomorrow."',
      'author': 'Jay Cutler',
    },
    {
      'quote': '"The only bad workout is the one that didn\'t happen."',
      'author': 'Unknown',
    },
    {
      'quote':
          '"Success isn\'t always about greatness. It\'s about consistency."',
      'author': 'Dwayne Johnson',
    },
    {
      'quote':
          '"The pain you feel today will be the strength you feel tomorrow."',
      'author': 'Arnold Schwarzenegger',
    },
    {
      'quote':
          '"Your body can stand almost anything. It\'s your mind you have to convince."',
      'author': 'Unknown',
    },
    {
      'quote':
          '"The only place where success comes before work is in the dictionary."',
      'author': 'Vidal Sassoon',
    },
    {
      'quote':
          '"Strength doesn\'t come from what you can do. It comes from overcoming the things you once thought you couldn\'t."',
      'author': 'Rikki Rogers',
    },
    {
      'quote':
          '"The difference between the impossible and the possible lies in a person\'s determination."',
      'author': 'Tommy Lasorda',
    },
    {
      'quote': '"Don\'t count the days, make the days count."',
      'author': 'Muhammad Ali',
    },
    {
      'quote':
          '"Discipline is doing what needs to be done, even when you don\'t want to do it."',
      'author': 'Unknown',
    },
  ];

  static Map<String, String> getDailyQuote() {
    // Get quote based on day of year so it changes daily
    final now = DateTime.now();
    final dayOfYear = now.difference(DateTime(now.year, 1, 1)).inDays;
    final index = dayOfYear % quotes.length;
    return quotes[index];
  }
}
