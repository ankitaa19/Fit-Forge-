import 'package:flutter/material.dart';
import '../widgets/sidebar.dart';
import '../widgets/workout_session_modal.dart';
import '../services/progress_service.dart';
import '../services/dashboard_service.dart';
import '../utils/motivational_quotes.dart';
import '../utils/responsive.dart';

class DashboardPage extends StatefulWidget {
  final Map<String, dynamic>? user;

  const DashboardPage({super.key, this.user});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  final ProgressService _progressService = ProgressService();
  final DashboardService _dashboardService = DashboardService();

  bool _isLoading = true;
  Map<String, dynamic>? _progressData;
  Map<String, dynamic>? _goalProgressData;
  Map<String, String> _dailyQuote = {};
  List<Map<String, dynamic>> _dashboardVideos = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);

    // Get daily quote
    _dailyQuote = MotivationalQuotes.getDailyQuote();

    // Fetch dashboard videos
    final dashboardResponse = await _dashboardService.getDashboardVideos();
    if (dashboardResponse['success']) {
      _dashboardVideos = (dashboardResponse['videos'] as List)
          .map((video) => video as Map<String, dynamic>)
          .toList();
      print('✅ Loaded ${_dashboardVideos.length} dashboard videos');
    } else {
      print(
        'Failed to fetch dashboard videos: ${dashboardResponse['message']}',
      );
      _dashboardVideos = [];
    }

    // Fetch user progress
    if (widget.user != null && widget.user!['_id'] != null) {
      print('Fetching progress for user: ${widget.user!['_id']}');
      final response = await _progressService.getUserProgress(
        widget.user!['_id'],
      );
      print('Progress response: $response');
      if (response['success']) {
        setState(() {
          _progressData = response['data'];
          // Sync widget.user with latest backend data
          if (_progressData != null && _progressData!['fitnessGoal'] != null) {
            widget.user!['fitnessGoal'] = _progressData!['fitnessGoal'];
            print(
              '✅ Updated user fitness goal to: ${widget.user!['fitnessGoal']}',
            );
          }
        });
        print('Progress data loaded: $_progressData');
      } else {
        print('Failed to fetch progress: ${response['message']}');
      }

      // Fetch goal-specific progress
      print('Fetching goal progress for user: ${widget.user!['_id']}');
      final goalResponse = await _progressService.getGoalProgress(
        widget.user!['_id'],
      );
      print('Goal progress response: $goalResponse');
      if (goalResponse['success']) {
        setState(() {
          _goalProgressData = goalResponse['data'];
        });
        print('Goal progress data loaded: $_goalProgressData');
      } else {
        print('Failed to fetch goal progress: ${goalResponse['message']}');
      }

      setState(() => _isLoading = false);
    } else {
      print('No user ID available');
      setState(() => _isLoading = false);
    }
  }

  void _startWorkoutSession(int startIndex) async {
    await showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => WorkoutSessionModal(
        exercises: _dashboardVideos,
        initialIndex: startIndex,
        userId: widget.user?['_id'], // Pass userId to modal
        onComplete: (result) {
          // Modal handles logging internally
        },
      ),
    );

    // Refresh dashboard data after workout modal closes
    print('🔄 Refreshing dashboard after workout...');
    await _loadData();
  }

  @override
  Widget build(BuildContext context) {
    final isNarrow = Responsive.isNarrow(context);
    final isMobile = Responsive.isMobile(context);
    final pagePadding = Responsive.pagePadding(context);

    // Safely handle user data with extra defensive checks
    String userName = 'User';
    try {
      if (widget.user != null && widget.user!.containsKey('name')) {
        final nameValue = widget.user!['name'];
        if (nameValue != null && nameValue is String && nameValue.isNotEmpty) {
          userName = nameValue;
        }
      }
    } catch (e) {
      userName = 'User';
    }

    String firstName = 'User';
    try {
      if (userName.isNotEmpty && userName.contains(' ')) {
        firstName = userName.split(' ').first;
      } else if (userName.isNotEmpty) {
        firstName = userName;
      }
    } catch (e) {
      firstName = 'User';
    }

    // Extract progress data with safe type handling
    // Get fitness goal from progress data (fresh from backend)
    final fitnessGoal =
        (_progressData?['fitnessGoal'] as String?) ?? 'General Fitness';
    
    // Use goal-specific progress if available, otherwise fall back to total
    final goalProgressMap = _goalProgressData?['goalProgress'] as Map<String, dynamic>?;
    final currentGoalProgress = goalProgressMap?[fitnessGoal] as Map<String, dynamic>?;
    
    final streak = (_progressData?['currentStreak'] as int?) ?? 0;
    final exercisesDone = (currentGoalProgress?['exercises'] as int?) ?? 0;
    final totalMinutes = (currentGoalProgress?['minutes'] as int?) ?? 0;
    final totalWorkouts = (currentGoalProgress?['workouts'] as int?) ?? 0;
    final goalTarget = (_progressData?['goalTarget'] as int?) ?? 100;
    final goalProgress = goalTarget > 0
        ? (exercisesDone / goalTarget * 100).toInt()
        : 0;

    // Note: Backend only tracks aggregate stats for weekly/monthly
    // These show overall progress, not goal-specific
    // For accurate goal-specific weekly/monthly, we simulate from current goal totals
    final weeklyWorkouts = totalWorkouts > 0 ? (totalWorkouts / 4).ceil() : 0;
    final weeklyMinutes = totalMinutes > 0 ? (totalMinutes / 4).ceil() : 0;

    final mainContent = _isLoading
        ? Center(
            child: CircularProgressIndicator(
              color: Theme.of(context).primaryColor,
            ),
          )
        : SingleChildScrollView(
            padding: pagePadding,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                isMobile
                    ? Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Hey, $firstName 👋',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Theme.of(context).colorScheme.onSurface,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Goal: $fitnessGoal',
                            style: TextStyle(
                              fontSize: 14,
                              color:
                                  Theme.of(context).textTheme.bodySmall?.color,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Theme.of(context).primaryColor,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Icon(
                              Icons.stars_rounded,
                              color: Theme.of(context).colorScheme.onPrimary,
                              size: 28,
                            ),
                          ),
                        ],
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Hey, $firstName 👋',
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Theme.of(
                                    context,
                                  ).colorScheme.onSurface,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Goal: $fitnessGoal',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Theme.of(
                                    context,
                                  ).textTheme.bodySmall?.color,
                                ),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Theme.of(context).primaryColor,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Icon(
                              Icons.stars_rounded,
                              color: Theme.of(context).colorScheme.onPrimary,
                              size: 28,
                            ),
                          ),
                        ],
                      ),
                SizedBox(height: isMobile ? 20 : 32),

                        // Quote Box
                        Container(
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: Theme.of(context).cardColor,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: Theme.of(
                                context,
                              ).primaryColor.withOpacity(0.3),
                              width: 1,
                            ),
                          ),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: Theme.of(
                                    context,
                                  ).colorScheme.secondary,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Icon(
                                  Icons.format_quote,
                                  color: Theme.of(context).primaryColor,
                                  size: 24,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      '"${_dailyQuote['quote'] ?? 'Stay focused and keep pushing!'}"',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontStyle: FontStyle.italic,
                                        color: Theme.of(
                                          context,
                                        ).colorScheme.onSurface,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      '— ${_dailyQuote['author'] ?? 'Unknown'}',
                                      style: TextStyle(
                                        fontSize: 13,
                                        color: Theme.of(context).disabledColor,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 32),

                        // Stats Grid
                        LayoutBuilder(
                          builder: (context, constraints) {
                            final spacing = 16.0;
                            final count = Responsive.gridCount(
                              constraints.maxWidth,
                              minTileWidth: 180,
                              maxCount: 4,
                            );
                            final totalSpacing = spacing * (count - 1);
                            final cardWidth =
                                (constraints.maxWidth - totalSpacing) / count;
                            return Wrap(
                              spacing: spacing,
                              runSpacing: spacing,
                              children: [
                                SizedBox(
                                  width: cardWidth,
                                  child: _buildStatCard(
                                    icon: Icons.local_fire_department,
                                    label: 'Streak',
                                    value: '$streak days',
                                  ),
                                ),
                                SizedBox(
                                  width: cardWidth,
                                  child: _buildStatCard(
                                    icon: Icons.emoji_events,
                                    label: 'Exercises Done',
                                    value: '$exercisesDone',
                                  ),
                                ),
                                SizedBox(
                                  width: cardWidth,
                                  child: _buildStatCard(
                                    icon: Icons.timer_outlined,
                                    label: 'Total Minutes',
                                    value: '$totalMinutes',
                                  ),
                                ),
                                SizedBox(
                                  width: cardWidth,
                                  child: _buildStatCard(
                                    icon: Icons.trending_up,
                                    label: 'Goal Progress',
                                    value: '$goalProgress%',
                                  ),
                                ),
                              ],
                            );
                          },
                        ),
                        const SizedBox(height: 32),

                        // Goal Timeline
                        Container(
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: Theme.of(context).cardColor,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: Theme.of(
                                context,
                              ).primaryColor.withOpacity(0.3),
                              width: 1,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'Goal Timeline',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w600,
                                      color: Theme.of(
                                        context,
                                      ).colorScheme.onSurface,
                                    ),
                                  ),
                                  Text(
                                    '$goalProgress%',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      color: Theme.of(context).primaryColor,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),
                              ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: LinearProgressIndicator(
                                  value: goalProgress / 100,
                                  backgroundColor: Theme.of(
                                    context,
                                  ).colorScheme.secondary,
                                  valueColor: AlwaysStoppedAnimation<Color>(
                                    Theme.of(context).primaryColor,
                                  ),
                                  minHeight: 8,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                '$exercisesDone / $goalTarget exercises to reach your milestone',
                                style: TextStyle(
                                  fontSize: 13,
                                  color: Theme.of(context).disabledColor,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 32),

                        // Weekly Summary
                        Container(
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: Theme.of(context).cardColor,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: Theme.of(
                                context,
                              ).primaryColor.withOpacity(0.3),
                              width: 1,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Icon(
                                    Icons.calendar_today_outlined,
                                    color: Theme.of(context).primaryColor,
                                    size: 20,
                                  ),
                                  SizedBox(width: 8),
                                  Text(
                                    'Weekly Summary',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w600,
                                      color: Theme.of(
                                        context,
                                      ).colorScheme.onSurface,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 24),
                              isMobile
                                  ? Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.stretch,
                                      children: [
                                        _buildWeeklyStat(
                                          icon: Icons.fitness_center,
                                          value: '$weeklyWorkouts',
                                          label: 'Workouts this week',
                                          subLabel: weeklyWorkouts > 0
                                              ? '🔥 Keep it up!'
                                              : '— Let\'s get started!',
                                        ),
                                        const SizedBox(height: 16),
                                        _buildWeeklyStat(
                                          icon: Icons.timer,
                                          value: '$weeklyMinutes',
                                          label: 'Minutes this week',
                                          subLabel: weeklyMinutes > 0
                                              ? '💪 Great progress!'
                                              : '— Time to begin!',
                                        ),
                                      ],
                                    )
                                  : Row(
                                      children: [
                                        Expanded(
                                          child: _buildWeeklyStat(
                                            icon: Icons.fitness_center,
                                            value: '$weeklyWorkouts',
                                            label: 'Workouts this week',
                                            subLabel: weeklyWorkouts > 0
                                                ? '🔥 Keep it up!'
                                                : '— Let\'s get started!',
                                          ),
                                        ),
                                        const SizedBox(width: 24),
                                        Expanded(
                                          child: _buildWeeklyStat(
                                            icon: Icons.timer,
                                            value: '$weeklyMinutes',
                                            label: 'Minutes this week',
                                            subLabel: weeklyMinutes > 0
                                                ? '💪 Great progress!'
                                                : '— Time to begin!',
                                          ),
                                        ),
                                      ],
                                    ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 32),

                        // Today's Workout
                        isMobile
                            ? Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Today\'s Workout',
                                    style: TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                  const SizedBox(height: 12),
                                  SizedBox(
                                    width: double.infinity,
                                    child: ElevatedButton.icon(
                                      onPressed: () => _startWorkoutSession(0),
                                      icon: const Icon(
                                        Icons.play_arrow,
                                        size: 20,
                                      ),
                                      label: const Text('Start Session'),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor:
                                            Theme.of(context).primaryColor,
                                        foregroundColor: Theme.of(
                                          context,
                                        ).scaffoldBackgroundColor,
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 24,
                                          vertical: 16,
                                        ),
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(
                                            12,
                                          ),
                                        ),
                                        elevation: 0,
                                      ),
                                    ),
                                  ),
                                ],
                              )
                            : Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text(
                                    'Today\'s Workout',
                                    style: TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                  ElevatedButton.icon(
                                    onPressed: () => _startWorkoutSession(0),
                                    icon: const Icon(
                                      Icons.play_arrow,
                                      size: 20,
                                    ),
                                    label: const Text('Start Session'),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor:
                                          Theme.of(context).primaryColor,
                                      foregroundColor: Theme.of(
                                        context,
                                      ).scaffoldBackgroundColor,
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 24,
                                        vertical: 16,
                                      ),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      elevation: 0,
                                    ),
                                  ),
                                ],
                              ),
                        const SizedBox(height: 20),
                        LayoutBuilder(
                          builder: (context, constraints) {
                            final spacing = 16.0;
                            final columns = Responsive.gridCount(
                              constraints.maxWidth,
                              minTileWidth: 280,
                              maxCount: 3,
                            );
                            final totalSpacing = spacing * (columns - 1);
                            final rawWidth =
                                (constraints.maxWidth - totalSpacing) /
                                    columns;
                            final cardWidth = isMobile
                                ? rawWidth
                                : (rawWidth > 360.0 ? 360.0 : rawWidth);

                            return Wrap(
                              spacing: spacing,
                              runSpacing: spacing,
                              children: _dashboardVideos.asMap().entries.map((
                                entry,
                              ) {
                                final index = entry.key;
                                final video = entry.value;
                                return SizedBox(
                                  width: cardWidth,
                                  child: _buildWorkoutCard(
                                    title: video['title'] as String? ?? '',
                                    description:
                                        video['description'] as String? ?? '',
                                    duration:
                                        video['duration'] as String? ?? '',
                                    durationSeconds:
                                        video['durationSeconds'] as int? ?? 0,
                                    category:
                                        video['category'] as String? ?? '',
                                    level: video['level'] as String? ?? '',
                                    videoUrl:
                                        (video['videoUrls'] as List?)
                                                ?.isNotEmpty ==
                                            true
                                        ? (video['videoUrls'] as List)[0]
                                        : null,
                                    caloriesBurned:
                                        video['caloriesBurned'] as int?,
                                    onTap: () => _startWorkoutSession(index),
                                  ),
                                );
                              }).toList(),
                            );
                          },
                        ),
                        const SizedBox(height: 32),

                        // Today's Diet Plan
                        Container(
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: Theme.of(context).cardColor,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: Theme.of(
                                context,
                              ).primaryColor.withOpacity(0.3),
                              width: 1,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Icon(
                                    Icons.restaurant,
                                    color: Theme.of(context).primaryColor,
                                    size: 20,
                                  ),
                                  SizedBox(width: 8),
                                  Text(
                                    'Today\'s Diet Plan',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.white,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 24),
                              isMobile
                                  ? Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.stretch,
                                      children: [
                                        _buildMealCard(
                                          'BREAKFAST',
                                          'Oatmeal with protein powder, peanut butter, and banana',
                                        ),
                                        const SizedBox(height: 12),
                                        _buildMealCard(
                                          'LUNCH',
                                          'Salmon with quinoa and roasted vegetables',
                                        ),
                                        const SizedBox(height: 12),
                                        _buildMealCard(
                                          'DINNER',
                                          'Ground turkey pasta with marinara sauce',
                                        ),
                                      ],
                                    )
                                  : Row(
                                      children: [
                                        Expanded(
                                          child: _buildMealCard(
                                            'BREAKFAST',
                                            'Oatmeal with protein powder, peanut butter, and banana',
                                          ),
                                        ),
                                        const SizedBox(width: 16),
                                        Expanded(
                                          child: _buildMealCard(
                                            'LUNCH',
                                            'Salmon with quinoa and roasted vegetables',
                                          ),
                                        ),
                                        const SizedBox(width: 16),
                                        Expanded(
                                          child: _buildMealCard(
                                            'DINNER',
                                            'Ground turkey pasta with marinara sauce',
                                          ),
                                        ),
                                      ],
                                    ),
                              const SizedBox(height: 16),
                              Row(
                                children: [
                                  Icon(
                                    Icons.tips_and_updates_outlined,
                                    color: Theme.of(context).disabledColor,
                                    size: 16,
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    'Aim for 1.6-2.2g protein per kg of bodyweight.',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontStyle: FontStyle.italic,
                                      color: Theme.of(context).disabledColor,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: isNarrow
          ? AppBar(
              title: const Text('Dashboard'),
              backgroundColor: Theme.of(context).scaffoldBackgroundColor,
              elevation: 0,
              iconTheme: IconThemeData(
                color: Theme.of(context).colorScheme.onSurface,
              ),
              titleTextStyle: TextStyle(
                color: Theme.of(context).colorScheme.onSurface,
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            )
          : null,
      drawer: isNarrow
          ? Drawer(
              child: SafeArea(
                child: Sidebar(
                  currentPage: 'dashboard',
                  user: widget.user,
                  onItemSelected: () => Navigator.of(context).pop(),
                ),
              ),
            )
          : null,
      body: isNarrow
          ? mainContent
          : Row(
              children: [
                Sidebar(currentPage: 'dashboard', user: widget.user),
                Expanded(child: mainContent),
              ],
            ),
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String label,
    required String value,
  }) {
    final isMobile = Responsive.isMobile(context);
    return Container(
      padding: EdgeInsets.all(isMobile ? 12 : 20),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF2A2A2A)),
      ),
      child: Row(
        children: [
          Icon(icon, size: isMobile ? 20 : 24, color: const Color(0xFFB4F405)),
          SizedBox(width: isMobile ? 8 : 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                value,
                style: TextStyle(
                  fontSize: isMobile ? 20 : 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              Text(
                label,
                style: TextStyle(
                  fontSize: isMobile ? 11 : 12,
                  color: const Color(0xFF9E9E9E),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildWeeklyStat({
    required IconData icon,
    required String value,
    required String label,
    required String subLabel,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.secondary,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: Theme.of(context).primaryColor, size: 24),
          const SizedBox(height: 12),
          Text(
            value,
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: Theme.of(context).colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 13,
              color: Theme.of(context).textTheme.bodySmall?.color,
            ),
          ),
          Text(
            subLabel,
            style: TextStyle(
              fontSize: 12,
              color: Theme.of(context).disabledColor,
            ),
          ),
        ],
      ),
    );
  }

  String _getYoutubeThumbnail(String? videoUrl) {
    if (videoUrl == null || videoUrl.isEmpty) return '';

    // Extract YouTube video ID
    final regex = RegExp(r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)');
    final match = regex.firstMatch(videoUrl);

    if (match != null && match.groupCount >= 1) {
      final videoId = match.group(1);
      return 'https://img.youtube.com/vi/$videoId/hqdefault.jpg';
    }

    return '';
  }

  Widget _buildWorkoutCard({
    required String title,
    required String description,
    required String duration,
    required int durationSeconds,
    required String category,
    required String level,
    String? videoUrl,
    int? caloriesBurned,
    VoidCallback? onTap,
  }) {
    final thumbnailUrl = _getYoutubeThumbnail(videoUrl);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFF2A2A2A), width: 1),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                Container(
                  height: 160,
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.secondary,
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(16),
                    ),
                  ),
                  child: thumbnailUrl.isNotEmpty
                      ? ClipRRect(
                          borderRadius: const BorderRadius.vertical(
                            top: Radius.circular(16),
                          ),
                          child: Image.network(
                            thumbnailUrl,
                            width: double.infinity,
                            height: 160,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Center(
                                child: Icon(
                                  Icons.fitness_center,
                                  size: 64,
                                  color: Theme.of(context).disabledColor,
                                ),
                              );
                            },
                          ),
                        )
                      : Center(
                          child: Icon(
                            Icons.fitness_center,
                            size: 64,
                            color: Theme.of(context).disabledColor,
                          ),
                        ),
                ),
                Positioned(
                  top: 12,
                  right: 12,
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardColor.withOpacity(0.8),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Icon(
                      Icons.favorite_border,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                ),
                Positioned(
                  bottom: 12,
                  right: 12,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      // Duration badge
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: Theme.of(context).cardColor.withOpacity(0.8),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              Icons.timer,
                              size: 14,
                              color: Theme.of(context).colorScheme.onSurface,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              duration,
                              style: TextStyle(
                                fontSize: 12,
                                color: Theme.of(context).colorScheme.onSurface,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Calories badge
                      if (caloriesBurned != null && caloriesBurned > 0)
                        Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: Theme.of(context).cardColor.withOpacity(0.8),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(
                              children: [
                                const Icon(
                                  Icons.local_fire_department,
                                  size: 14,
                                  color: Color(0xFFFF6B35),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  '$caloriesBurned cal',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: Color(0xFFFF6B35),
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
                // Play button overlay
                Positioned.fill(
                  child: Center(
                    child: Icon(
                      Icons.play_circle_filled,
                      size: 56,
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: Theme.of(context).colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    description,
                    style: TextStyle(
                      fontSize: 13,
                      color: Theme.of(context).textTheme.bodySmall?.color,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.secondary,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          category,
                          style: TextStyle(
                            fontSize: 11,
                            color: Theme.of(context).colorScheme.onSurface,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Row(
                        children: [
                          Icon(
                            Icons.bolt,
                            size: 14,
                            color: Theme.of(context).primaryColor,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            level,
                            style: TextStyle(
                              fontSize: 11,
                              color: Theme.of(
                                context,
                              ).textTheme.bodySmall?.color,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMealCard(String mealType, String description) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.secondary,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            mealType,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: Theme.of(context).primaryColor,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            description,
            style: TextStyle(
              fontSize: 14,
              color: Theme.of(context).colorScheme.onSurface,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }
}
