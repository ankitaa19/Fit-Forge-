import 'package:flutter/material.dart';
import '../widgets/sidebar.dart';
import '../services/progress_service.dart';
import '../utils/responsive.dart';

class AchievementsPage extends StatefulWidget {
  final Map<String, dynamic>? user;

  const AchievementsPage({super.key, this.user});

  @override
  State<AchievementsPage> createState() => _AchievementsPageState();
}

class _AchievementsPageState extends State<AchievementsPage> {
  final ProgressService _progressService = ProgressService();
  bool _isLoading = true;
  Map<String, dynamic>? _progressData;
  Map<String, dynamic>? _goalProgressData;

  // User stats from backend
  int _currentExercises = 0;
  int _currentMinutes = 0;
  int _currentDayStreak = 0;
  int _currentSessions = 0;

  @override
  void initState() {
    super.initState();
    _loadAchievements();
  }

  Future<void> _loadAchievements() async {
    // Achievements page: Loads and displays achievements based on user progress
    if (widget.user != null && widget.user!['_id'] != null) {
      final response = await _progressService.getUserProgress(
        widget.user!['_id'],
      );

      final goalResponse = await _progressService.getGoalProgress(
        widget.user!['_id'],
      );

      if (mounted) {
        setState(() {
          if (response['success']) {
            _progressData = response['data'];
            _currentDayStreak = _progressData?['currentStreak'] ?? 0;

            // Use goal-specific progress if available
            if (goalResponse['success']) {
              _goalProgressData = goalResponse['data'];
              final fitnessGoal =
                  _goalProgressData?['currentGoal'] ?? 'General Fitness';
              final goalProgressMap =
                  _goalProgressData?['goalProgress'] as Map<String, dynamic>?;
              final currentGoalProgress =
                  goalProgressMap?[fitnessGoal] as Map<String, dynamic>?;

              _currentExercises = currentGoalProgress?['exercises'] ?? 0;
              _currentMinutes = currentGoalProgress?['minutes'] ?? 0;
              _currentSessions = currentGoalProgress?['workouts'] ?? 0;
            } else {
              // Fallback to total stats
              _currentExercises = _progressData?['totalExercises'] ?? 0;
              _currentMinutes = _progressData?['totalMinutes'] ?? 0;
              _currentSessions = _progressData?['totalWorkouts'] ?? 0;
            }

            _updateAchievementsProgress();
          }
          _isLoading = false;
        });
      }
    } else {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _updateAchievementsProgress() {
    for (var achievement in _achievements) {
      switch (achievement['category']) {
        case 'Streak':
          achievement['currentProgress'] = _currentDayStreak;
          break;
        case 'Exercises':
          achievement['currentProgress'] = _currentExercises;
          break;
        case 'Time':
          achievement['currentProgress'] = _currentMinutes;
          break;
        case 'Milestones':
          achievement['currentProgress'] = _currentSessions;
          break;
      }
      // Check if unlocked
      achievement['unlocked'] =
          achievement['currentProgress'] >= achievement['requirement'];
    }
  }

  final List<Map<String, dynamic>> _achievements = [
    // Streak Achievements
    {
      'category': 'Streak',
      'icon': Icons.local_fire_department,
      'name': 'Getting Started',
      'description': 'Maintain a 3-day workout streak',
      'requirement': 3,
      'currentProgress': 0,
      'unlocked': false,
    },
    {
      'category': 'Streak',
      'icon': Icons.local_fire_department,
      'name': 'Week Warrior',
      'description': 'Maintain a 7-day workout streak',
      'requirement': 7,
      'currentProgress': 0,
      'unlocked': false,
    },
    {
      'category': 'Streak',
      'icon': Icons.local_fire_department,
      'name': 'Unstoppable',
      'description': 'Maintain a 14-day workout streak',
      'requirement': 14,
      'currentProgress': 0,
      'unlocked': false,
    },
    {
      'category': 'Streak',
      'icon': Icons.local_fire_department,
      'name': 'Iron Will',
      'description': 'Maintain a 30-day workout streak',
      'requirement': 30,
      'currentProgress': 0,
      'unlocked': false,
    },

    // Exercise Achievements
    {
      'category': 'Exercises',
      'icon': Icons.fitness_center,
      'name': 'First Steps',
      'description': 'Complete 10 exercises',
      'requirement': 10,
      'currentProgress': 0,
      'unlocked': false,
    },
    {
      'category': 'Exercises',
      'icon': Icons.fitness_center,
      'name': 'Quarter Century',
      'description': 'Complete 25 exercises',
      'requirement': 25,
      'currentProgress': 0,
      'unlocked': false,
    },
    {
      'category': 'Exercises',
      'icon': Icons.fitness_center,
      'name': 'Half Century',
      'description': 'Complete 50 exercises',
      'requirement': 50,
      'currentProgress': 0,
      'unlocked': false,
    },
    {
      'category': 'Exercises',
      'icon': Icons.fitness_center,
      'name': 'Centurion',
      'description': 'Complete 100 exercises',
      'requirement': 100,
      'currentProgress': 0,
      'unlocked': false,
    },
    {
      'category': 'Exercises',
      'icon': Icons.fitness_center,
      'name': 'Elite Athlete',
      'description': 'Complete 250 exercises',
      'requirement': 250,
      'currentProgress': 0,
      'unlocked': false,
    },

    // Time Achievements
    {
      'category': 'Time',
      'icon': Icons.timer,
      'name': 'First Hour',
      'description': 'Accumulate 60 minutes of exercise',
      'requirement': 60,
      'currentProgress': 0,
      'unlocked': false,
    },
    {
      'category': 'Time',
      'icon': Icons.timer,
      'name': '5 Hour Club',
      'description': 'Accumulate 300 minutes of exercise',
      'requirement': 300,
      'currentProgress': 0,
      'unlocked': false,
    },
    {
      'category': 'Time',
      'icon': Icons.timer,
      'name': 'Dedicated',
      'description': 'Accumulate 10 hours of exercise',
      'requirement': 600,
      'currentProgress': 0,
      'unlocked': false,
    },
    {
      'category': 'Time',
      'icon': Icons.timer,
      'name': 'Time Invested',
      'description': 'Accumulate 25 hours of exercise',
      'requirement': 1500,
      'currentProgress': 0,
      'unlocked': false,
    },

    // Milestone Achievements
    {
      'category': 'Milestones',
      'icon': Icons.emoji_events,
      'name': 'Day One',
      'description': 'Complete your first workout session',
      'requirement': 1,
      'currentProgress': 0,
      'unlocked': false,
    },
    {
      'category': 'Milestones',
      'icon': Icons.emoji_events,
      'name': 'Regular',
      'description': 'Complete 10 workout sessions',
      'requirement': 10,
      'currentProgress': 0,
      'unlocked': false,
    },
    {
      'category': 'Milestones',
      'icon': Icons.emoji_events,
      'name': 'Committed',
      'description': 'Complete 25 workout sessions',
      'requirement': 25,
      'currentProgress': 0,
      'unlocked': false,
    },
    {
      'category': 'Milestones',
      'icon': Icons.emoji_events,
      'name': 'Fitness Legend',
      'description': 'Complete 50 workout sessions',
      'requirement': 50,
      'currentProgress': 0,
      'unlocked': false,
    },
  ];

  int get _unlockedCount =>
      _achievements.where((a) => a['unlocked'] == true).length;
  int get _totalCount => _achievements.length;

  List<Map<String, dynamic>> _getAchievementsByCategory(String category) {
    return _achievements.where((a) => a['category'] == category).toList();
  }

  @override
  Widget build(BuildContext context) {
    final isNarrow = Responsive.isNarrow(context);
    final pagePadding = Responsive.pagePadding(context);

    final mainContent = _isLoading
        ? const Center(
            child: CircularProgressIndicator(color: Color(0xFFB4F405)),
          )
        : SingleChildScrollView(
            padding: pagePadding,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Achievements',
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '$_unlockedCount of $_totalCount unlocked',
                      style: const TextStyle(
                        fontSize: 14,
                        color: Color(0xFFB4F405),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 32),

                // Summary Stats
                LayoutBuilder(
                  builder: (context, constraints) {
                    final isMobile = Responsive.isMobile(context);
                    final spacing = 20.0;
                    final columns = Responsive.gridCount(
                      constraints.maxWidth,
                      minTileWidth: 180,
                      maxCount: 4,
                    );
                    final totalSpacing = spacing * (columns - 1);
                    final rawWidth =
                        (constraints.maxWidth - totalSpacing) / columns;
                    final cardWidth =
                        isMobile ? rawWidth : (rawWidth > 260 ? 260.0 : rawWidth);

                    return Wrap(
                      spacing: spacing,
                      runSpacing: spacing,
                      children: [
                        SizedBox(
                          width: cardWidth,
                          child: _buildStatCard(
                            'Exercises',
                            _currentExercises.toString(),
                            Icons.fitness_center,
                          ),
                        ),
                        SizedBox(
                          width: cardWidth,
                          child: _buildStatCard(
                            'Minutes',
                            _currentMinutes.toString(),
                            Icons.timer,
                          ),
                        ),
                        SizedBox(
                          width: cardWidth,
                          child: _buildStatCard(
                            'Day Streak',
                            _currentDayStreak.toString(),
                            Icons.local_fire_department,
                          ),
                        ),
                        SizedBox(
                          width: cardWidth,
                          child: _buildStatCard(
                            'Sessions',
                            _currentSessions.toString(),
                            Icons.event_note,
                          ),
                        ),
                      ],
                    );
                  },
                ),
                const SizedBox(height: 32),

                // Achievement Categories
                _buildAchievementSection(
                  '🔥 Streak',
                  _getAchievementsByCategory('Streak'),
                ),
                const SizedBox(height: 32),
                _buildAchievementSection(
                  '💪 Exercises',
                  _getAchievementsByCategory('Exercises'),
                ),
                const SizedBox(height: 32),
                _buildAchievementSection(
                  '⏱️ Time',
                  _getAchievementsByCategory('Time'),
                ),
                const SizedBox(height: 32),
                _buildAchievementSection(
                  '🏆 Milestones',
                  _getAchievementsByCategory('Milestones'),
                ),
              ],
            ),
          );

    return Scaffold(
      backgroundColor: const Color(0xFF0F0F0F),
      appBar: isNarrow
          ? AppBar(
              title: const Text('Achievements'),
              backgroundColor: const Color(0xFF0F0F0F),
              elevation: 0,
              iconTheme: const IconThemeData(color: Colors.white),
              titleTextStyle: const TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            )
          : null,
      drawer: isNarrow
          ? Drawer(
              child: SafeArea(
                child: Sidebar(
                  currentPage: 'achievements',
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
                Sidebar(currentPage: 'achievements', user: widget.user),
                Expanded(child: mainContent),
              ],
            ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon) {
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

  Widget _buildAchievementSection(
    String title,
    List<Map<String, dynamic>> achievements,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 16),
        LayoutBuilder(
          builder: (context, constraints) {
            final spacing = 20.0;
            final count = Responsive.gridCount(
              constraints.maxWidth,
              minTileWidth: 280,
              maxCount: 2,
            );
            final totalSpacing = spacing * (count - 1);
            final cardWidth = (constraints.maxWidth - totalSpacing) / count;

            return Wrap(
              spacing: spacing,
              runSpacing: spacing,
              children: achievements
                  .map(
                    (achievement) => SizedBox(
                      width: cardWidth,
                      child: _buildAchievementCard(achievement),
                    ),
                  )
                  .toList(),
            );
          },
        ),
      ],
    );
  }

  Widget _buildAchievementCard(Map<String, dynamic> achievement) {
    final isUnlocked = achievement['unlocked'] as bool;
    final progress = achievement['currentProgress'] as int;
    final requirement = achievement['requirement'] as int;
    final percentage = requirement > 0
        ? (progress / requirement).clamp(0.0, 1.0)
        : 0.0;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isUnlocked ? const Color(0xFFB4F405) : const Color(0xFF2A2A2A),
        ),
      ),
      child: Row(
        children: [
          // Icon
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isUnlocked
                  ? const Color(0xFFB4F405).withOpacity(0.2)
                  : const Color(0xFF2A2A2A),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              isUnlocked ? achievement['icon'] as IconData : Icons.lock_outline,
              color: isUnlocked
                  ? const Color(0xFFB4F405)
                  : const Color(0xFF6E6E6E),
              size: 32,
            ),
          ),
          const SizedBox(width: 16),

          // Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  achievement['name'] as String,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: isUnlocked ? Colors.white : const Color(0xFF6E6E6E),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  achievement['description'] as String,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF9E9E9E),
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                if (!isUnlocked) ...[
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: percentage,
                            backgroundColor: const Color(0xFF2A2A2A),
                            valueColor: const AlwaysStoppedAnimation<Color>(
                              Color(0xFFB4F405),
                            ),
                            minHeight: 4,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '$progress/$requirement',
                        style: const TextStyle(
                          fontSize: 11,
                          color: Color(0xFF9E9E9E),
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
