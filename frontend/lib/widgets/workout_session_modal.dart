import 'dart:async';
import 'package:flutter/material.dart';
import '../services/progress_service.dart';
import 'youtube_video_player.dart';

class WorkoutSessionModal extends StatefulWidget {
  final List<Map<String, dynamic>> exercises;
  final int initialIndex;
  final void Function(Map<String, dynamic>?)? onComplete;
  final String? userId; // Add userId parameter

  const WorkoutSessionModal({
    super.key,
    required this.exercises,
    this.initialIndex = 0,
    this.onComplete,
    this.userId, // Add userId to constructor
  });

  @override
  State<WorkoutSessionModal> createState() => _WorkoutSessionModalState();
}

class _WorkoutSessionModalState extends State<WorkoutSessionModal> {
  Timer? _timer;
  int _remainingSeconds = 0;
  bool _isRunning = false;
  late int _currentIndex;
  int _currentVideoIndex = 0; // Track which video is currently selected

  // Progress tracking
  final ProgressService _progressService = ProgressService();
  int _totalWorkoutSeconds = 0; // Total time spent across all exercises
  int _completedExercises = 0; // Count of exercises completed
  bool _hasLoggedProgress = false; // Prevent duplicate logging
  bool _showVideoPlayer = false; // Control video player visibility
  bool _isVideoPlaying = false; // Track video play state

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _remainingSeconds = _currentExercise['durationSeconds'] as int;
  }

  Map<String, dynamic> get _currentExercise => widget.exercises[_currentIndex];

  String _extractVideoId(String? videoUrl) {
    if (videoUrl == null || videoUrl.isEmpty) return '';
    final uri = Uri.tryParse(videoUrl);
    if (uri == null) return '';
    if (uri.host.contains('youtube.com')) {
      return uri.queryParameters['v'] ?? '';
    } else if (uri.host.contains('youtu.be')) {
      return uri.pathSegments.isNotEmpty ? uri.pathSegments[0] : '';
    }
    return '';
  }

  void _navigateToPrevious() {
    if (_currentIndex > 0) {
      setState(() {
        _timer?.cancel();
        _currentIndex--;
        _currentVideoIndex = 0; // Reset to first video of the new exercise
        _remainingSeconds = _currentExercise['durationSeconds'] as int;
        _isRunning = false;
        _showVideoPlayer = false; // Hide video player for new exercise
        _isVideoPlaying = false;
      });
    }
  }

  void _navigateToNext() {
    if (_currentIndex < widget.exercises.length - 1) {
      setState(() {
        _timer?.cancel();
        _currentIndex++;
        _currentVideoIndex = 0; // Reset to first video of the new exercise
        _remainingSeconds = _currentExercise['durationSeconds'] as int;
        _isRunning = false;
        _showVideoPlayer = false; // Hide video player for new exercise
        _isVideoPlaying = false;
      });
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    print('⚠️ Modal disposing - Progress should have been logged before this');
    super.dispose();
  }

  void _startTimer() {
    // Show inline video player when starting
    setState(() {
      _showVideoPlayer = true;
      _isVideoPlaying = true;
    });

    print(
      '▶️ Timer started - Current total workout time: $_totalWorkoutSeconds seconds',
    );

    setState(() {
      _isRunning = true;
    });

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_remainingSeconds > 0) {
        setState(() {
          _remainingSeconds--;
          _totalWorkoutSeconds++; // Track total workout time
        });
      } else {
        _completeExercise();
      }
    });
  }

  void _pauseTimer() {
    _timer?.cancel();
    print(
      '⏸️ Timer paused - Total workout time: $_totalWorkoutSeconds seconds',
    );
    setState(() {
      _isRunning = false;
      _isVideoPlaying = false; // Pause video when timer is paused
    });
  }

  void _completeExercise() {
    _timer?.cancel();

    setState(() {
      _isRunning = false;
      _showVideoPlayer = false; // Hide video player when exercise completes
      _isVideoPlaying = false;
    });

    // Track completed exercise
    _completedExercises++;

    print('✅ Exercise completed!');
    print('   - Total exercises: $_completedExercises');
    print(
      '   - Total workout time: $_totalWorkoutSeconds seconds (${(_totalWorkoutSeconds / 60).toStringAsFixed(1)} minutes)',
    );

    // Show success dialog
    _showSuccessDialog();
  }

  Future<void> _logProgressToBackend() async {
    print('🔍 _logProgressToBackend called');
    print('   - _hasLoggedProgress: $_hasLoggedProgress');
    print('   - _totalWorkoutSeconds: $_totalWorkoutSeconds');
    print('   - userId from widget: ${widget.userId}');

    // Don't log if already logged or no workout time
    if (_hasLoggedProgress) {
      print('⏭ Skipping - already logged');
      return;
    }

    if (_totalWorkoutSeconds == 0) {
      print('⏭ Skipping - no workout time');
      return;
    }

    // Check if userId is available
    if (widget.userId == null || widget.userId!.isEmpty) {
      print('❌ No userId available');
      return;
    }

    _hasLoggedProgress = true;

    try {
      final userId = widget.userId!;

      final minutes = (_totalWorkoutSeconds / 60).round();
      print('📊 Logging workout progress:');
      print('   - Total seconds: $_totalWorkoutSeconds');
      print('   - Minutes (rounded): $minutes');
      print('   - Exercises completed: $_completedExercises');
      print('   - User ID: $userId');

      final response = await _progressService.logWorkout(
        userId: userId,
        seconds: _totalWorkoutSeconds,
        exercisesCompleted: _completedExercises,
      );

      if (response['success']) {
        print('✅ Progress logged successfully!');
        print('   Response: ${response['data']}');
      } else {
        print('❌ Failed to log progress: ${response['message']}');
      }
    } catch (e) {
      print('Error logging progress: $e');
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: Colors.transparent,
          child: Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFF1A1A1A),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFB4F405), width: 2),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFB4F405),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check,
                    size: 40,
                    color: Color(0xFF1A1A1A),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Exercise Complete!',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Great job on ${_currentExercise['title']}!',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Color(0xFF9E9E9E),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );

    // Auto-close dialog after 3 seconds
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        Navigator.of(context).pop();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final durationSeconds = _currentExercise['durationSeconds'] as int;
    final progress = _remainingSeconds / durationSeconds;
    final minutes = _remainingSeconds ~/ 60;
    final seconds = _remainingSeconds % 60;
    final exerciseName = _currentExercise['title'] as String;
    final description = _currentExercise['description'] as String;
    final what = _currentExercise['what'] as String? ?? '';
    final why = _currentExercise['why'] as String? ?? '';
    final how = _currentExercise['how'] as String? ?? '';
    final caloriesBurned = _currentExercise['caloriesBurned'] as int? ?? 0;
    final videoUrls = _currentExercise['videoUrls'] as List<dynamic>?;
    final videoId = videoUrls != null && videoUrls.isNotEmpty
        ? _extractVideoId(videoUrls[_currentVideoIndex].toString())
        : '';

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.all(20),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 700, maxHeight: 700),
        decoration: BoxDecoration(
          color: const Color(0xFF1A1A1A),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header with close button
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Exercise ${_currentIndex + 1} of ${widget.exercises.length}',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFFB4F405),
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                exerciseName,
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                            // Calories badge
                            if (caloriesBurned > 0)
                              Row(
                                children: [
                                  const Icon(
                                    Icons.local_fire_department,
                                    size: 18,
                                    color: Color(0xFFFF6B35),
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    '$caloriesBurned cal',
                                    style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFFFF6B35),
                                    ),
                                  ),
                                ],
                              ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          description,
                          style: const TextStyle(
                            fontSize: 14,
                            color: Color(0xFF9E9E9E),
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () async {
                      print('❌ Close button clicked');
                      await _logProgressToBackend(); // Log before closing
                      if (mounted) {
                        Navigator.of(context).pop();
                      }
                    },
                    icon: const Icon(Icons.close, color: Colors.white),
                  ),
                ],
              ),
            ),

            // Content area - Now scrollable
            Flexible(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    // Video Player or Thumbnail with Navigation
                    if (videoId.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                        child: Column(
                          children: [
                            // Video Player or Thumbnail
                            if (_showVideoPlayer)
                              // Show inline YouTube player
                              Container(
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(12),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.3),
                                      blurRadius: 8,
                                      spreadRadius: 2,
                                    ),
                                  ],
                                ),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(12),
                                  child: YouTubeVideoPlayer(
                                    videoUrl: videoUrls![_currentVideoIndex]
                                        .toString(),
                                    autoPlay: _isVideoPlaying,
                                  ),
                                ),
                              )
                            else
                              // Show clickable thumbnail
                              GestureDetector(
                                onTap: () {
                                  setState(() {
                                    _showVideoPlayer = true;
                                    _isVideoPlaying = true;
                                  });
                                },
                                child: Container(
                                  height: 200,
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(12),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.3),
                                        blurRadius: 8,
                                        spreadRadius: 2,
                                      ),
                                    ],
                                  ),
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(12),
                                    child: Stack(
                                      children: [
                                        // YouTube thumbnail
                                        Image.network(
                                          'https://img.youtube.com/vi/$videoId/maxresdefault.jpg',
                                          height: 200,
                                          width: double.infinity,
                                          fit: BoxFit.cover,
                                          errorBuilder:
                                              (context, error, stackTrace) {
                                                return Container(
                                                  height: 200,
                                                  color: const Color(
                                                    0xFF2A2A2A,
                                                  ),
                                                  child: const Center(
                                                    child: Icon(
                                                      Icons.video_library,
                                                      size: 60,
                                                      color: Color(0xFF6E6E6E),
                                                    ),
                                                  ),
                                                );
                                              },
                                        ),
                                        // Play button overlay
                                        Positioned.fill(
                                          child: Container(
                                            color: Colors.black.withOpacity(
                                              0.3,
                                            ),
                                            child: const Center(
                                              child: SizedBox(
                                                width: 72,
                                                height: 72,
                                                child: DecoratedBox(
                                                  decoration: BoxDecoration(
                                                    color: Color(0xFFB4F405),
                                                    shape: BoxShape.circle,
                                                  ),
                                                  child: Icon(
                                                    Icons.play_arrow,
                                                    size: 40,
                                                    color: Colors.black,
                                                  ),
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                        // Click instruction
                                        Positioned(
                                          bottom: 16,
                                          left: 16,
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 12,
                                              vertical: 6,
                                            ),
                                            decoration: BoxDecoration(
                                              color: Colors.black.withOpacity(
                                                0.8,
                                              ),
                                              borderRadius:
                                                  BorderRadius.circular(20),
                                            ),
                                            child: const Text(
                                              'Tap to play video inline',
                                              style: TextStyle(
                                                color: Colors.white,
                                                fontSize: 12,
                                                fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                    const SizedBox(height: 20),

                    // Timer Circle
                    SizedBox(
                      width: 140,
                      height: 140,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          SizedBox(
                            width: 140,
                            height: 140,
                            child: CircularProgressIndicator(
                              value: progress,
                              strokeWidth: 8,
                              backgroundColor: const Color(0xFF2A2A2A),
                              valueColor: const AlwaysStoppedAnimation<Color>(
                                Color(0xFFB4F405),
                              ),
                            ),
                          ),
                          Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}',
                                style: const TextStyle(
                                  fontSize: 36,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                              Text(
                                '${durationSeconds}s',
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: Color(0xFF6E6E6E),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 30),

                    // Control Buttons - Previous | Pause/Start | Next
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          // Previous Button
                          SizedBox(
                            width: 140,
                            child: OutlinedButton.icon(
                              onPressed: _navigateToPrevious,
                              icon: const Icon(Icons.skip_previous),
                              label: const Text('Previous'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(
                                  vertical: 16,
                                ),
                                side: const BorderSide(
                                  color: Color(0xFF3A3A3A),
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          // Pause/Start Button
                          SizedBox(
                            width: 140,
                            child: ElevatedButton.icon(
                              onPressed: _isRunning ? _pauseTimer : _startTimer,
                              icon: Icon(
                                _isRunning ? Icons.pause : Icons.play_arrow,
                              ),
                              label: Text(_isRunning ? 'Pause' : 'Start'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFFB4F405),
                                foregroundColor: const Color(0xFF1A1A1A),
                                padding: const EdgeInsets.symmetric(
                                  vertical: 16,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                elevation: 0,
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          // Next Button
                          SizedBox(
                            width: 140,
                            child: OutlinedButton.icon(
                              onPressed: _navigateToNext,
                              icon: const Icon(Icons.skip_next),
                              label: const Text('Next'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(
                                  vertical: 16,
                                ),
                                side: const BorderSide(
                                  color: Color(0xFF3A3A3A),
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Motivational Cards - WHAT, WHY, HOW (Horizontal Row)
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (what.isNotEmpty)
                            Expanded(
                              child: _buildMotivationalCard('WHAT', what),
                            ),
                          if (what.isNotEmpty && why.isNotEmpty)
                            const SizedBox(width: 12),
                          if (why.isNotEmpty)
                            Expanded(child: _buildMotivationalCard('WHY', why)),
                          if (why.isNotEmpty && how.isNotEmpty)
                            const SizedBox(width: 12),
                          if (how.isNotEmpty)
                            Expanded(child: _buildMotivationalCard('HOW', how)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMotivationalCard(String title, String content) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF2A2A2A),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: Color(0xFFB4F405),
              letterSpacing: 1.0,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            content,
            style: const TextStyle(
              fontSize: 14,
              color: Colors.white,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}
