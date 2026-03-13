import 'package:flutter/material.dart';
import '../widgets/sidebar.dart';
import '../services/progress_service.dart';

class ProgressChartsPage extends StatefulWidget {
  final Map<String, dynamic>? user;

  const ProgressChartsPage({super.key, this.user});

  @override
  State<ProgressChartsPage> createState() => _ProgressChartsPageState();
}

class _ProgressChartsPageState extends State<ProgressChartsPage> {
  final ProgressService _progressService = ProgressService();
  bool _isLoading = true;
  String _exercisesTimePeriod = 'This Week';
  String _minutesTimePeriod = 'This Week';
  String _overviewTimePeriod = 'Current Month';

  // Current fitness goal for filtering progress data
  String _currentFitnessGoal = 'General Fitness';

  // Data for charts - will be populated from backend
  Map<String, int> _weeklyExercises = {
    'Mon': 0,
    'Tue': 0,
    'Wed': 0,
    'Thu': 0,
    'Fri': 0,
    'Sat': 0,
    'Sun': 0,
  };

  Map<String, int> _weeklyMinutes = {
    'Mon': 0,
    'Tue': 0,
    'Wed': 0,
    'Thu': 0,
    'Fri': 0,
    'Sat': 0,
    'Sun': 0,
  };

  Map<String, Map<String, int>> _monthlyOverview = {
    'Week 1': {'exercises': 0, 'minutes': 0},
    'Week 2': {'exercises': 0, 'minutes': 0},
    'Week 3': {'exercises': 0, 'minutes': 0},
    'Week 4': {'exercises': 0, 'minutes': 0},
  };

  String? _hoveredDay;
  String? _hoveredWeek;
  int _totalExercises = 0;
  int _totalMinutes = 0;

  @override
  void initState() {
    super.initState();
    _loadProgressData();
  }

  Future<void> _loadProgressData() async {
    if (widget.user == null || widget.user!['_id'] == null) {
      setState(() => _isLoading = false);
      return;
    }

    setState(() => _isLoading = true);

    try {
      final response = await _progressService.getUserProgress(
        widget.user!['_id'],
      );

      final goalResponse = await _progressService.getGoalProgress(
        widget.user!['_id'],
      );

      if (mounted && response['success']) {
        final progressData = response['data'];
        final goalData = goalResponse['success'] ? goalResponse['data'] : null;

        setState(() {
          // Get current fitness goal
          final fitnessGoal =
              progressData['fitnessGoal'] as String? ?? 'General Fitness';
          _currentFitnessGoal = fitnessGoal;

          // Get goal-specific progress
          if (goalData != null) {
            final goalProgressMap =
                goalData['goalProgress'] as Map<String, dynamic>?;
            final currentGoalProgress =
                goalProgressMap?[fitnessGoal] as Map<String, dynamic>?;

            _totalExercises =
                currentGoalProgress?['exercises'] ??
                progressData['totalExercises'] ??
                0;
            _totalMinutes =
                currentGoalProgress?['minutes'] ??
                progressData['totalMinutes'] ??
                0;
          } else {
            _totalExercises = progressData['totalExercises'] ?? 0;
            _totalMinutes = progressData['totalMinutes'] ?? 0;
          }

          // Update charts with current filter selections
          _updateWeeklyExercisesData();
          _updateWeeklyMinutesData();
          _updateMonthlyOverviewData();

          _isLoading = false;
        });
      } else {
        setState(() => _isLoading = false);
      }
    } catch (e) {
      print('Error loading progress data: $e');
      setState(() => _isLoading = false);
    }
  }

  void _updateWeeklyExercisesData() {
    // Reset weekly data
    _weeklyExercises = {
      'Mon': 0,
      'Tue': 0,
      'Wed': 0,
      'Thu': 0,
      'Fri': 0,
      'Sat': 0,
      'Sun': 0,
    };

    int exercisesForPeriod = _totalExercises;

    // Adjust based on selected time period
    if (_exercisesTimePeriod == 'Last Week') {
      // Simulate 70% of current week for last week
      exercisesForPeriod = (_totalExercises * 0.7).floor();
    } else if (_exercisesTimePeriod == 'Last 4 Weeks') {
      // Use full total which represents the month
      exercisesForPeriod = _totalExercises;
    }

    if (exercisesForPeriod > 0) {
      final avgPerDay = (exercisesForPeriod / 7).floor();
      final today = DateTime.now().weekday - 1;
      final days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      for (var i = 0; i <= today && i < days.length; i++) {
        _weeklyExercises[days[i]] =
            avgPerDay + (i == today ? exercisesForPeriod % 7 : 0);
      }
    }
  }

  void _updateWeeklyMinutesData() {
    // Reset weekly data
    _weeklyMinutes = {
      'Mon': 0,
      'Tue': 0,
      'Wed': 0,
      'Thu': 0,
      'Fri': 0,
      'Sat': 0,
      'Sun': 0,
    };

    int minutesForPeriod = _totalMinutes;

    // Adjust based on selected time period
    if (_minutesTimePeriod == 'Last Week') {
      // Simulate 70% of current week for last week
      minutesForPeriod = (_totalMinutes * 0.7).floor();
    } else if (_minutesTimePeriod == 'Last 30 Days') {
      // Use full total which represents the month
      minutesForPeriod = _totalMinutes;
    }

    if (minutesForPeriod > 0) {
      final avgPerDay = (minutesForPeriod / 7).floor();
      final today = DateTime.now().weekday - 1;
      final days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      for (var i = 0; i <= today && i < days.length; i++) {
        _weeklyMinutes[days[i]] =
            avgPerDay + (i == today ? minutesForPeriod % 7 : 0);
      }
    }
  }

  void _updateMonthlyOverviewData() {
    // Reset monthly data
    _monthlyOverview = {
      'Week 1': {'exercises': 0, 'minutes': 0},
      'Week 2': {'exercises': 0, 'minutes': 0},
      'Week 3': {'exercises': 0, 'minutes': 0},
      'Week 4': {'exercises': 0, 'minutes': 0},
    };

    int exercisesForPeriod = _totalExercises;
    int minutesForPeriod = _totalMinutes;
    int weeksToShow = 4;

    // Adjust based on selected time period
    if (_overviewTimePeriod == 'Last 3 Months') {
      exercisesForPeriod = (_totalExercises * 1.2).floor();
      minutesForPeriod = (_totalMinutes * 1.2).floor();
      weeksToShow = 12;
    } else if (_overviewTimePeriod == 'Last 6 Months') {
      exercisesForPeriod = (_totalExercises * 1.5).floor();
      minutesForPeriod = (_totalMinutes * 1.5).floor();
      weeksToShow = 24;
    } else if (_overviewTimePeriod == 'Last 12 Months') {
      exercisesForPeriod = (_totalExercises * 2).floor();
      minutesForPeriod = (_totalMinutes * 2).floor();
      weeksToShow = 52;
    }

    if (exercisesForPeriod > 0 && minutesForPeriod > 0) {
      final avgExercisesPerWeek = (exercisesForPeriod / weeksToShow).floor();
      final avgMinutesPerWeek = (minutesForPeriod / weeksToShow).floor();

      // For current month view, show 4 weeks
      if (_overviewTimePeriod == 'Current Month') {
        for (var i = 1; i <= 4; i++) {
          _monthlyOverview['Week $i'] = {
            'exercises': avgExercisesPerWeek,
            'minutes': avgMinutesPerWeek,
          };
        }
      } else {
        // For other periods, simulate week progression
        for (var i = 1; i <= 4; i++) {
          _monthlyOverview['Week $i'] = {
            'exercises': avgExercisesPerWeek,
            'minutes': avgMinutesPerWeek,
          };
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F0F0F),
      body: Row(
        children: [
          Sidebar(currentPage: 'progress', user: widget.user),
          Expanded(
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(color: Color(0xFFB4F405)),
                  )
                : SingleChildScrollView(
                    padding: const EdgeInsets.all(32),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Header
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Progress Charts',
                                  style: TextStyle(
                                    fontSize: 32,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Visualize your fitness journey for $_currentFitnessGoal',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.grey[400],
                                  ),
                                ),
                              ],
                            ),
                            // Stats Badge
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 20,
                                vertical: 12,
                              ),
                              decoration: BoxDecoration(
                                color: const Color(0xFFB4F405).withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: const Color(
                                    0xFFB4F405,
                                  ).withOpacity(0.3),
                                ),
                              ),
                              child: Row(
                                children: [
                                  const Icon(
                                    Icons.fitness_center,
                                    color: Color(0xFFB4F405),
                                    size: 20,
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    '$_totalExercises Exercises • $_totalMinutes Min',
                                    style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFFB4F405),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 40),

                        // Weekly Exercises Chart
                        _buildChartCard(
                          title: 'Weekly Exercises',
                          timePeriod: _exercisesTimePeriod,
                          onTimePeriodChanged: (value) {
                            setState(() {
                              _exercisesTimePeriod = value;
                              _updateWeeklyExercisesData();
                            });
                          },
                          child: _buildWeeklyExercisesChart(),
                        ),
                        const SizedBox(height: 24),

                        // Weekly Minutes Chart
                        _buildChartCard(
                          title: 'Weekly Minutes',
                          timePeriod: _minutesTimePeriod,
                          onTimePeriodChanged: (value) {
                            setState(() {
                              _minutesTimePeriod = value;
                              _updateWeeklyMinutesData();
                            });
                          },
                          child: _buildWeeklyMinutesChart(),
                        ),
                        const SizedBox(height: 24),

                        // Monthly Overview Chart
                        _buildChartCard(
                          title: 'Monthly Overview',
                          timePeriod: _overviewTimePeriod,
                          onTimePeriodChanged: (value) {
                            setState(() {
                              _overviewTimePeriod = value;
                              _updateMonthlyOverviewData();
                            });
                          },
                          child: _buildMonthlyOverviewChart(),
                        ),
                      ],
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildChartCard({
    required String title,
    required Widget child,
    String? timePeriod,
    Function(String)? onTimePeriodChanged,
  }) {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF2A2A2A)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
              if (timePeriod != null && onTimePeriodChanged != null)
                _buildTimePeriodDropdown(
                  title,
                  timePeriod,
                  onTimePeriodChanged,
                ),
            ],
          ),
          const SizedBox(height: 32),
          child,
        ],
      ),
    );
  }

  Widget _buildTimePeriodDropdown(
    String chartTitle,
    String currentValue,
    Function(String) onChanged,
  ) {
    // Different dropdown options based on chart type
    List<String> getDropdownOptions() {
      if (chartTitle == 'Weekly Exercises') {
        return ['This Week', 'Last Week', 'Last 4 Weeks'];
      } else if (chartTitle == 'Weekly Minutes') {
        return ['This Week', 'Last Week', 'Last 30 Days'];
      } else if (chartTitle == 'Monthly Overview') {
        return [
          'Current Month',
          'Last 3 Months',
          'Last 6 Months',
          'Last 12 Months',
        ];
      }
      return [];
    }

    final options = getDropdownOptions();
    // Ensure the currentValue is valid; if not, use the first option
    final validValue = options.contains(currentValue)
        ? currentValue
        : (options.isNotEmpty ? options.first : '');

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFF0F0F0F),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: const Color(0xFF2A2A2A)),
      ),
      child: DropdownButton<String>(
        value: validValue,
        dropdownColor: const Color(0xFF1A1A1A),
        underline: Container(),
        isDense: true,
        icon: const Icon(
          Icons.arrow_drop_down,
          color: Color(0xFFB4F405),
          size: 20,
        ),
        style: const TextStyle(fontSize: 12, color: Colors.white),
        items: options.map((String value) {
          return DropdownMenuItem<String>(value: value, child: Text(value));
        }).toList(),
        onChanged: (String? newValue) {
          if (newValue != null) {
            onChanged(newValue);
          }
        },
      ),
    );
  }

  Widget _buildWeeklyExercisesChart() {
    final maxValue = _weeklyExercises.values.fold<int>(
      0,
      (max, val) => val > max ? val : max,
    );
    final chartMax = maxValue > 0 ? maxValue + 1 : 4;

    return SizedBox(
      height: 320,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          // Y-axis labels
          SizedBox(
            width: 40,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: List.generate(5, (index) {
                final value = chartMax - (chartMax / 4 * index).round();
                return Text(
                  value.toString(),
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF6E6E6E),
                  ),
                );
              }),
            ),
          ),
          const SizedBox(width: 16),

          // Chart bars
          Expanded(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: _weeklyExercises.entries.map((entry) {
                final height = chartMax > 0
                    ? (entry.value / chartMax * 240)
                    : 0.0;
                final isHovered = _hoveredDay == entry.key;

                return Expanded(
                  child: MouseRegion(
                    onEnter: (_) => setState(() => _hoveredDay = entry.key),
                    onExit: (_) => setState(() => _hoveredDay = null),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        // Tooltip
                        if (isHovered)
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFF2A2A2A),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Column(
                              children: [
                                Text(
                                  entry.key,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.white,
                                  ),
                                ),
                                Text(
                                  'Exercises: ${entry.value}',
                                  style: const TextStyle(
                                    fontSize: 11,
                                    color: Color(0xFF9E9E9E),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        const SizedBox(height: 8),

                        // Bar
                        Container(
                          width: double.infinity,
                          height: height < 2 ? 2 : height,
                          margin: const EdgeInsets.symmetric(horizontal: 8),
                          decoration: BoxDecoration(
                            color: const Color(0xFFB4F405),
                            borderRadius: const BorderRadius.vertical(
                              top: Radius.circular(4),
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),

                        // X-axis label
                        Text(
                          entry.key,
                          style: const TextStyle(
                            fontSize: 12,
                            color: Color(0xFF9E9E9E),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWeeklyMinutesChart() {
    final maxValue = _weeklyMinutes.values.fold<int>(
      0,
      (max, val) => val > max ? val : max,
    );
    final chartMax = maxValue > 0 ? maxValue + 1 : 4;

    return SizedBox(
      height: 320,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          // Y-axis labels
          SizedBox(
            width: 40,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: List.generate(5, (index) {
                final value = chartMax - (chartMax / 4 * index).round();
                return Text(
                  value.toString(),
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF6E6E6E),
                  ),
                );
              }),
            ),
          ),
          const SizedBox(width: 16),

          // Chart line
          Expanded(
            child: Stack(
              children: [
                // Line chart
                Positioned.fill(
                  child: CustomPaint(
                    painter: LineChartPainter(
                      data: _weeklyMinutes,
                      maxValue: chartMax.toDouble(),
                      hoveredDay: _hoveredDay,
                      color: const Color(0xFFB4F405),
                    ),
                  ),
                ),
                // Interactive overlay for tooltips and labels
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: _weeklyMinutes.entries.map((entry) {
                    final isHovered = _hoveredDay == entry.key;

                    return Expanded(
                      child: MouseRegion(
                        onEnter: (_) => setState(() => _hoveredDay = entry.key),
                        onExit: (_) => setState(() => _hoveredDay = null),
                        child: SizedBox(
                          height: 300,
                          child: Stack(
                            children: [
                              // Tooltip at top
                              if (isHovered)
                                Positioned(
                                  top: 8,
                                  left: 0,
                                  right: 0,
                                  child: Center(
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 12,
                                        vertical: 8,
                                      ),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF2A2A2A),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Column(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Text(
                                            entry.key,
                                            style: const TextStyle(
                                              fontSize: 12,
                                              fontWeight: FontWeight.w600,
                                              color: Colors.white,
                                            ),
                                          ),
                                          Text(
                                            'Minutes: ${entry.value}',
                                            style: const TextStyle(
                                              fontSize: 11,
                                              color: Color(0xFF9E9E9E),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                              // X-axis label at bottom
                              Positioned(
                                bottom: 0,
                                left: 0,
                                right: 0,
                                child: Center(
                                  child: Text(
                                    entry.key,
                                    style: const TextStyle(
                                      fontSize: 12,
                                      color: Color(0xFF9E9E9E),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMonthlyOverviewChart() {
    final maxValue = _monthlyOverview.values.fold<int>(
      0,
      (max, week) => week['exercises']! > max ? week['exercises']! : max,
    );
    final chartMax = maxValue > 0 ? maxValue + 1 : 4;

    return SizedBox(
      height: 320,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          // Y-axis labels
          SizedBox(
            width: 40,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: List.generate(5, (index) {
                final value = chartMax - (chartMax / 4 * index).round();
                return Text(
                  value.toString(),
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF6E6E6E),
                  ),
                );
              }),
            ),
          ),
          const SizedBox(width: 16),

          // Chart bars (grouped)
          Expanded(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: _monthlyOverview.entries.map((entry) {
                final exercises = entry.value['exercises']!;
                final minutes = entry.value['minutes']!;
                final height = chartMax > 0
                    ? (exercises / chartMax * 260)
                    : 0.0;
                final isHovered = _hoveredWeek == entry.key;

                return Expanded(
                  child: MouseRegion(
                    onEnter: (_) => setState(() => _hoveredWeek = entry.key),
                    onExit: (_) => setState(() => _hoveredWeek = null),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        // Tooltip
                        if (isHovered)
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFF2A2A2A),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Column(
                              children: [
                                Text(
                                  entry.key,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.white,
                                  ),
                                ),
                                Text(
                                  'Exercises: $exercises',
                                  style: const TextStyle(
                                    fontSize: 11,
                                    color: Color(0xFF9E9E9E),
                                  ),
                                ),
                                Text(
                                  'Minutes: $minutes',
                                  style: const TextStyle(
                                    fontSize: 11,
                                    color: Color(0xFF9E9E9E),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        const SizedBox(height: 8),

                        // Bar
                        Container(
                          width: double.infinity,
                          height: height < 2 ? 2 : height,
                          margin: const EdgeInsets.symmetric(horizontal: 8),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                const Color(0xFFB4F405),
                                const Color(0xFFB4F405).withOpacity(0.6),
                              ],
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                            ),
                            borderRadius: const BorderRadius.vertical(
                              top: Radius.circular(6),
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),

                        // X-axis label
                        Text(
                          entry.key,
                          style: const TextStyle(
                            fontSize: 12,
                            color: Color(0xFF9E9E9E),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}

class LineChartPainter extends CustomPainter {
  final Map<String, int> data;
  final double maxValue;
  final String? hoveredDay;
  final Color color;

  LineChartPainter({
    required this.data,
    required this.maxValue,
    this.hoveredDay,
    required this.color,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final pointPaint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final path = Path();
    final points = <Offset>[];

    final entries = data.entries.toList();
    final spacing = size.width / (entries.length - 1);

    for (var i = 0; i < entries.length; i++) {
      final x = i * spacing;
      final y = size.height - (entries[i].value / maxValue * size.height);
      points.add(Offset(x, y));

      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }

    // Draw line
    canvas.drawPath(path, paint);

    // Draw points
    for (var i = 0; i < points.length; i++) {
      final isHovered = hoveredDay == entries[i].key;
      canvas.drawCircle(points[i], isHovered ? 6 : 4, pointPaint);

      if (isHovered) {
        final circlePaint = Paint()
          ..color = color.withOpacity(0.3)
          ..style = PaintingStyle.fill;
        canvas.drawCircle(points[i], 10, circlePaint);
      }
    }
  }

  @override
  bool shouldRepaint(LineChartPainter oldDelegate) {
    return oldDelegate.hoveredDay != hoveredDay;
  }
}
