import 'package:flutter/material.dart';
import '../widgets/sidebar.dart';
import '../widgets/workout_session_modal.dart';
import '../services/exercise_service.dart';
import '../services/progress_service.dart';

class MyWorkoutsPage extends StatefulWidget {
  final Map<String, dynamic>? user;

  const MyWorkoutsPage({super.key, this.user});

  @override
  State<MyWorkoutsPage> createState() => _MyWorkoutsPageState();
}

class _MyWorkoutsPageState extends State<MyWorkoutsPage> {
  List<Map<String, dynamic>> _customWorkouts = [];
  String _newWorkoutName = '';
  final List<Map<String, dynamic>> _selectedExercises = [];
  List<Map<String, dynamic>> _availableExercises = [];
  bool _isLoadingExercises = false;
  bool _isLoadingWorkouts = true;
  final ExerciseService _exerciseService = ExerciseService();
  final ProgressService _progressService = ProgressService();

  // Legacy hardcoded exercises - now replaced by API
  final List<Map<String, dynamic>> _legacyExercises = [
    {
      'id': '1',
      'title': 'Push-ups',
      'description': 'Classic upper body strength exercise',
      'duration': '45s',
      'durationSeconds': 45,
      'category': 'Strength',
      'level': 'Beginner',
    },
    {
      'id': '2',
      'title': 'Squats',
      'description': 'Essential lower body compound movement',
      'duration': '60s',
      'durationSeconds': 60,
      'category': 'Strength',
      'level': 'Beginner',
    },
    {
      'id': '3',
      'title': 'Plank Hold',
      'description': 'Core stability and endurance',
      'duration': '45s',
      'durationSeconds': 45,
      'category': 'Core',
      'level': 'Beginner',
    },
    {
      'id': '4',
      'title': 'Lunges',
      'description': 'Unilateral leg strength builder',
      'duration': '60s',
      'durationSeconds': 60,
      'category': 'Strength',
      'level': 'Intermediate',
    },
    {
      'id': '5',
      'title': 'Russian Twists',
      'description': 'Rotational core strength',
      'duration': '45s',
      'durationSeconds': 45,
      'category': 'Core',
      'level': 'Intermediate',
    },
    {
      'id': '6',
      'title': 'Bicycle Crunches',
      'description': 'Dynamic ab exercise',
      'duration': '45s',
      'durationSeconds': 45,
      'category': 'Core',
      'level': 'Beginner',
    },
    {
      'id': '7',
      'title': 'Box Jumps',
      'description': 'Explosive power development',
      'duration': '30s',
      'durationSeconds': 30,
      'category': 'Cardio',
      'level': 'Advanced',
    },
    {
      'id': '8',
      'title': 'Tricep Dips',
      'description': 'Arm and chest strength',
      'duration': '45s',
      'durationSeconds': 45,
      'category': 'Strength',
      'level': 'Intermediate',
    },
  ];

  Future<void> _loadExercisesFromAPI() async {
    setState(() {
      _isLoadingExercises = true;
    });

    try {
      final fitnessGoal =
          widget.user?['fitnessGoal'] as String? ?? 'General Fitness';
      final response = await _exerciseService.getExercisesByGoal(fitnessGoal);

      setState(() {
        if (response['success'] == true && response['exercises'] != null) {
          _availableExercises = (response['exercises'] as List)
              .cast<Map<String, dynamic>>();
        } else {
          _availableExercises = List.from(_legacyExercises);
        }
        _isLoadingExercises = false;
      });
    } catch (e) {
      setState(() {
        _isLoadingExercises = false;
        // Fallback to legacy exercises if API fails
        _availableExercises = List.from(_legacyExercises);
      });
    }
  }

  Future<void> _startAddingWorkout() async {
    setState(() {
      _selectedExercises.clear();
      _newWorkoutName = '';
    });
    await _loadExercisesFromAPI();
    if (mounted) {
      _showAddWorkoutModal();
    }
  }

  void _showAddWorkoutModal() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Dialog(
              backgroundColor: const Color(0xFF1A1A1A),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              child: Container(
                width: MediaQuery.of(context).size.width * 0.75,
                height: MediaQuery.of(context).size.height * 0.75,
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Create Custom Workout',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        IconButton(
                          onPressed: () => Navigator.of(context).pop(),
                          icon: const Icon(
                            Icons.close,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    // Content
                    Expanded(
                      child: SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Workout Name Input
                            const Text(
                              'Workout Name (Optional)',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 8),
                            TextField(
                              onChanged: (value) {
                                setModalState(() {
                                  _newWorkoutName = value;
                                });
                              },
                              style: const TextStyle(color: Colors.white),
                              decoration: InputDecoration(
                                hintText:
                                    'e.g., Morning Routine, Full Body Blast (optional)',
                                hintStyle: const TextStyle(
                                  color: Color(0xFF6E6E6E),
                                ),
                                filled: true,
                                fillColor: const Color(0xFF0F0F0F),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: const BorderSide(
                                    color: Color(0xFFB4F405),
                                  ),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: const BorderSide(
                                    color: Color(0xFF2A2A2A),
                                  ),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: const BorderSide(
                                    color: Color(0xFFB4F405),
                                    width: 2,
                                  ),
                                ),
                                contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 16,
                                  vertical: 12,
                                ),
                              ),
                            ),
                            const SizedBox(height: 16),
                            // Exercise Selection Header
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  'Pick exercises',
                                  style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.white,
                                  ),
                                ),
                                Text(
                                  '${_selectedExercises.length} selected',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: Color(0xFFB4F405),
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),
                            // Selected Exercises Chips
                            if (_selectedExercises.isNotEmpty)
                              Container(
                                padding: const EdgeInsets.all(8),
                                margin: const EdgeInsets.only(bottom: 8),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF0F0F0F),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: const Color(0xFFB4F405),
                                  ),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Row(
                                      children: [
                                        Text(
                                          'Selected',
                                          style: TextStyle(
                                            fontSize: 13,
                                            fontWeight: FontWeight.w600,
                                            color: Colors.white,
                                          ),
                                        ),
                                        SizedBox(width: 8),
                                        Text(
                                          '(Tap to remove)',
                                          style: TextStyle(
                                            fontSize: 11,
                                            color: Color(0xFF6E6E6E),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 6),
                                    Wrap(
                                      spacing: 6,
                                      runSpacing: 6,
                                      children: _selectedExercises.map((
                                        exercise,
                                      ) {
                                        return InkWell(
                                          onTap: () {
                                            setModalState(() {
                                              _toggleExerciseSelection(
                                                exercise,
                                              );
                                            });
                                          },
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 12,
                                              vertical: 8,
                                            ),
                                            decoration: BoxDecoration(
                                              color: const Color(0xFFB4F405),
                                              borderRadius:
                                                  BorderRadius.circular(20),
                                            ),
                                            child: Row(
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                Text(
                                                  exercise['title']
                                                          ?.toString() ??
                                                      'Exercise',
                                                  style: const TextStyle(
                                                    fontSize: 13,
                                                    fontWeight: FontWeight.w600,
                                                    color: Color(0xFF1A1A1A),
                                                  ),
                                                ),
                                                const SizedBox(width: 6),
                                                const Icon(
                                                  Icons.close,
                                                  size: 14,
                                                  color: Color(0xFF1A1A1A),
                                                ),
                                              ],
                                            ),
                                          ),
                                        );
                                      }).toList(),
                                    ),
                                  ],
                                ),
                              ),
                            // Loading indicator
                            if (_isLoadingExercises)
                              const Center(
                                child: Padding(
                                  padding: EdgeInsets.all(40.0),
                                  child: CircularProgressIndicator(
                                    color: Color(0xFFB4F405),
                                  ),
                                ),
                              )
                            else if (_availableExercises.isEmpty)
                              Center(
                                child: Padding(
                                  padding: const EdgeInsets.all(40.0),
                                  child: Text(
                                    'No exercises available',
                                    style: TextStyle(
                                      color: Colors.grey[400],
                                      fontSize: 14,
                                    ),
                                  ),
                                ),
                              )
                            else
                              // Exercise Grid
                              GridView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                gridDelegate:
                                    const SliverGridDelegateWithFixedCrossAxisCount(
                                      crossAxisCount: 3,
                                      crossAxisSpacing: 16,
                                      mainAxisSpacing: 16,
                                      childAspectRatio: 1.18,
                                    ),
                                itemCount: _availableExercises.length,
                                itemBuilder: (context, index) {
                                  final exercise = _availableExercises[index];
                                  // Support both MongoDB's _id and legacy id
                                  final exerciseId =
                                      (exercise['_id'] ?? exercise['id'])
                                          ?.toString() ??
                                      '';
                                  final isSelected = _isExerciseSelected(
                                    exerciseId,
                                  );

                                  // Extract video ID from videoUrls for thumbnail
                                  String? thumbnailUrl;
                                  if (exercise['videoUrls'] != null) {
                                    final videoUrls = exercise['videoUrls'];
                                    if (videoUrls is List &&
                                        videoUrls.isNotEmpty) {
                                      final videoUrl =
                                          videoUrls[0]?.toString() ?? '';
                                      if (videoUrl.isNotEmpty &&
                                          videoUrl.contains('v=')) {
                                        final videoId = videoUrl
                                            .split('v=')[1]
                                            .split('&')[0];
                                        if (videoId.isNotEmpty) {
                                          thumbnailUrl =
                                              'https://img.youtube.com/vi/$videoId/hqdefault.jpg';
                                        }
                                      }
                                    }
                                  }

                                  return InkWell(
                                    onTap: () {
                                      setModalState(() {
                                        _toggleExerciseSelection(exercise);
                                      });
                                    },
                                    borderRadius: BorderRadius.circular(12),
                                    child: Container(
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF0F0F0F),
                                        borderRadius: BorderRadius.circular(12),
                                        border: Border.all(
                                          color: isSelected
                                              ? const Color(0xFFB4F405)
                                              : const Color(0xFF2A2A2A),
                                          width: isSelected ? 2.5 : 1,
                                        ),
                                      ),
                                      child: Stack(
                                        children: [
                                          Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              // Thumbnail
                                              Container(
                                                height: 160,
                                                decoration: BoxDecoration(
                                                  color: const Color(
                                                    0xFF2A2A2A,
                                                  ),
                                                  borderRadius:
                                                      const BorderRadius.only(
                                                        topLeft:
                                                            Radius.circular(12),
                                                        topRight:
                                                            Radius.circular(12),
                                                      ),
                                                  image: thumbnailUrl != null
                                                      ? DecorationImage(
                                                          image: NetworkImage(
                                                            thumbnailUrl,
                                                          ),
                                                          fit: BoxFit.cover,
                                                        )
                                                      : null,
                                                ),
                                                child: thumbnailUrl == null
                                                    ? Center(
                                                        child: Icon(
                                                          Icons.fitness_center,
                                                          size: 48,
                                                          color:
                                                              Colors.grey[600],
                                                        ),
                                                      )
                                                    : null,
                                              ),
                                              // Info
                                              Padding(
                                                padding: const EdgeInsets.all(
                                                  16,
                                                ),
                                                child: Column(
                                                  crossAxisAlignment:
                                                      CrossAxisAlignment.start,
                                                  children: [
                                                    SizedBox(
                                                      height: 22,
                                                      child: Text(
                                                        exercise['title']
                                                                ?.toString() ??
                                                            'Exercise',
                                                        style: const TextStyle(
                                                          fontSize: 18,
                                                          fontWeight:
                                                              FontWeight.w600,
                                                          color: Colors.white,
                                                        ),
                                                        maxLines: 1,
                                                        overflow: TextOverflow
                                                            .ellipsis,
                                                      ),
                                                    ),
                                                    const SizedBox(height: 4),
                                                    SizedBox(
                                                      height: 36,
                                                      child: Text(
                                                        exercise['description']
                                                                ?.toString() ??
                                                            '',
                                                        style: const TextStyle(
                                                          fontSize: 13,
                                                          color: Color(
                                                            0xFF9E9E9E,
                                                          ),
                                                        ),
                                                        maxLines: 2,
                                                        overflow: TextOverflow
                                                            .ellipsis,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ],
                                          ),
                                          if (isSelected)
                                            Positioned(
                                              top: 12,
                                              right: 12,
                                              child: Container(
                                                padding: const EdgeInsets.all(
                                                  8,
                                                ),
                                                decoration: const BoxDecoration(
                                                  color: Color(0xFFB4F405),
                                                  shape: BoxShape.circle,
                                                  boxShadow: [
                                                    BoxShadow(
                                                      color: Colors.black26,
                                                      blurRadius: 8,
                                                      offset: Offset(0, 2),
                                                    ),
                                                  ],
                                                ),
                                                child: const Icon(
                                                  Icons.check,
                                                  size: 24,
                                                  color: Color(0xFF1A1A1A),
                                                ),
                                              ),
                                            ),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                            const SizedBox(
                              height: 80,
                            ), // Bottom padding for button clearance
                          ],
                        ),
                      ),
                    ),
                    // Action Buttons with background
                    Container(
                      decoration: const BoxDecoration(
                        color: Color(0xFF1A1A1A),
                        border: Border(
                          top: BorderSide(color: Color(0xFF2A2A2A), width: 1),
                        ),
                      ),
                      padding: const EdgeInsets.only(top: 12),
                      child: Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => Navigator.of(context).pop(),
                              style: OutlinedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(
                                  vertical: 12,
                                ),
                                side: const BorderSide(
                                  color: Color(0xFF2A2A2A),
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              child: const Text(
                                'Cancel',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () async {
                                if (_selectedExercises.isEmpty) {
                                  _showErrorDialog(
                                    'Please select at least one exercise',
                                  );
                                  return;
                                }

                                final workoutName = _newWorkoutName.isEmpty
                                    ? 'Workout ${_customWorkouts.length + 1}'
                                    : _newWorkoutName;

                                // Save to backend
                                if (widget.user != null &&
                                    widget.user?['_id'] != null) {
                                  final userId = widget.user!['_id'].toString();
                                  final response = await _progressService
                                      .saveCustomWorkout(
                                        userId: userId,
                                        name: workoutName,
                                        exercises: _selectedExercises,
                                      );

                                  if (response['success'] == true) {
                                    // Reload workouts from backend
                                    await _loadWorkouts();
                                    Navigator.of(context).pop();
                                    _showSuccessDialog(
                                      'Workout Saved!',
                                      'Your custom workout "$workoutName" has been created successfully.',
                                    );
                                  } else {
                                    _showErrorDialog(
                                      response['message'] ??
                                          'Failed to save workout',
                                    );
                                  }
                                }
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFFB4F405),
                                padding: const EdgeInsets.symmetric(
                                  vertical: 12,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: const [
                                  Icon(
                                    Icons.save,
                                    color: Color(0xFF1A1A1A),
                                    size: 20,
                                  ),
                                  SizedBox(width: 8),
                                  Text(
                                    'Save Workout',
                                    style: TextStyle(
                                      color: Color(0xFF1A1A1A),
                                      fontSize: 16,
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
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  void _toggleExerciseSelection(Map<String, dynamic> exercise) {
    // Support both MongoDB's _id and legacy id
    final exerciseId = (exercise['_id'] ?? exercise['id'])?.toString() ?? '';
    if (exerciseId.isEmpty) return;

    final index = _selectedExercises.indexWhere(
      (e) => (e['_id'] ?? e['id'])?.toString() == exerciseId,
    );
    if (index >= 0) {
      _selectedExercises.removeAt(index);
    } else {
      _selectedExercises.add(exercise);
    }
  }

  bool _isExerciseSelected(String exerciseId) {
    if (exerciseId.isEmpty) return false;
    // Support both MongoDB's _id and legacy id
    return _selectedExercises.any(
      (e) => (e['_id'] ?? e['id'])?.toString() == exerciseId,
    );
  }

  void _openWorkoutModal(
    List<Map<String, dynamic>> exercises,
    int currentIndex,
  ) async {
    await showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return WorkoutSessionModal(
          exercises: exercises,
          initialIndex: currentIndex,
          userId: widget.user?['_id'], // Pass userId
          onComplete: (data) {
            // Session completed - modal will stay open until user closes it
          },
        );
      },
    );
  }

  void _showSuccessDialog(String title, String message) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        Future.delayed(const Duration(seconds: 2), () {
          if (mounted && Navigator.of(context).canPop()) {
            Navigator.of(context).pop();
          }
        });

        return Dialog(
          backgroundColor: const Color(0xFF1A1A1A),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: Container(
            width: 320,
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Success Icon
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: const Color(0xFFB4F405),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check_rounded,
                    size: 40,
                    color: Color(0xFF1A1A1A),
                  ),
                ),
                const SizedBox(height: 20),
                // Title
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 10),
                // Message
                Text(
                  message,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 13,
                    color: Color(0xFF9E9E9E),
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (dialogCtx) => Dialog(
        backgroundColor: const Color(0xFF1A1A1A),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Container(
          width: 320,
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: Colors.red.shade600,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.error_outline,
                  size: 40,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                'Error',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                message,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 13,
                  color: Color(0xFF9E9E9E),
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 42,
                child: ElevatedButton(
                  onPressed: () => Navigator.of(dialogCtx).pop(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2A2A2A),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
                    'OK',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _deleteWorkout(String workoutId) async {
    if (workoutId.isEmpty) return;

    if (widget.user != null && widget.user?['_id'] != null) {
      final userId = widget.user!['_id'].toString();
      final response = await _progressService.deleteCustomWorkout(
        userId: userId,
        workoutId: workoutId,
      );

      if (response['success'] == true) {
        await _loadWorkouts();
        _showSuccessDialog(
          'Workout Deleted!',
          'The workout has been removed from your list.',
        );
      } else {
        _showErrorDialog(response['message'] ?? 'Failed to delete workout');
      }
    }
  }

  Future<void> _deleteExerciseFromWorkout(
    String workoutId,
    int exerciseIndex,
  ) async {
    if (workoutId.isEmpty) return;

    // Find the workout
    final workoutIndex = _customWorkouts.indexWhere(
      (w) => (w['_id'] ?? w['id'])?.toString() == workoutId,
    );

    if (workoutIndex == -1) return;

    final workout = _customWorkouts[workoutIndex];
    final exercises =
        (workout['exercises'] as List?)?.cast<Map<String, dynamic>>() ?? [];

    // If this is the last exercise, delete the entire workout
    if (exercises.length <= 1) {
      await _deleteWorkout(workoutId);
      return;
    }

    // Remove the exercise at the given index
    exercises.removeAt(exerciseIndex);

    // Update the workout in backend
    if (widget.user != null && widget.user?['_id'] != null) {
      final userId = widget.user!['_id'].toString();

      // Delete old workout and create new one with updated exercises
      await _progressService.deleteCustomWorkout(
        userId: userId,
        workoutId: workoutId,
      );

      final response = await _progressService.saveCustomWorkout(
        userId: userId,
        name: workout['name']?.toString() ?? 'Custom Workout',
        exercises: exercises,
      );

      if (response['success'] == true) {
        await _loadWorkouts();
        _showSuccessDialog(
          'Exercise Removed!',
          'The exercise has been removed from your workout.',
        );
      } else {
        _showErrorDialog(response['message'] ?? 'Failed to remove exercise');
      }
    }
  }

  @override
  void initState() {
    super.initState();
    _loadWorkouts();
  }

  Future<void> _loadWorkouts() async {
    if (widget.user == null || widget.user?['_id'] == null) {
      setState(() {
        _isLoadingWorkouts = false;
      });
      return;
    }

    final userId = widget.user!['_id'].toString();
    final response = await _progressService.getCustomWorkouts(userId);

    setState(() {
      if (response['success'] == true && response['data'] != null) {
        _customWorkouts = (response['data'] as List)
            .map(
              (w) => {
                '_id': w['_id'],
                'id': w['_id'], // Add id for compatibility
                'name': w['name'],
                'exercises': w['exercises'],
                'createdAt': w['createdAt'],
              },
            )
            .toList();
      }
      _isLoadingWorkouts = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F0F0F),
      body: Row(
        children: [
          Sidebar(currentPage: 'workouts', user: widget.user),
          Expanded(
            child: Column(
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.all(32),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'My Workouts',
                            style: TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Create and manage your custom workout routines',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey[400],
                            ),
                          ),
                        ],
                      ),
                      ElevatedButton.icon(
                        onPressed: _startAddingWorkout,
                        icon: const Icon(Icons.add, color: Color(0xFF1A1A1A)),
                        label: const Text(
                          'New Workout',
                          style: TextStyle(color: Color(0xFF1A1A1A)),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFB4F405),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 24,
                            vertical: 16,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Content
                Expanded(child: _buildWorkoutsGrid()),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWorkoutsGrid() {
    if (_isLoadingWorkouts) {
      return const Center(
        child: CircularProgressIndicator(color: Color(0xFFB4F405)),
      );
    }

    if (_customWorkouts.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.fitness_center, size: 80, color: Colors.grey[700]),
            const SizedBox(height: 24),
            Text(
              'No custom workouts yet',
              style: TextStyle(
                fontSize: 20,
                color: Colors.grey[400],
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Create your first workout to get started',
              style: TextStyle(fontSize: 14, color: Colors.grey[600]),
            ),
          ],
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(32, 0, 32, 32),
      child: Column(
        children: _customWorkouts.map((workout) {
          return _buildWorkoutSection(workout);
        }).toList(),
      ),
    );
  }

  Widget _buildWorkoutSection(Map<String, dynamic> workout) {
    final exercises =
        (workout['exercises'] as List?)?.cast<Map<String, dynamic>>() ?? [];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Exercise Cards Grid
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 1.18,
          ),
          itemCount: exercises.length,
          itemBuilder: (context, index) {
            final exercise = exercises[index];
            return _buildExerciseCard(exercise, workout, index);
          },
        ),
        const SizedBox(height: 32),
      ],
    );
  }

  Widget _buildExerciseCard(
    Map<String, dynamic> exercise,
    Map<String, dynamic> workout,
    int startIndex,
  ) {
    // Extract video ID from videoUrls for thumbnail
    String? thumbnailUrl;
    if (exercise['videoUrls'] != null) {
      final videoUrls = exercise['videoUrls'];
      if (videoUrls is List && videoUrls.isNotEmpty) {
        final videoUrl = videoUrls[0]?.toString() ?? '';
        if (videoUrl.isNotEmpty && videoUrl.contains('v=')) {
          final videoId = videoUrl.split('v=')[1].split('&')[0];
          if (videoId.isNotEmpty) {
            thumbnailUrl = 'https://img.youtube.com/vi/$videoId/hqdefault.jpg';
          }
        }
      }
    }

    return InkWell(
      onTap: () {
        final exercises = (workout['exercises'] as List)
            .cast<Map<String, dynamic>>();
        _openWorkoutModal(exercises, startIndex);
      },
      borderRadius: BorderRadius.circular(12),
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF0F0F0F),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFF2A2A2A), width: 1),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Thumbnail with badges
            Stack(
              children: [
                Container(
                  height: 160,
                  decoration: BoxDecoration(
                    color: const Color(0xFF2A2A2A),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(12),
                      topRight: Radius.circular(12),
                    ),
                    image: thumbnailUrl != null
                        ? DecorationImage(
                            image: NetworkImage(thumbnailUrl),
                            fit: BoxFit.cover,
                          )
                        : null,
                  ),
                  child: thumbnailUrl == null
                      ? Center(
                          child: Icon(
                            Icons.fitness_center,
                            size: 48,
                            color: Colors.grey[600],
                          ),
                        )
                      : null,
                ),
                // Duration Badge
                if (exercise['duration'] != null)
                  Positioned(
                    bottom: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1A1A1A).withOpacity(0.8),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.timer,
                            size: 14,
                            color: Colors.white,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            exercise['duration'].toString(),
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.white,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                // Play button overlay
                const Positioned.fill(
                  child: Center(
                    child: Icon(
                      Icons.play_circle_filled,
                      size: 56,
                      color: Color(0xFFB4F405),
                    ),
                  ),
                ),
                // Delete button on each card
                Positioned(
                  top: 12,
                  right: 12,
                  child: InkWell(
                    onTap: () => _deleteExerciseFromWorkout(
                      workout['id']?.toString() ?? '',
                      startIndex,
                    ),
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1A1A1A).withOpacity(0.9),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: Colors.red.withOpacity(0.3),
                          width: 1,
                        ),
                      ),
                      child: Icon(
                        Icons.delete_outline,
                        color: Colors.red[400],
                        size: 18,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            // Info
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(
                    height: 22,
                    child: Text(
                      exercise['title']?.toString() ?? 'Exercise',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(height: 6),
                  SizedBox(
                    height: 36,
                    child: Text(
                      exercise['description']?.toString() ?? '',
                      style: const TextStyle(
                        fontSize: 13,
                        color: Color(0xFF9E9E9E),
                        height: 1.4,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      // Level badge
                      if (exercise['level'] != null)
                        Row(
                          children: [
                            const Icon(
                              Icons.bolt,
                              size: 14,
                              color: Color(0xFFB4F405),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              exercise['level'].toString(),
                              style: const TextStyle(
                                fontSize: 11,
                                color: Color(0xFF9E9E9E),
                              ),
                            ),
                          ],
                        ),
                      const Spacer(),
                      // Calories badge
                      if (exercise['caloriesBurned'] != null)
                        Row(
                          children: [
                            const Icon(
                              Icons.local_fire_department,
                              size: 14,
                              color: Color(0xFFFF6B35),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '${exercise['caloriesBurned']} cal',
                              style: const TextStyle(
                                fontSize: 11,
                                color: Color(0xFF9E9E9E),
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
}
