import 'package:flutter/material.dart';
import '../widgets/sidebar.dart';
import '../widgets/workout_session_modal.dart';
import '../services/exercise_service.dart';
import '../services/progress_service.dart';

class ExercisesPage extends StatefulWidget {
  final Map<String, dynamic>? user;

  const ExercisesPage({super.key, this.user});

  @override
  State<ExercisesPage> createState() => _ExercisesPageState();
}

class _ExercisesPageState extends State<ExercisesPage> {
  String _selectedCategory = 'All';
  String _selectedLevel = 'All';
  String _searchQuery = '';
  final Set<String> _favorites = {};
  final ExerciseService _exerciseService = ExerciseService();
  final ProgressService _progressService = ProgressService();
  List<Map<String, dynamic>> _exercises = [];
  bool _isLoading = true;
  late String _currentFitnessGoal; // Will be updated from backend

  @override
  void initState() {
    super.initState();
    // Initialize with user's current goal to avoid flash of wrong header
    _currentFitnessGoal =
        widget.user?['fitnessGoal'] as String? ?? 'Weight Loss';
    _loadUserGoalAndExercises();
  }

  @override
  void didUpdateWidget(ExercisesPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Reload exercises if fitness goal changed
    if (oldWidget.user?['fitnessGoal'] != widget.user?['fitnessGoal']) {
      _loadUserGoalAndExercises();
    }
  }

  // Load user's current fitness goal from backend, then load matching exercises
  Future<void> _loadUserGoalAndExercises() async {
    if (widget.user == null || widget.user!['_id'] == null) {
      // No user logged in, use default goal
      _loadExercises();
      return;
    }

    setState(() => _isLoading = true);

    try {
      // Fetch latest progress data to get current fitness goal
      final response = await _progressService.getUserProgress(
        widget.user!['_id'],
      );

      if (response['success'] && response['data'] != null) {
        final progressData = response['data'];
        final fitnessGoal = progressData['fitnessGoal'] as String?;

        setState(() {
          _currentFitnessGoal = fitnessGoal ?? 'Weight Loss';
        });

        // Sync widget.user with latest backend data
        if (fitnessGoal != null) {
          widget.user!['fitnessGoal'] = fitnessGoal;
          print('✅ Updated user fitness goal to: $fitnessGoal');
        }

        print('🎯 User current goal from backend: $_currentFitnessGoal');

        // Now load exercises for this goal
        await _loadExercises();
      } else {
        // Failed to load progress, use default
        print('⚠️ Failed to load progress: ${response['message']}');
        await _loadExercises();
      }
    } catch (e) {
      print('❌ Error loading user goal: $e');
      await _loadExercises();
    }
  }

  Future<void> _loadExercises() async {
    setState(() => _isLoading = true);

    print('📚 Loading exercises for goal: $_currentFitnessGoal');

    // Fetch exercises based on fitness goal
    final response = await _exerciseService.getExercisesByGoal(
      _currentFitnessGoal,
    );

    if (response['success']) {
      setState(() {
        _exercises = (response['exercises'] as List)
            .map(
              (e) => {
                'id': e['_id'].toString(),
                'title': e['title'].toString(),
                'description': e['description'].toString(),
                'duration': e['duration'].toString(),
                'durationSeconds': e['durationSeconds'] as int,
                'level': e['level'].toString(),
                'recommended': e['recommended'] as bool? ?? false,
                'videoUrls': e['videoUrls'] as List<dynamic>? ?? [],
                'caloriesBurned': e['caloriesBurned'] as int?,
                'muscleGroup': e['muscleGroup']?.toString(),
                'targetArea': e['targetArea']?.toString(),
                'focusArea': e['focusArea']?.toString(),
                'exerciseType': e['exerciseType']?.toString(),
                'category': e['category']?.toString(),
                'what': e['what']?.toString() ?? '',
                'why': e['why']?.toString() ?? '',
                'how': e['how']?.toString() ?? '',
              },
            )
            .toList();
        print(
          '✅ Loaded ${_exercises.length} exercises for $_currentFitnessGoal',
        );
        if (_exercises.isNotEmpty) {
          print(
            'Sample exercise: ${_exercises[0]['title']} - category: ${_exercises[0]['category']}, calories: ${_exercises[0]['caloriesBurned']}',
          );
        }
        _isLoading = false;
      });
    } else {
      setState(() {
        _exercises = [];
        _isLoading = false;
      });
      // Only show error for actual failures, not for unsupported goals
      if (mounted && response['unsupported'] != true) {
        showDialog(
          context: context,
          builder: (dialogCtx) => Dialog(
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
                    response['message'] ?? 'Failed to load exercises',
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
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      }
    }
  }

  // Get exercise name tabs
  List<Map<String, dynamic>> get _categoryTabs {
    // Favorites and All are always first
    final tabs = <Map<String, dynamic>>[
      {'label': 'Favorites', 'icon': Icons.favorite},
      {'label': 'All', 'icon': null},
    ];

    // Add exercise names as tabs (limit to first 15)
    for (var i = 0; i < _exercises.length && i < 15; i++) {
      tabs.add({'label': _exercises[i]['title'] as String, 'icon': null});
    }

    return tabs;
  }

  List<Map<String, dynamic>> get _filteredExercises {
    return _exercises.where((exercise) {
      // Exercise name/tab filtering
      bool matchesCategory;
      if (_selectedCategory == 'Favorites') {
        matchesCategory = _favorites.contains(exercise['id']);
      } else if (_selectedCategory == 'All') {
        matchesCategory = true;
      } else {
        // Check if selected category matches exercise title
        matchesCategory = exercise['title'] == _selectedCategory;
      }

      final matchesSearch = exercise['title'].toString().toLowerCase().contains(
        _searchQuery.toLowerCase(),
      );

      // Level filtering
      bool matchesLevel;
      if (_selectedLevel == 'All') {
        matchesLevel = true;
      } else {
        matchesLevel = exercise['level'] == _selectedLevel;
      }

      return matchesCategory && matchesSearch && matchesLevel;
    }).toList();
  }

  void _toggleFavorite(String exerciseId) {
    setState(() {
      if (_favorites.contains(exerciseId)) {
        _favorites.remove(exerciseId);
      } else {
        _favorites.add(exerciseId);
      }
    });
  }

  void _openWorkoutModal(Map<String, dynamic> exercise) async {
    // Find the index of the clicked exercise in the filtered list
    final exerciseIndex = _filteredExercises.indexWhere(
      (e) => e['id'] == exercise['id'],
    );

    await showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => WorkoutSessionModal(
        exercises: _filteredExercises, // Pass all filtered exercises
        initialIndex: exerciseIndex >= 0 ? exerciseIndex : 0,
        userId: widget.user?['_id'], // Pass userId
        onComplete: (result) {
          // Exercise completed
        },
      ),
    );

    // Modal closed - no need to reload exercises page
  }

  // Extract YouTube video ID from URL
  String _extractVideoId(String url) {
    try {
      final uri = Uri.parse(url);
      if (uri.host.contains('youtube.com')) {
        return uri.queryParameters['v'] ?? '';
      } else if (uri.host.contains('youtu.be')) {
        return uri.pathSegments.isNotEmpty ? uri.pathSegments[0] : '';
      }
    } catch (e) {
      print('Error parsing video URL: $e');
    }
    return '';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: Row(
        children: [
          // Sidebar
          Sidebar(currentPage: 'exercises', user: widget.user),

          // Main Content
          Expanded(
            child: _isLoading
                ? Center(
                    child: CircularProgressIndicator(
                      color: Theme.of(context).primaryColor,
                    ),
                  )
                : _exercises.isEmpty
                ? _buildEmptyState()
                : Column(
                    children: [
                      // Fixed Header Section
                      Container(
                        color: Theme.of(context).scaffoldBackgroundColor,
                        padding: const EdgeInsets.fromLTRB(32, 32, 32, 0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Header
                            Row(
                              children: [
                                Text(
                                  '$_currentFitnessGoal Exercise Library',
                                  style: TextStyle(
                                    fontSize: 32,
                                    fontWeight: FontWeight.bold,
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.onSurface,
                                  ),
                                ),
                                const Spacer(),
                                Text(
                                  '${_exercises.length} exercises',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Theme.of(context).primaryColor,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 32),

                            // Search Bar with Level Filter Dropdown
                            Row(
                              children: [
                                // Search Bar (80%)
                                Expanded(
                                  flex: 80,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 20,
                                    ),
                                    decoration: BoxDecoration(
                                      color: Theme.of(context).cardColor,
                                      borderRadius: BorderRadius.circular(12),
                                      border: Border.all(
                                        color: Theme.of(context).primaryColor,
                                        width: 2,
                                      ),
                                    ),
                                    child: TextField(
                                      onChanged: (value) {
                                        setState(() {
                                          _searchQuery = value;
                                        });
                                      },
                                      style: TextStyle(
                                        color: Theme.of(
                                          context,
                                        ).colorScheme.onSurface,
                                      ),
                                      decoration: InputDecoration(
                                        hintText:
                                            'Search exercises, muscles, categories...',
                                        hintStyle: TextStyle(
                                          color: Theme.of(
                                            context,
                                          ).disabledColor,
                                        ),
                                        border: InputBorder.none,
                                        icon: Icon(
                                          Icons.search,
                                          color: Theme.of(
                                            context,
                                          ).disabledColor,
                                        ),
                                        contentPadding: EdgeInsets.symmetric(
                                          vertical: 16,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                // Level Filter Dropdown (20%)
                                Expanded(
                                  flex: 20,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                    ),
                                    decoration: BoxDecoration(
                                      color: _selectedLevel != 'All'
                                          ? Theme.of(context).primaryColor
                                          : Theme.of(context).cardColor,
                                      borderRadius: BorderRadius.circular(12),
                                      border: _selectedLevel == 'All'
                                          ? Border.all(
                                              color: Theme.of(
                                                context,
                                              ).primaryColor,
                                              width: 2,
                                            )
                                          : null,
                                    ),
                                    child: DropdownButtonHideUnderline(
                                      child: DropdownButton<String>(
                                        value: _selectedLevel,
                                        isExpanded: true,
                                        dropdownColor: Theme.of(
                                          context,
                                        ).cardColor,
                                        borderRadius: BorderRadius.circular(12),
                                        elevation: 8,
                                        menuMaxHeight: 300,
                                        icon: Icon(
                                          Icons.arrow_drop_down,
                                          color: _selectedLevel != 'All'
                                              ? Theme.of(
                                                  context,
                                                ).scaffoldBackgroundColor
                                              : Theme.of(context).primaryColor,
                                        ),
                                        selectedItemBuilder:
                                            (BuildContext context) {
                                              return [
                                                'All',
                                                'Beginner',
                                                'Intermediate',
                                                'Advanced',
                                              ].map<Widget>((String item) {
                                                return Center(
                                                  child: Text(
                                                    item,
                                                    style: TextStyle(
                                                      color:
                                                          _selectedLevel !=
                                                              'All'
                                                          ? const Color(
                                                              0xFF1A1A1A,
                                                            )
                                                          : Colors.white,
                                                      fontSize: 14,
                                                      fontWeight:
                                                          FontWeight.w500,
                                                    ),
                                                  ),
                                                );
                                              }).toList();
                                            },
                                        style: const TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w500,
                                        ),
                                        onChanged: (String? newValue) {
                                          if (newValue != null) {
                                            setState(() {
                                              _selectedLevel = newValue;
                                            });
                                          }
                                        },
                                        items:
                                            [
                                              'All',
                                              'Beginner',
                                              'Intermediate',
                                              'Advanced',
                                            ].asMap().entries.map<
                                              DropdownMenuItem<String>
                                            >((entry) {
                                              int idx = entry.key;
                                              String value = entry.value;
                                              bool isLast = idx == 3;
                                              return DropdownMenuItem<String>(
                                                value: value,
                                                alignment:
                                                    AlignmentDirectional.center,
                                                child: Column(
                                                  children: [
                                                    Container(
                                                      width: double.infinity,
                                                      padding:
                                                          const EdgeInsets.symmetric(
                                                            vertical: 12,
                                                          ),
                                                      child: Text(
                                                        value,
                                                        textAlign:
                                                            TextAlign.center,
                                                        style: const TextStyle(
                                                          color: Colors.white,
                                                          fontSize: 14,
                                                          fontWeight:
                                                              FontWeight.w500,
                                                        ),
                                                      ),
                                                    ),
                                                    if (!isLast)
                                                      Container(
                                                        height: 2,
                                                        color: const Color(
                                                          0xFFB4F405,
                                                        ),
                                                      ),
                                                  ],
                                                ),
                                              );
                                            }).toList(),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 24),

                            // Category Filters - Dynamic based on fitness goal
                            SingleChildScrollView(
                              scrollDirection: Axis.horizontal,
                              child: Row(
                                children: _categoryTabs.map((tab) {
                                  return Padding(
                                    padding: const EdgeInsets.only(right: 12),
                                    child: _buildCategoryChip(
                                      tab['label'] as String,
                                      tab['icon'] as IconData?,
                                    ),
                                  );
                                }).toList(),
                              ),
                            ),
                            const SizedBox(height: 24),
                          ],
                        ),
                      ),

                      // Scrollable Exercise Grid
                      Expanded(
                        child: SingleChildScrollView(
                          padding: const EdgeInsets.fromLTRB(32, 8, 32, 32),
                          child: GridView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            gridDelegate:
                                const SliverGridDelegateWithFixedCrossAxisCount(
                                  crossAxisCount: 3,
                                  crossAxisSpacing: 20,
                                  mainAxisSpacing: 20,
                                  childAspectRatio: 1.18,
                                ),
                            itemCount: _filteredExercises.length,
                            itemBuilder: (context, index) {
                              final exercise = _filteredExercises[index];
                              return _buildExerciseCard(exercise);
                            },
                          ),
                        ),
                      ),
                    ],
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryChip(String label, IconData? icon) {
    final isActive = _selectedCategory == label;
    return InkWell(
      onTap: () {
        setState(() {
          _selectedCategory = label;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        clipBehavior: Clip.antiAlias,
        decoration: BoxDecoration(
          color: isActive
              ? Theme.of(context).primaryColor
              : Theme.of(context).colorScheme.secondary,
          borderRadius: BorderRadius.circular(24),
          boxShadow: isActive
              ? [
                  BoxShadow(
                    color: Theme.of(context).primaryColor.withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ]
              : null,
        ),
        child: Row(
          children: [
            if (icon != null) ...[
              Icon(
                icon,
                size: 18,
                color: isActive
                    ? Theme.of(context).scaffoldBackgroundColor
                    : Colors.white,
              ),
              const SizedBox(width: 8),
            ],
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: isActive
                    ? Theme.of(context).scaffoldBackgroundColor
                    : Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(48.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.secondary,
                borderRadius: BorderRadius.circular(60),
              ),
              child: Icon(
                Icons.fitness_center,
                size: 60,
                color: Theme.of(context).disabledColor,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              '$_currentFitnessGoal Exercises',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Theme.of(context).colorScheme.onSurface,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Coming Soon!',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Theme.of(context).primaryColor,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'We\'re working on adding exercises for $_currentFitnessGoal.\nCheck back soon or try Weight Loss or Muscle Gain exercises.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: Theme.of(context).textTheme.bodySmall?.color,
                height: 1.5,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildExerciseCard(Map<String, dynamic> exercise) {
    final isFavorite = _favorites.contains(exercise['id']);

    // Extract video ID for thumbnail
    final videoUrls = exercise['videoUrls'] as List<dynamic>?;
    final videoId = videoUrls != null && videoUrls.isNotEmpty
        ? _extractVideoId(videoUrls[0].toString())
        : '';
    final thumbnailUrl = videoId.isNotEmpty
        ? 'https://img.youtube.com/vi/$videoId/hqdefault.jpg'
        : '';

    return InkWell(
      onTap: () => _openWorkoutModal(exercise),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: const Color(0xFF2A2A2A),
            width: 1,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image/Thumbnail Area
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
                // Favorite Button
                Positioned(
                  top: 12,
                  right: 12,
                  child: InkWell(
                    onTap: () => _toggleFavorite(exercise['id'] as String),
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Theme.of(context).cardColor.withOpacity(0.8),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Icon(
                        isFavorite ? Icons.favorite : Icons.favorite_border,
                        color: isFavorite
                            ? Colors.red
                            : Theme.of(context).colorScheme.onSurface,
                        size: 20,
                      ),
                    ),
                  ),
                ),
                // Duration Badge
                Positioned(
                  bottom: 12,
                  right: 12,
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
                        Icon(
                          Icons.timer,
                          size: 14,
                          color: Theme.of(context).colorScheme.onSurface,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          exercise['duration'] as String,
                          style: TextStyle(
                            fontSize: 12,
                            color: Theme.of(context).colorScheme.onSurface,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
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
            // Exercise Info
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(
                    height: 22,
                    child: Text(
                      exercise['title'] as String,
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
                      exercise['description'] as String,
                      style: TextStyle(
                        fontSize: 13,
                        color: Theme.of(context).textTheme.bodySmall?.color,
                        height: 1.4,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      // Category badge
                      if (exercise['category'] != null)
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
                            exercise['category'] as String,
                            style: TextStyle(
                              fontSize: 11,
                              color: Theme.of(context).colorScheme.onSurface,
                            ),
                          ),
                        ),
                      const SizedBox(width: 8),
                      // Level badge
                      Row(
                        children: [
                          Icon(
                            Icons.bolt,
                            size: 14,
                            color: Theme.of(context).primaryColor,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            exercise['level'] as String,
                            style: TextStyle(
                              fontSize: 11,
                              color: Theme.of(
                                context,
                              ).textTheme.bodySmall?.color,
                            ),
                          ),
                        ],
                      ),
                      const Spacer(),
                      // Calories badge (always show if available)
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
}
