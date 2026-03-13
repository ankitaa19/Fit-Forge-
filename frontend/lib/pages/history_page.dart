import 'package:flutter/material.dart';
import '../widgets/sidebar.dart';
import '../services/progress_service.dart';
import 'package:intl/intl.dart';

class HistoryPage extends StatefulWidget {
  final Map<String, dynamic>? user;

  const HistoryPage({super.key, this.user});

  @override
  State<HistoryPage> createState() => _HistoryPageState();
}

class _HistoryPageState extends State<HistoryPage> {
  final ProgressService _progressService = ProgressService();
  bool _isLoading = true;
  Map<String, dynamic>? _progressData;
  Map<String, dynamic>? _goalProgressData;
  final List<Map<String, dynamic>> _workoutHistory = [];

  int get _totalSessions {
    if (_goalProgressData != null) {
      final fitnessGoal = _progressData?['fitnessGoal'] ?? 'General Fitness';
      final goalProgressMap =
          _goalProgressData!['goalProgress'] as Map<String, dynamic>?;
      final currentGoalProgress =
          goalProgressMap?[fitnessGoal] as Map<String, dynamic>?;
      return currentGoalProgress?['workouts'] ?? 0;
    }
    return _progressData?['totalWorkouts'] ?? 0;
  }

  int get _totalExercises {
    if (_goalProgressData != null) {
      final fitnessGoal = _progressData?['fitnessGoal'] ?? 'General Fitness';
      final goalProgressMap =
          _goalProgressData!['goalProgress'] as Map<String, dynamic>?;
      final currentGoalProgress =
          goalProgressMap?[fitnessGoal] as Map<String, dynamic>?;
      return currentGoalProgress?['exercises'] ?? 0;
    }
    return _progressData?['totalExercises'] ?? 0;
  }

  int get _totalMinutes {
    if (_goalProgressData != null) {
      final fitnessGoal = _progressData?['fitnessGoal'] ?? 'General Fitness';
      final goalProgressMap =
          _goalProgressData!['goalProgress'] as Map<String, dynamic>?;
      final currentGoalProgress =
          goalProgressMap?[fitnessGoal] as Map<String, dynamic>?;
      return currentGoalProgress?['minutes'] ?? 0;
    }
    return _progressData?['totalMinutes'] ?? 0;
  }

  @override
  void initState() {
    super.initState();
    _loadProgress();
  }

  Future<void> _loadProgress() async {
    // History page: Loads workout history and timeline data for user
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
          }
          if (goalResponse['success']) {
            _goalProgressData = goalResponse['data'];
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F0F0F),
      body: Row(
        children: [
          Sidebar(currentPage: 'history', user: widget.user),
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
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Workout History',
                                  style: TextStyle(
                                    fontSize: 32,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Your complete workout timeline',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.grey[400],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 40),

                        // Stats Summary
                        Row(
                          children: [
                            _buildStatCard(
                              'Sessions',
                              _totalSessions.toString(),
                              Icons.event_note,
                            ),
                            const SizedBox(width: 20),
                            _buildStatCard(
                              'Exercises',
                              _totalExercises.toString(),
                              Icons.fitness_center,
                            ),
                            const SizedBox(width: 20),
                            _buildStatCard(
                              'Minutes',
                              _totalMinutes.toString(),
                              Icons.timer,
                            ),
                          ],
                        ),
                        const SizedBox(height: 40),

                        // Workout Timeline
                        if (_workoutHistory.isEmpty)
                          _buildEmptyState()
                        else
                          _buildWorkoutTimeline(),
                      ],
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: const Color(0xFF1A1A1A),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFF2A2A2A)),
        ),
        child: Column(
          children: [
            Text(
              value,
              style: const TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(icon, size: 16, color: const Color(0xFF9E9E9E)),
                const SizedBox(width: 6),
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Color(0xFF9E9E9E),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    // Check if user has workout data
    final hasWorkouts = _totalSessions > 0;

    return Container(
      padding: const EdgeInsets.all(48),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF2A2A2A)),
      ),
      child: Center(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: hasWorkouts
                    ? const Color(0xFFB4F405).withOpacity(0.2)
                    : const Color(0xFF2A2A2A),
                shape: BoxShape.circle,
              ),
              child: Icon(
                hasWorkouts ? Icons.fitness_center : Icons.history,
                size: 64,
                color: hasWorkouts ? const Color(0xFFB4F405) : Colors.grey[700],
              ),
            ),
            const SizedBox(height: 24),
            Text(
              hasWorkouts
                  ? 'Your Progress is Being Tracked!'
                  : 'No workouts yet',
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              hasWorkouts
                  ? 'Your workout stats are displayed above. Keep up the great work!'
                  : 'Complete your first session to start tracking your progress!',
              style: TextStyle(fontSize: 14, color: Colors.grey[400]),
              textAlign: TextAlign.center,
            ),
            if (hasWorkouts) ...[
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFFB4F405).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: const Color(0xFFB4F405).withOpacity(0.3),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.check_circle,
                      color: Color(0xFFB4F405),
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '$_totalSessions ${_totalSessions == 1 ? 'Session' : 'Sessions'} Completed',
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
          ],
        ),
      ),
    );
  }

  Widget _buildWorkoutTimeline() {
    return Column(
      children: _workoutHistory.map((workout) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 20),
          child: _buildWorkoutCard(workout),
        );
      }).toList(),
    );
  }

  Widget _buildWorkoutCard(Map<String, dynamic> workout) {
    final date = workout['date'] as DateTime;
    final exercises = workout['exercises'] as List<Map<String, dynamic>>;
    final totalMinutes = workout['totalMinutes'] as int;
    final totalExercises = workout['totalExercises'] as int;

    return Container(
      padding: const EdgeInsets.all(24),
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
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    DateFormat('EEEE, MMMM d').format(date),
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    DateFormat('h:mm a').format(date),
                    style: const TextStyle(
                      fontSize: 13,
                      color: Color(0xFF9E9E9E),
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFFB4F405).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.check_circle,
                      size: 16,
                      color: Color(0xFFB4F405),
                    ),
                    const SizedBox(width: 6),
                    const Text(
                      'Completed',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFFB4F405),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Exercises List
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF0F0F0F),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Exercises',
                  style: TextStyle(
                    fontSize: 12,
                    color: Color(0xFF9E9E9E),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 12),
                ...exercises.map(
                  (exercise) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.check,
                          size: 16,
                          color: Color(0xFFB4F405),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          exercise['name'] as String,
                          style: const TextStyle(
                            fontSize: 14,
                            color: Colors.white,
                          ),
                        ),
                        const Spacer(),
                        Text(
                          '${exercise['duration']}s',
                          style: const TextStyle(
                            fontSize: 12,
                            color: Color(0xFF9E9E9E),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Summary
          Row(
            children: [
              _buildSummaryChip(
                Icons.fitness_center,
                '$totalExercises exercises',
              ),
              const SizedBox(width: 12),
              _buildSummaryChip(Icons.timer, '$totalMinutes min'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFF2A2A2A),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Icon(icon, size: 14, color: const Color(0xFF9E9E9E)),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(fontSize: 12, color: Color(0xFF9E9E9E)),
          ),
        ],
      ),
    );
  }
}
